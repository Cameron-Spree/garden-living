import { pool } from '../db/pool.js';

export async function refreshStreak(userId) {
  const actionsResult = await pool.query(
    `select count(*)::int as count from task_completion where user_id = $1 and completed_at >= now() - interval '7 days'`,
    [userId]
  );
  const actionsThisWeek = Number(actionsResult.rows[0]?.count ?? 0);
  const currentStreakDays = Math.min(actionsThisWeek, 7);

  await pool.query(
    `
    insert into streak_snapshot (user_id, current_streak_days, actions_this_week, last_action_at)
    values ($1, $2, $3, now())
    on conflict (user_id)
    do update set current_streak_days = excluded.current_streak_days,
                  actions_this_week = excluded.actions_this_week,
                  last_action_at = excluded.last_action_at
  `,
    [userId, currentStreakDays, actionsThisWeek]
  );
}
