# Reviewer Guide

This guide defines the reviewer path for EVA during the one-maintainer phase and the transition toward a multi-maintainer open project.

It complements:

- [ROADMAP.md](../ROADMAP.md)
- [docs/governance.md](governance.md)
- [docs/release-strategy.md](release-strategy.md)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

## Purpose

Review in EVA is not only code review.

Because the project sits at the intersection of historical research, philosophy of classification, and software engineering, reviewers are expected to check:

- technical correctness;
- documentation completeness;
- operational safety;
- research-method fit;
- data-rights implications when relevant.

## Reviewer Pipeline

The project currently operates with one maintainer, so the reviewer pipeline is preparatory rather than mandatory.

The intended path is:

1. contributor submits reproducible changes;
2. trusted contributors begin giving informal review feedback;
3. reviewer candidates are recognized through repeated high-quality review and contribution work;
4. once there is enough reviewer continuity, GitHub `main` can require approving PR review;
5. only after that should the project add a second maintainer.

## What Reviewers Should Check

### Technical Review

- does the code do what the change claims;
- are validation rules clear and defensible;
- are backward-compatibility or persistence risks introduced;
- are `npm run lint` and `npm run build` still expected to pass.

### Documentation Review

- if behavior changed, were docs updated in the same change;
- are setup, API, storage, or deployment assumptions now different;
- is the public repo still understandable without private operator context.

### Operational Review

- does the change affect deployment, backups, or runtime data;
- does it alter the GitHub versus Gitea authority model;
- could it create production risk if later promoted to `deploy/eva-hadox-org`.

### Research Review

- does the change affect historical interpretation or analytical output;
- are heuristic or lexical assumptions explained;
- is the difference between retrieval and interpretation preserved.

## Reviewer Labels

The GitHub label set should support review routing.

Important labels:

- `needs-review`
- `research-impact`
- `ops-impact`
- `docs-impact`
- `tests`
- `good first issue`
- `help wanted`

## When To Tighten GitHub Review Rules

GitHub `main` should require approving review only when:

- at least one active reviewer besides the lead maintainer exists;
- contributor throughput is high enough to justify stricter gates;
- urgent fixes will not be blocked by a single person being unavailable.

Until then:

- keep branch deletion and force pushes disabled;
- keep review expectations documented;
- build reviewer habit before enforcing reviewer dependency.

## Reviewer Candidate Signals

Good reviewer candidates usually show:

- repeated merged work;
- accurate and constructive feedback;
- strong documentation discipline;
- awareness of research and operational impact, not only code style.

## Maintainer Use

Maintainers should use this guide to:

- route issues to contributor-friendly work;
- identify trusted contributors;
- distinguish routine fixes from research-sensitive changes;
- decide when the repository is ready for mandatory PR review.

