function formatList(items, limit = 4) {
  const filtered = items.filter(Boolean)

  if (!filtered.length) {
    return 'sin datos suficientes'
  }

  const sliced = filtered.slice(0, limit)

  if (sliced.length === 1) {
    return sliced[0]
  }

  if (sliced.length === 2) {
    return `${sliced[0]} y ${sliced[1]}`
  }

  return `${sliced.slice(0, -1).join(', ')} y ${sliced.at(-1)}`
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

function pickTopTerms(records, limit = 10) {
  return countValues(records.flatMap((record) => record.historicalTerms ?? []))
    .slice(0, limit)
    .map(([term, count]) => ({ term, count }))
}

function sortByScoreThenYear(entries) {
  return [...entries].sort((left, right) => {
    if (right.combinedScore !== left.combinedScore) {
      return right.combinedScore - left.combinedScore
    }

    return left.record.year - right.record.year
  })
}

function buildCombinedEntries(records, searchResults) {
  const combined = new Map(
    records.map((record) => [
      record.id,
      {
        record,
        exactScore: 0,
        heuristicScore: 0,
        vectorScore: 0,
        combinedScore: 0,
        contexts: [],
      },
    ]),
  )

  for (const result of searchResults.literal ?? []) {
    const item = combined.get(result.record.id)
    if (!item) {
      continue
    }

    item.exactScore = result.score
    item.combinedScore += result.score * 1.35
    item.contexts.push(
      ...(result.contexts ?? []).map((context) => ({
        ...context,
        mode: 'literal',
      })),
    )
  }

  for (const result of searchResults.heuristic ?? []) {
    const item = combined.get(result.record.id)
    if (!item) {
      continue
    }

    item.heuristicScore = result.score
    item.combinedScore += result.score
    item.contexts.push(
      ...(result.contexts ?? []).map((context) => ({
        ...context,
        mode: 'heuristic',
      })),
    )
  }

  for (const result of searchResults.vector ?? []) {
    const item = combined.get(result.record.id)
    if (!item) {
      continue
    }

    item.vectorScore = result.score
    item.combinedScore += result.score * 4
  }

  return [...combined.values()]
}

function pickSectionEvidence(entries, field, maxItems = 4) {
  return sortByScoreThenYear(entries)
    .filter((entry) => entry.record[field])
    .slice(0, maxItems)
    .map((entry) => ({
      label: `${entry.record.shortTitle} (${entry.record.year})`,
      text: entry.record[field],
    }))
}

function buildChronology(entries) {
  return [...entries]
    .sort((left, right) => left.record.year - right.record.year)
    .map((entry) => ({
      year: entry.record.year,
      label: entry.record.shortTitle,
      title: entry.record.title,
      note: entry.record.description,
      place: entry.record.place,
      type: entry.record.recordType,
    }))
}

function buildMethodNotes(selectedEntries, query) {
  const exact = selectedEntries.filter((entry) => entry.exactScore > 0).length
  const heuristic = selectedEntries.filter((entry) => entry.heuristicScore > 0).length
  const vector = selectedEntries.filter((entry) => entry.vectorScore > 0).length

  return [
    {
      title: 'Exacto',
      value: exact,
      note: query.trim()
        ? 'Fuentes donde aparecio la misma cadena o frase.'
        : 'Sin consulta puntual, el modo exacto no aporta evidencia.'
    },
    {
      title: 'Heuristico',
      value: heuristic,
      note: 'Fuentes alcanzadas por variantes ortograficas o morfologicas.'
    },
    {
      title: 'Vectorial',
      value: vector,
      note: 'Fuentes sugeridas por cercania contextual dentro del corpus.'
    },
  ]
}

export function buildCompositeReport({
  query,
  records,
  searchResults,
  sourceLimit = 'todas',
}) {
  const combinedEntries = buildCombinedEntries(records, searchResults)
  const sortedEntries = sortByScoreThenYear(combinedEntries)
  const queryTrimmed = query.trim()
  const numericLimit = sourceLimit === 'todas' ? Number.POSITIVE_INFINITY : Number(sourceLimit)

  let selectedEntries

  if (queryTrimmed) {
    selectedEntries = sortedEntries.filter((entry) => entry.combinedScore > 0)
  } else {
    selectedEntries = [...combinedEntries].sort(
      (left, right) => left.record.year - right.record.year,
    )
  }

  if (!selectedEntries.length) {
    selectedEntries = [...combinedEntries].sort(
      (left, right) => left.record.year - right.record.year,
    )
  }

  selectedEntries = selectedEntries.slice(0, numericLimit)

  const selectedRecords = selectedEntries.map((entry) => entry.record)
  const years = selectedRecords.map((record) => record.year)
  const minYear = Math.min(...years)
  const maxYear = Math.max(...years)
  const topTerms = pickTopTerms(selectedRecords)
  const sourceTypes = countValues(selectedRecords.map((record) => record.recordType))
  const places = countValues(selectedRecords.map((record) => record.place))
  const exactContextEvidence = selectedEntries
    .flatMap((entry) =>
      entry.contexts.map((context) => ({
        source: entry.record.shortTitle,
        year: entry.record.year,
        mode: context.mode,
        snippet: context.snippet,
      })),
    )
    .slice(0, 8)

  const summary = queryTrimmed
    ? `Reporte compuesto para "${queryTrimmed}" con ${selectedEntries.length} fuentes entre ${minYear} y ${maxYear}. Predominan ${formatList(
        sourceTypes.map(([type]) => type),
        3,
      )}, con presencia fuerte en ${formatList(
        places.map(([place]) => place),
        3,
      )}. El vocabulario mas recurrente en la muestra incluye ${formatList(
        topTerms.map((term) => term.term),
        6,
      )}.`
    : `Panorama compuesto de ${selectedEntries.length} fuentes entre ${minYear} y ${maxYear}. La muestra cruza ${formatList(
        sourceTypes.map(([type]) => type),
        4,
      )} y deja ver una transicion desde descripciones clinicas y de puerperio hacia estadistica hospitalaria, mortalidad publica y cirugia institucional.`

  const sections = [
    {
      title: 'Nombrar y describir',
      intro: `Terminos dominantes en la muestra: ${formatList(
        topTerms.map((term) => `${term.term} (${term.count})`),
        6,
      )}.`,
      evidence: pickSectionEvidence(selectedEntries, 'howDescribed'),
    },
    {
      title: 'Tratamiento y manejo',
      intro:
        'Las fuentes permiten seguir un desplazamiento desde manejo del puerperio, paliacion local y decision operatoria temprana hacia series hospitalarias y tecnicas quirurgicas mas institucionalizadas.',
      evidence: pickSectionEvidence(selectedEntries, 'treatmentNote'),
    },
    {
      title: 'Actores, pacientes y mediaciones',
      intro:
        'Aqui se juntan profesiones medicas, parteras, prensa, hospitales y pacientes, mostrando quien observa, quien decide y quien queda registrado de forma fragmentaria.',
      evidence: [
        ...pickSectionEvidence(selectedEntries, 'actorsNote', 3),
        ...pickSectionEvidence(selectedEntries, 'patientNote', 3),
      ].slice(0, 5),
    },
    {
      title: 'Frecuencia, economia y reporte',
      intro:
        'La muestra mezcla series institucionales, prensa y publicidad, asi que el cancer de mama aparece tanto como padecimiento corporal como problema administrativo y mercado terapeutico.',
      evidence: [
        ...pickSectionEvidence(selectedEntries, 'frequencyNote', 3),
        ...pickSectionEvidence(selectedEntries, 'economyNote', 2),
        ...pickSectionEvidence(selectedEntries, 'reportingNote', 2),
      ].slice(0, 5),
    },
  ]

  return {
    query: queryTrimmed,
    totalSources: selectedEntries.length,
    summary,
    selectedSources: selectedEntries.map((entry) => ({
      id: entry.record.id,
      label: entry.record.shortTitle,
      year: entry.record.year,
      type: entry.record.recordType,
      place: entry.record.place,
      combinedScore: entry.combinedScore,
      exactScore: entry.exactScore,
      heuristicScore: entry.heuristicScore,
      vectorScore: entry.vectorScore,
    })),
    chronology: buildChronology(selectedEntries),
    sections,
    methodNotes: buildMethodNotes(selectedEntries, queryTrimmed),
    exactContextEvidence,
  }
}
