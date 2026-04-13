# Roadmap

This roadmap defines the next growth path for EVA as both:

- an open research software project;
- a live research platform operated in production at `eva.hadox.org`.

It is intentionally split between product, research, and community maturity so contributors can see where the project is going and what kinds of help are most valuable.

## Current Phase

Current phase: `v0.1.x` foundational open-project phase.

This phase establishes:

- public documentation;
- governance and security policy;
- GitHub public collaboration;
- Gitea operational deployment;
- Drone-based production promotion through `deploy/eva-hadox-org`.

## Near-Term Priorities

### 1. Platform Safety And Reliability

- add authentication before broad public write exposure;
- add automated tests for API behavior and analysis logic;
- document and test backup and restore procedures against real runtime data;
- improve validation around uploads, OCR text, and metadata entry.

### 2. Research Data Maturity

- add provenance fields at record and upload level;
- add editorial status markers such as `prospected`, `curated`, `reviewed`;
- improve rights metadata for archival texts, OCR artifacts, and uploads;
- make corpus version boundaries easier to cite and reproduce.

### 3. Analytical Quality

- add tests for term detection and co-occurrence behavior;
- make chunking and similarity settings more explicit and inspectable;
- add researcher-visible explanations for analytical limitations;
- support better export of evidence trails for scholarly writing.

### 4. Open Collaboration

- attract first external contributors through documentation-first issues;
- define labels for research, documentation, frontend, backend, and operations work;
- establish a reviewer path before tightening GitHub PR review rules;
- publish release notes consistently for tagged versions.

## Contributor And Reviewer Roadmap

The project should grow through a clear responsibility ladder.

### Stage 1. Contributor

Expected profile:

- fixes docs, UI issues, validation gaps, or small bugs;
- improves tests or research metadata handling;
- follows existing governance and documentation requirements.

Expected evidence:

- one or more merged changes;
- respectful discussion and reproducible work;
- willingness to update docs with behavior changes.

### Stage 2. Trusted Contributor

Expected profile:

- contributes repeatedly in one area such as frontend, API, corpus tooling, or documentation;
- can review simple changes informally;
- understands the GitHub and Gitea branch model.

Expected evidence:

- several merged changes over time;
- reliable local verification with `npm run lint` and `npm run build`;
- ability to explain operational or research impact of changes.

### Stage 3. Reviewer

Expected profile:

- reviews pull requests for correctness, documentation, and project fit;
- can identify when a change affects research interpretation, not only code behavior;
- helps preserve clarity between public collaboration and production deployment.

Expected evidence:

- sustained contribution quality;
- good review judgment;
- familiarity with the current methodological and data-rights constraints.

### Stage 4. Maintainer

Expected profile:

- can merge to `main`;
- can promote validated commits to `deploy/eva-hadox-org`;
- can manage releases, documentation, and operator-facing decisions;
- can represent the project’s interdisciplinary standards in public.

Expected evidence:

- trusted reviewer history;
- operational discipline;
- clear communication;
- alignment with the research program and governance model.

## Maintainer Growth Trigger

The project should add a second maintainer before tightening GitHub `main` to require mandatory approving review.

Professional trigger conditions:

- at least one active reviewer other than the lead maintainer;
- at least one contributor with repeated, reliable merged work;
- enough continuity that urgent fixes will not be blocked by one person’s absence.

Once that threshold is reached:

- add the second maintainer in GitHub and Gitea;
- require PR review on GitHub `main`;
- require conversation resolution before merge;
- keep production promotion in Gitea limited to maintainers.

## Research Program Roadmap

### Corpus And Curation

- expand and normalize the pre-1900 seed corpus;
- improve editorial notes and source-type distinctions;
- clarify what is canonical corpus material versus exploratory prospecting material.

### Conceptual And Historical Work

- refine historical disease-term groupings;
- document why terms are grouped or separated;
- connect lexical findings to specific historiographical questions.

### Computational Extensions

- improve reproducibility of analysis outputs;
- add better traceability from visualization back to source passages;
- evaluate future multilingual or semantic retrieval features cautiously against historical validity requirements.

## Release Roadmap

### `v0.1.x`

- stabilize open-project documentation;
- publish consistent release notes;
- harden branch and deployment controls;
- begin test coverage.

### `v0.2.x`

- add authentication and stronger write-path controls;
- improve provenance and rights metadata;
- add first meaningful automated tests.

### `v0.3.x`

- strengthen reviewer workflow;
- improve research exports and traceability;
- formalize contributor labels and milestones.

### `v1.0.0`

Target characteristics:

- stable contributor workflow;
- at least two maintainers;
- required GitHub PR review on `main`;
- tested core analysis and ingestion flows;
- publication-ready release and citation guidance.

## How Contributors Can Help Now

High-value first contributions:

- improve tests;
- improve upload and validation UX;
- refine historical metadata and notes fields;
- improve documentation clarity for external researchers;
- review analytical assumptions against the stated methodology.
