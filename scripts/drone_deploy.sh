#!/usr/bin/env bash
set -euo pipefail

DEPLOY_PATH="${DEPLOY_PATH:-$HOME/eva.hadox.org}"
COMPOSE_FILE="${COMPOSE_FILE:-compose.hostinger.yaml}"
COMPOSE_PROJECT_NAME="${COMPOSE_PROJECT_NAME:-eva-hadox-org}"

cd "$DEPLOY_PATH"

mkdir -p runtime-data/uploads

# The server build uses the local source tree; stale build artifacts only slow it down.
rm -rf dist node_modules

docker compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" config -q
docker compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" build --pull archive
docker compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" up -d --remove-orphans archive
docker compose -p "$COMPOSE_PROJECT_NAME" -f "$COMPOSE_FILE" ps
