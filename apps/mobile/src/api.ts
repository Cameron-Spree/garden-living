import { AuthResponse, Streak, Task } from './types';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.message ?? 'Request failed');
  }

  return response.json();
}

export const api = {
  register(payload: { email: string; password: string; handle: string; displayName: string }) {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  login(payload: { email: string; password: string }) {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },
  listTodayTasks(token: string) {
    return request<Task[]>('/tasks/today', undefined, token);
  },
  createTask(token: string, payload: { title: string; taskType: Task['taskType']; dueAt: string }) {
    return request<Task>('/tasks', { method: 'POST', body: JSON.stringify(payload) }, token);
  },
  completeTask(token: string, taskId: string) {
    return request<{ success: boolean; streak: Streak }>(`/tasks/${taskId}/complete`, { method: 'POST' }, token);
  },
  getStreak(token: string) {
    return request<Streak>('/tasks/streak', undefined, token);
  }
};
