import express from 'express';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use('/auth', authRoutes);
  app.use('/tasks', taskRoutes);

  return app;
}
