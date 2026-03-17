import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import useContainerSize from '../hooks/useContainerSize'

function ContextNetwork({
  data,
  title,
  subtitle,
  sectionLabel = 'Visualizacion artistica',
  emptyMessage = 'No hay suficientes coincidencias para dibujar la red todavia.',
  hint = 'Arrastra nodos si quieres reorganizar la lectura. La estructura base ya separa terminos y obras para evitar apelmazamiento.',
  termColumnLabel = 'Terminos',
  recordColumnLabel = 'Obras',
}) {
  const [containerRef, { width: containerWidth }] = useContainerSize(760, 420)
  const svgRef = useRef(null)

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = Math.max(containerWidth, 540)
    const height = Math.max(460, Math.min(720, containerWidth * 0.82))
    svg.attr('viewBox', `0 0 ${width} ${height}`)

    if (!data.nodes.length) {
      return
    }

    const nodes = data.nodes.map((node) => ({ ...node }))
    const links = data.links.map((link) => ({ ...link }))
    const root = svg.append('g')
    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.7, 2.6])
      .on('zoom', (event) => {
        root.attr('transform', event.transform)
      })

    svg.call(zoomBehavior)

    const termNodes = nodes.filter((node) => node.type === 'term')
    const recordNodes = nodes.filter((node) => node.type === 'record')
    const termY = d3
      .scalePoint()
      .domain(termNodes.map((node) => node.id))
      .range([86, height - 76])
      .padding(0.7)
    const recordY = d3
      .scalePoint()
      .domain(recordNodes.map((node) => node.id))
      .range([86, height - 76])
      .padding(0.7)

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((node) => node.id)
          .distance(210)
          .strength(0.2),
      )
      .force(
        'x',
        d3
          .forceX((node) => (node.type === 'term' ? width * 0.24 : width * 0.76))
          .strength(0.72),
      )
      .force(
        'y',
        d3
          .forceY((node) =>
            node.type === 'term' ? termY(node.id) ?? height / 2 : recordY(node.id) ?? height / 2,
          )
          .strength(0.48),
      )
      .force('charge', d3.forceManyBody().strength(-160))
      .force('collision', d3.forceCollide().radius((node) => nodeRadius(node) + 26))

    root
      .append('text')
      .attr('class', 'network-column-label')
      .attr('x', width * 0.18)
      .attr('y', 34)
      .text(termColumnLabel)

    root
      .append('text')
      .attr('class', 'network-column-label')
      .attr('x', width * 0.7)
      .attr('y', 34)
      .text(recordColumnLabel)

    const link = root
      .append('g')
      .attr('stroke-linecap', 'round')
      .selectAll('path')
      .data(links)
      .join('path')
      .attr('class', 'network-link')
      .attr('stroke-width', (entry) => Math.max(1.4, Math.sqrt(entry.value) * 1.15))

    const node = root
      .append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'network-node')
      .call(
        d3
          .drag()
          .on('start', (event, entry) => {
            if (!event.active) {
              simulation.alphaTarget(0.2).restart()
            }

            entry.fx = entry.x
            entry.fy = entry.y
          })
          .on('drag', (event, entry) => {
            entry.fx = event.x
            entry.fy = event.y
          })
          .on('end', (event, entry) => {
            if (!event.active) {
              simulation.alphaTarget(0)
            }

            entry.fx = null
            entry.fy = null
          }),
      )

    node
      .append('circle')
      .attr('r', (entry) => nodeRadius(entry))
      .attr('class', (entry) => `network-circle network-${entry.type}`)

    node
      .append('text')
      .attr('class', 'network-label')
      .attr('x', (entry) => (entry.type === 'term' ? 16 : -16))
      .attr('y', 4)
      .attr('text-anchor', (entry) => (entry.type === 'term' ? 'start' : 'end'))
      .text((entry) => entry.label)

    simulation.on('tick', () => {
      link.attr('d', (entry) => curvedPath(entry.source, entry.target))
      node.attr('transform', (entry) => `translate(${entry.x},${entry.y})`)
    })

    return () => {
      simulation.stop()
    }
  }, [containerWidth, data, recordColumnLabel, termColumnLabel])

  return (
    <div className="viz-card viz-card-network">
      <div className="viz-head">
        <div>
          <p className="section-label">{sectionLabel}</p>
          <h3>{title}</h3>
        </div>
        <p>{subtitle}</p>
      </div>

      <div ref={containerRef} className="viz-stage">
        {data.nodes.length ? (
          <svg ref={svgRef} className="viz-svg network-svg" role="img" />
        ) : (
          <div className="network-empty">{emptyMessage}</div>
        )}
      </div>

      <div className="viz-hint">{hint}</div>
    </div>
  )
}

function curvedPath(source, target) {
  const middleX = (source.x + target.x) / 2
  return `M${source.x},${source.y} C${middleX},${source.y} ${middleX},${target.y} ${target.x},${target.y}`
}

function nodeRadius(node) {
  if (node.type === 'record') {
    return 9 + Math.min(node.value * 0.9, 9)
  }

  return 7 + Math.min(node.value * 0.55, 8)
}

export default ContextNetwork
