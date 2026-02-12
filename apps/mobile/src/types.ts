export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export interface Task {
  id: string;
  title: string;
  taskType: 'water' | 'prune' | 'feed' | 'inspect' | 'harvest';
  dueAt: string;
  status: 'pending' | 'done' | 'skipped';
}

export interface Streak {
  currentStreakDays: number;
  actionsThisWeek: number;
}
