# Changelog

All notable changes to this project should be documented in this file.

The format is based on Keep a Changelog principles and uses semantic version tags where practical.

## [v0.1.0] - 2026-04-13

Initial public open-source research baseline.

### Added

- Apache 2.0 licensing and project notice files.
- Security policy, security contact, code of conduct, contributing guide, and data-rights policy.
- Public collaboration templates for GitHub and Gitea.
- Technical documentation for architecture, API, data model, operations, governance, release strategy, research methodology, and repository metadata.
- Public GitHub repository in `Hadox-Research-Labs`.
- Initial tag `v0.1.0`.

### Changed

- README rewritten as a public-facing open research project overview.
- Deployment workflow updated so Drone deploys from `deploy/eva-hadox-org` instead of deploying directly from `main`.
- Governance model clarified: GitHub `main` for open collaboration, Gitea `deploy/eva-hadox-org` for live deployment.
- Compose naming and `.gitignore` refined to match documented operational practice.

### Security

- GitHub repository hardened with branch protection, vulnerability alerts, and automated security fixes.

## Release Workflow

For future entries:

- add a new section per version tag;
- group changes under `Added`, `Changed`, `Fixed`, `Removed`, `Security` where useful;
- ensure the changelog entry matches the actual tagged release.
