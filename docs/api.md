# API Reference

## Overview

The backend is implemented in `server/index.mjs`. It exposes a small HTTP API used by the React frontend and by any external automation that wants to interact with the platform.

Base assumptions:

- responses are JSON unless otherwise stated;
- there is no authentication layer in the current implementation;
- uploads are served from `/uploads/*`;
- the production server also serves the built frontend.

## Conventions

- Content type for JSON endpoints: `application/json`
- Content type for upload endpoint: `multipart/form-data`
- Error payload shape: `{ "error": "message" }`
- Success payloads vary by endpoint

## Endpoints

### `GET /api/state`

Returns the full current application state required by the frontend.

Response shape:

```json
{
  "project": {
    "title": "Plataforma colaborativa para la historia del cancer de mama",
    "focus": "Encontrar todos los archivos donde se menciona cancer de mama..."
  },
  "terms": [],
  "documents": [],
  "analysis": {
    "summary": {},
    "timeline": [],
    "topTerms": [],
    "cooccurrences": [],
    "mentions": [],
    "documentsWithMentions": []
  }
}
```

Notes:

- `documents` are serialized server-side to include `uploadTextUrl` and `uploadFileUrl`.
- `analysis` is derived at request time from the current runtime corpus.

### `POST /api/terms`

Creates a new term.

Request body:

```json
{
  "canonical": "scirrhus of the breast",
  "variants": "scirrhous breast, scirrhus, scirrhous",
  "category": "historical nomenclature",
  "notes": "Used in late eighteenth and nineteenth century surgical writing."
}
```

Validation rules:

- `canonical` is required.
- `variants` is expected as a comma-separated string.
- `category` defaults to `general`.
- `notes` is optional.

Success response:

```json
{
  "ok": true
}
```

Error response:

```json
{
  "error": "canonical es obligatorio"
}
```

### `PUT /api/terms/:termId`

Updates an existing term.

Path parameters:

- `termId`: term identifier such as `term-1710419200000`

Request body:

```json
{
  "canonical": "mammary tumour",
  "variants": "mammary tumor, tumour of the breast, tumor of the breast",
  "category": "description",
  "notes": "Supports British and US spellings."
}
```

Validation and behavior:

- missing term returns `404`;
- `variants` is still a comma-separated string, not an array;
- unspecified fields fall back to current stored values.

Success response:

```json
{
  "ok": true
}
```

Not found response:

```json
{
  "error": "Termino no encontrado"
}
```

### `POST /api/documents`

Creates a new document and optionally stores OCR text and a binary upload.

Content type:

- `multipart/form-data`

Accepted fields:

- `title`
- `shortTitle`
- `year`
- `place`
- `language`
- `recordType`
- `sourceHost`
- `contributorName`
- `contributorRole`
- `summary`
- `notes`
- `ocrText`
- `file`

Validation rules:

- `title` is required;
- at least one of the following must be present:
  - `ocrText`
  - `file` with a `text/*` MIME type
  - `summary`
- uploaded file size is limited to 25 MB;
- if a text file is uploaded and `ocrText` is absent, the server extracts text from the uploaded file buffer.

Example with `curl`:

```bash
curl -X POST http://localhost:8080/api/documents \
  -F 'title=Clinical remarks on cancer of the breast' \
  -F 'shortTitle=McGuire, 1882' \
  -F 'year=1882' \
  -F 'place=Richmond' \
  -F 'language=english' \
  -F 'recordType=clinical article' \
  -F 'sourceHost=Internet Archive' \
  -F 'contributorName=Research Team' \
  -F 'contributorRole=editor' \
  -F 'summary=Short editorial summary of the document.' \
  -F 'ocrText=Full OCR text goes here.'
```

Success response:

```json
{
  "ok": true,
  "id": "doc-1710419200000",
  "document": {
    "id": "doc-1710419200000",
    "title": "Clinical remarks on cancer of the breast",
    "shortTitle": "McGuire, 1882",
    "year": 1882,
    "place": "Richmond",
    "language": "english",
    "recordType": "clinical article",
    "sourceHost": "Internet Archive",
    "contributorName": "Research Team",
    "contributorRole": "editor",
    "notes": "",
    "summary": "Short editorial summary of the document.",
    "textPath": "/absolute/path/in/runtime-data/uploads/...",
    "originalFilePath": "",
    "sourceLinks": [],
    "createdAt": "2026-04-13T00:00:00.000Z",
    "reviewStatus": "nuevo",
    "uploadTextUrl": "/uploads/doc-1710419200000.txt",
    "uploadFileUrl": ""
  }
}
```

Error responses:

```json
{
  "error": "title es obligatorio"
}
```

```json
{
  "error": "Se necesita OCR en texto, archivo de texto o un resumen minimo."
}
```

### `GET /api/similar-contexts/:mentionId`

Returns the nearest contextual neighbors for an existing mention.

Path parameters:

- `mentionId`: an ID returned inside the `analysis.mentions` array from `GET /api/state`

Typical response shape:

```json
{
  "sourceMention": {},
  "similarContexts": []
}
```

Behavior:

- uses the current corpus and current term configuration;
- compares chunk vectors using cosine similarity;
- excludes the source chunk itself from the neighbor list;
- returns only rows with positive similarity scores.

### `POST /api/context-query`

Returns contextual neighbors for arbitrary input text.

Request body:

```json
{
  "text": "The breast became indurated and painful with ulceration following..."
}
```

Validation rules:

- `text` is required and trimmed;
- empty text returns `400`.

Success response:

```json
{
  "sourceContext": {},
  "similarContexts": []
}
```

Error response:

```json
{
  "error": "text es obligatorio"
}
```

## Upload URL Handling

Uploaded OCR text files and uploaded original files are exposed through:

- `/uploads/<basename>`

The server strips directory paths and only publishes the basename through `uploadTextUrl` and `uploadFileUrl`.

## Response Data Notes

### Terms

Terms typically contain:

```json
{
  "id": "cancer-breast",
  "canonical": "cancer of the breast",
  "variants": ["breast cancer", "cancerous breast"],
  "category": "enfermedad",
  "notes": "Formula canonica amplia para detectar menciones directas."
}
```

### Documents

Documents typically contain:

- bibliographic metadata;
- editorial metadata;
- persisted text/file paths;
- generated upload URLs;
- `reviewStatus`.

### Mentions

Mention rows inside `analysis.mentions` include:

- mention `id`;
- `documentId`;
- `documentTitle`;
- `year`;
- `place`;
- `recordType`;
- `termId`;
- `canonicalTerm`;
- `matchedText`;
- `snippet`;
- `chunkId`.

## Stability Notes

This API is currently internal-to-platform and not versioned. If the project is released for wider external integration, maintainers should consider:

1. explicit API versioning;
2. formal schema documentation;
3. request validation middleware;
4. authentication and rate limiting;
5. deletion and moderation endpoints;
6. structured error codes.
