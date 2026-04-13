# Operations Guide

## Purpose

This document is the runbook for local operators and maintainers. It covers local development, containerized execution, persistence handling, deployment, and recovery.

## Supported Runtime Baseline

Use:

- Node.js 24.x
- npm 11.x or newer
- Docker with Compose plugin

These versions match CI and container builds.

## Key Files

- `package.json`: scripts and dependency declarations
- `vite.config.js`: frontend dev proxy configuration
- `Dockerfile`: production image build
- `compose.yaml`: local compose run
- `compose.hostinger.yaml`: production compose run
- `.drone.yml`: CI/CD pipeline
- `scripts/drone_deploy.sh`: remote deployment script

## Installation

Install dependencies:

```bash
npm ci
```

Download seed OCR files referenced by the curated corpus:

```bash
npm run download:sources
```

This step writes OCR text into `public/raw/ocr/`.

## Local Development Workflow

### Option 1: Split frontend and backend

Start the backend:

```bash
npm run server
```

Start the frontend dev server in another terminal:

```bash
npm run dev
```

Expected local endpoints:

- frontend dev server: `http://localhost:5173`
- backend API server: `http://localhost:8080`

The Vite dev server proxies:

- `/api`
- `/uploads`

to `http://localhost:8080`.

### Option 2: Production-style local run

Build:

```bash
npm run build
```

Run:

```bash
npm run server
```

Expected endpoint:

- `http://localhost:8080`

## Docker Workflow

Local compose run:

```bash
docker compose up --build -d
```

Local compose characteristics:

- project name: `25-eva-hadox-dev`
- service name: `archive`
- container name: `25-eva-hadox-archive-dev`
- exposed port: `4173`
- mounted persistence: `./runtime-data:/app/runtime-data`

Expected endpoint:

- `http://localhost:4173`

Stop:

```bash
docker compose down
```

Rebuild after source changes:

```bash
docker compose up --build -d
```

## Environment Variables

### Application

- `PORT`
  - default: `8080`
  - used by Express

- `DATA_DIR`
  - default outside Docker: `<repo>/runtime-data`
  - default inside Docker image: `/app/runtime-data`
  - controls runtime JSON and upload storage location

### Compose

- `COMPOSE_PROJECT_NAME`
  - local `.env` currently sets `25-eva-hadox-dev`

### Deployment Script

`scripts/drone_deploy.sh` accepts:

- `DEPLOY_PATH`
  - default: `$HOME/eva.hadox.org`
- `COMPOSE_FILE`
  - default: `compose.hostinger.yaml`
- `COMPOSE_PROJECT_NAME`
  - default: `eva-hadox-org`

## Persistence And Backups

The mutable state is:

- `runtime-data/terms.json`
- `runtime-data/documents.json`
- `runtime-data/uploads/`

Back up all of `runtime-data/`, not just the JSON files.

### Backup Example

```bash
tar -czf eva-runtime-data-$(date +%Y%m%d-%H%M%S).tar.gz runtime-data
```

### Restore Example

1. Stop the application.
2. Restore the archived `runtime-data/` directory.
3. Start the application again.

Example:

```bash
docker compose down
rm -rf runtime-data
tar -xzf eva-runtime-data-20260413-120000.tar.gz
docker compose up -d
```

Adjust the exact restore commands to match the archive structure you created.

## Build Validation

Current validation commands:

```bash
npm run lint
npm run build
```

There is currently no automated test suite. Lint and build are the main safety checks.

## Current CI/CD Flow

Drone pipeline behavior:

1. clone the repository on `push` and `pull_request` for `main` and `deploy/eva-hadox-org`;
2. run:
   - `npm ci`
   - `npm run lint`
   - `npm run build`
3. on push to `deploy/eva-hadox-org`, deploy via SSH to the VPS;
4. sync repository contents with `rsync`, excluding runtime and local artifacts;
5. execute `scripts/drone_deploy.sh` on the remote machine.

Branch behavior:

- `main` is the open collaboration branch;
- `deploy/eva-hadox-org` is the production deployment branch;
- deployment should happen only after a reviewed promotion from `main`.

### Required Drone Secret

- `EVA_DEPLOY_SSH_KEY`

This must contain the private SSH key that allows the Drone runner to authenticate as `deploy` on the target VPS.

## Production Deployment Topology

The current intended production deployment uses:

- source repository in Gitea;
- Drone for CI/CD;
- target VPS at `191.101.233.39`;
- deploy user home path `/home/deploy/eva.hadox.org`;
- production compose file `compose.hostinger.yaml`;
- internal bind `127.0.0.1:4174:8080`;
- deployment branch `deploy/eva-hadox-org`.

Operational implication:

- the application is not directly exposed on all interfaces by the production compose file;
- a reverse proxy such as Nginx, Caddy, or another fronting service is expected to terminate public traffic and forward to `127.0.0.1:4174`.

## Manual Deployment

If CI is unavailable, a maintainer can deploy manually on the target host.

Typical sequence:

```bash
cd /home/deploy/eva.hadox.org
chmod +x scripts/drone_deploy.sh
./scripts/drone_deploy.sh
```

What the script does:

- ensures `runtime-data/uploads` exists;
- removes local `dist` and `node_modules` to avoid stale build artifacts;
- validates the compose file;
- rebuilds the `archive` service image with `--pull`;
- restarts the service.

## Troubleshooting

### App boots but there is no data

Check:

- whether `runtime-data/` exists;
- whether `runtime-data/documents.json` was created;
- whether `src/data/records.json` exists and is valid JSON.

### Uploaded files are missing

Check:

- whether `runtime-data/uploads/` exists;
- whether the bind mount is present in Docker;
- whether file permissions allow the app container to write into the mounted directory.

### Dev frontend cannot reach API

Check:

- backend is running on `localhost:8080`;
- Vite proxy configuration in `vite.config.js`;
- browser requests are using `/api` rather than hardcoded ports.

### Production app starts but site is unreachable

Check:

- container status with `docker compose ps`;
- host bind `127.0.0.1:4174`;
- reverse proxy upstream configuration;
- firewall rules;
- whether the reverse proxy points at the expected port.

### OCR downloads fail

Check:

- network reachability to remote archive sources;
- correctness of `remoteUrl` values in `src/data/records.json`;
- whether the remote endpoint is serving plain text as expected.

## Operational Risks

- No auth means the application should not be exposed broadly without network controls.
- Local JSON persistence has no concurrency control.
- Runtime schema changes require manual compatibility handling.
- No delete flows means moderation or cleanup is manual.
- No background processing means larger datasets will eventually affect responsiveness.

## Recommended Next Operations Work

1. add health checks and basic smoke tests;
2. document reverse proxy configuration explicitly;
3. automate runtime-data backups;
4. add restore drills;
5. add observability for HTTP errors and deploy failures.
