export function calculateStreak(completions, now = new Date()) {
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const actionsThisWeek = completions.filter((c) => c >= sevenDaysAgo && c <= now).length;
  return {
    actionsThisWeek,
    currentStreakDays: Math.min(actionsThisWeek, 7)
  };
}
