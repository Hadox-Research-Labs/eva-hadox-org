function CompositeReport({ report }) {
  return (
    <section className="report-panel">
      <div className="report-header">
        <div>
          <p className="section-label">Reporte compuesto</p>
          <h2>
            {report.query
              ? `Dossier automatico sobre "${report.query}"`
              : 'Dossier automatico del corpus filtrado'}
          </h2>
        </div>
        <div className="report-stats">
          <span className="report-stat">{report.totalSources} fuentes integradas</span>
        </div>
      </div>

      <p className="report-summary">{report.summary}</p>

      <div className="report-method-grid">
        {report.methodNotes.map((note) => (
          <article className="report-method-card" key={note.title}>
            <p className="portal-country">{note.title}</p>
            <h3>{note.value}</h3>
            <p>{note.note}</p>
          </article>
        ))}
      </div>

      <div className="report-body">
        <div className="report-main">
          {report.sections.map((section) => (
            <article className="report-section" key={section.title}>
              <div className="report-section-head">
                <h3>{section.title}</h3>
                <p>{section.intro}</p>
              </div>

              <ul className="report-evidence-list">
                {section.evidence.map((item) => (
                  <li key={`${section.title}-${item.label}`}>
                    <strong>{item.label}</strong>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}

          {report.exactContextEvidence.length ? (
            <article className="report-section">
              <div className="report-section-head">
                <h3>Huella textual</h3>
                <p>
                  Fragmentos cortos donde el algoritmo encontro evidencia exacta o
                  heuristica dentro del OCR o de la ficha curada.
                </p>
              </div>

              <ul className="report-snippet-list">
                {report.exactContextEvidence.map((item, index) => (
                  <li key={`${item.source}-${index}`}>
                    <div className="snippet-meta">
                      <span>{item.source}</span>
                      <span>{item.year}</span>
                      <span>{item.mode}</span>
                    </div>
                    <p>{item.snippet}</p>
                  </li>
                ))}
              </ul>
            </article>
          ) : null}
        </div>

        <aside className="report-aside">
          <article className="report-source-card">
            <h3>Fuentes incluidas</h3>
            <ul className="report-source-list">
              {report.selectedSources.map((source) => (
                <li key={source.id}>
                  <div>
                    <strong>{source.label}</strong>
                    <span>
                      {source.year} · {source.place}
                    </span>
                  </div>
                  <span>{source.type}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="report-source-card">
            <h3>Cronologia integrada</h3>
            <div className="chronology-stack">
              {report.chronology.map((entry) => (
                <div className="chronology-item" key={`${entry.year}-${entry.label}`}>
                  <span className="chronology-year">{entry.year}</span>
                  <div>
                    <strong>{entry.label}</strong>
                    <p>{entry.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </div>
    </section>
  )
}

export default CompositeReport
