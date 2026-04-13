# Release Notes Template

Use this template when publishing a Git tag or GitHub release.

Replace bracketed values before publishing.

## EVA Platform [version]

Release date: `[YYYY-MM-DD]`

Tag: `[vX.Y.Z]`

Production branch: `deploy/eva-hadox-org`

### Summary

One short paragraph describing the release in plain language.

### Research And Product Impact

- note any change that affects corpus interpretation, lexicon behavior, or analytical results;
- note any interface or workflow change that affects researchers or maintainers;
- state whether the release changes only documentation, only operations, or the application itself.

### Added

- item

### Changed

- item

### Fixed

- item

### Security

- item

### Deployment Notes

- whether this tag was promoted to `deploy/eva-hadox-org`;
- whether any manual migration, data backup, or restart step was required;
- whether rollback requires a specific prior tag or commit.

### Documentation

- list the docs updated alongside the release, if any.

### Verification

- `npm run lint`
- `npm run build`
- any manual smoke checks
