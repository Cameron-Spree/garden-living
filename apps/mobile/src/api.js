const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

async function request(path, init = {}, token) {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {})
    }
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? 'Request failed');
  }
  return res.json();
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  listTodayTasks: (token) => request('/tasks/today', {}, token),
  createTask: (token, payload) => request('/tasks', { method: 'POST', body: JSON.stringify(payload) }, token),
  completeTask: (token, taskId) => request(`/tasks/${taskId}/complete`, { method: 'POST' }, token),
  getStreak: (token) => request('/tasks/streak', {}, token)
};
