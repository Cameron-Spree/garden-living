import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { comparePassword, hashPassword, signToken } from '../services/authService.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  handle: z.string().min(3),
  displayName: z.string().min(1)
});

router.post('/register', async (req, res) => {
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ message: 'Invalid payload', errors: parse.error.flatten() });
    return;
  }

  const { email, password, handle, displayName } = parse.data;
  const passwordHash = await hashPassword(password);

  try {
    const result = await pool.query<{ id: string; email: string }>(
      `
      insert into app_user (email, handle, display_name, password_hash)
      values ($1, $2, $3, $4)
      returning id, email
    `,
      [email, handle, displayName, passwordHash]
    );

    const user = result.rows[0];
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch {
    res.status(409).json({ message: 'User already exists' });
  }
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

router.post('/login', async (req, res) => {
  const parse = loginSchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ message: 'Invalid payload', errors: parse.error.flatten() });
    return;
  }

  const { email, password } = parse.data;
  const result = await pool.query<{ id: string; email: string; password_hash: string }>(
    'select id, email, password_hash from app_user where email = $1',
    [email]
  );

  if (!result.rowCount) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const user = result.rows[0];
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const token = signToken({ id: user.id, email: user.email });
  res.json({ token, user: { id: user.id, email: user.email } });
});

export default router;
