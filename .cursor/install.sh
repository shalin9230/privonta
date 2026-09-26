#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd git
require_cmd curl
require_cmd node
require_cmd python3

MARKER="$ROOT/.cursor/.install-complete"
STAMP="$(git rev-parse HEAD 2>/dev/null || echo 'no-git')"

if [[ -f "$MARKER" ]] && [[ "$(cat "$MARKER")" == "$STAMP" ]]; then
  echo "Install already up to date for commit $STAMP"
  exit 0
fi

echo "Bootstrapping privonta development environment at $ROOT"
node --version
python3 --version

# Add package-manager install steps here when the project defines them
# (e.g. npm ci, pip install -r requirements.txt, cargo fetch).

echo "$STAMP" > "$MARKER"
echo "Install complete."
