# EVA Breast Cancer Archive Platform

EVA Breast Cancer Archive Platform is an interdisciplinary open research platform for studying how breast cancer was named, described, classified, and treated before 1900.

It brings together historical source curation, conceptual and lexical analysis, and computational corpus methods in a single environment intended for collaborative research.

The platform combines:

- a curated seed corpus stored in the repository;
- a local editable lexicon of historical terms and variants;
- full-corpus mention detection across seed and uploaded documents;
- contextual similarity based on TF-IDF chunk vectors;
- a collaborative ingestion workflow for OCR, notes, and uploaded files;
- a prospecting layer for documents identified but not yet curated into the main corpus.

This repository is the technical base intended to be maintained in Gitea at `git.hadox.org` and mirrored publicly to GitHub.

## Public Summary

This project sits at the intersection of:

- history of medicine;
- philosophy of language and classification;
- digital humanities;
- computer science applied to corpus exploration.

The platform supports researchers who want to trace how historical disease categories were formed, stabilized, contested, and recorded across archival, medical, and public texts.

## Status

The codebase is functional and deployable, but still intentionally simple:

- no authentication or authorization layer;
- no relational database;
- no background jobs;
- no external search engine;
- no automated test suite yet;
- persistent state stored on disk in JSON files and uploaded assets.

That simplicity makes the platform easy to run and hack on, but it also means operators should treat it as a research platform with explicit operational discipline.

## What The Platform Does

The current runtime supports:

- corpus bootstrapping from `src/data/records.json`;
- editable term management through the API and UI;
- seeded and uploaded document analysis;
- mention detection for canonical terms and variants;
- co-occurrence analysis within document chunks;
- timeline and term-frequency visualizations;
- contextual comparison from a selected mention;
- contextual comparison from manually pasted OCR text;
- collaborative document upload with metadata, OCR text, and file attachment;
- viewing uploaded OCR and original files through `/uploads/*`.

## Research Orientation

This project sits at the intersection of:

- history of medicine;
- philosophy of language and classification;
- digital humanities;
- computer science applied to corpus exploration.

It is not only a software product. It is also a research instrument for studying how disease categories are historically named, stabilized, contested, and operationalized across medical, popular, and archival texts.

See [docs/research-methodology.md](docs/research-methodology.md) for the full methodological framing.

## Technology Stack

- Frontend: React 19 + Vite
- Backend: Express 5
- Visualization: D3
- File upload handling: Multer
- Persistence: local JSON files + uploaded files on disk
- Containerization: Docker / Docker Compose
- CI/CD: Drone pipeline with remote deployment over SSH

## Repository Layout

```text
.
├── Dockerfile
├── compose.yaml
├── compose.hostinger.yaml
├── server/
│   ├── analysis.mjs
│   ├── index.mjs
│   └── store.mjs
├── src/
│   ├── App.jsx
│   ├── components/
│   └── data/
├── public/
│   └── raw/ocr/
├── runtime-data/
├── scripts/
│   ├── download-sources.mjs
│   └── drone_deploy.sh
└── docs/
```

## Documentation Map

- [docs/architecture.md](docs/architecture.md): system design, request flow, and deployment topology.
- [docs/api.md](docs/api.md): HTTP API, payloads, validation rules, and examples.
- [docs/data-model.md](docs/data-model.md): repository datasets and runtime persistence model.
- [docs/operations.md](docs/operations.md): local development, Docker, backup, restore, and deployment runbook.
- [docs/release-strategy.md](docs/release-strategy.md): branch model, promotion flow, and release/tag policy.
- [docs/research-methodology.md](docs/research-methodology.md): scientific framing, research questions, and interdisciplinary method.
- [docs/open-source-release.md](docs/open-source-release.md): Gitea and GitHub publishing orientation and release checklist.
- [docs/governance.md](docs/governance.md): canonical remote policy, maintainer roles, and release authority.
- [DATA_RIGHTS.md](DATA_RIGHTS.md): rights and redistribution policy for OCR, archival sources, and uploaded materials.
- [CONTRIBUTING.md](CONTRIBUTING.md): contributor workflow and collaboration rules.
- [SECURITY.md](SECURITY.md): vulnerability reporting and security boundaries.
- [SECURITY_CONTACT.md](SECURITY_CONTACT.md): private reporting paths and maintainer security contacts.
- [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md): collaboration standards.

## License

This codebase is licensed under the Apache License 2.0. See [LICENSE](LICENSE).

The software license applies to the code in this repository. Historical source texts, OCR artifacts, linked archival materials, and uploaded research data may be subject to separate rights and must be reviewed independently before redistribution. See [DATA_RIGHTS.md](DATA_RIGHTS.md).

## Prerequisites

Use the same major runtime used in CI and Docker:

- Node.js 24.x
- npm 11.x or newer
- Docker Engine with Docker Compose plugin for containerized runs

The code may work on slightly older modern Node releases, but `24.x` is the supported baseline because CI and production containers both use it.

## Quick Start

Install dependencies:

```bash
npm ci
```

Download remote OCR files declared in the seed corpus:

```bash
npm run download:sources
```

Build the frontend bundle:

```bash
npm run build
```

Start the production-style application server:

```bash
npm run server
```

The application will be available at `http://localhost:8080` when started directly with Node.

## Local Development

The repository uses a split local development workflow:

1. Start the backend server:

```bash
npm run server
```

2. In a second terminal, start the Vite development server:

```bash
npm run dev
```

The Vite server proxies `/api` and `/uploads` to `http://localhost:8080`. See `vite.config.js` for the proxy configuration.

During frontend development the default Vite URL is typically `http://localhost:5173`.

## Docker

For a local containerized run:

```bash
docker compose up --build -d
```

The local compose file:

- builds the application image from `Dockerfile`;
- binds host port `4173` to container port `8080`;
- mounts `./runtime-data` into the container for persistence.

The application will be available at `http://localhost:4173`.

## Persistence Model

Application state is persisted in `runtime-data/`:

- `runtime-data/terms.json`
- `runtime-data/documents.json`
- `runtime-data/uploads/`

On first boot, the server seeds missing files from repository data:

- seed corpus records are read from `src/data/records.json`;
- default terms are created from `server/store.mjs`.

If `runtime-data/` already exists, it is treated as the source of truth.

## Environment Variables

The runtime is intentionally small. The important environment variables are:

- `PORT`: HTTP server port. Default `8080`.
- `DATA_DIR`: absolute or relative path to the runtime data directory. Default `./runtime-data` relative to the repository root when running outside Docker.
- `COMPOSE_PROJECT_NAME`: used by Docker Compose. Local `.env` currently sets `25-eva-hadox-dev`.

## Quality Gates

Validation currently consists of:

```bash
npm run lint
npm run build
```

That same validation is used by the Drone pipeline before deployment.

## Deployment Summary

The current deployment model is SSH-based:

- Gitea hosts the primary Git repository.
- Drone runs validation and deployment on pushes to `main`.
- The deployment target is a VPS under `/home/deploy/eva.hadox.org`.
- The production compose file is `compose.hostinger.yaml`.
- The production container binds `127.0.0.1:4174:8080`, so an external reverse proxy is expected in front of it.

See [docs/operations.md](docs/operations.md) for the full runbook.

## Open Source Orientation

This repository is being prepared to serve two roles:

- private or internal system-of-record repository in Gitea at `git.hadox.org`;
- public mirror on GitHub for open source collaboration and discoverability.

The intended pattern is:

- GitHub `main` is the open collaboration branch for the public codebase;
- Gitea remains the operational remote for controlled deployment;
- Gitea deploys from `deploy/eva-hadox-org`, not directly from public collaboration traffic;
- documentation in this repository must be sufficient for external contributors to understand architecture, data flow, and contribution expectations without private operator context.

See [docs/open-source-release.md](docs/open-source-release.md) for the publishing model and release checklist.
See [docs/governance.md](docs/governance.md) for the canonical-remote policy and maintainer authority model.

## Known Limitations

- No auth means anyone with network access to the running app can modify terms and upload documents.
- Persistence is local-disk JSON, so concurrent multi-node writes are not supported.
- Similarity is lexical TF-IDF, not embedding-based semantic search.
- There are no delete endpoints for terms or documents.
- Large-scale ingestion workflows, moderation, and editorial review states are still minimal.

## Maintainer Recommendation

Before broad public release, prioritize:

1. adding authentication and role separation;
2. hardening the upload and moderation governance path;
3. adding automated tests for the API and analysis pipeline;
4. documenting reverse proxy and TLS configuration;
5. continuously maintaining explicit data-rights and archival-material redistribution policy.
