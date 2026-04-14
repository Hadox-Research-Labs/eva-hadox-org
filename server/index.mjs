import express from 'express'
import multer from 'multer'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  ensureStore,
  getPaths,
  loadDocuments,
  loadTerms,
  saveDocuments,
  saveTerms,
} from './store.mjs'
import {
  analyzeCorpus,
  invalidateAnalysisCache,
  similarContextsForMention,
  similarContextsForText,
} from './analysis.mjs'

const port = Number(process.env.PORT || 8080)
const serverDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(serverDir, '..')
const distRoot = path.join(projectRoot, 'dist')
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 25 * 1024 * 1024,
  },
})

const app = express()

await ensureStore()

function asUploadUrl(filePath) {
  if (!filePath) {
    return ''
  }

  return `/uploads/${path.basename(filePath)}`
}

function serializeDocument(document) {
  return {
    ...document,
    uploadTextUrl: asUploadUrl(document.textPath),
    uploadFileUrl: asUploadUrl(document.originalFilePath),
  }
}

app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(getPaths().uploadsRoot))

app.get('/api/state', async (_request, response) => {
  const [terms, documents] = await Promise.all([loadTerms(), loadDocuments()])
  const analysis = await analyzeCorpus(documents, terms)

  response.json({
    project: {
      title: 'Plataforma colaborativa para la historia del cancer de mama',
      focus:
        'Explorar el cancer de mama antes de 1900 desde la historia, la filosofia de la clasificacion y el analisis computacional del corpus, comparando menciones, contextos y vocabularios.',
    },
    terms,
    documents: documents.map(serializeDocument),
    analysis: {
      summary: analysis.summary,
      timeline: analysis.timeline,
      topTerms: analysis.topTerms,
      cooccurrences: analysis.cooccurrences,
      mentions: analysis.mentions,
      documentsWithMentions: analysis.documentsWithMentions,
    },
  })
})

app.post('/api/terms', async (request, response) => {
  const terms = await loadTerms()
  const canonical = String(request.body.canonical || '').trim()

  if (!canonical) {
    response.status(400).json({ error: 'canonical es obligatorio' })
    return
  }

  const variants = String(request.body.variants || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)

  terms.push({
    id: `term-${Date.now()}`,
    canonical,
    variants,
    category: String(request.body.category || 'general').trim() || 'general',
    notes: String(request.body.notes || '').trim(),
  })

  await saveTerms(terms)
  invalidateAnalysisCache()
  response.status(201).json({ ok: true })
})

app.put('/api/terms/:termId', async (request, response) => {
  const terms = await loadTerms()
  const term = terms.find((entry) => entry.id === request.params.termId)

  if (!term) {
    response.status(404).json({ error: 'Termino no encontrado' })
    return
  }

  term.canonical = String(request.body.canonical || term.canonical).trim()
  term.variants = String(request.body.variants || term.variants.join(', '))
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
  term.category = String(request.body.category || term.category).trim()
  term.notes = String(request.body.notes || term.notes || '').trim()

  await saveTerms(terms)
  invalidateAnalysisCache()
  response.json({ ok: true })
})

app.post('/api/documents', upload.single('file'), async (request, response) => {
  const documents = await loadDocuments()
  const { uploadsRoot } = getPaths()
  const title = String(request.body.title || '').trim()
  const summary = String(request.body.summary || '').trim()
  const ocrText = String(request.body.ocrText || '').trim()

  if (!title) {
    response.status(400).json({ error: 'title es obligatorio' })
    return
  }

  const id = `doc-${Date.now()}`
  let textPath = ''
  let originalFilePath = ''
  let resolvedText = ocrText

  if (!resolvedText && request.file && request.file.mimetype.startsWith('text/')) {
    resolvedText = request.file.buffer.toString('utf8')
  }

  if (!resolvedText && !summary) {
    response.status(400).json({
      error: 'Se necesita OCR en texto, archivo de texto o un resumen minimo.',
    })
    return
  }

  if (resolvedText) {
    textPath = path.join(uploadsRoot, `${id}.txt`)
    await writeFile(textPath, resolvedText, 'utf8')
  }

  if (request.file) {
    const extension = path.extname(request.file.originalname) || '.bin'
    originalFilePath = path.join(uploadsRoot, `${id}${extension}`)
    await writeFile(originalFilePath, request.file.buffer)
  }

  const document = {
    id,
    title,
    shortTitle: String(request.body.shortTitle || title).trim(),
    year: Number(request.body.year || new Date().getFullYear()),
    place: String(request.body.place || 'Sin lugar').trim(),
    language: String(request.body.language || 'sin especificar').trim(),
    recordType: String(request.body.recordType || 'archivo cargado').trim(),
    sourceHost: String(request.body.sourceHost || 'carga comunitaria').trim(),
    contributorName: String(request.body.contributorName || 'anonimo').trim(),
    contributorRole: String(request.body.contributorRole || 'comunidad').trim(),
    notes: String(request.body.notes || '').trim(),
    summary,
    textPath,
    originalFilePath,
    sourceLinks: [],
    createdAt: new Date().toISOString(),
    reviewStatus: 'nuevo',
  }

  documents.push(document)
  await saveDocuments(documents)
  invalidateAnalysisCache()
  response.status(201).json({ ok: true, id, document: serializeDocument(document) })
})

app.get('/api/similar-contexts/:mentionId', async (request, response) => {
  const [documents, terms] = await Promise.all([loadDocuments(), loadTerms()])
  const payload = await similarContextsForMention(
    request.params.mentionId,
    documents,
    terms,
  )

  response.json(payload)
})

app.post('/api/context-query', async (request, response) => {
  const [documents, terms] = await Promise.all([loadDocuments(), loadTerms()])
  const text = String(request.body.text || '').trim()

  if (!text) {
    response.status(400).json({ error: 'text es obligatorio' })
    return
  }

  const payload = await similarContextsForText(text, documents, terms)
  response.json(payload)
})

app.use(express.static(distRoot))

app.use((request, response, next) => {
  if (request.path.startsWith('/api') || request.path.startsWith('/uploads')) {
    next()
    return
  }

  response.sendFile(path.join(distRoot, 'index.html'))
})

app.listen(port, () => {
  console.log(`research platform listening on ${port}`)
})
