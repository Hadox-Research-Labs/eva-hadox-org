# Contributing

This repository is meant to support both:

- a primary operational remote in Gitea at `git.hadox.org`;
- a public mirror in GitHub for broader open source collaboration.

This document defines the expected contribution workflow for maintainers and external contributors.

For repository authority and release ownership, see [docs/governance.md](docs/governance.md) and [docs/release-strategy.md](docs/release-strategy.md).

For the project growth path from contributor to reviewer and maintainer, see [ROADMAP.md](ROADMAP.md).

## Principles

- Keep the repository runnable from local source with minimal prerequisites.
- Prefer explicit documentation over tribal knowledge.
- Treat repository data and runtime data as different concerns.
- Do not commit `runtime-data/`.
- Do not introduce infrastructure coupling that only exists in one host without documenting it.

## Supported Contribution Areas

- frontend UX and visualization improvements;
- API design and validation improvements;
- ingestion tooling and editorial workflow improvements;
- historical lexicon and corpus curation tooling;
- deployment and operations documentation;
- automated testing and CI hardening.

## Development Workflow

1. Fork or branch from the current default branch.
2. Install dependencies with `npm ci`.
3. Run `npm run lint`.
4. Run `npm run build`.
5. If your change touches runtime behavior, verify the affected flow locally.
6. Update documentation when behavior, configuration, or operational assumptions change.

## Local Run Workflow

Backend:

```bash
npm run server
```

Frontend dev server:

```bash
npm run dev
```

Containerized run:

```bash
docker compose up --build
```

## Branching And Review

Recommended branch naming:

- `feature/<short-name>`
- `fix/<short-name>`
- `docs/<short-name>`
- `ops/<short-name>`

Pull requests should include:

- a short problem statement;
- the design or implementation approach;
- any data-model or API compatibility impact;
- any operator-facing changes;
- documentation updates if behavior changed.

## Commit Guidance

Prefer small, intentional commits with clear messages, for example:

- `docs: expand architecture and operations guide`
- `fix: validate document uploads with clearer errors`
- `feat: add editorial review metadata to documents`

## Documentation Requirement

Any change that affects one of the following must update docs in the same change:

- local setup;
- environment variables;
- API payloads or responses;
- storage layout;
- deployment topology;
- contributor workflow.

## Data And Privacy

This repository is a research platform, not a clinical records platform.

Contributors must not:

- upload patient-identifiable private medical data;
- commit secrets, credentials, or private SSH material;
- commit local `runtime-data/` artifacts;
- assume uploaded research files are safe for public redistribution without verifying rights.

## Gitea And GitHub Flow

The intended collaboration model is:

- GitHub is the public collaboration and visibility surface.
- `main` is the open collaboration branch.
- Gitea is the operational deployment remote.
- `deploy/eva-hadox-org` is the deployment branch used for `eva.hadox.org`.

For this repository, the default policy is:

- GitHub `main` is where open-source collaboration is expected.
- Gitea at `git.hadox.org` remains the authoritative deployment remote.
- deployment promotion happens by moving `deploy/eva-hadox-org` in Gitea after maintainers decide a `main` commit is ready for production.
- release tags should point to commits already validated in `main`.

If both remotes are used, maintainers should keep:

- branch names aligned where possible;
- tags consistent;
- release notes reproducible from the same commit SHA.

## Areas That Need Special Care

- `server/analysis.mjs`: changes can alter research output and interpretation.
- `server/store.mjs`: changes affect persistence compatibility.
- `src/data/records.json`: changes affect the seed corpus and first-boot state.
- deployment files: changes affect production availability and recoverability.

## Before Opening A PR

Run:

```bash
npm run lint
npm run build
```

If your change affects docs only, still verify that links, commands, and file paths remain correct.
