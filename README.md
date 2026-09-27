# privonta

Local **demo** web app for testing four roles: super admin, distributor, partner, and customer.

This is for **your PC only** (`localhost`). It is not deployed to the public internet.

## Requirements

- [Node.js](https://nodejs.org/) 18 or newer
- npm (included with Node)

## Run on your local PC

```bash
git clone https://github.com/shalin9230/privonta.git
cd privonta
git checkout cursor/env-setup-6ab3
npm install
npm start
```

Open in Chrome (or any browser):

**http://localhost:3000**

Stop the server with `Ctrl+C` in the terminal.

### Optional: auto-reload while developing

```bash
npm run dev
```

## Demo login accounts

All demo users use the **same password** (local testing only):

| Role | Email | Password |
| --- | --- | --- |
| Super admin | `superadmin@privonta.local` | `Privonta@Demo2026!` |
| Distributor | `distributor@privonta.local` | `Privonta@Demo2026!` |
| Partner | `partner@privonta.local` | `Privonta@Demo2026!` |
| Customer | `customer@privonta.local` | `Privonta@Demo2026!` |

Users are created automatically on `npm install` (runs `server/seed.js`). To reset them:

```bash
rm -rf data
npm run seed
```

## Verify from the terminal

```bash
curl -s http://localhost:3000/api/health
curl -s http://localhost:3000/api/demo-users
```

## Cloud Agent bootstrap (optional)

```bash
bash .cursor/install.sh
bash .cursor/verify-environment.sh
```
