import * as d3 from 'd3'
import useContainerSize from '../hooks/useContainerSize'
import useDragScroll from '../hooks/useDragScroll'

function TimelineChart({
  data,
  title,
  subtitle,
  sectionLabel = 'Visualizacion clasica',
  totalLabel = 'corpus total',
  matchedLabel = 'documentos con menciones',
  hint = 'Desplaza horizontalmente si la grafica se abre en movil.',
}) {
  const [containerRef, { width: containerWidth }] = useContainerSize(760, 260)
  const scrollRef = useDragScroll()
  const width = Math.max(containerWidth, data.length * 84 + 140)
  const height = Math.max(240, Math.min(310, containerWidth * 0.36))
  const margin = { top: 26, right: 24, bottom: 44, left: 44 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const maxValue = d3.max(data, (entry) => entry.total) ?? 1
  const xScale = d3
    .scaleBand()
    .domain(data.map((entry) => entry.decade))
    .range([0, innerWidth])
    .padding(0.18)
  const yScale = d3.scaleLinear().domain([0, maxValue]).nice().range([innerHeight, 0])
  const ticks = yScale.ticks(4)

  return (
    <div className="viz-card">
      <div className="viz-head">
        <div>
          <p className="section-label">{sectionLabel}</p>
          <h3>{title}</h3>
        </div>
        <p>{subtitle}</p>
      </div>

      <div ref={containerRef} className="viz-stage">
        <div ref={scrollRef} className="viz-scroll">
          <svg className="viz-svg" viewBox={`0 0 ${width} ${height}`} role="img">
            <g transform={`translate(${margin.left},${margin.top})`}>
              {ticks.map((tick) => (
                <g key={tick} transform={`translate(0,${yScale(tick)})`}>
                  <line className="grid-line" x1="0" x2={innerWidth} />
                  <text className="axis-label" x="-10" y="4" textAnchor="end">
                    {tick}
                  </text>
                </g>
              ))}

              {data.map((entry) => {
                const x = xScale(entry.decade) ?? 0
                const totalHeight = innerHeight - yScale(entry.total)
                const matchedHeight = innerHeight - yScale(entry.matched)

                return (
                  <g key={entry.decade} transform={`translate(${x},0)`}>
                    <rect
                      className="bar-total"
                      y={yScale(entry.total)}
                      width={xScale.bandwidth()}
                      height={totalHeight}
                      rx="12"
                    />
                    <rect
                      className="bar-match"
                      y={yScale(entry.matched)}
                      width={xScale.bandwidth()}
                      height={matchedHeight}
                      rx="12"
                    />
                    <text
                      className="axis-label"
                      x={xScale.bandwidth() / 2}
                      y={innerHeight + 22}
                      textAnchor="middle"
                    >
                      {entry.decade}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>
      </div>

      <div className="viz-legend">
        <span>
          <i className="legend-swatch legend-total"></i>
          {totalLabel}
        </span>
        <span>
          <i className="legend-swatch legend-match"></i>
          {matchedLabel}
        </span>
      </div>
      <div className="viz-hint">{hint}</div>
    </div>
  )
}

export default TimelineChart
