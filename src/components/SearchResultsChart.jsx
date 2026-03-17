import * as d3 from 'd3'
import useContainerSize from '../hooks/useContainerSize'
import useDragScroll from '../hooks/useDragScroll'

function SearchResultsChart({
  title,
  subtitle,
  metricLabel,
  sectionLabel = 'Lectura cuantitativa',
  items,
  formatValue = defaultFormatValue,
  hint = 'La etiqueta se compacta en móvil y la gráfica puede desplazarse.',
}) {
  const [containerRef, { width: containerWidth }] = useContainerSize(760, 320)
  const scrollRef = useDragScroll()
  const topItems = items.slice(0, 6)
  const width = Math.max(containerWidth, 720)
  const height = Math.max(300, topItems.length * 54 + 92)
  const margin = {
    top: 26,
    right: 36,
    bottom: 30,
    left: containerWidth < 620 ? 128 : 190,
  }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const maxValue = d3.max(topItems, (entry) => entry.value) ?? 1
  const xScale = d3.scaleLinear().domain([0, maxValue]).nice().range([0, innerWidth])
  const yScale = d3
    .scaleBand()
    .domain(topItems.map((entry) => entry.label))
    .range([0, innerHeight])
    .padding(0.22)
  const ticks = xScale.ticks(4)

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
                <g key={tick} transform={`translate(${xScale(tick)},0)`}>
                  <line className="grid-line" y1="0" y2={innerHeight} />
                  <text className="axis-label" y={innerHeight + 20} textAnchor="middle">
                    {defaultFormatValue(tick)}
                  </text>
                </g>
              ))}

              {topItems.map((entry) => {
                const y = yScale(entry.label) ?? 0
                return (
                  <g key={entry.id ?? entry.label} transform={`translate(0,${y})`}>
                    <text
                      className="axis-label axis-label-left"
                      x="-12"
                      y={yScale.bandwidth() / 2 + 4}
                      textAnchor="end"
                    >
                      {truncate(entry.label, containerWidth < 620 ? 16 : 24)}
                    </text>
                    <rect
                      className="bar-focus"
                      x="0"
                      y="0"
                      width={xScale(entry.value)}
                      height={yScale.bandwidth()}
                      rx="14"
                    />
                    <text
                      className="bar-value"
                      x={Math.min(xScale(entry.value) + 10, innerWidth - 6)}
                      y={yScale.bandwidth() / 2 + 5}
                    >
                      {formatValue(entry.value)}
                    </text>
                  </g>
                )
              })}
            </g>
          </svg>
        </div>
      </div>

      <div className="viz-foot">{metricLabel}</div>
      <div className="viz-hint">{hint}</div>
    </div>
  )
}

function truncate(text, limit) {
  if (text.length <= limit) {
    return text
  }

  return `${text.slice(0, limit - 1)}…`
}

function defaultFormatValue(value) {
  return value < 1 ? value.toFixed(2) : value.toFixed(0)
}

export default SearchResultsChart
