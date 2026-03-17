const STOPWORDS = new Set([
  'a',
  'about',
  'after',
  'all',
  'along',
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
  'con',
  'de',
  'del',
  'do',
  'during',
  'el',
  'en',
  'for',
  'from',
  'had',
  'has',
  'have',
  'her',
  'hers',
  'him',
  'his',
  'how',
  'in',
  'into',
  'is',
  'it',
  'its',
  'la',
  'las',
  'les',
  'lo',
  'los',
  'many',
  'more',
  'most',
  'no',
  'not',
  'of',
  'on',
  'or',
  'our',
  'out',
  'para',
  'por',
  'que',
  'se',
  'she',
  'so',
  'some',
  'such',
  'than',
  'that',
  'the',
  'their',
  'them',
  'there',
  'these',
  'they',
  'this',
  'those',
  'through',
  'to',
  'upon',
  'was',
  'were',
  'which',
  'who',
  'with',
  'woman',
  'women',
  'you',
])

const VARIANT_GROUPS = [
  ['scirrhus', 'scirrhous'],
  ['tumor', 'tumour', 'tumors', 'tumours'],
  ['hemorrhage', 'haemorrhage', 'hemorrhages', 'haemorrhages'],
  ['color', 'colour'],
  ['favor', 'favour'],
  ['labor', 'labour'],
  ['organize', 'organise', 'organization', 'organisation'],
  ['center', 'centre'],
  ['anemia', 'anaemia'],
  ['mamma', 'mammary', 'mammae'],
  ['cancer', 'cancerous', 'cancers'],
  ['nipple', 'nipples'],
  ['ulcer', 'ulcerated', 'ulceration', 'ulcers'],
  ['operation', 'operations', 'operative', 'operated'],
  ['axilla', 'axillary'],
]

const VARIANT_LOOKUP = buildVariantLookup()

function buildVariantLookup() {
  const lookup = new Map()

  for (const group of VARIANT_GROUPS) {
    const normalizedGroup = group.map((entry) => normalizeBase(entry))
    for (const term of normalizedGroup) {
      lookup.set(term, new Set(normalizedGroup))
    }
  }

  return lookup
}

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function normalizeBase(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/ſ/g, 's')
    .replace(/æ/g, 'ae')
    .replace(/œ/g, 'oe')
    .replace(/[‐‑–—]/g, '-')
}

export function tokenize(text) {
  return normalizeBase(text).match(/[a-z0-9]+(?:'[a-z0-9]+)?/g) ?? []
}

function buildMetadataText(record) {
  return [
    record.title,
    record.shortTitle,
    record.recordType,
    record.place,
    record.language,
    record.description,
    record.howDescribed,
    record.treatmentNote,
    record.actorsNote,
    record.patientNote,
    record.frequencyNote,
    record.economyNote,
    record.reportingNote,
    ...(record.historicalTerms ?? []),
    ...(record.researchLenses ?? []),
  ].join(' ')
}

function buildDocumentText(record, ocrTexts, scopeMode) {
  const metadataText = buildMetadataText(record)
  const ocrText = ocrTexts[record.id] ?? ''

  if (scopeMode === 'ficha') {
    return metadataText
  }

  if (scopeMode === 'ocr') {
    return ocrText || metadataText
  }

  return `${metadataText}\n\n${ocrText}`.trim()
}

function makeContextSnippet(text, index, length, radius = 90) {
  const start = Math.max(0, index - radius)
  const end = Math.min(text.length, index + length + radius)
  return text
    .slice(start, end)
    .replace(/\s+/g, ' ')
    .trim()
}

function collectPatternMatches(text, patterns, limit = 5) {
  const matches = []

  for (const pattern of patterns) {
    const normalizedPattern = pattern.trim()
    if (!normalizedPattern) {
      continue
    }

    const isSingleToken = !/\s/.test(normalizedPattern)
    const expression = isSingleToken
      ? new RegExp(`\\b${escapeRegex(normalizedPattern)}\\b`, 'gi')
      : new RegExp(escapeRegex(normalizedPattern), 'gi')

    for (const match of text.matchAll(expression)) {
      matches.push({
        term: normalizedPattern,
        index: match.index ?? 0,
        length: match[0].length,
      })
    }
  }

  matches.sort((left, right) => left.index - right.index)

  return {
    count: matches.length,
    matchedTerms: [...new Set(matches.map((match) => match.term))],
    contexts: matches.slice(0, limit).map((match) => ({
      snippet: makeContextSnippet(text, match.index, match.length),
      term: match.term,
    })),
  }
}

function expandToken(token) {
  const normalized = normalizeBase(token)
  const expanded = new Set([normalized])

  if (VARIANT_LOOKUP.has(normalized)) {
    for (const variant of VARIANT_LOOKUP.get(normalized)) {
      expanded.add(variant)
    }
  }

  if (normalized.endsWith('our')) {
    expanded.add(`${normalized.slice(0, -3)}or`)
  }

  if (normalized.endsWith('or')) {
    expanded.add(`${normalized.slice(0, -2)}our`)
  }

  if (normalized.endsWith('y')) {
    expanded.add(`${normalized.slice(0, -1)}ies`)
  }

  if (normalized.endsWith('ies')) {
    expanded.add(`${normalized.slice(0, -3)}y`)
  }

  if (normalized.length > 4) {
    expanded.add(`${normalized}s`)
    expanded.add(`${normalized}ed`)
    expanded.add(`${normalized}ing`)
  }

  if (normalized.endsWith('e') && normalized.length > 4) {
    expanded.add(`${normalized.slice(0, -1)}ing`)
  }

  if (normalized.endsWith('s') && normalized.length > 3) {
    expanded.add(normalized.slice(0, -1))
  }

  return [...expanded]
}

function pickRelatedTerms(text, queryTokens, maxTerms = 6) {
  const counts = new Map()

  for (const token of tokenize(text)) {
    if (token.length < 4 || STOPWORDS.has(token) || queryTokens.has(token)) {
      continue
    }

    counts.set(token, (counts.get(token) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, maxTerms)
    .map(([term, value]) => ({ term, value }))
}

function tokenizeForVector(text) {
  return tokenize(text).filter((token) => token.length > 2 && !STOPWORDS.has(token))
}

function buildTfIdfModel(documents) {
  const documentFrequencies = new Map()
  const documentTerms = documents.map((document) => {
    const tokens = tokenizeForVector(document.text)
    const uniqueTokens = new Set(tokens)

    for (const token of uniqueTokens) {
      documentFrequencies.set(token, (documentFrequencies.get(token) ?? 0) + 1)
    }

    return tokens
  })

  const totalDocuments = Math.max(documents.length, 1)

  return documents.map((document, index) => {
    const tokens = documentTerms[index]
    const termCounts = new Map()

    if (!tokens.length) {
      return {
        document,
        vector: new Map(),
        magnitude: 0,
        topTerms: [],
      }
    }

    for (const token of tokens) {
      termCounts.set(token, (termCounts.get(token) ?? 0) + 1)
    }

    const vector = new Map()
    let magnitude = 0

    for (const [term, count] of termCounts.entries()) {
      const tf = count / tokens.length
      const idf =
        Math.log((1 + totalDocuments) / (1 + (documentFrequencies.get(term) ?? 0))) + 1
      const weight = tf * idf

      vector.set(term, weight)
      magnitude += weight * weight
    }

    return {
      document,
      vector,
      magnitude: Math.sqrt(magnitude),
      topTerms: [...vector.entries()]
        .sort((left, right) => right[1] - left[1])
        .slice(0, 12)
        .map(([term, value]) => ({ term, value })),
    }
  })
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

function buildQueryVector(query, documentCount, documentFrequencyMap) {
  const expandedTokens = tokenizeForVector(query).flatMap((token) => expandToken(token))
  const filteredTokens = expandedTokens.filter((token) => !STOPWORDS.has(token))
  const counts = new Map()

  if (!filteredTokens.length) {
    return { vector: new Map(), magnitude: 0 }
  }

  for (const token of filteredTokens) {
    counts.set(token, (counts.get(token) ?? 0) + 1)
  }

  const vector = new Map()
  let magnitude = 0

  for (const [term, count] of counts.entries()) {
    const tf = count / filteredTokens.length
    const idf =
      Math.log((1 + documentCount) / (1 + (documentFrequencyMap.get(term) ?? 0))) + 1
    const weight = tf * idf

    vector.set(term, weight)
    magnitude += weight * weight
  }

  return { vector, magnitude: Math.sqrt(magnitude) }
}

function searchLiteral(query, document) {
  if (!query.trim()) {
    return { score: 0, count: 0, contexts: [], matchedTerms: [], relatedTerms: [] }
  }

  const result = collectPatternMatches(document.text, [query.trim()])
  const queryTokens = new Set(tokenize(query))

  return {
    score: result.count,
    count: result.count,
    contexts: result.contexts,
    matchedTerms: result.matchedTerms,
    relatedTerms: pickRelatedTerms(
      result.contexts.map((context) => context.snippet).join(' '),
      queryTokens,
    ),
  }
}

function searchHeuristic(query, document) {
  const queryTokens = tokenize(query)
  if (!queryTokens.length) {
    return { score: 0, count: 0, contexts: [], matchedTerms: [], relatedTerms: [] }
  }

  const variants = [...new Set(queryTokens.flatMap((token) => expandToken(token)))]
  const result = collectPatternMatches(document.text, variants)
  const coverage = queryTokens.filter((token) =>
    expandToken(token).some((variant) => result.matchedTerms.includes(variant)),
  ).length
  const coverageRatio = coverage / queryTokens.length
  const score = result.count * (0.65 + coverageRatio)

  return {
    score,
    count: result.count,
    contexts: result.contexts,
    matchedTerms: result.matchedTerms,
    relatedTerms: pickRelatedTerms(
      result.contexts.map((context) => context.snippet).join(' '),
      new Set(queryTokens.flatMap((token) => expandToken(token))),
    ),
  }
}

function searchVector(query, vectorModel) {
  if (!query.trim()) {
    return []
  }

  const documentFrequencyMap = new Map()

  for (const entry of vectorModel) {
    for (const term of entry.vector.keys()) {
      documentFrequencyMap.set(term, (documentFrequencyMap.get(term) ?? 0) + 1)
    }
  }

  const queryVector = buildQueryVector(
    query,
    vectorModel.length,
    documentFrequencyMap,
  )
  const queryTokens = new Set(tokenizeForVector(query).flatMap((token) => expandToken(token)))

  return vectorModel
    .map((entry) => {
      const score = cosineSimilarity(
        queryVector.vector,
        queryVector.magnitude,
        entry.vector,
        entry.magnitude,
      )

      return {
        ...entry.document,
        score,
        count: score,
        contexts: [],
        matchedTerms: [],
        relatedTerms: entry.topTerms
          .filter((term) => !queryTokens.has(term.term))
          .slice(0, 6),
      }
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)
}

function enrichRecordResult(record, baseResult) {
  return {
    ...baseResult,
    record,
  }
}

export const algorithmDefinitions = {
  literal: {
    id: 'literal',
    title: 'Literal exacto',
    tier: 'Manual asistido',
    description:
      'Busca la misma palabra o frase. Es el equivalente digital de un Ctrl+F sobre la ficha o el OCR.',
    metricLabel: 'ocurrencias exactas',
  },
  heuristic: {
    id: 'heuristic',
    title: 'Variantes historicas',
    tier: 'Heuristico',
    description:
      'Busca mayusculas, acentos, pluralizacion y variantes ortograficas como tumour/tumor o scirrhus/scirrhous.',
    metricLabel: 'ocurrencias ponderadas',
  },
  vector: {
    id: 'vector',
    title: 'Contexto vectorial ligero',
    tier: 'Vectorial',
    description:
      'Usa TF-IDF y similitud coseno para sugerir textos cercanos al termino, aunque no repitan exactamente la misma cadena.',
    metricLabel: 'similitud contextual',
  },
}

export function runSearch(records, ocrTexts, query, scopeMode) {
  const documents = records.map((record) => ({
    id: record.id,
    record,
    text: buildDocumentText(record, ocrTexts, scopeMode),
  }))

  const literalResults = documents
    .map((document) => enrichRecordResult(document.record, searchLiteral(query, document)))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)

  const heuristicResults = documents
    .map((document) => enrichRecordResult(document.record, searchHeuristic(query, document)))
    .filter((entry) => entry.score > 0)
    .sort((left, right) => right.score - left.score)

  const vectorModel = buildTfIdfModel(documents)
  const vectorResults = searchVector(query, vectorModel)
    .map((entry) => ({
      ...entry,
      record: entry.record,
    }))
    .sort((left, right) => right.score - left.score)

  return {
    literal: literalResults,
    heuristic: heuristicResults,
    vector: vectorResults,
  }
}

export function buildDecadeSummary(records, resultEntries) {
  const resultMap = new Map(
    resultEntries.map((entry) => [entry.record.id, entry.score ?? entry.count ?? 0]),
  )

  const decadeMap = new Map()

  for (const record of records) {
    const decade = `${Math.floor(record.year / 10) * 10}s`
    if (!decadeMap.has(decade)) {
      decadeMap.set(decade, {
        decade,
        total: 0,
        matched: 0,
      })
    }

    const item = decadeMap.get(decade)
    item.total += 1

    if (resultMap.has(record.id)) {
      item.matched += 1
    }
  }

  return [...decadeMap.values()].sort((left, right) =>
    Number.parseInt(left.decade, 10) - Number.parseInt(right.decade, 10),
  )
}

export function buildNetworkData(query, results) {
  if (!query.trim()) {
    return { nodes: [], links: [] }
  }

  const topResults = results.slice(0, 5)
  const nodes = [{ id: 'query', label: query.trim(), type: 'query', value: 1.2 }]
  const links = []
  const termWeights = new Map()

  for (const result of topResults) {
    nodes.push({
      id: result.record.id,
      label: result.record.shortTitle,
      type: 'record',
      value: Math.max(result.score, 0.8),
    })

    links.push({
      source: 'query',
      target: result.record.id,
      value: Math.max(result.score, 0.5),
    })

    for (const related of result.relatedTerms ?? []) {
      termWeights.set(
        related.term,
        (termWeights.get(related.term) ?? 0) + related.value + result.score,
      )

      links.push({
        source: result.record.id,
        target: `term-${related.term}`,
        value: related.value,
      })
    }
  }

  for (const [term, value] of [...termWeights.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)) {
    nodes.push({
      id: `term-${term}`,
      label: term,
      type: 'term',
      value,
    })
  }

  const validIds = new Set(nodes.map((node) => node.id))

  return {
    nodes,
    links: links.filter(
      (link) => validIds.has(link.source) && validIds.has(link.target),
    ),
  }
}
