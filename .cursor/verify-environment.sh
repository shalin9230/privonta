#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

bash "$ROOT/.cursor/install.sh"

if [[ ! -f "$ROOT/README.md" ]]; then
  echo "Expected README.md in repository root" >&2
  exit 1
fi

if ! grep -q privonta "$ROOT/README.md"; then
  echo "README sanity check failed" >&2
  exit 1
fi

echo "Environment verification passed."
