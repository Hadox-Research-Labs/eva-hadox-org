# Security Policy

## Scope

This repository contains software for historical research and corpus analysis.

It is not:

- a clinical system;
- a medical device;
- a diagnostic tool;
- a secure records platform for sensitive patient data.

Security expectations should be set accordingly.

## Supported Versions

Security fixes are expected only for the currently maintained default branch:

- `main`: supported

Older snapshots, tags, or downstream forks may not receive coordinated fixes.

## Reporting A Vulnerability

Do not open public issues for unpatched security vulnerabilities.

Instead, report them privately to the maintainers at `eva@ciencias.unam.mx`.

Detailed contact guidance is documented in [SECURITY_CONTACT.md](SECURITY_CONTACT.md).

When reporting, include:

- affected component or file;
- reproduction steps;
- realistic impact;
- whether authentication, special access, or deployment exposure is required;
- proposed mitigation, if known.

## Response Goals

Target handling expectations:

- acknowledgement within 5 business days;
- triage and impact classification as soon as practical;
- coordinated fix or mitigation guidance before public disclosure where possible.

These are goals, not guaranteed service levels.

## Current Security Boundaries

The current platform has important limits:

- no authentication or authorization;
- writable term and document ingestion endpoints;
- local JSON persistence;
- local file uploads;
- no rate limiting;
- no audit log;
- no multi-tenant isolation.

Because of that, maintainers should assume the application is safe only behind deliberate network controls until stronger application-level security exists.

## Deployment Recommendations

If you operate this platform on a public or semi-public network:

- put it behind a reverse proxy and TLS;
- restrict write access using network controls or authentication in front of the app;
- back up `runtime-data/`;
- keep the host and container base images up to date;
- avoid exposing deploy keys or writable SSH paths broadly;
- do not use the platform to store private clinical records or regulated health data.

## Sensitive Data Policy

Do not commit or knowingly upload:

- secrets;
- access tokens;
- private SSH keys;
- patient-identifiable private medical data;
- non-public archival material without rights review.

## Public Disclosure

After a fix is available, maintainers may disclose:

- affected versions or commits;
- impact summary;
- remediation steps;
- whether runtime-data review or secret rotation is recommended.

## Security Improvement Priorities

The highest-priority improvements for this project are:

1. authentication and role separation;
2. request validation hardening;
3. upload controls and moderation workflow;
4. audit trail for editorial changes;
5. reverse proxy and production hardening documentation;
6. automated dependency and runtime patch hygiene.
