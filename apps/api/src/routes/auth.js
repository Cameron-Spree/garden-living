import { Router } from 'express';
import { pool } from '../db/pool.js';
import { comparePassword, hashPassword, signToken } from '../services/authService.js';

const router = Router();

router.post('/register', async (req, res) => {
  const { email, password, handle, displayName } = req.body;
  if (!email || !password || !handle || !displayName) return res.status(400).json({ message: 'Invalid payload' });

  const passwordHash = await hashPassword(password);
  try {
    const result = await pool.query(
      'insert into app_user (email, handle, display_name, password_hash) values ($1,$2,$3,$4) returning id,email',
      [email, handle, displayName, passwordHash]
    );
    const user = result.rows[0];
    return res.status(201).json({ token: signToken(user), user });
  } catch {
    return res.status(409).json({ message: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Invalid payload' });

  const result = await pool.query('select id,email,password_hash from app_user where email = $1', [email]);
  if (!result.rowCount) return res.status(401).json({ message: 'Invalid credentials' });

  const user = result.rows[0];
  const valid = await comparePassword(password, user.password_hash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  return res.json({ token: signToken({ id: user.id, email: user.email }), user: { id: user.id, email: user.email } });
});

export default router;
