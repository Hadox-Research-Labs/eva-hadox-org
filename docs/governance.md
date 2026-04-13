# Governance

## Repository Authority

This project uses a dual-remote model:

- canonical operational repository: Gitea at `git.hadox.org`
- public collaboration mirror: GitHub

The canonical source of truth is the Gitea repository.

That means:

- deployment decisions are authoritative only from Gitea;
- release tags are authoritative only from Gitea;
- protected branch policy is defined in Gitea;
- secrets and operational automation are anchored to Gitea and Drone.

## Why This Model

The project needs both:

- a dependable operational home tied to existing deployment infrastructure;
- a public-facing collaboration surface for open source visibility and contribution.

Using Gitea as canonical and GitHub as public mirror keeps operations simple while still allowing public participation.

## Maintainer Responsibilities

Maintainers are expected to:

- preserve deployability of the canonical branch;
- review technical and documentation changes;
- keep public and canonical mirrors aligned;
- protect secrets and deployment paths;
- communicate clearly when policies or contribution paths change.

## Contribution Intake

Contributions may be discussed or proposed in public mirrors, but maintainers retain authority to:

- request that the authoritative merge happen in Gitea;
- replay or cherry-pick public changes into the canonical branch;
- close stale or non-aligned proposals;
- require documentation updates for behavioral changes.

## Release Authority

The release authority flow is:

1. changes merge into the canonical Gitea repository;
2. validation passes on the canonical branch;
3. maintainers cut release tags from the canonical repository;
4. tags and release notes are mirrored to GitHub.

If a tag exists only on GitHub and not on Gitea, it should not be treated as authoritative.

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
