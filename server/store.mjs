import { mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import records from '../src/data/records.json' with { type: 'json' }

const serverDir = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(serverDir, '..')
const dataRoot = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(projectRoot, 'runtime-data')
const uploadsRoot = path.join(dataRoot, 'uploads')
const termsPath = path.join(dataRoot, 'terms.json')
const documentsPath = path.join(dataRoot, 'documents.json')

const seedTerms = [
  {
    id: 'cancer-breast',
    canonical: 'cancer of the breast',
    variants: ['breast cancer', 'cancerous breast'],
    category: 'enfermedad',
    notes: 'Formula canonica amplia para detectar menciones directas.',
  },
  {
    id: 'scirrhus-breast',
    canonical: 'scirrhus of the breast',
    variants: ['scirrhous breast', 'scirrhus', 'scirrhous'],
    category: 'nomenclatura historica',
    notes: 'Variantes tempranas y decimononicas.',
  },
  {
    id: 'mammary-tumour',
    canonical: 'mammary tumour',
    variants: ['mammary tumor', 'tumour of the breast', 'tumor of the breast'],
    category: 'descripcion',
    notes: 'Incluye variantes britanicas y estadounidenses.',
  },
  {
    id: 'ulcerated-breast',
    canonical: 'ulcerated breast',
    variants: ['ulcerated cancer of the mamma', 'open cancer', 'ulceration of the breast'],
    category: 'descripcion',
    notes: 'Formula para lesiones avanzadas y ulceradas.',
  },
  {
    id: 'retracted-nipple',
    canonical: 'retracted nipple',
    variants: ['drawn nipple', 'retraction of the nipple'],
    category: 'sintoma',
    notes: 'Muy util para descripcion clinica historica.',
  },
  {
    id: 'axillary-glands',
    canonical: 'axillary glands',
    variants: ['glands in the axilla', 'axilla', 'axillary gland'],
    category: 'anatomia',
    notes: 'Sirve para extension y ganglios.',
  },
  {
    id: 'lying-in-breast',
    canonical: 'lying-in',
    variants: ['diseased nipples', 'sore nipples', 'abscess of the breast', 'induration'],
    category: 'puerperio',
    notes: 'Captura el eje parteria-lactancia-puerperio.',
  },
  {
    id: 'operation-extirpation',
    canonical: 'operation',
    variants: ['extirpation', 'operative treatment', 'mastectomy'],
    category: 'tratamiento',
    notes: 'Relaciona operacion, extirpacion y lenguaje quirurgico.',
  },
]

function buildSeedDocuments() {
  return records.map((record) => {
    const ocrAttachment = record.attachments.find((attachment) => attachment.kind === 'ocr')
    const ocrPath = ocrAttachment
      ? path.join(projectRoot, 'public', ocrAttachment.url.replace(/^\//, ''))
      : ''

    return {
      id: record.id,
      title: record.title,
      shortTitle: record.shortTitle,
      year: record.year,
      place: record.place,
      language: record.language,
      recordType: record.recordType,
      sourceHost: record.sourceHost,
      contributorName: 'Seed corpus',
      contributorRole: 'sistema',
      notes: record.description,
      summary: [
        record.description,
        record.howDescribed,
        record.treatmentNote,
        record.actorsNote,
        record.patientNote,
        record.frequencyNote,
        record.economyNote,
        record.reportingNote,
      ]
        .filter(Boolean)
        .join('\n\n'),
      textPath: ocrPath,
      originalFilePath: '',
      sourceLinks: record.attachments
        .filter((attachment) => attachment.kind === 'source')
        .map((attachment) => ({
          label: attachment.label,
          url: attachment.url,
        })),
      createdAt: new Date().toISOString(),
      reviewStatus: 'seed',
    }
  })
}

async function fileExists(targetPath) {
  try {
    await stat(targetPath)
    return true
  } catch {
    return false
  }
}

async function writeJson(targetPath, payload) {
  await writeFile(targetPath, JSON.stringify(payload, null, 2), 'utf8')
}

async function readJson(targetPath) {
  return JSON.parse(await readFile(targetPath, 'utf8'))
}

export async function ensureStore() {
  await mkdir(dataRoot, { recursive: true })
  await mkdir(uploadsRoot, { recursive: true })

  if (!(await fileExists(termsPath))) {
    await writeJson(termsPath, seedTerms)
  }

  if (!(await fileExists(documentsPath))) {
    await writeJson(documentsPath, buildSeedDocuments())
  }
}

export async function loadTerms() {
  await ensureStore()
  return readJson(termsPath)
}

export async function saveTerms(terms) {
  await writeJson(termsPath, terms)
}

export async function loadDocuments() {
  await ensureStore()
  return readJson(documentsPath)
}

export async function saveDocuments(documents) {
  await writeJson(documentsPath, documents)
}

export async function resolveDocumentText(document) {
  if (document.textPath && (await fileExists(document.textPath))) {
    return readFile(document.textPath, 'utf8')
  }

  return document.summary || document.notes || ''
}

export function getPaths() {
  return {
    dataRoot,
    uploadsRoot,
    projectRoot,
  }
}
