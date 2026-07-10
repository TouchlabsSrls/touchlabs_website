#!/usr/bin/env bash
# Deploy public/ → newtl.touchlabs.it (Plesk document root)
# Uso: DEPLOY_HOST=user@newtl.touchlabs.it DEPLOY_PATH=/var/www/vhosts/touchlabs.it/newtl.touchlabs.it/httpdocs ./scripts/deploy-public.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HOST="${DEPLOY_HOST:-touchlabs@newtl.touchlabs.it}"
REMOTE="${DEPLOY_PATH:?Set DEPLOY_PATH to Plesk httpdocs}"

echo "Deploy $ROOT/public → $HOST:$REMOTE"

rsync -avz --delete \
  --exclude='.DS_Store' \
  --exclude='assets/video/touchlabs-showreel.mp4' \
  "$ROOT/public/" "$HOST:$REMOTE/"

echo "Removing legacy 72MB showreel on remote if present..."
ssh "$HOST" "rm -f '$REMOTE/assets/video/touchlabs-showreel.mp4'"

echo "Done. Verify: curl -sL https://newtl.touchlabs.it/ | grep -c 'Scopri tutti i servizi'"
