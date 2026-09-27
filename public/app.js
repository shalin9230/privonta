const ROLE_COPY = {
  super_admin: {
    title: 'Super admin console',
    bullets: [
      'Manage all distributors, partners, and customers',
      'Global settings and audit logs',
      'Create or disable any tenant account',
    ],
  },
  distributor: {
    title: 'Distributor workspace',
    bullets: [
      'Onboard partners under your territory',
      'View aggregated partner performance',
      'Cannot change global platform settings',
    ],
  },
  partner: {
    title: 'Partner workspace',
    bullets: [
      'Manage assigned customer accounts',
      'Submit deals and support tickets',
      'Cannot create other partners',
    ],
  },
  customer: {
    title: 'Customer portal',
    bullets: [
      'View your subscription and usage',
      'Invite users within your organization',
      'No access to distributor or partner tools',
    ],
  },
};

const loginPanel = document.getElementById('login-panel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const demoUserList = document.getElementById('demo-user-list');
const welcomeName = document.getElementById('welcome-name');
const welcomeRole = document.getElementById('welcome-role');
const rolePanel = document.getElementById('role-panel');
const logoutBtn = document.getElementById('logout-btn');

async function fetchJson(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

function showDashboard(user) {
  loginPanel.hidden = true;
  dashboard.hidden = false;
  welcomeName.textContent = `Welcome, ${user.displayName}`;
  welcomeRole.textContent = `Signed in as ${user.role.replace('_', ' ')}`;
  const copy = ROLE_COPY[user.role] || { title: user.role, bullets: [] };
  rolePanel.innerHTML = `
    <h2>${copy.title}</h2>
    <ul>${copy.bullets.map((b) => `<li>${b}</li>`).join('')}</ul>
  `;
}

function showLogin() {
  dashboard.hidden = true;
  loginPanel.hidden = false;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.hidden = true;
  const fd = new FormData(loginForm);
  try {
    const { user } = await fetchJson('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: fd.get('email'),
        password: fd.get('password'),
      }),
    });
    showDashboard(user);
  } catch (err) {
    loginError.textContent = err.message;
    loginError.hidden = false;
  }
});

logoutBtn.addEventListener('click', async () => {
  await fetchJson('/api/logout', { method: 'POST' });
  loginForm.reset();
  showLogin();
});

async function init() {
  try {
    const { users } = await fetchJson('/api/demo-users');
    demoUserList.innerHTML = users
      .map(
        (u) =>
          `<li><strong>${u.displayName}</strong> — ${u.email} <em>(${u.role})</em></li>`
      )
      .join('');
  } catch {
    demoUserList.innerHTML = '<li>Start the server to load demo users.</li>';
  }

  try {
    const { user } = await fetchJson('/api/me');
    showDashboard(user);
  } catch {
    showLogin();
  }
}

init();
