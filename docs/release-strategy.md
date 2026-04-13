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
- currently practical protection only in GitHub because the project is still in a one-maintainer phase;
- may also exist in Gitea as the mirrored integration branch.

### `deploy/eva-hadox-org`

Purpose:

- deployment branch for the live platform at `eva.hadox.org`;
- branch promoted intentionally from reviewed code;
- branch used by Drone to trigger production deployment.

Remote expectations:

- must exist in Gitea;
- is protected in Gitea;
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

- currently enforced:
  - disallow force pushes;
  - disallow deletion;
  - enable vulnerability alerts and automated fixes.
- later, when a second active maintainer exists:
  - require pull requests before merge;
  - require at least one review;
  - require conversation resolution;
  - consider enforcing rules for admins.
- keep force pushes disabled;
- keep branch deletion disabled.

### Gitea `main`

- push whitelist enforced for `hadoxmin`;
- merge whitelist enforced for `hadoxmin`;
- force pushes disabled.

### Gitea `deploy/eva-hadox-org`

- push whitelist enforced for `hadoxmin`;
- merge whitelist enforced for `hadoxmin`;
- disallow force pushes;
- branch deletion blocked through protection;
- production promotion remains explicit and auditable.

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

## Release Notes Workflow

For each tagged release:

1. update [CHANGELOG.md](../CHANGELOG.md);
2. copy [docs/release-notes-template.md](release-notes-template.md);
3. fill in the release-specific research, operational, and verification notes;
4. publish the notes with the tag in GitHub;
5. if desired, mirror the same notes into Gitea.
