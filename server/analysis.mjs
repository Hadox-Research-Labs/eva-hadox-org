import { resolveDocumentText } from './store.mjs'

const STOPWORDS = new Set([
  'a',
  'about',
  'after',
  'all',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'been',
  'before',
  'being',
  'but',
  'by',
  'de',
  'del',
  'en',
  'for',
  'from',
  'had',
  'has',
  'have',
  'in',
  'into',
  'is',
  'it',
  'its',
  'la',
  'las',
  'los',
  'of',
  'on',
  'or',
  'que',
  'se',
  'the',
  'their',
  'them',
  'there',
  'these',
  'they',
  'this',
  'those',
  'to',
  'was',
  'were',
  'which',
  'with',
])

let cachedAnalysis = null

function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ſ/g, 's')
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .replace(/[‐‑–—]/g, '-')
}

function tokenize(text) {
  return normalize(text).match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) ?? []
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function splitIntoChunks(text, chunkSize = 900, overlap = 220) {
  const compact = text.replace(/\r\n/g, '\n').trim()
  if (!compact) {
    return []
  }

  const paragraphs = compact
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)

  const chunks = []

  for (const paragraph of paragraphs.length ? paragraphs : [compact]) {
    if (paragraph.length <= chunkSize) {
      chunks.push(paragraph)
      continue
    }

    for (let index = 0; index < paragraph.length; index += chunkSize - overlap) {
      chunks.push(paragraph.slice(index, index + chunkSize))
    }
  }

  return chunks
}

function buildSnippet(text, index, length, radius = 120) {
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + length + radius)
  return text
    .slice(start, end)
    .replace(/\s+/g, ' ')
    .trim()
}

function countValues(values) {
  const counts = new Map()
  for (const value of values) {
    if (!value) {
      continue
    }

    counts.set(value, (counts.get(value) ?? 0) + 1)
  }

  return [...counts.entries()].sort((left, right) => right[1] - left[1])
}

function analyzeTermsInChunk(chunkText, term) {
  const patterns = new Set([term.canonical, ...(term.variants ?? [])].map((value) => value.trim()))
  const mentions = []

  for (const pattern of patterns) {
    if (!pattern) {
      continue
    }

    const expression = /\s/.test(pattern)
      ? new RegExp(escapeRegex(pattern), 'gi')
      : new RegExp(`\\b${escapeRegex(pattern)}\\b`, 'gi')

    for (const match of chunkText.matchAll(expression)) {
      mentions.push({
        matchedText: match[0],
        index: match.index ?? 0,
        length: match[0].length,
      })
    }
  }

  return mentions
}

function buildTfIdf(chunks) {
  const documentFrequency = new Map()
  const preparedTokens = chunks.map((chunk) => {
    const tokens = tokenize(chunk.text).filter(
      (token) => token.length > 2 && !STOPWORDS.has(token),
    )
    const uniqueTokens = new Set(tokens)

    for (const token of uniqueTokens) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1)
    }

    return tokens
  })

  const vectorizedChunks = chunks.map((chunk, index) => {
    const vectorData = buildVector(
      preparedTokens[index],
      documentFrequency,
      chunks.length,
    )

    return {
      ...chunk,
      ...vectorData,
    }
  })

  return {
    vectorizedChunks,
    documentFrequency,
    chunkCount: chunks.length,
  }
}

function buildVector(tokens, documentFrequency, chunkCount) {
  const counts = new Map()
  for (const token of tokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }

  const vector = new Map()
  let magnitude = 0

  for (const [term, count] of counts.entries()) {
    const tf = count / tokens.length
    const idf = Math.log((1 + chunkCount) / (1 + (documentFrequency.get(term) ?? 0))) + 1
    const weight = tf * idf

    vector.set(term, weight)
    magnitude += weight * weight
  }

  return {
    vector,
    magnitude: Math.sqrt(magnitude),
  }
}

function vectorizeText(text, documentFrequency, chunkCount) {
  const tokens = tokenize(text).filter((token) => token.length > 2 && !STOPWORDS.has(token))
  return buildVector(tokens, documentFrequency, chunkCount)
}

function cosineSimilarity(leftVector, leftMagnitude, rightVector, rightMagnitude) {
  if (!leftMagnitude || !rightMagnitude) {
    return 0
  }

  let dotProduct = 0
  for (const [term, value] of leftVector.entries()) {
    if (rightVector.has(term)) {
      dotProduct += value * rightVector.get(term)
    }
  }

  return dotProduct / (leftMagnitude * rightMagnitude)
}

function buildSimilarContextRows(sourceVector, sourceMagnitude, analysis, excludedChunkId = null) {
  return analysis.vectorizedChunks
    .filter((chunk) => chunk.id !== excludedChunkId)
    .map((chunk) => ({
      chunkId: chunk.id,
      documentId: chunk.documentId,
      documentTitle: chunk.documentTitle,
      year: chunk.year,
      place: chunk.place,
      recordType: chunk.recordType,
      snippet: chunk.text.slice(0, 320),
      score: cosineSimilarity(sourceVector, sourceMagnitude, chunk.vector, chunk.magnitude),
      termLabels: [
        ...new Set(
          analysis.mentions
            .filter((mention) => mention.chunkId === chunk.id)
            .map((mention) => mention.canonicalTerm),
        ),
      ],
    }))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, 8)
}

export function invalidateAnalysisCache() {
  cachedAnalysis = null
}

export async function analyzeCorpus(documents, terms) {
  if (cachedAnalysis) {
    return cachedAnalysis
  }

  const mentions = []
  const chunks = []
  const chunkMentions = new Map()
  const documentMentionMap = new Map()
  let chunkIndex = 0

  for (const document of documents) {
    const text = await resolveDocumentText(document)
    const documentChunks = splitIntoChunks(text)

    documentMentionMap.set(document.id, {
      document,
      mentions: [],
      termIds: new Set(),
    })

    for (const rawChunk of documentChunks) {
      const chunkId = `${document.id}:chunk:${chunkIndex}`
      const chunk = {
        id: chunkId,
        documentId: document.id,
        documentTitle: document.shortTitle || document.title,
        year: document.year,
        place: document.place,
        recordType: document.recordType,
        text: rawChunk,
      }

      chunks.push(chunk)
      chunkMentions.set(chunkId, new Set())
      chunkIndex += 1

      for (const term of terms) {
        const found = analyzeTermsInChunk(rawChunk, term)
        if (!found.length) {
          continue
        }

        for (const match of found) {
          const mentionId = `${chunkId}:${term.id}:${mentions.length}`
          const mention = {
            id: mentionId,
            documentId: document.id,
            documentTitle: document.shortTitle || document.title,
            year: document.year,
            place: document.place,
            recordType: document.recordType,
            termId: term.id,
            canonicalTerm: term.canonical,
            matchedText: match.matchedText,
            snippet: buildSnippet(rawChunk, match.index, match.length),
            chunkId,
          }

          mentions.push(mention)
          documentMentionMap.get(document.id).mentions.push(mention)
          documentMentionMap.get(document.id).termIds.add(term.id)
          chunkMentions.get(chunkId).add(term.id)
        }
      }
    }
  }

  const { vectorizedChunks, documentFrequency, chunkCount } = buildTfIdf(chunks)
  const vectorChunkMap = new Map(vectorizedChunks.map((chunk) => [chunk.id, chunk]))
  const cooccurrences = new Map()

  for (const [, termSet] of chunkMentions.entries()) {
    const termsInChunk = [...termSet]
    for (let left = 0; left < termsInChunk.length; left += 1) {
      for (let right = left + 1; right < termsInChunk.length; right += 1) {
        const pair = [termsInChunk[left], termsInChunk[right]].sort().join('::')
        cooccurrences.set(pair, (cooccurrences.get(pair) ?? 0) + 1)
      }
    }
  }

  const termLookup = new Map(terms.map((term) => [term.id, term]))
  const documentsWithMentions = [...documentMentionMap.values()]
    .filter((entry) => entry.mentions.length)
    .map((entry) => ({
      id: entry.document.id,
      title: entry.document.title,
      shortTitle: entry.document.shortTitle,
      year: entry.document.year,
      place: entry.document.place,
      recordType: entry.document.recordType,
      contributorName: entry.document.contributorName,
      reviewStatus: entry.document.reviewStatus,
      mentionCount: entry.mentions.length,
      termLabels: [...entry.termIds].map((termId) => termLookup.get(termId)?.canonical ?? termId),
    }))
    .sort((left, right) => left.year - right.year)

  const timelineMap = new Map()
  for (const document of documents) {
    const decade = `${Math.floor(Number(document.year) / 10) * 10}s`
    if (!timelineMap.has(decade)) {
      timelineMap.set(decade, { decade, total: 0, matched: 0 })
    }

    timelineMap.get(decade).total += 1
    if (documentMentionMap.get(document.id)?.mentions.length) {
      timelineMap.get(decade).matched += 1
    }
  }

  cachedAnalysis = {
    summary: {
      documentsTotal: documents.length,
      documentsWithMentions: documentsWithMentions.length,
      totalMentions: mentions.length,
      configuredTerms: terms.length,
      vectorizedContexts: vectorizedChunks.length,
    },
    timeline: [...timelineMap.values()].sort(
      (left, right) => Number.parseInt(left.decade, 10) - Number.parseInt(right.decade, 10),
    ),
    topTerms: countValues(mentions.map((mention) => mention.termId))
      .slice(0, 12)
      .map(([termId, count]) => ({
        termId,
        label: termLookup.get(termId)?.canonical ?? termId,
        count,
      })),
    cooccurrences: [...cooccurrences.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 20)
      .map(([pair, count]) => {
        const [source, target] = pair.split('::')
        return {
          source,
          sourceLabel: termLookup.get(source)?.canonical ?? source,
          target,
          targetLabel: termLookup.get(target)?.canonical ?? target,
          count,
        }
      }),
    mentions,
    documentsWithMentions,
    vectorizedChunks,
    vectorChunkMap,
    documentFrequency,
    chunkCount,
  }

  return cachedAnalysis
}

export async function similarContextsForMention(mentionId, documents, terms) {
  const analysis = await analyzeCorpus(documents, terms)
  const sourceMention = analysis.mentions.find((mention) => mention.id === mentionId)

  if (!sourceMention) {
    return {
      sourceMention: null,
      similarContexts: [],
    }
  }

  const sourceChunk = analysis.vectorChunkMap.get(sourceMention.chunkId)

  if (!sourceChunk) {
    return {
      sourceMention,
      similarContexts: [],
    }
  }

  return {
    sourceMention,
    similarContexts: buildSimilarContextRows(
      sourceChunk.vector,
      sourceChunk.magnitude,
      analysis,
      sourceChunk.id,
    ),
  }
}

export async function similarContextsForText(sourceText, documents, terms) {
  const analysis = await analyzeCorpus(documents, terms)
  const vectorData = vectorizeText(
    sourceText,
    analysis.documentFrequency,
    analysis.chunkCount,
  )

  if (!sourceText.trim() || !vectorData.magnitude) {
    return {
      sourceContext: {
        snippet: sourceText.trim(),
      },
      similarContexts: [],
    }
  }

  return {
    sourceContext: {
      snippet: sourceText.trim().slice(0, 600),
    },
    similarContexts: buildSimilarContextRows(
      vectorData.vector,
      vectorData.magnitude,
      analysis,
    ),
  }
}
