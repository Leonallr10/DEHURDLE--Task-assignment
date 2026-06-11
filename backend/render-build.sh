#!/usr/bin/env bash
set -euo pipefail

echo "==> Removing cached node_modules..."
rm -rf node_modules

echo "==> Installing dependencies..."
npm ci --omit=dev

echo "==> Verifying mongoose..."
node -e "const v=require('mongoose/package.json').version; if(!v.startsWith('7.')) throw new Error('Expected mongoose 7, got '+v); console.log('mongoose', v, 'OK')"
