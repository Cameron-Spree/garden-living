import { Router } from 'express';
import { z } from 'zod';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';
import { refreshStreak } from '../services/streakService.js';

const router = Router();
router.use(requireAuth);

const createTaskSchema = z.object({
  title: z.string().min(1),
  taskType: z.enum(['water', 'prune', 'feed', 'inspect', 'harvest']),
  dueAt: z.string().datetime()
});

router.post('/', async (req, res) => {
  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success || !req.user) {
    res.status(400).json({ message: 'Invalid payload' });
    return;
  }

  const { title, taskType, dueAt } = parse.data;
  const result = await pool.query(
    `
    insert into garden_task (user_id, title, task_type, due_at)
    values ($1, $2, $3, $4)
    returning id, title, task_type as "taskType", due_at as "dueAt", status
  `,
    [req.user.id, title, taskType, dueAt]
  );

  res.status(201).json(result.rows[0]);
});

router.get('/today', async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const result = await pool.query(
    `
    select id, title, task_type as "taskType", due_at as "dueAt", status
    from garden_task
    where user_id = $1
      and due_at::date = now()::date
    order by due_at asc
  `,
    [req.user.id]
  );

  res.json(result.rows);
});

router.post('/:taskId/complete', async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const { taskId } = req.params;
  const task = await pool.query(
    `
    update garden_task
    set status = 'done'
    where id = $1 and user_id = $2
    returning id
  `,
    [taskId, req.user.id]
  );

  if (!task.rowCount) {
    res.status(404).json({ message: 'Task not found' });
    return;
  }

  await pool.query(
    'insert into task_completion (task_id, user_id) values ($1, $2)',
    [taskId, req.user.id]
  );

  await refreshStreak(req.user.id);

  const streak = await pool.query(
    'select current_streak_days as "currentStreakDays", actions_this_week as "actionsThisWeek" from streak_snapshot where user_id = $1',
    [req.user.id]
  );

  res.json({ success: true, streak: streak.rows[0] });
});

router.get('/streak', async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const result = await pool.query(
    `
    select current_streak_days as "currentStreakDays", actions_this_week as "actionsThisWeek", last_action_at as "lastActionAt"
    from streak_snapshot where user_id = $1
  `,
    [req.user.id]
  );

  res.json(result.rows[0] ?? { currentStreakDays: 0, actionsThisWeek: 0, lastActionAt: null });
});

export default router;
