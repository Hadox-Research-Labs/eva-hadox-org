# Data Rights And Redistribution Policy

## Scope

This file governs rights expectations for non-code materials associated with the repository.

It applies to:

- OCR text files;
- historical source metadata;
- linked archival references;
- uploaded user-contributed materials;
- derivative research datasets built from those materials.

It does not replace the software license for the code itself. The code is licensed under Apache License 2.0.

## Core Principle

Code and historical materials must be treated as different rights categories.

The presence of a text, OCR file, image, scan, link, or metadata record in this repository does not by itself mean that the material is free of copyright, contract, database, archive-use, or institutional restrictions.

## Repository Code

The software code in this repository is governed by [LICENSE](LICENSE).

## Seed Corpus Metadata

Repository-curated metadata records such as entries in `src/data/records.json`, `src/data/discoveredDocuments.js`, `src/data/researchPortals.json`, and `src/data/tracks.json` are intended as research metadata and project-authored descriptive structure.

Unless a specific entry says otherwise, project-authored metadata may be redistributed as part of the repository under the repository’s open source terms for code and documentation.

## OCR Files

OCR files require special care.

Policy:

- OCR text downloaded from third-party archives should be treated as rights-sensitive source material.
- Redistribution is permitted only when maintainers have a reasonable basis to believe the source is public domain, openly licensed, or otherwise redistributable.
- If redistributability is uncertain, prefer storing stable source links and acquisition scripts rather than redistributing the OCR artifact itself.

Operational implication:

- before mirroring OCR-heavy content publicly to GitHub, maintainers should review each source family for redistribution safety;
- if needed, public mirrors may exclude some OCR payloads while retaining metadata and acquisition instructions.

## Linked Archival Sources

Links to external archives are references, not license transfers.

Maintainers and contributors must not assume that:

- an archive URL grants republication rights;
- OCR access implies unrestricted redistribution;
- institutional availability implies open licensing.

## Uploaded Materials

Uploaded materials placed into `runtime-data/uploads/` are not automatically cleared for public redistribution.

Policy:

- runtime uploads are treated as locally governed research materials;
- they must not be committed to version control;
- they must not be mirrored publicly without explicit rights review;
- maintainers should assume uploaded materials are private-to-instance unless documented otherwise.

## Sensitive Or Inappropriate Material

The platform must not be used to store:

- private clinical records;
- patient-identifiable non-public material;
- secrets or credentials;
- rights-restricted materials that the uploader has no permission to share.

## Public Mirror Policy

For GitHub or any other public mirror:

- code and project-authored docs are intended to be public;
- metadata may be public unless a specific restriction applies;
- OCR and archival derivatives should be reviewed before inclusion;
- `runtime-data/` must remain excluded.

## Contributor Responsibility

Contributors are responsible for ensuring that any material they add:

- can legally be shared in the intended repository context;
- is accurately described if rights are limited or uncertain;
- does not misrepresent third-party ownership or archive provenance.

## Recommended Review Workflow

Before adding non-code source material:

1. identify the original source institution or repository;
2. check whether the source is public domain, openly licensed, or unclear;
3. record provenance in metadata where possible;
4. avoid committing uncertain artifacts if a link or fetch script is sufficient;
5. escalate unclear cases to maintainers before public publication.

## Research Ethics Note

This project studies the historical language of disease. That does not remove the need for care around:

- archival rights;
- institutional restrictions;
- contextual sensitivity of medical history materials;
- the difference between scholarly quotation, metadata description, and full-text redistribution.

## Recommended Future Improvement

Maintainers should consider adding field-level rights metadata to source records, for example:

- `rightsStatus`
- `rightsNote`
- `redistributionAllowed`
- `sourceInstitution`
- `licenseUrl`

That would make public mirror decisions auditable and repeatable.
