# Data Model

## Overview

The platform uses a hybrid data model:

- version-controlled repository data for the seed corpus and static research structures;
- runtime JSON data for mutable collaborative state.

This document explains both.

## Repository Data

### `src/data/records.json`

This is the seed corpus used to initialize the runtime document store when `runtime-data/documents.json` does not yet exist.

A seed record includes fields such as:

- `id`
- `title`
- `shortTitle`
- `year`
- `place`
- `language`
- `recordType`
- `status`
- `sourceHost`
- `scope`
- `researchLenses`
- `historicalTerms`
- `description`
- `howDescribed`
- `treatmentNote`
- `actorsNote`
- `patientNote`
- `frequencyNote`
- `economyNote`
- `reportingNote`
- `attachments`

Attachment entries typically include:

- `label`
- `kind`
- `url`
- `remoteUrl`
- `download`

Important distinction:

- `records.json` is repository-curated data;
- the live application reads it only for first-boot seeding and for OCR file resolution.

### `src/data/discoveredDocuments.js`

This is a prospecting dataset, not the live corpus.

It contains identified candidate sources that are visible in the UI but are not yet part of the mutable document runtime store unless separately uploaded or curated.

Typical fields:

- `id`
- `shortTitle`
- `title`
- `year`
- `creator`
- `recordType`
- `sourceHost`
- `focus`
- `url`
- `ocrUrl`

### `src/data/researchPortals.json`

Static discovery resources for future corpus expansion.

### `src/data/tracks.json`

Static research tracks or thematic acquisition lanes used by the interface.

## Runtime Data

The runtime store defaults to:

- `runtime-data/terms.json`
- `runtime-data/documents.json`
- `runtime-data/uploads/`

The root can be changed with `DATA_DIR`.

## Runtime Terms

Terms are stored as an array in `terms.json`.

Shape:

```json
{
  "id": "cancer-breast",
  "canonical": "cancer of the breast",
  "variants": ["breast cancer", "cancerous breast"],
  "category": "enfermedad",
  "notes": "Formula canonica amplia para detectar menciones directas."
}
```

Semantics:

- `id` is the stable key used by mentions and updates.
- `canonical` is the display and grouping term.
- `variants` are alternate literal forms used for detection.
- `category` is a lightweight historical grouping dimension.
- `notes` captures editorial or methodological rationale.

Seed terms are defined directly in `server/store.mjs`.

## Runtime Documents

Documents are stored as an array in `documents.json`.

Shape:

```json
{
  "id": "rowley-1772",
  "title": "A Practical Treatise on Diseases of the Breast of Women",
  "shortTitle": "Rowley, 1772",
  "year": 1772,
  "place": "Londres",
  "language": "inglés",
  "recordType": "manual de partería",
  "sourceHost": "Internet Archive",
  "contributorName": "Seed corpus",
  "contributorRole": "sistema",
  "notes": "Manual sobre padecimientos mamarios...",
  "summary": "Manual sobre padecimientos mamarios...\n\n...",
  "textPath": "/absolute/path/to/public/raw/ocr/rowley-1772.txt",
  "originalFilePath": "",
  "sourceLinks": [],
  "createdAt": "2026-04-13T00:00:00.000Z",
  "reviewStatus": "seed"
}
```

For uploaded documents:

- `textPath` usually points into `runtime-data/uploads/`;
- `originalFilePath` may contain the stored uploaded binary;
- `reviewStatus` defaults to `nuevo`.

## Serialized Document Fields

When documents are returned through the API, the server adds:

- `uploadTextUrl`
- `uploadFileUrl`

These are URL-safe public paths for client access.

## Text Resolution Rules

When analysis needs a document’s text:

1. if `textPath` exists and the file is present, use that file;
2. otherwise use `summary`;
3. otherwise use `notes`;
4. otherwise use an empty string.

This means a document can participate in analysis even when no OCR file exists, as long as at least summary text is available.

## Analysis-Derived Structures

The following structures are not persisted as primary storage. They are derived at runtime:

- `analysis.summary`
- `analysis.timeline`
- `analysis.topTerms`
- `analysis.cooccurrences`
- `analysis.mentions`
- `analysis.documentsWithMentions`
- chunk vectors used for contextual similarity

These are recalculated in-process and cached in memory until invalidated.

## Mention Model

Mentions are generated from chunk-level term matching.

Typical shape:

```json
{
  "id": "rowley-1772:chunk:0:cancer-breast:0",
  "documentId": "rowley-1772",
  "documentTitle": "Rowley, 1772",
  "year": 1772,
  "place": "Londres",
  "recordType": "manual de partería",
  "termId": "cancer-breast",
  "canonicalTerm": "cancer of the breast",
  "matchedText": "cancer",
  "snippet": "....",
  "chunkId": "rowley-1772:chunk:0"
}
```

## Chunk Model

Chunks are internal analysis structures built by splitting text into overlapping windows.

Current defaults in `server/analysis.mjs`:

- chunk size: `900` characters
- overlap: `220` characters

These are implementation details but materially affect similarity quality and performance.

## Persistence Lifecycle

### First Boot

On first boot:

- `terms.json` is created from seed terms in `server/store.mjs`;
- `documents.json` is created from `src/data/records.json`;
- `uploads/` directory is created.

### After First Boot

After those files exist:

- runtime JSON becomes authoritative;
- editing repository seed files does not retroactively rewrite runtime JSON;
- operators must explicitly migrate or regenerate runtime data if they want repository changes applied to an existing deployment.

## Operational Implications

- `runtime-data/` must be backed up.
- Restoring `runtime-data/` restores live mutable state.
- Deleting `runtime-data/` effectively resets the instance to seed state plus any repository OCR assets.
- Multiple writable instances sharing no storage will diverge immediately.

## Recommended Future Data Work

1. formal schema validation for terms and documents;
2. explicit migration scripts for runtime state;
3. provenance and change history for editorial actions;
4. richer review-state and moderation fields;
5. import/export tooling for batch curation.
