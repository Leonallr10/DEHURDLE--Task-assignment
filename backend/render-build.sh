#!/usr/bin/env bash
set -euo pipefail

echo "==> Removing cached node_modules..."
rm -rf node_modules

echo "==> Installing dependencies (npm ci)..."
npm ci

echo "==> Verifying @mongodb-js/saslprep..."
if [ ! -f "node_modules/@mongodb-js/saslprep/dist/node.js" ]; then
  echo "==> dist missing — force reinstalling saslprep..."
  npm install @mongodb-js/saslprep@1.4.11 --force --no-save
fi

node -e "require('@mongodb-js/saslprep'); console.log('==> saslprep OK')"
