'use strict';

const fs = require('fs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { seed, USERS_FILE } = require('./seed');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '127.0.0.1';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

if (!fs.existsSync(USERS_FILE)) {
  seed();
}

function loadUsers() {
  const raw = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
  return raw.users;
}

const app = express();
app.use(express.json());
app.use(
  session({
    name: 'privonta.sid',
    secret: process.env.SESSION_SECRET || 'privonta-local-dev-only',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.use(express.static(PUBLIC_DIR));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'privonta-demo' });
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not signed in' });
  }
  res.json({ user: req.session.user });
});

app.post('/api/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const user = loadUsers().find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  req.session.user = {
    id: user.id,
    email: user.email,
    role: user.role,
    displayName: user.displayName,
  };
  res.json({ user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

app.get('/api/demo-users', (_req, res) => {
  res.json({
    users: loadUsers().map(({ id, email, role, displayName }) => ({
      id,
      email,
      role,
      displayName,
    })),
    passwordHint: 'See README.md — all demo users share one local password.',
  });
});

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`Privonta demo running at http://${HOST}:${PORT}`);
  console.log('Local only — bind is 127.0.0.1 by default.');
});
