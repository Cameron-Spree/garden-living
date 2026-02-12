import { calculateStreak } from '../lib/streak.js';

export async function createPostgresRepo(databaseUrl) {
  const pg = await import('pg');
  const { Pool } = pg.default;
  const pool = new Pool({ connectionString: databaseUrl });

  return {
    async createUser({ email, handle, displayName, passwordHash }) {
      const result = await pool.query(
        'insert into app_user (email, handle, display_name, password_hash) values ($1,$2,$3,$4) returning id,email',
        [email, handle, displayName, passwordHash]
      );
      return result.rows[0];
    },
    async findUserByEmail(email) {
      const result = await pool.query('select * from app_user where email = $1', [email]);
      return result.rows[0] ?? null;
    },
    async createTask({ userId, title, taskType, dueAt }) {
      const result = await pool.query(
        'insert into garden_task (user_id, title, task_type, due_at) values ($1,$2,$3,$4) returning id, user_id as "userId", title, task_type as "taskType", due_at as "dueAt", status',
        [userId, title, taskType, dueAt]
      );
      return result.rows[0];
    },
    async listTodayTasks(userId) {
      const result = await pool.query(
        'select id, user_id as "userId", title, task_type as "taskType", due_at as "dueAt", status from garden_task where user_id = $1 and due_at::date = now()::date order by due_at asc',
        [userId]
      );
      return result.rows;
    },
    async completeTask({ taskId, userId }) {
      const updated = await pool.query('update garden_task set status = $1 where id = $2 and user_id = $3 returning id', ['done', taskId, userId]);
      if (!updated.rowCount) return null;
      await pool.query('insert into task_completion (task_id, user_id) values ($1,$2)', [taskId, userId]);
      return { id: taskId };
    },
    async getStreak(userId) {
      const result = await pool.query('select completed_at from task_completion where user_id = $1', [userId]);
      return calculateStreak(result.rows.map((r) => new Date(r.completed_at)), new Date());
    }
  };
}
