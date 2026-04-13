# Release Strategy

## Purpose

This document defines the branch and release model for a real open project that also operates a live production platform.

## Branch Model

### `main`

Purpose:

- open collaboration branch;
- public integration branch;
- branch used for pull requests, review, and general feature development.

Remote expectations:

- protected in GitHub;
- may also exist in Gitea as the mirrored integration branch.

### `deploy/eva-hadox-org`

Purpose:

- deployment branch for the live platform at `eva.hadox.org`;
- branch promoted intentionally from reviewed code;
- branch used by Drone to trigger production deployment.

Remote expectations:

- must exist in Gitea;
- should be protected in Gitea;
- should only move through maintainer-controlled promotion.

## Promotion Flow

Recommended workflow:

1. contributors open changes against `main`;
2. maintainers review and merge into `main`;
3. CI validates `main`;
4. maintainers decide which `main` commit is production-ready;
5. that commit is promoted to `deploy/eva-hadox-org`;
6. Drone deploys from `deploy/eva-hadox-org`.

This separates open collaboration from production stability.

## Why This Is Better Than Deploying From `main`

Deploying directly from `main` is fast, but it is not ideal for a public open project because:

- every merge becomes production-sensitive;
- public collaboration and production safety get tightly coupled;
- rollback and promotion decisions become less explicit;
- it becomes harder to distinguish reviewed-for-production state from merely merged state.

Using a dedicated deploy branch is more professional for a public-facing research platform.

## Tag Strategy

Recommended tag scheme:

- semantic version tags on releaseable commits, for example `v0.1.0`, `v0.2.0`, `v1.0.0`
- optional pre-release tags, for example `v0.2.0-rc1`

Tags should point to commits already validated in `main`.

## Recommended Protection Rules

### GitHub `main`

- require pull requests before merge;
- require at least one review;
- require conversation resolution;
- disallow force pushes;
- disallow branch deletion.

### Gitea `deploy/eva-hadox-org`

- restrict direct pushes to maintainers;
- disallow force pushes;
- disallow deletion;
- require promotion to be explicit and auditable.

## Manual Promotion Example

```bash
git checkout main
git pull origin main
git checkout -B deploy/eva-hadox-org main
git push origin deploy/eva-hadox-org
```

## Rollback Strategy

If a deployment must be rolled back:

1. identify the last known-good commit;
2. move `deploy/eva-hadox-org` back to that commit;
3. redeploy through Drone.

## First Public Release

The current open-source baseline is suitable to mark as `v0.1.0`.
