import crypto from 'node:crypto';
import { calculateStreak } from '../lib/streak.js';

const db = {
  users: [],
  tasks: [],
  completions: []
};

export const inMemoryRepo = {
  async createUser({ email, handle, displayName, passwordHash }) {
    if (db.users.some((u) => u.email === email || u.handle === handle)) throw new Error('exists');
    const user = { id: crypto.randomUUID(), email, handle, displayName, passwordHash };
    db.users.push(user);
    return { id: user.id, email: user.email };
  },
  async findUserByEmail(email) {
    return db.users.find((u) => u.email === email) ?? null;
  },
  async createTask({ userId, title, taskType, dueAt }) {
    const task = { id: crypto.randomUUID(), userId, title, taskType, dueAt, status: 'pending' };
    db.tasks.push(task);
    return task;
  },
  async listTodayTasks(userId, now = new Date()) {
    const today = now.toISOString().slice(0, 10);
    return db.tasks.filter((t) => t.userId === userId && t.dueAt.slice(0, 10) === today);
  },
  async completeTask({ taskId, userId, completedAt = new Date().toISOString() }) {
    const task = db.tasks.find((t) => t.id === taskId && t.userId === userId);
    if (!task) return null;
    task.status = 'done';
    db.completions.push({ taskId, userId, completedAt });
    return task;
  },
  async getStreak(userId) {
    const completions = db.completions.filter((c) => c.userId === userId).map((c) => new Date(c.completedAt));
    return calculateStreak(completions, new Date());
  }
};
