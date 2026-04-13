# Governance

## Repository Authority

This project uses a dual-remote model:

- canonical operational deployment repository: Gitea at `git.hadox.org`
- public collaboration repository: GitHub

The authority model is split by responsibility:

- GitHub `main` is the public collaboration branch.
- Gitea is the operational deployment authority.
- Gitea branch `deploy/eva-hadox-org` is the branch that should drive production deployment.

That means:

- production deployment decisions are authoritative only from Gitea;
- deployment automation is anchored to Gitea and Drone;
- public contribution flow can happen in GitHub without directly deploying every merged change;
- production promotion should be a deliberate maintainer act.

## Why This Model

The project needs both:

- a dependable operational home tied to existing deployment infrastructure;
- a public-facing collaboration surface for open source visibility and contribution.

Using GitHub for open collaboration and Gitea for controlled deployment is more professional for a live public platform than deploying directly from the public integration branch.

## Maintainer Responsibilities

Maintainers are expected to:

- preserve deployability of the canonical branch;
- review technical and documentation changes;
- keep public and canonical mirrors aligned;
- protect secrets and deployment paths;
- keep branch-protection and release controls aligned with the actual maintainer count;
- communicate clearly when policies or contribution paths change.

## Contribution Intake

Contributions may be discussed or proposed in GitHub, but maintainers retain authority to:

- review and merge into `main`;
- decide when a `main` commit is production-ready;
- promote reviewed commits to `deploy/eva-hadox-org`;
- close stale or non-aligned proposals;
- require documentation updates for behavioral changes.

## Release Authority

The release authority flow is:

1. changes merge into GitHub `main`;
2. validated commits are mirrored or synced to Gitea `main`;
3. maintainers promote a chosen commit to `deploy/eva-hadox-org` in Gitea;
4. Drone deploys from `deploy/eva-hadox-org`;
5. release tags are cut from reviewed commits.

If a commit exists in GitHub `main` but has not been promoted to `deploy/eva-hadox-org`, it should not be treated as the live production state.

## Documentation Authority

Repository documentation should be written so that:

- external contributors can orient themselves from the public mirror alone;
- internal operators do not rely on undocumented tribal knowledge;
- differences between public and private operational context are explicit.

## Licensing Intent

The software code in this repository is licensed under Apache License 2.0.

This choice is intended to:

- permit broad reuse;
- support academic and commercial adoption;
- allow derivative platform work;
- include an explicit patent grant for contributor safety.

Historical source texts, OCR artifacts, and uploaded research materials may carry separate rights and must be reviewed independently.

## Future Governance Improvements

As the project grows, maintainers should consider adding:

1. named maintainer roles;
2. review and merge policy by area;
3. release cadence expectations;
4. archival and data-rights governance policy;
5. public roadmap and milestone ownership.

## Review Policy Maturity

The current repository protections are intentionally sized for a one-maintainer phase.

Later, when the project has at least one additional active maintainer, GitHub `main` should be tightened to require pull requests with approval before merge. That is the more professional steady state for a mature open research project, but applying it too early would create an artificial maintenance bottleneck.
