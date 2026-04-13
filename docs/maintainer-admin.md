# Maintainer Admin Guide

## Purpose

This document is for maintainers operating the project across:

- GitHub public collaboration
- Gitea operational deployment
- Drone CI/CD
- the live platform at `eva.hadox.org`

It complements:

- [docs/operations.md](docs/operations.md)
- [docs/release-strategy.md](docs/release-strategy.md)
- [docs/governance.md](docs/governance.md)

## Infrastructure And Access Notes

Local command-center documentation already references the relevant infrastructure surfaces.

Relevant documented locations found in the wider workspace:

- `/home/hadox/cmd-center/infra/servers-docs/README.md`
- `/home/hadox/cmd-center/infra/servers-docs/eva.hadox.org.md`
- `/home/hadox/cmd-center/infra/servers-docs/be-cicd.md`
- `/home/hadox/cmd-center/infra/servers-docs/inventory.yaml`

Those documents reference:

- `git.hadox.org`
- `drone.hadox.org`
- `eva.hadox.org`
- VPS `srv566867`
- IP `191.101.233.39`

They also indicate that local token conventions exist for Gitea and Drone in the broader environment, but secrets themselves should be handled carefully and not copied into repository docs.

## Current Branch Model

- GitHub `main`: open collaboration branch
- Gitea `main`: mirrored integration branch
- Gitea `deploy/eva-hadox-org`: production deployment branch

Drone now deploys from:

- `deploy/eva-hadox-org`

## Exact Gitea Branch Protection Settings To Click

These are the recommended manual settings in the Gitea web UI for the repo at `git.hadox.org`.

### Protect `deploy/eva-hadox-org`

Go to:

1. repository
2. `Settings`
3. `Branches`
4. `Add branch protection rule`

Set:

- branch pattern: `deploy/eva-hadox-org`
- enable branch protection: `on`
- require pull request before merge: `on` if your Gitea workflow supports it cleanly
- block pushes from non-maintainers: `on`
- allow force push: `off`
- allow deletion: `off`
- whitelist pushers: only the maintainers who are allowed to promote production
- whitelist merge approvals if available: maintainers only

Recommended intent:

- only trusted maintainers can move the live deployment branch;
- production promotion remains explicit and auditable.

### Protect `main` In Gitea

Also recommended:

1. repository
2. `Settings`
3. `Branches`
4. `Add branch protection rule`

Set:

- branch pattern: `main`
- branch protection: `on`
- allow force push: `off`
- allow deletion: `off`

If Gitea PR review is part of your integration flow, require PRs there too. If GitHub is your primary review surface, keep Gitea `main` protected against destructive actions and use it mainly as the mirrored operational branch.

## Maintainer Promotion Workflow

Professional promotion flow:

1. contributors work on feature branches and open PRs against GitHub `main`;
2. maintainers review and merge into `main`;
3. CI validates the integrated commit;
4. maintainers choose a specific `main` commit for production;
5. maintainers promote that commit to Gitea `deploy/eva-hadox-org`;
6. Drone deploys from `deploy/eva-hadox-org`;
7. if appropriate, maintainers cut or update a release tag.

## Exact Promotion Commands

If local branches are up to date:

```bash
git checkout main
git pull github main
git push origin main
git checkout -B deploy/eva-hadox-org main
git push origin deploy/eva-hadox-org
```

If you want to promote a specific commit instead of the current `main` tip:

```bash
git checkout -B deploy/eva-hadox-org <commit-sha>
git push origin deploy/eva-hadox-org
```

## Rollback Commands

Rollback by promoting the last known-good commit:

```bash
git checkout -B deploy/eva-hadox-org <known-good-sha>
git push origin deploy/eva-hadox-org
```

If Gitea protection blocks direct push, use the approved maintainer workflow there.

## GitHub Protection Guidance

### Current Practical Protection

GitHub `main` is currently hardened enough for a single-maintainer phase:

- force pushes disabled
- branch deletion disabled
- vulnerability alerts enabled
- automated security fixes enabled
- discussions enabled

The stricter PR-review gate was intentionally relaxed so the repository can still be maintained in a one-maintainer setup.

### Later, When You Add Another Maintainer

Tighten GitHub `main` to require PR review.

Recommended future settings:

- require pull request before merge: `on`
- required approving reviews: `1` or `2`
- dismiss stale approvals: `on`
- require conversation resolution: `on`
- enforce for admins: `on` once you have enough maintainers
- keep force pushes disabled
- keep deletions disabled

This is the right time to strengthen review rules because there will be enough maintainers to avoid deadlocking the repository.

## Suggested Release And Notes Workflow

Recommended pattern:

1. merge reviewed work into `main`
2. update [CHANGELOG.md](../CHANGELOG.md)
3. tag the release on a reviewed `main` commit
4. promote the same or a known-good release commit to `deploy/eva-hadox-org`
5. publish release notes in GitHub and, if desired, mirror them in Gitea

## What Should Stay Out Of The Repository

Do not commit:

- live tokens
- API keys
- SSH private keys
- runtime-data
- production-only secrets

## If You Want API-Based Gitea Automation Later

If you want me to automate Gitea branch protection, repo settings, or release management directly, I need one of:

- a Gitea API token with repo admin access
- a documented local token path you explicitly authorize me to use

Until then, GitHub admin actions can be automated here more easily than Gitea admin actions.
