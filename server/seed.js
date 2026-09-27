#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const DEMO_PASSWORD = 'Privonta@Demo2026!';

const USERS = [
  {
    id: '1',
    email: 'superadmin@privonta.local',
    role: 'super_admin',
    displayName: 'Super Admin',
  },
  {
    id: '2',
    email: 'distributor@privonta.local',
    role: 'distributor',
    displayName: 'Demo Distributor',
  },
  {
    id: '3',
    email: 'partner@privonta.local',
    role: 'partner',
    displayName: 'Demo Partner',
  },
  {
    id: '4',
    email: 'customer@privonta.local',
    role: 'customer',
    displayName: 'Demo Customer',
  },
];

function seed() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);
  const payload = {
    version: 1,
    demoPasswordNote:
      'All demo users share the same password for local testing only.',
    users: USERS.map((u) => ({ ...u, passwordHash })),
  };
  fs.writeFileSync(USERS_FILE, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Seeded ${USERS.length} demo users → ${USERS_FILE}`);
}

if (require.main === module) {
  seed();
}

module.exports = { seed, USERS_FILE, DEMO_PASSWORD, USERS };
