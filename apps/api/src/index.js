import http from 'node:http';
import crypto from 'node:crypto';
import { signJwt, verifyJwt } from './lib/jwt.js';
import { inMemoryRepo } from './repositories/inMemoryRepo.js';
import { createPostgresRepo } from './repositories/postgresRepo.js';

const PORT = Number(process.env.PORT ?? 4000);
const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

let repo = inMemoryRepo;
if (process.env.DATABASE_URL) {
  try {
    repo = await createPostgresRepo(process.env.DATABASE_URL);
    console.log('Using Postgres repository');
  } catch {
    console.log('Falling back to in-memory repository (pg package unavailable)');
  }
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch (error) {
        reject(error);
      }
    });
  });
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function getAuthUser(req) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  try {
    return verifyJwt(header.slice(7), JWT_SECRET);
  } catch {
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true });

  if (req.method === 'POST' && req.url === '/auth/register') {
    const body = await parseBody(req).catch(() => null);
    if (!body?.email || !body?.password || !body?.handle || !body?.displayName) return json(res, 400, { message: 'Invalid payload' });
    try {
      const user = await repo.createUser({
        email: body.email,
        handle: body.handle,
        displayName: body.displayName,
        passwordHash: hashPassword(body.password)
      });
      const token = signJwt(user, JWT_SECRET);
      return json(res, 201, { token, user });
    } catch {
      return json(res, 409, { message: 'User already exists' });
    }
  }

  if (req.method === 'POST' && req.url === '/auth/login') {
    const body = await parseBody(req).catch(() => null);
    if (!body?.email || !body?.password) return json(res, 400, { message: 'Invalid payload' });
    const user = await repo.findUserByEmail(body.email);
    if (!user || user.passwordHash !== hashPassword(body.password)) return json(res, 401, { message: 'Invalid credentials' });
    const token = signJwt({ id: user.id, email: user.email }, JWT_SECRET);
    return json(res, 200, { token, user: { id: user.id, email: user.email } });
  }

  if (req.url?.startsWith('/tasks')) {
    const authUser = getAuthUser(req);
    if (!authUser) return json(res, 401, { message: 'Unauthorized' });

    if (req.method === 'POST' && req.url === '/tasks') {
      const body = await parseBody(req).catch(() => null);
      if (!body?.title || !body?.taskType || !body?.dueAt) return json(res, 400, { message: 'Invalid payload' });
      const task = await repo.createTask({ userId: authUser.id, title: body.title, taskType: body.taskType, dueAt: body.dueAt });
      return json(res, 201, task);
    }

    if (req.method === 'GET' && req.url === '/tasks/today') {
      const tasks = await repo.listTodayTasks(authUser.id, new Date());
      return json(res, 200, tasks);
    }

    if (req.method === 'GET' && req.url === '/tasks/streak') {
      const streak = await repo.getStreak(authUser.id);
      return json(res, 200, streak);
    }

    const completeMatch = req.url.match(/^\/tasks\/([^/]+)\/complete$/);
    if (req.method === 'POST' && completeMatch) {
      const taskId = completeMatch[1];
      const completed = await repo.completeTask({ taskId, userId: authUser.id });
      if (!completed) return json(res, 404, { message: 'Task not found' });
      const streak = await repo.getStreak(authUser.id);
      return json(res, 200, { success: true, streak });
    }
  }

  return json(res, 404, { message: 'Not found' });
});

if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`API listening on ${PORT}`);
  });
}

export { server };
