const API_URL = window.GARDEN_API_URL || 'http://localhost:4000';
let token = null;

const authCard = document.getElementById('authCard');
const appCard = document.getElementById('appCard');

const authError = document.getElementById('authError');
const appError = document.getElementById('appError');
const streakText = document.getElementById('streakText');
const taskList = document.getElementById('taskList');

function getAuthPayload() {
  return {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    handle: document.getElementById('handle').value,
    displayName: document.getElementById('displayName').value
  };
}

async function request(path, init = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {})
    }
  });

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || 'Request failed');
  return body;
}

function showApp() {
  authCard.classList.add('hidden');
  appCard.classList.remove('hidden');
}

function showAuth() {
  appCard.classList.add('hidden');
  authCard.classList.remove('hidden');
}

async function loadDashboard() {
  appError.textContent = '';
  try {
    const [streak, tasks] = await Promise.all([
      request('/tasks/streak'),
      request('/tasks/today')
    ]);

    streakText.textContent = `Streak: ${streak.currentStreakDays} days · ${streak.actionsThisWeek}/7 actions`;

    taskList.innerHTML = '';
    if (!tasks.length) {
      taskList.innerHTML = '<p class="muted">No tasks for today yet.</p>';
      return;
    }

    tasks.forEach((task) => {
      const row = document.createElement('div');
      row.className = 'task';
      row.innerHTML = `
        <div>
          <strong>${task.title}</strong><br/>
          <span class="muted">${task.taskType} · ${task.status}</span>
        </div>
      `;
      const button = document.createElement('button');
      button.textContent = task.status === 'done' ? 'Done' : 'Complete';
      button.disabled = task.status === 'done';
      button.onclick = async () => {
        try {
          await request(`/tasks/${task.id}/complete`, { method: 'POST' });
          await loadDashboard();
        } catch (error) {
          appError.textContent = error.message;
        }
      };
      row.appendChild(button);
      taskList.appendChild(row);
    });
  } catch (error) {
    appError.textContent = error.message;
  }
}

document.getElementById('registerBtn').onclick = async () => {
  authError.textContent = '';
  try {
    const payload = getAuthPayload();
    const response = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    token = response.token;
    showApp();
    await loadDashboard();
  } catch (error) {
    authError.textContent = error.message;
  }
};

document.getElementById('loginBtn').onclick = async () => {
  authError.textContent = '';
  try {
    const payload = getAuthPayload();
    const response = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: payload.email, password: payload.password })
    });
    token = response.token;
    showApp();
    await loadDashboard();
  } catch (error) {
    authError.textContent = error.message;
  }
};

document.getElementById('addTaskBtn').onclick = async () => {
  appError.textContent = '';
  try {
    await request('/tasks', {
      method: 'POST',
      body: JSON.stringify({
        title: document.getElementById('taskTitle').value,
        taskType: document.getElementById('taskType').value,
        dueAt: new Date().toISOString()
      })
    });
    await loadDashboard();
  } catch (error) {
    appError.textContent = error.message;
  }
};

document.getElementById('logoutBtn').onclick = () => {
  token = null;
  showAuth();
};
