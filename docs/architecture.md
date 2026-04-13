# Architecture

## Overview

The EVA Breast Cancer Archive Platform is a single-repository web application with:

- a React frontend built by Vite;
- an Express server that exposes the API and serves the built frontend;
- a local-disk persistence layer based on JSON files and uploaded assets;
- a lexical and contextual analysis layer executed in-process at request time.

The platform is intentionally monolithic. There are no separate workers, queues, databases, or external indexing services.

## High-Level Topology

```text
Browser
  |
  | HTTP
  v
Express server (server/index.mjs)
  |-- serves /api/*
  |-- serves /uploads/*
  |-- serves built frontend from /dist
  |
  +--> store layer (server/store.mjs)
  |      |-- runtime-data/terms.json
  |      |-- runtime-data/documents.json
  |      `-- runtime-data/uploads/*
  |
  `--> analysis layer (server/analysis.mjs)
         |-- chunking
         |-- lexical mention detection
         |-- co-occurrence aggregation
         `-- TF-IDF vector similarity
```

## Runtime Components

### Frontend

Main frontend entrypoints:

- `src/main.jsx`
- `src/App.jsx`

The frontend is a client-rendered React application. It requests all main state from `GET /api/state` and then performs most interaction through in-memory filtering on the returned payload.

Primary UI responsibilities:

- render corpus overview metrics;
- filter mentions and connected documents;
- render D3 charts and network visualizations;
- create and edit lexicon terms;
- upload new documents;
- request contextual similarity comparisons.

### Backend

Main backend entrypoint:

- `server/index.mjs`

Backend responsibilities:

- initialize the runtime store on startup;
- serve JSON API endpoints;
- accept multipart uploads for new documents;
- serialize upload URLs for client access;
- compute analysis payloads for the corpus;
- serve the built frontend and uploaded files.

### Store Layer

Implemented in `server/store.mjs`.

Responsibilities:

- determine the active data root;
- create missing runtime directories;
- seed terms and documents when runtime state does not yet exist;
- load and save `terms.json` and `documents.json`;
- resolve a document’s text from stored OCR text or fallback summary fields.

The store layer is file-based and synchronous at the application level. There is no lock manager, migration engine, or multi-process coordination.

### Analysis Layer

Implemented in `server/analysis.mjs`.

Responsibilities:

- normalize and tokenize text;
- split document text into overlapping chunks;
- detect term mentions by exact or phrase regex;
- aggregate mentions by document and chunk;
- compute co-occurrences;
- compute timeline summaries;
- build TF-IDF vectors per chunk;
- return similar contexts for a selected mention or arbitrary text.

Analysis is cached in memory until invalidated. Cache invalidation occurs when terms or documents are changed through the API.

## Request Flow

### Initial Application Load

1. Browser loads built frontend.
2. Frontend requests `GET /api/state`.
3. Server loads terms and documents from runtime storage.
4. Server computes corpus analysis with the current runtime data.
5. Server returns:
   - project metadata;
   - term list;
   - serialized documents;
   - aggregate analysis payload.
6. Frontend renders the dashboard and performs client-side filtering.

### New Term Flow

1. User submits a term from the lexicon form.
2. Frontend sends `POST /api/terms` or `PUT /api/terms/:termId`.
3. Server persists updated `terms.json`.
4. Server invalidates analysis cache.
5. Frontend refreshes application state.

### Document Upload Flow

1. User submits metadata and optional file/OCR from the upload form.
2. Frontend sends multipart form data to `POST /api/documents`.
3. Server validates required fields.
4. Server writes OCR text and original uploaded file into `runtime-data/uploads/`.
5. Server appends a document record into `runtime-data/documents.json`.
6. Server invalidates analysis cache.
7. Frontend refreshes application state.

### Context Similarity Flow

There are two paths:

- mention-based: `GET /api/similar-contexts/:mentionId`
- free-text: `POST /api/context-query`

Both paths reuse the same TF-IDF chunk vector space from the current corpus.

## Persistence Design

The repository contains two kinds of data:

### Repository Data

Version-controlled files:

- `src/data/records.json`
- `src/data/discoveredDocuments.js`
- `src/data/researchPortals.json`
- `src/data/tracks.json`
- OCR files downloaded into `public/raw/ocr/`

These define the seed corpus and research-oriented static data shipped with the repository.

### Runtime Data

Non-versioned mutable state:

- `runtime-data/terms.json`
- `runtime-data/documents.json`
- `runtime-data/uploads/*`

This is the mutable application state. It must be backed up operationally and must not be committed.

## Deployment Topology

The current deployment pattern is a single-container application:

- built from `Dockerfile`;
- run with `compose.hostinger.yaml`;
- persisted through a bind-mounted `runtime-data/` directory;
- exposed internally on `127.0.0.1:4174` in production;
- expected to sit behind a reverse proxy for public access.

## Environment Model

Important runtime values:

- `PORT`: HTTP port used by Express.
- `DATA_DIR`: directory for runtime JSON state and uploaded files.
- `COMPOSE_PROJECT_NAME`: compose project namespace.

No external API keys, database URLs, or message brokers are required by the current application.

## CI/CD Model

The current pipeline is defined in `.drone.yml`.

Validation phase:

- `npm ci`
- `npm run lint`
- `npm run build`

Deploy phase:

- sync repository contents to the VPS over SSH using `rsync`;
- exclude `runtime-data/`, `node_modules/`, and local build artifacts;
- execute `scripts/drone_deploy.sh` remotely;
- rebuild and restart the application container.

## Architectural Constraints

The current design is simple, but it creates clear constraints:

- Only one writable runtime instance should be considered authoritative.
- Horizontal scaling is unsafe without a shared storage strategy.
- Analysis runs in-process, so very large corpora will increase response time and memory usage.
- No auth means network exposure must be controlled externally.
- No database means schema evolution must be handled manually and carefully.

## Recommended Future Architecture Work

Priority candidates for the next architectural stage:

1. authentication and role-based permissions;
2. a proper persistence backend or at least versioned runtime migrations;
3. background indexing and analysis jobs for larger corpora;
4. audit history for editorial changes;
5. semantic embeddings and multilingual retrieval;
6. test coverage for analysis correctness and API stability.
