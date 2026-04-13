# Open Source Release Orientation

## Goal

This repository is intended to become:

- the canonical platform codebase managed through Gitea at `git.hadox.org`;
- a public mirror on GitHub for visibility, reuse, and community contributions.

This document describes how to frame and operate the project for that dual-host model.

## Recommended Repository Roles

### Gitea

Recommended as the operational source of truth for:

- protected branches;
- CI/CD integration with Drone;
- deploy secrets;
- internal operator workflow;
- release approvals that affect production.

### GitHub

Recommended as the public-facing mirror for:

- discovery;
- public issues and discussions, if desired;
- external pull requests;
- public release notes and tags;
- ecosystem visibility.

## Recommended Governance Pattern

Use one of these patterns explicitly and document it in both remotes:

### Pattern A: Gitea canonical, GitHub mirror

- all merges happen in Gitea;
- GitHub mirrors commits and tags;
- GitHub PRs are either disabled or treated as contribution intake that is replayed in Gitea.

### Pattern B: Shared contribution intake, Gitea release authority

- issues and PRs may be accepted in both places;
- maintainers decide merge location;
- release tags are always cut from the Gitea canonical branch;
- GitHub is updated immediately after merges.

For this project, the most professional model is a hybrid:

- GitHub `main` for public collaboration;
- Gitea for operational deployment authority;
- a dedicated deployment branch in Gitea so production promotion is separate from public collaboration traffic.

## Minimum Public Metadata To Add

Before broad public promotion, add or confirm:

1. a license file;
2. a code of conduct if public community contributions are expected;
3. issue and pull request templates;
4. a security disclosure policy;
5. a clear statement of which remote is canonical;
6. release tags and versioning policy;
7. maintainer contact points.

## README Positioning

The public README should answer:

- what the platform is;
- who it is for;
- what problems it solves;
- how to run it locally;
- what its current limitations are;
- where the detailed technical docs live;
- how to contribute.

This repository now includes the baseline README, contributing guidance, license, security policy, governance notes, and collaboration templates. Release maintainers should keep those files aligned with actual repository policy as the project evolves.

## Suggested Branch Policy

Recommended baseline:

- default branch: `main`
- protected branch: `main`
- deployment branch in Gitea: `deploy/eva-hadox-org`
- short-lived feature branches
- tags for releaseable states

Recommended release naming:

- `v0.1.0`
- `v0.2.0`
- `v1.0.0`

Until the platform stabilizes, semantic versioning can still be used even if releases are pre-1.0.

## Suggested Release Notes Structure

For each release, include:

- platform capabilities added or changed;
- any API changes;
- data model or migration impact;
- operational or deployment changes;
- known limitations;
- upgrade notes if runtime compatibility changed.

## Security And Exposure Notes

The current platform is not ready for unrestricted public write access.

Reasons:

- no authentication;
- no role separation;
- no moderation queue;
- writable upload and term-edit endpoints;
- local JSON persistence without multi-user controls.

For a public open source repository, that is acceptable. For a public internet deployment, it is not enough by itself.

## Recommended Public Messaging

Position the project as:

- an open research infrastructure platform;
- a collaborative historical corpus exploration tool;
- a base for community curation and analysis workflows;
- an actively evolving platform with clear next steps.

Avoid framing it as:

- a clinical decision tool;
- a medical diagnostic system;
- a secure multi-tenant archive platform.

## Suggested Immediate Open Source Roadmap

1. protect `main` in GitHub and the deployment branch in Gitea;
2. add tests for API and analysis logic;
3. add authentication before any wide public write-enabled deployment;
4. add export/import and moderation tooling;
5. define public issue labels and milestones;
6. document and enforce the promotion flow to production.

## Mirror Synchronization Recommendation

If Gitea is canonical, automate mirroring from Gitea to GitHub after merge to `main`.

Keep the following synchronized:

- branches intended for public visibility;
- annotated tags;
- release notes;
- changelog entries;
- README and docs.

## Maintainer Checklist Before Public Launch

- repository is licensed;
- secrets are not committed;
- `runtime-data/` is excluded and absent from version control;
- docs are accurate and complete;
- CI is green on `main`;
- deploy path is documented;
- contributors know whether to use Gitea or GitHub for PRs;
- security posture is documented honestly.
- maintainer or security contact address is published.
