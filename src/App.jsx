import { useEffect, useState } from 'react'
import ContextNetwork from './components/ContextNetwork'
import SearchResultsChart from './components/SearchResultsChart'
import TimelineChart from './components/TimelineChart'
import discoveredDocuments from './data/discoveredDocuments'
import uiCopy from './data/uiCopy'
import './App.css'

const emptyTermDraft = {
  id: '',
  canonical: '',
  variants: '',
  category: 'general',
  notes: '',
}

const emptyUploadDraft = {
  title: '',
  shortTitle: '',
  year: '',
  place: '',
  language: '',
  recordType: '',
  sourceHost: '',
  contributorName: '',
  contributorRole: '',
  summary: '',
  notes: '',
  ocrText: '',
}

const networkColumnLabels = {
  es: { terms: 'Términos', works: 'Obras' },
  en: { terms: 'Terms', works: 'Works' },
  fr: { terms: 'Termes', works: 'Oeuvres' },
  pt: { terms: 'Termos', works: 'Obras' },
}

const sectionLabels = {
  es: {
    nav: 'Navegación',
    currentLabel: 'Vista actual',
    overview: {
      label: 'Panorama',
      blurb: 'Objetivo, método y estado general del corpus.',
    },
    analysis: {
      label: 'Análisis',
      blurb: 'Filtros, gráficas y relaciones entre términos y obras.',
    },
    mentions: {
      label: 'Menciones',
      blurb: 'Pruebas textuales y comparación contextual.',
    },
    workspace: {
      label: 'Trabajo editorial',
      blurb: 'Léxico, OCR y carga colaborativa de documentos.',
    },
    sources: {
      label: 'Fuentes',
      blurb: 'Corpus curado y prospección documental.',
    },
    about: {
      label: 'Eva',
      blurb: 'Perfil de investigación y conducción del proyecto.',
    },
  },
  en: {
    nav: 'Navigation',
    currentLabel: 'Current view',
    overview: {
      label: 'Overview',
      blurb: 'Purpose, method, and corpus-wide status.',
    },
    analysis: {
      label: 'Analysis',
      blurb: 'Filters, charts, and term-to-work relations.',
    },
    mentions: {
      label: 'Mentions',
      blurb: 'Textual evidence and contextual comparison.',
    },
    workspace: {
      label: 'Editorial work',
      blurb: 'Lexicon, OCR, and collaborative ingestion.',
    },
    sources: {
      label: 'Sources',
      blurb: 'Curated corpus and document prospecting.',
    },
    about: {
      label: 'Eva',
      blurb: 'Research profile and project stewardship.',
    },
  },
  fr: {
    nav: 'Navigation',
    currentLabel: 'Vue active',
    overview: {
      label: 'Vue d’ensemble',
      blurb: 'Objet, methode et etat general du corpus.',
    },
    analysis: {
      label: 'Analyse',
      blurb: 'Filtres, graphiques et relations terme-oeuvre.',
    },
    mentions: {
      label: 'Mentions',
      blurb: 'Preuves textuelles et comparaison contextuelle.',
    },
    workspace: {
      label: 'Travail editorial',
      blurb: 'Lexique, OCR et collecte collaborative.',
    },
    sources: {
      label: 'Sources',
      blurb: 'Corpus cure et prospection documentaire.',
    },
    about: {
      label: 'Eva',
      blurb: 'Profil de recherche et conduite du projet.',
    },
  },
  pt: {
    nav: 'Navegação',
    currentLabel: 'Vista atual',
    overview: {
      label: 'Panorama',
      blurb: 'Propósito, método e estado geral do corpus.',
    },
    analysis: {
      label: 'Análise',
      blurb: 'Filtros, gráficos e relações entre termos e obras.',
    },
    mentions: {
      label: 'Menções',
      blurb: 'Provas textuais e comparação contextual.',
    },
    workspace: {
      label: 'Trabalho editorial',
      blurb: 'Léxico, OCR e carga colaborativa.',
    },
    sources: {
      label: 'Fontes',
      blurb: 'Corpus curado e prospecção documental.',
    },
    about: {
      label: 'Eva',
      blurb: 'Perfil de pesquisa e condução do projeto.',
    },
  },
}

async function requestState() {
  const response = await fetch('/api/state')
  if (!response.ok) {
    throw new Error('STATE_LOAD_ERROR')
  }

  return response.json()
}

function App() {
  const [activeLocale, setActiveLocale] = useState('es')
  const [activeSection, setActiveSection] = useState('overview')
  const [state, setState] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')
  const [filters, setFilters] = useState({
    query: '',
    termId: 'todos',
    category: 'todos',
    recordType: 'todos',
    reviewStatus: 'todos',
  })
  const [termDraft, setTermDraft] = useState(emptyTermDraft)
  const [termMode, setTermMode] = useState('new')
  const [termSaving, setTermSaving] = useState(false)
  const [uploadDraft, setUploadDraft] = useState(emptyUploadDraft)
  const [uploadFile, setUploadFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [selectedMentionId, setSelectedMentionId] = useState('')
  const [similarPayload, setSimilarPayload] = useState({
    sourceMention: null,
    similarContexts: [],
  })
  const [similarLoading, setSimilarLoading] = useState(false)
  const [manualContext, setManualContext] = useState('')
  const [manualPayload, setManualPayload] = useState({
    sourceContext: null,
    similarContexts: [],
  })
  const [manualLoading, setManualLoading] = useState(false)
  const copy = uiCopy[activeLocale]
  const localeOptions = ['es', 'en', 'fr', 'pt']
  const networkColumns = networkColumnLabels[activeLocale]
  const sectionCopy = sectionLabels[activeLocale]

  function handleSectionChange(sectionId, anchorId = '') {
    setActiveSection(sectionId)

    if (typeof window === 'undefined') {
      return
    }

    window.setTimeout(() => {
      if (anchorId) {
        document.getElementById(anchorId)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
        return
      }

      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 70)
  }

  useEffect(() => {
    let ignore = false

    async function load() {
      try {
        const payload = await requestState()
        if (ignore) {
          return
        }

        setState(payload)
        setError('')
      } catch (requestError) {
        if (!ignore) {
          setError(
            requestError instanceof Error &&
              requestError.message === 'STATE_LOAD_ERROR'
              ? copy.messages.stateLoadError
              : copy.messages.platformLoadError,
          )
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      ignore = true
    }
  }, [copy.messages.platformLoadError, copy.messages.stateLoadError])

  const terms = state?.terms ?? []
  const documents = state?.documents ?? []
  const analysis = state?.analysis ?? {
    summary: {
      documentsTotal: 0,
      documentsWithMentions: 0,
      totalMentions: 0,
      configuredTerms: 0,
      vectorizedContexts: 0,
    },
    mentions: [],
    topTerms: [],
    cooccurrences: [],
    timeline: [],
  }
  const project = {
    title: copy.projectTitle,
    focus: copy.projectFocus,
  }
  const sections = [
    {
      id: 'overview',
      label: sectionCopy.overview.label,
      blurb: sectionCopy.overview.blurb,
      metric: `${analysis.summary.documentsTotal} ${copy.stats.documentsTotal}`,
    },
    {
      id: 'analysis',
      label: sectionCopy.analysis.label,
      blurb: sectionCopy.analysis.blurb,
      metric: `${cooccurrenceLabel(analysis)} ${copy.controls.cooccurrencePairs}`,
    },
    {
      id: 'mentions',
      label: sectionCopy.mentions.label,
      blurb: sectionCopy.mentions.blurb,
      metric: `${analysis.summary.totalMentions} ${copy.stats.totalMentions}`,
    },
    {
      id: 'workspace',
      label: sectionCopy.workspace.label,
      blurb: sectionCopy.workspace.blurb,
      metric: `${analysis.summary.configuredTerms} ${copy.stats.configuredTerms}`,
    },
    {
      id: 'sources',
      label: sectionCopy.sources.label,
      blurb: sectionCopy.sources.blurb,
      metric: `${discoveredDocuments.length} ${copy.stats.prospectedSources}`,
    },
    {
      id: 'about',
      label: sectionCopy.about.label,
      blurb: sectionCopy.about.blurb,
      metric: copy.evaName,
    },
  ]
  const activeSectionMeta =
    sections.find((section) => section.id === activeSection) ?? sections[0]

  function handleSectionKeyDown(event, sectionId) {
    const currentIndex = sections.findIndex((section) => section.id === sectionId)
    if (currentIndex === -1) {
      return
    }

    let nextIndex = currentIndex

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % sections.length
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + sections.length) % sections.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = sections.length - 1
    } else {
      return
    }

    event.preventDefault()
    const nextSection = sections[nextIndex]
    handleSectionChange(nextSection.id)
  }

  const termLookup = new Map(terms.map((term) => [term.id, term]))
  const documentLookup = new Map(documents.map((document) => [document.id, document]))
  const categories = ['todos', ...unique(terms.map((term) => term.category))]
  const recordTypes = ['todos', ...unique(documents.map((document) => document.recordType))]
  const reviewStatuses = ['todos', ...unique(documents.map((document) => document.reviewStatus))]
  const baseDocuments = documents.filter(
    (document) =>
      (filters.recordType === 'todos' || document.recordType === filters.recordType) &&
      (filters.reviewStatus === 'todos' || document.reviewStatus === filters.reviewStatus),
  )

  const filteredMentions = analysis.mentions.filter((mention) => {
    const document = documentLookup.get(mention.documentId)
    const term = termLookup.get(mention.termId)
    if (!document || !term) {
      return false
    }

    if (filters.termId !== 'todos' && mention.termId !== filters.termId) {
      return false
    }

    if (filters.category !== 'todos' && term.category !== filters.category) {
      return false
    }

    if (filters.recordType !== 'todos' && document.recordType !== filters.recordType) {
      return false
    }

    if (
      filters.reviewStatus !== 'todos' &&
      document.reviewStatus !== filters.reviewStatus
    ) {
      return false
    }

    const query = normalizeText(filters.query)
    if (!query) {
      return true
    }

    const haystack = normalizeText([
      mention.matchedText,
      mention.canonicalTerm,
      mention.snippet,
      mention.documentTitle,
      mention.place,
      document.summary,
      document.notes,
    ].join(' '))

    return haystack.includes(query)
  })

  const mentionSummaryByDocument = new Map()
  for (const mention of filteredMentions) {
    const document = documentLookup.get(mention.documentId)
    const current = mentionSummaryByDocument.get(mention.documentId) ?? {
      id: mention.documentId,
      title: document?.title ?? mention.documentTitle,
      shortTitle: document?.shortTitle ?? mention.documentTitle,
      year: Number(document?.year ?? mention.year),
      place: document?.place ?? mention.place,
      recordType: document?.recordType ?? mention.recordType,
      contributorName: document?.contributorName ?? 'sin dato',
      reviewStatus: document?.reviewStatus ?? 'sin revisar',
      mentionCount: 0,
      termLabels: new Set(),
      termCounts: new Map(),
      sourceLinks: document?.sourceLinks ?? [],
      uploadFileUrl: document?.uploadFileUrl ?? '',
      uploadTextUrl: document?.uploadTextUrl ?? '',
      summary: document?.summary ?? '',
    }

    current.mentionCount += 1
    current.termLabels.add(mention.canonicalTerm)
    current.termCounts.set(
      mention.canonicalTerm,
      (current.termCounts.get(mention.canonicalTerm) ?? 0) + 1,
    )
    mentionSummaryByDocument.set(mention.documentId, current)
  }

  const filteredDocuments = [...mentionSummaryByDocument.values()]
    .map((document) => ({
      ...document,
      termLinks: [...document.termCounts.entries()]
        .map(([label, count]) => ({ label, count }))
        .sort((left, right) => right.count - left.count),
      termLabels: [...document.termLabels].sort(),
    }))
    .sort((left, right) => {
      if (left.year !== right.year) {
        return left.year - right.year
      }

      return right.mentionCount - left.mentionCount
    })

  const timelineData = buildTimeline(baseDocuments, mentionSummaryByDocument)
  const topTermItems = buildTopTermItems(filteredMentions, termLookup)
  const cooccurrenceItems = buildCooccurrenceItems(filteredMentions, termLookup)
  const networkData = buildNetworkData(topTermItems, cooccurrenceItems, filteredDocuments)
  const activeMention = filteredMentions.find((mention) => mention.id === selectedMentionId) ?? null

  useEffect(() => {
    if (!filteredMentions.length) {
      if (selectedMentionId) {
        setSelectedMentionId('')
      }
      return
    }

    if (!filteredMentions.some((mention) => mention.id === selectedMentionId)) {
      setSelectedMentionId(filteredMentions[0].id)
    }
  }, [filteredMentions, selectedMentionId])

  useEffect(() => {
    let ignore = false

    async function loadSimilarContexts() {
      if (!selectedMentionId) {
        setSimilarPayload({
          sourceMention: null,
          similarContexts: [],
        })
        return
      }

      setSimilarLoading(true)

      try {
        const response = await fetch(
          `/api/similar-contexts/${encodeURIComponent(selectedMentionId)}`,
        )
        if (!response.ok) {
          throw new Error(copy.messages.similarError)
        }

        const payload = await response.json()
        if (!ignore) {
          setSimilarPayload(payload)
        }
      } catch (requestError) {
        if (!ignore) {
          setSimilarPayload({
            sourceMention: null,
            similarContexts: [],
          })
          setFlash(
            requestError instanceof Error
              ? requestError.message
              : copy.messages.similarError,
          )
        }
      } finally {
        if (!ignore) {
          setSimilarLoading(false)
        }
      }
    }

    loadSimilarContexts()

    return () => {
      ignore = true
    }
  }, [copy.messages.similarError, selectedMentionId])

  async function refreshState(nextFlash = '') {
    setLoading(true)
    try {
      const payload = await requestState()
      setState(payload)
      setError('')
      setFlash(nextFlash)
    } catch (requestError) {
      setError(
        requestError instanceof Error &&
          requestError.message === 'STATE_LOAD_ERROR'
          ? copy.messages.stateLoadError
          : copy.messages.refreshError,
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleTermSubmit(event) {
    event.preventDefault()
    setTermSaving(true)

    const payload = {
      canonical: termDraft.canonical.trim(),
      variants: parseVariants(termDraft.variants).join(', '),
      category: termDraft.category.trim() || 'general',
      notes: termDraft.notes.trim(),
    }

    try {
      const response = await fetch(
        termMode === 'edit' && termDraft.id ? `/api/terms/${termDraft.id}` : '/api/terms',
        {
          method: termMode === 'edit' ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        },
      )

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || copy.messages.termSaveError)
      }

      setTermDraft(emptyTermDraft)
      setTermMode('new')
      await refreshState(
        termMode === 'edit'
          ? copy.messages.termUpdated
          : copy.messages.termCreated,
      )
    } catch (requestError) {
      setFlash(
        requestError instanceof Error ? requestError.message : copy.messages.termSaveError,
      )
    } finally {
      setTermSaving(false)
    }
  }

  async function handleUploadSubmit(event) {
    event.preventDefault()
    setUploading(true)

    const formData = new FormData()
    for (const [key, value] of Object.entries(uploadDraft)) {
      if (String(value).trim()) {
        formData.append(key, String(value))
      }
    }

    if (uploadFile) {
      formData.append('file', uploadFile)
    }

    try {
      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || copy.messages.documentError)
      }

      setUploadDraft(emptyUploadDraft)
      setUploadFile(null)
      await refreshState(copy.messages.documentCreated)
    } catch (requestError) {
      setFlash(
        requestError instanceof Error ? requestError.message : copy.messages.documentError,
      )
    } finally {
      setUploading(false)
    }
  }

  async function handleManualContextSubmit(event) {
    event.preventDefault()
    if (!manualContext.trim()) {
      return
    }

    setManualLoading(true)

    try {
      const response = await fetch('/api/context-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: manualContext }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.error || copy.messages.contextError)
      }

      const payload = await response.json()
      setManualPayload(payload)
      setFlash(copy.messages.contextCompared)
    } catch (requestError) {
      setFlash(
        requestError instanceof Error ? requestError.message : copy.messages.contextError,
      )
    } finally {
      setManualLoading(false)
    }
  }

  if (loading && !state) {
    return (
      <main className="app-shell">
        <section className="hero-panel">
          <div className="hero-copy">
            <p className="eyebrow">{copy.loadingEyebrow}</p>
            <h1>{copy.loadingTitle}</h1>
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <div className="hero-toolbar">
            <p className="eyebrow">{copy.heroEyebrow}</p>
            <div className="locale-switch" role="group" aria-label={copy.localeLabel}>
              <span className="locale-label">{copy.localeLabel}</span>
              {localeOptions.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  className={`locale-button ${activeLocale === locale ? 'is-active' : ''}`}
                  onClick={() => setActiveLocale(locale)}
                >
                  {locale.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <h1>{project.title}</h1>
          <p className="lede">{project.focus}</p>
          <div className="hero-note">{copy.heroNote}</div>
        </div>

        <div className="hero-aside">
          <StatCard value={analysis.summary.documentsTotal} label={copy.stats.documentsTotal} />
          <StatCard
            value={analysis.summary.documentsWithMentions}
            label={copy.stats.documentsWithMentions}
          />
          <StatCard value={analysis.summary.totalMentions} label={copy.stats.totalMentions} />
          <StatCard value={analysis.summary.configuredTerms} label={copy.stats.configuredTerms} />
          <StatCard
            value={analysis.summary.vectorizedContexts}
            label={copy.stats.vectorizedContexts}
          />
          <StatCard value={filteredMentions.length} label={copy.stats.visibleMentions} />
          <StatCard value={discoveredDocuments.length} label={copy.stats.prospectedSources} />
        </div>
      </section>

      <nav className="section-nav-panel" aria-label={sectionCopy.nav}>
        <div className="section-nav-head">
          <div>
            <p className="section-label">{sectionCopy.nav}</p>
            <h2 className="section-nav-title">{activeSectionMeta.label}</h2>
          </div>
          <p className="section-nav-summary">{activeSectionMeta.blurb}</p>
        </div>

        <div className="section-nav-shell">
          <ol className="section-nav-list" role="tablist" aria-label={sectionCopy.nav}>
            {sections.map((section, index) => (
              <li key={section.id} className="section-nav-item">
                <button
                  id={`section-tab-${section.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeSection === section.id}
                  aria-controls={`section-panel-${section.id}`}
                  tabIndex={activeSection === section.id ? 0 : -1}
                  className={`section-nav-button ${
                    activeSection === section.id ? 'is-active' : ''
                  }`}
                  onClick={() => handleSectionChange(section.id)}
                  onKeyDown={(event) => handleSectionKeyDown(event, section.id)}
                >
                  <span className="nav-kicker">{String(index + 1).padStart(2, '0')}</span>
                  <span className="section-nav-copy">
                    <strong>{section.label}</strong>
                    <small>{section.blurb}</small>
                  </span>
                  <span className="section-nav-metric">{section.metric}</span>
                </button>
              </li>
            ))}
          </ol>

          <aside className="section-nav-current" aria-live="polite">
            <span className="section-nav-marker">{sectionCopy.currentLabel}</span>
            <h3>{activeSectionMeta.label}</h3>
            <p>{activeSectionMeta.blurb}</p>
            <div className="section-nav-current-metric">{activeSectionMeta.metric}</div>
          </aside>
        </div>
      </nav>

      <section className="status-strip">
        <span className={`status-badge ${loading ? 'status-pendiente' : 'status-leido'}`}>
          {loading ? copy.band.loading : copy.band.ready}
        </span>
        {flash ? <p className="flash-copy">{flash}</p> : null}
        {error ? <p className="error-copy">{error}</p> : null}
      </section>

      {activeSection === 'overview' ? (
        <div
          className="section-stage"
          role="tabpanel"
          id="section-panel-overview"
          aria-labelledby="section-tab-overview"
        >
          <section className="study-grid study-grid-single">
            <article className="study-card">
              <p className="section-label">{copy.purposeLabel}</p>
              <h2>{copy.purposeTitle}</h2>
              <p>{copy.purpose}</p>
              <div className="study-callout">
                <p>{copy.uploadCallout}</p>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => handleSectionChange('workspace', 'upload-workspace')}
                >
                  {copy.jumpToUpload}
                </button>
              </div>
            </article>
          </section>

          <section className="band">
            <div className="band-copy">
              <p className="section-label">{copy.band.sectionLabel}</p>
              <h2>{copy.band.title}</h2>
              <p>{copy.band.text}</p>
            </div>
          </section>

          <section className="algorithm-section">
            <div className="section-heading">
              <div>
                <p className="section-label">{copy.algorithms.sectionLabel}</p>
                <h2>{copy.algorithms.title}</h2>
              </div>
              <p className="section-copy">{copy.algorithms.text}</p>
            </div>

            <div className="algorithm-grid">
              {copy.algorithms.cards.map((card, index) => (
                <article key={`${activeLocale}-${index}`} className="algorithm-card">
                  <p className="algorithm-tier">{card.tier}</p>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeSection === 'analysis' ? (
        <div
          className="section-stage"
          role="tabpanel"
          id="section-panel-analysis"
          aria-labelledby="section-tab-analysis"
        >
          <section className="controls-panel">
            <div className="section-heading">
              <div>
                <p className="section-label">{copy.controls.sectionLabel}</p>
                <h2>{copy.controls.title}</h2>
              </div>
              <p className="section-copy">{copy.controls.text}</p>
            </div>

            <div className="filters-grid">
              <label>
                <span className="field-label">{copy.controls.queryLabel}</span>
                <input
                  className="search-input"
                  type="text"
                  value={filters.query}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, query: event.target.value }))
                  }
                  placeholder={copy.controls.queryPlaceholder}
                />
              </label>

              <label>
                <span className="field-label">{copy.controls.configuredTerm}</span>
                <select
                  value={filters.termId}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, termId: event.target.value }))
                  }
                >
                  <option value="todos">{copy.controls.all}</option>
                  {terms.map((term) => (
                    <option key={term.id} value={term.id}>
                      {term.canonical}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="field-label">{copy.controls.category}</span>
                <select
                  value={filters.category}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, category: event.target.value }))
                  }
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="field-label">{copy.controls.sourceType}</span>
                <select
                  value={filters.recordType}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, recordType: event.target.value }))
                  }
                >
                  {recordTypes.map((recordType) => (
                    <option key={recordType} value={recordType}>
                      {recordType}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="field-label">{copy.controls.reviewStatus}</span>
                <select
                  value={filters.reviewStatus}
                  onChange={(event) =>
                    setFilters((current) => ({ ...current, reviewStatus: event.target.value }))
                  }
                >
                  {reviewStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="chip-row">
              <span className="chip chip-accent">
                {filteredMentions.length} {copy.controls.visibleMentions}
              </span>
              <span className="chip">
                {filteredDocuments.length} {copy.controls.connectedDocuments}
              </span>
              <span className="chip">
                {cooccurrenceItems.length} {copy.controls.cooccurrencePairs}
              </span>
            </div>
          </section>

          <section className="visual-grid">
            <TimelineChart
              data={timelineData}
              sectionLabel={copy.algorithms.sectionLabel}
              title={copy.visuals.timelineTitle}
              subtitle={copy.visuals.timelineSubtitle}
              totalLabel={copy.visuals.timelineTotalLabel}
              matchedLabel={copy.visuals.timelineMatchedLabel}
              hint={copy.visuals.chartHint}
            />

            <SearchResultsChart
              sectionLabel={copy.algorithms.sectionLabel}
              title={copy.visuals.topTermsTitle}
              subtitle={copy.visuals.topTermsSubtitle}
              metricLabel={copy.visuals.topTermsMetric}
              items={topTermItems}
              hint={copy.visuals.chartHint}
            />
          </section>

          <section className="visual-grid visual-grid-bottom">
            <SearchResultsChart
              title={copy.visuals.cooccurrenceTitle}
              subtitle={copy.visuals.cooccurrenceSubtitle}
              metricLabel={copy.visuals.cooccurrenceMetric}
              sectionLabel={copy.algorithms.sectionLabel}
              items={cooccurrenceItems.map((entry) => ({
                id: entry.id,
                label: `${entry.sourceLabel} + ${entry.targetLabel}`,
                value: entry.value,
              }))}
              hint={copy.visuals.chartHint}
            />

            <div className="summary-card">
              <p className="section-label">{copy.visuals.summaryLabel}</p>
              <h3>{copy.visuals.summaryTitle}</h3>
              <ul className="evidence-list">
                {cooccurrenceItems.slice(0, 6).map((entry) => (
                  <li key={entry.id}>
                    <strong>
                      {entry.sourceLabel} + {entry.targetLabel}
                    </strong>
                    <span>
                      {entry.value} {copy.visuals.sharedFragments}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="network-row">
            <ContextNetwork
              data={networkData}
              sectionLabel={copy.algorithms.sectionLabel}
              title={copy.visuals.networkTitle}
              subtitle={copy.visuals.networkSubtitle}
              emptyMessage={copy.visuals.networkEmpty}
              hint={copy.visuals.networkHint}
              termColumnLabel={networkColumns.terms}
              recordColumnLabel={networkColumns.works}
            />
          </div>
        </div>
      ) : null}

      {activeSection === 'mentions' ? (
        <section
          className="archive-layout section-stage"
          role="tabpanel"
          id="section-panel-mentions"
          aria-labelledby="section-tab-mentions"
        >
          <div className="list-panel">
            <div className="list-heading">
              <div>
                <p className="section-label">{copy.mentions.sectionLabel}</p>
                <h2>{copy.mentions.title}</h2>
              </div>
              <p className="list-summary">{copy.mentions.summary}</p>
            </div>

            <div className="record-list">
              {filteredMentions.slice(0, 24).map((mention) => (
                <button
                  key={mention.id}
                  type="button"
                  className={`record-card ${
                    mention.id === selectedMentionId ? 'is-active' : ''
                  }`}
                  onClick={() => setSelectedMentionId(mention.id)}
                >
                  <div className="record-card-top">
                    <span className="record-year">{mention.year}</span>
                    <span className="status-badge status-parcial">{mention.recordType}</span>
                  </div>
                  <h3>{mention.documentTitle}</h3>
                  <p className="record-type">
                    {mention.canonicalTerm} · {mention.place}
                  </p>
                  <p className="record-snippet">{mention.snippet}</p>
                </button>
              ))}

              {!filteredMentions.length ? (
                <div className="empty-card">{copy.mentions.empty}</div>
              ) : null}
            </div>
          </div>

          <aside className="detail-panel">
            <div className="detail-block">
              <p className="section-label">{copy.mentions.activeLabel}</p>
              <h3>{activeMention ? activeMention.documentTitle : copy.mentions.noSelection}</h3>
              {activeMention ? (
                <>
                  <p className="detail-meta">
                    {activeMention.canonicalTerm} · {activeMention.year} · {activeMention.place}
                  </p>
                  <p>{activeMention.snippet}</p>
                </>
              ) : (
                <p>{copy.mentions.noActive}</p>
              )}
            </div>

            <div className="detail-block">
              <p className="section-label">{copy.mentions.similarLabel}</p>
              <h3>{copy.mentions.similarTitle}</h3>
              <p className="context-note">{copy.mentions.similarNote}</p>

              {similarLoading ? <p className="loading-copy">{copy.mentions.comparing}</p> : null}

              <div className="context-list">
                {similarPayload.similarContexts.map((context) => (
                  <article key={context.chunkId} className="context-card">
                    <div className="snippet-meta">
                      <span>{context.documentTitle}</span>
                      <span>{context.year}</span>
                      <span>{context.score.toFixed(2)}</span>
                    </div>
                    <p>{context.snippet}</p>
                    <div className="chip-row">
                      {context.termLabels.map((label) => (
                        <span key={label} className="chip">
                          {label}
                        </span>
                      ))}
                    </div>
                  </article>
                ))}
                {!similarLoading && !similarPayload.similarContexts.length ? (
                  <p className="context-note">{copy.mentions.noNeighbors}</p>
                ) : null}
              </div>
            </div>

            <div className="detail-block">
              <p className="section-label">{copy.mentions.evaLabLabel}</p>
              <h3>{copy.mentions.evaLabTitle}</h3>
              <form className="stack-form" onSubmit={handleManualContextSubmit}>
                <label>
                  <span className="field-label">{copy.mentions.evaLabField}</span>
                  <textarea
                    rows="5"
                    value={manualContext}
                    onChange={(event) => setManualContext(event.target.value)}
                    placeholder={copy.mentions.evaLabPlaceholder}
                  />
                </label>
                <button type="submit" className="primary-button" disabled={manualLoading}>
                  {manualLoading
                    ? copy.mentions.evaLabButtonLoading
                    : copy.mentions.evaLabButton}
                </button>
              </form>

              <div className="context-list">
                {manualPayload.similarContexts.map((context) => (
                  <article key={context.chunkId} className="context-card">
                    <div className="snippet-meta">
                      <span>{context.documentTitle}</span>
                      <span>{context.year}</span>
                      <span>{context.score.toFixed(2)}</span>
                    </div>
                    <p>{context.snippet}</p>
                  </article>
                ))}
              </div>
            </div>
          </aside>
        </section>
      ) : null}

      {activeSection === 'workspace' ? (
        <section
          className="workspace-grid section-stage"
          role="tabpanel"
          id="section-panel-workspace"
          aria-labelledby="section-tab-workspace"
        >
          <div className="workspace-card">
            <div className="section-heading">
              <div>
                <p className="section-label">{copy.lexicon.sectionLabel}</p>
                <h2>{copy.lexicon.title}</h2>
              </div>
              <p className="section-copy">{copy.lexicon.text}</p>
            </div>

            <div className="term-grid">
              {terms.map((term) => (
                <article key={term.id} className="term-card">
                  <div className="term-card-head">
                    <div>
                      <p className="term-category">{term.category}</p>
                      <h3>{term.canonical}</h3>
                    </div>
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => {
                        setTermMode('edit')
                        setTermDraft({
                          id: term.id,
                          canonical: term.canonical,
                          variants: term.variants.join(', '),
                          category: term.category,
                          notes: term.notes ?? '',
                        })
                      }}
                    >
                      {copy.lexicon.editButton}
                    </button>
                  </div>
                  <p>{term.notes || copy.lexicon.noMethodNote}</p>
                  <div className="chip-row">
                    {term.variants.map((variant) => (
                      <span key={variant} className="chip">
                        {variant}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <form className="workspace-form" onSubmit={handleTermSubmit}>
              <div className="form-head">
                <h3>{termMode === 'edit' ? copy.lexicon.editTitle : copy.lexicon.newTitle}</h3>
                {termMode === 'edit' ? (
                  <button
                    type="button"
                    className="ghost-button"
                    onClick={() => {
                      setTermDraft(emptyTermDraft)
                      setTermMode('new')
                    }}
                  >
                    {copy.lexicon.cancelEdit}
                  </button>
                ) : null}
              </div>

              <div className="form-grid">
                <label>
                  <span className="field-label">{copy.lexicon.canonical}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={termDraft.canonical}
                    onChange={(event) =>
                      setTermDraft((current) => ({
                        ...current,
                        canonical: event.target.value,
                      }))
                    }
                    placeholder="scirrhus of the breast"
                  />
                </label>

                <label>
                  <span className="field-label">{copy.lexicon.category}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={termDraft.category}
                    onChange={(event) =>
                      setTermDraft((current) => ({
                        ...current,
                        category: event.target.value,
                      }))
                    }
                    placeholder="nomenclatura histórica"
                  />
                </label>
              </div>

              <label>
                <span className="field-label">{copy.lexicon.variants}</span>
                <textarea
                  rows="4"
                  value={termDraft.variants}
                  onChange={(event) =>
                    setTermDraft((current) => ({
                      ...current,
                      variants: event.target.value,
                    }))
                  }
                  placeholder={copy.lexicon.variantsPlaceholder}
                />
              </label>

              <label>
                <span className="field-label">{copy.lexicon.notes}</span>
                <textarea
                  rows="3"
                  value={termDraft.notes}
                  onChange={(event) =>
                    setTermDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder={copy.lexicon.notesPlaceholder}
                />
              </label>

              <button type="submit" className="primary-button" disabled={termSaving}>
                {termSaving
                  ? copy.lexicon.saving
                  : termMode === 'edit'
                    ? copy.lexicon.saveEdit
                    : copy.lexicon.saveNew}
              </button>
            </form>
          </div>

          <div className="workspace-card" id="upload-workspace">
            <div className="section-heading">
              <div>
                <p className="section-label">{copy.upload.sectionLabel}</p>
                <h2>{copy.upload.title}</h2>
              </div>
              <p className="section-copy">{copy.upload.text}</p>
            </div>

            <form className="workspace-form" onSubmit={handleUploadSubmit}>
              <div className="form-grid form-grid-wide">
                <label>
                  <span className="field-label">{copy.upload.fieldTitle}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.title}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        title: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.shortTitle}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.shortTitle}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        shortTitle: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.year}</span>
                  <input
                    className="search-input"
                    type="number"
                    value={uploadDraft.year}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        year: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.place}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.place}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        place: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.language}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.language}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        language: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.recordType}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.recordType}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        recordType: event.target.value,
                      }))
                    }
                    placeholder={copy.upload.recordTypePlaceholder}
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.sourceHost}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.sourceHost}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        sourceHost: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.contributorName}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.contributorName}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        contributorName: event.target.value,
                      }))
                    }
                  />
                </label>

                <label>
                  <span className="field-label">{copy.upload.contributorRole}</span>
                  <input
                    className="search-input"
                    type="text"
                    value={uploadDraft.contributorRole}
                    onChange={(event) =>
                      setUploadDraft((current) => ({
                        ...current,
                        contributorRole: event.target.value,
                      }))
                    }
                    placeholder={copy.upload.contributorRolePlaceholder}
                  />
                </label>

                <label className="file-field">
                  <span className="field-label">{copy.upload.file}</span>
                  <input
                    type="file"
                    onChange={(event) => setUploadFile(event.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <label>
                <span className="field-label">{copy.upload.summary}</span>
                <textarea
                  rows="3"
                  value={uploadDraft.summary}
                  onChange={(event) =>
                    setUploadDraft((current) => ({
                      ...current,
                      summary: event.target.value,
                    }))
                  }
                  placeholder={copy.upload.summaryPlaceholder}
                />
              </label>

              <label>
                <span className="field-label">{copy.upload.notes}</span>
                <textarea
                  rows="3"
                  value={uploadDraft.notes}
                  onChange={(event) =>
                    setUploadDraft((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  placeholder={copy.upload.notesPlaceholder}
                />
              </label>

              <label>
                <span className="field-label">{copy.upload.ocrText}</span>
                <textarea
                  rows="7"
                  value={uploadDraft.ocrText}
                  onChange={(event) =>
                    setUploadDraft((current) => ({
                      ...current,
                      ocrText: event.target.value,
                    }))
                  }
                  placeholder={copy.upload.ocrPlaceholder}
                />
              </label>

              <button type="submit" className="primary-button" disabled={uploading}>
                {uploading ? copy.upload.submitting : copy.upload.submit}
              </button>
            </form>
          </div>
        </section>
      ) : null}

      {activeSection === 'sources' ? (
        <div
          className="section-stage"
          role="tabpanel"
          id="section-panel-sources"
          aria-labelledby="section-tab-sources"
        >
          <section className="documents-section">
            <div className="section-heading">
              <div>
                <p className="section-label">{copy.connected.sectionLabel}</p>
                <h2>{copy.connected.title}</h2>
              </div>
              <p className="section-copy">{copy.connected.text}</p>
            </div>

            <div className="document-grid">
              {filteredDocuments.slice(0, 12).map((document) => (
                <article key={document.id} className="document-card">
                  <div className="record-card-top">
                    <span className="record-year">{document.year}</span>
                    <span className="status-badge status-leido">
                      {document.mentionCount} {copy.connected.mentionsSuffix}
                    </span>
                  </div>
                  <h3>{document.shortTitle}</h3>
                  <p className="record-type">
                    {document.recordType} · {document.place}
                  </p>
                  <div className="chip-row">
                    {document.termLabels.slice(0, 5).map((label) => (
                      <span key={label} className="chip">
                        {label}
                      </span>
                    ))}
                  </div>
                  <div className="document-links">
                    {buildDocumentLinks(document, activeLocale).map((link) => (
                      <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="documents-section">
            <div className="section-heading">
              <div>
                <p className="section-label">{copy.prospecting.sectionLabel}</p>
                <h2>{copy.prospecting.title}</h2>
              </div>
              <p className="section-copy">{copy.prospecting.text}</p>
            </div>

            <div className="document-grid">
              {discoveredDocuments.map((document) => (
                <article key={document.id} className="document-card">
                  <div className="record-card-top">
                    <span className="record-year">{document.year}</span>
                    <span className="status-badge status-pendiente">{document.recordType}</span>
                  </div>
                  <h3>{document.shortTitle}</h3>
                  <p className="record-type">
                    {document.creator} · {document.sourceHost}
                  </p>
                  <p>{document.focus}</p>
                  <div className="document-links">
                    <a href={document.url} target="_blank" rel="noreferrer">
                      {copy.prospecting.source}
                    </a>
                    <a href={document.ocrUrl} target="_blank" rel="noreferrer">
                      {copy.prospecting.remoteOcr}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      ) : null}

      {activeSection === 'about' ? (
        <section
          className="study-grid study-grid-single section-stage"
          role="tabpanel"
          id="section-panel-about"
          aria-labelledby="section-tab-about"
        >
          <article className="study-card">
            <p className="section-label">{copy.studySectionLabel}</p>
            <h2>{copy.evaName}</h2>
            <p className="field-label">{copy.evaBioLabel}</p>
            <p>{copy.evaBio}</p>
            <div className="study-callout">
              <p>{copy.uploadCallout}</p>
              <button
                type="button"
                className="secondary-button"
                onClick={() => handleSectionChange('workspace', 'upload-workspace')}
              >
                {copy.jumpToUpload}
              </button>
            </div>
          </article>
        </section>
      ) : null}
    </main>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="stat-card">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

function normalizeText(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
}

function unique(values) {
  return [...new Set(values.filter(Boolean))]
}

function parseVariants(value) {
  return value
    .split(/[\n,]/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function cooccurrenceLabel(analysis) {
  return analysis?.cooccurrences?.length ?? 0
}

function buildTimeline(documents, mentionSummaryByDocument) {
  const timelineMap = new Map()

  for (const document of documents) {
    const decade = `${Math.floor(Number(document.year) / 10) * 10}s`
    if (!timelineMap.has(decade)) {
      timelineMap.set(decade, {
        decade,
        total: 0,
        matched: 0,
      })
    }

    timelineMap.get(decade).total += 1
    if (mentionSummaryByDocument.has(document.id)) {
      timelineMap.get(decade).matched += 1
    }
  }

  return [...timelineMap.values()].sort(
    (left, right) => Number.parseInt(left.decade, 10) - Number.parseInt(right.decade, 10),
  )
}

function buildTopTermItems(mentions, termLookup) {
  const counts = new Map()
  for (const mention of mentions) {
    counts.set(mention.termId, (counts.get(mention.termId) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([termId, count]) => ({
      id: termId,
      label: termLookup.get(termId)?.canonical ?? termId,
      value: count,
    }))
}

function buildCooccurrenceItems(mentions, termLookup) {
  const mentionsByChunk = new Map()
  for (const mention of mentions) {
    if (!mentionsByChunk.has(mention.chunkId)) {
      mentionsByChunk.set(mention.chunkId, new Set())
    }

    mentionsByChunk.get(mention.chunkId).add(mention.termId)
  }

  const cooccurrences = new Map()
  for (const termSet of mentionsByChunk.values()) {
    const termIds = [...termSet]
    for (let left = 0; left < termIds.length; left += 1) {
      for (let right = left + 1; right < termIds.length; right += 1) {
        const key = [termIds[left], termIds[right]].sort().join('::')
        cooccurrences.set(key, (cooccurrences.get(key) ?? 0) + 1)
      }
    }
  }

  return [...cooccurrences.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 12)
    .map(([pair, value]) => {
      const [source, target] = pair.split('::')
      return {
        id: pair,
        source,
        target,
        sourceLabel: termLookup.get(source)?.canonical ?? source,
        targetLabel: termLookup.get(target)?.canonical ?? target,
        value,
      }
    })
}

function buildNetworkData(topTerms, _cooccurrences, documents) {
  if (!topTerms.length) {
    return { nodes: [], links: [] }
  }

  const nodes = []
  const links = []
  const topTermsSlice = topTerms.slice(0, 8)
  const topTermLabels = new Set(topTermsSlice.map((term) => term.label))
  const topDocuments = documents
    .filter((document) => document.termLinks.some((entry) => topTermLabels.has(entry.label)))
    .slice(0, 10)

  for (const term of topTermsSlice) {
    nodes.push({
      id: term.id,
      label: shorten(term.label, 18),
      type: 'term',
      value: term.value,
    })
  }

  for (const document of topDocuments) {
    const nodeId = `doc:${document.id}`
    nodes.push({
      id: nodeId,
      label: shorten(document.shortTitle, 16),
      type: 'record',
      value: document.mentionCount,
    })

    for (const termLink of document.termLinks) {
      const matchingTerm = topTermsSlice.find((term) => term.label === termLink.label)
      if (matchingTerm) {
        links.push({
          source: nodeId,
          target: matchingTerm.id,
          value: termLink.count,
        })
      }
    }
  }

  return { nodes, links }
}

function buildDocumentLinks(document, locale) {
  const labels = {
    es: { file: 'archivo', ocr: 'ocr' },
    en: { file: 'file', ocr: 'ocr' },
    fr: { file: 'fichier', ocr: 'ocr' },
    pt: { file: 'arquivo', ocr: 'ocr' },
  }[locale] ?? { file: 'file', ocr: 'ocr' }
  const links = []

  if (document.uploadFileUrl) {
    links.push({ label: labels.file, url: document.uploadFileUrl })
  }

  if (document.uploadTextUrl) {
    links.push({ label: labels.ocr, url: document.uploadTextUrl })
  }

  for (const sourceLink of document.sourceLinks ?? []) {
    links.push({ label: sourceLink.label, url: sourceLink.url })
  }

  return links.slice(0, 3)
}

function shorten(text, limit) {
  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit - 1)}…`
}

export default App
