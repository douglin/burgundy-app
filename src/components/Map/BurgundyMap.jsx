import * as d3 from 'd3'
import { useEffect, useMemo, useRef, useState } from 'react'

const REGION_FILL = {
  'chablis':           '#7A6248',
  'cote-de-nuits':     '#6B0F1A',
  'cote-de-beaune':    '#8B1D2E',
  'cote-chalonnaise':  '#9B4020',
  'maconnais':         '#7B5A18',
}

const REGION_HOVER = {
  'chablis':           '#9A8268',
  'cote-de-nuits':     '#8B2F3A',
  'cote-de-beaune':    '#AB3D4E',
  'cote-chalonnaise':  '#BB6040',
  'maconnais':         '#9B7A38',
}

const CRU_FILL = {
  'grand-cru':   '#C9A84C',
  'premier-cru': '#A8A8A8',
}

const CRU_HOVER = {
  'grand-cru':   '#E8D09A',
  'premier-cru': '#C8C8C8',
}

export default function BurgundyMap({
  selectedRegion, onSelectRegion,
  selectedVillage, onSelectVillage,
  onSelectCru,
}) {
  const svgRef = useRef(null)
  const gRef = useRef(null)
  const containerRef = useRef(null)
  const zoomRef = useRef(null)
  const [size, setSize] = useState({ w: 500, h: 750 })
  const [regions, setRegions] = useState(null)
  const [villages, setVillages] = useState(null)
  const [crus, setCrus] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [tooltip, setTooltip] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const [zoomK, setZoomK] = useState(1)

  useEffect(() => {
    Promise.all([
      fetch('/geo/regions.geojson').then(r => r.json()),
      fetch('/geo/villages.geojson').then(r => r.json()),
      fetch('/geo/crus.geojson').then(r => r.json()),
    ]).then(([r, v, c]) => {
      setRegions(r)
      setVillages(v)
      setCrus(c)
    })
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const obs = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.max(width, 200), h: Math.max(height, 300) })
    })
    obs.observe(containerRef.current)
    return () => obs.disconnect()
  }, [])

  const { projection, pathGen } = useMemo(() => {
    if (!regions) return {}
    const pad = 40
    const proj = d3.geoMercator().fitExtent(
      [[pad, pad], [size.w - pad, size.h - pad]],
      regions
    )
    return { projection: proj, pathGen: d3.geoPath().projection(proj) }
  }, [regions, size])

  useEffect(() => {
    if (!svgRef.current) return
    const zoom = d3.zoom()
      .scaleExtent([1, 20])
      .filter(() => false)
      .on('zoom', event => {
        d3.select(gRef.current).attr('transform', event.transform)
        setZoomK(event.transform.k)
      })
    d3.select(svgRef.current).call(zoom)
    zoomRef.current = zoom
  }, [size])

  // Zoom to region
  useEffect(() => {
    if (!selectedRegion || !pathGen || !svgRef.current || !regions || !zoomRef.current) return
    if (selectedVillage) return // village zoom takes priority
    const feature = regions.features.find(f => f.properties.id === selectedRegion.id)
    if (!feature) return
    const [[x0, y0], [x1, y1]] = pathGen.bounds(feature)
    const dx = x1 - x0, dy = y1 - y0
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2
    const scale = Math.min(10, 0.82 / Math.max(dx / size.w, dy / size.h))
    const tx = size.w / 2 - scale * cx
    const ty = size.h / 2 - scale * cy
    d3.select(svgRef.current)
      .transition().duration(700).ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale))
    setZoomed(true)
  }, [selectedRegion, pathGen, regions, size, selectedVillage])

  // Zoom to village
  useEffect(() => {
    if (!selectedVillage || !projection || !svgRef.current || !crus || !zoomRef.current) return
    const villageCrus = crus.features.filter(f => f.properties.villageId === selectedVillage.id)
    let cx, cy, scale

    if (villageCrus.length > 0) {
      // Compute bounds directly from geographic coordinates to avoid D3 path artifact issue
      const coords = villageCrus.flatMap(f => f.geometry.coordinates[0])
      const lons = coords.map(c => c[0])
      const lats = coords.map(c => c[1])
      const [x0, y1] = projection([Math.min(...lons), Math.min(...lats)])
      const [x1, y0] = projection([Math.max(...lons), Math.max(...lats)])
      const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0)
      cx = (x0 + x1) / 2; cy = (y0 + y1) / 2
      scale = Math.min(18, 0.75 / Math.max(dx / size.w, dy / size.h))
    } else {
      // Fallback: zoom to village point
      const [vx, vy] = projection(selectedVillage.coordinates)
      cx = vx; cy = vy; scale = 14
    }

    const tx = size.w / 2 - scale * cx
    const ty = size.h / 2 - scale * cy
    d3.select(svgRef.current)
      .transition().duration(700).ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, d3.zoomIdentity.translate(tx, ty).scale(scale))
  }, [selectedVillage, projection, crus, pathGen, size])

  // Zoom back out on deselect
  useEffect(() => {
    if (selectedRegion || !zoomed || !svgRef.current || !zoomRef.current) return
    d3.select(svgRef.current)
      .transition().duration(550).ease(d3.easeCubicInOut)
      .call(zoomRef.current.transform, d3.zoomIdentity)
    setZoomed(false)
  }, [selectedRegion, zoomed])

  const villagesInRegion = useMemo(() => {
    if (!villages || !selectedRegion) return []
    return villages.features.filter(f => f.properties.regionId === selectedRegion.id)
  }, [villages, selectedRegion])

  const crusForVillage = useMemo(() => {
    if (!crus || !selectedVillage) return []
    return crus.features.filter(f => f.properties.villageId === selectedVillage.id)
  }, [crus, selectedVillage])

  function handleMouseMove(e, name) {
    setTooltip({ x: e.clientX, y: e.clientY, name })
  }

  return (
    <div ref={containerRef} className="relative w-full h-full select-none">
      <svg
        ref={svgRef}
        className="w-full h-full"
        onClick={() => {
          if (selectedVillage) { onSelectVillage(null); return }
          if (selectedRegion) onSelectRegion(null)
        }}
      >
        <g ref={gRef}>
          {/* Region polygons */}
          {regions && pathGen && regions.features.map(feature => {
            const { id, name } = feature.properties
            const isSelected = selectedRegion?.id === id
            const isDimmed = selectedRegion && !isSelected
            const isHovered = hovered === id && !isDimmed
            const [cx, cy] = pathGen.centroid(feature)

            return (
              <g key={id}>
                <path
                  d={pathGen(feature)}
                  fill={isHovered ? REGION_HOVER[id] : REGION_FILL[id]}
                  fillOpacity={isDimmed ? 0.15 : 0.82}
                  stroke="#F5F0E8"
                  strokeWidth={isSelected ? 1.5 : 0.5}
                  style={{ cursor: isDimmed ? 'default' : 'pointer', transition: 'fill-opacity 0.3s' }}
                  onClick={e => { e.stopPropagation(); if (!isDimmed) onSelectRegion(feature.properties) }}
                  onMouseEnter={e => { if (!isDimmed) { setHovered(id); handleMouseMove(e, name) } }}
                  onMouseMove={e => { if (!isDimmed) handleMouseMove(e, name) }}
                  onMouseLeave={() => { setHovered(null); setTooltip(null) }}
                />
                {!isDimmed && !isNaN(cx) && !selectedVillage && (
                  <text
                    x={cx} y={cy}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={11} fontWeight="600"
                    fontFamily="'Playfair Display', Georgia, serif"
                    fill="#F5F0E8" fillOpacity={0.95}
                    style={{ pointerEvents: 'none', letterSpacing: '0.03em' }}
                  >
                    {name}
                  </text>
                )}
              </g>
            )
          })}

          {/* Village dots — shown when region selected but no village selected */}
          {selectedRegion && !selectedVillage && projection && villagesInRegion.map((feature, i) => {
            const { id, name } = feature.properties
            const [x, y] = projection(feature.geometry.coordinates)
            if (isNaN(x) || isNaN(y)) return null
            const isHoveredV = hovered === id
            const labelSide = i % 2 === 0 ? 1 : -1
            const labelX = labelSide > 0 ? x + 9 : x - 9
            const anchor = labelSide > 0 ? 'start' : 'end'

            return (
              <g
                key={id}
                style={{ cursor: 'pointer' }}
                onClick={e => {
                  e.stopPropagation()
                  onSelectVillage({ ...feature.properties, coordinates: feature.geometry.coordinates })
                }}
                onMouseEnter={e => { setHovered(id); handleMouseMove(e, name) }}
                onMouseMove={e => handleMouseMove(e, name)}
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              >
                <circle cx={x} cy={y} r={isHoveredV ? 5 : 3.5}
                  fill={isHoveredV ? '#E8D09A' : '#C9A84C'}
                  stroke="#F5F0E8" strokeWidth={1.2}
                  style={{ transition: 'r 0.1s' }}
                />
                <text x={labelX} y={y} textAnchor={anchor} dominantBaseline="middle"
                  fontSize={8} fill="#F5F0E8"
                  fontFamily="'Crimson Pro', Georgia, serif"
                  style={{ pointerEvents: 'none' }}
                >
                  {name}
                </text>
              </g>
            )
          })}

          {/* Cru polygons — shown when village selected; grand-cru rendered last (on top) */}
          {selectedVillage && pathGen && [...crusForVillage]
            .sort((a, b) => a.properties.level === 'grand-cru' ? 1 : -1)
            .map(feature => {
            const { id, name, level, hectares } = feature.properties
            const isHoveredC = hovered === id
            const fill = isHoveredC ? CRU_HOVER[level] : CRU_FILL[level]
            // Compute centroid directly from geographic coordinates to avoid D3 path artifacts
            const ring = feature.geometry.coordinates[0].slice(0, -1)
            const proj = ring.map(([lon, lat]) => projection([lon, lat]))
            const cx = proj.reduce((s, [x]) => s + x, 0) / proj.length
            const cy = proj.reduce((s, [, y]) => s + y, 0) / proj.length

            return (
              <g
                key={id}
                style={{ cursor: 'pointer' }}
                onClick={e => { e.stopPropagation(); onSelectCru && onSelectCru(feature.properties) }}
                onMouseEnter={e => { setHovered(id); handleMouseMove(e, `${name} · ${level === 'grand-cru' ? 'Grand Cru' : 'Premier Cru'} · ${hectares} ha`) }}
                onMouseMove={e => handleMouseMove(e, `${name} · ${level === 'grand-cru' ? 'Grand Cru' : 'Premier Cru'} · ${hectares} ha`)}
                onMouseLeave={() => { setHovered(null); setTooltip(null) }}
              >
                <path
                  d={feature.geometry.coordinates[0].map(([lon, lat], i) => {
                    const [x, y] = projection([lon, lat])
                    return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
                  }).join('') + 'Z'}
                  fill={fill}
                  fillOpacity={0.85}
                  stroke="#F5F0E8"
                  strokeWidth={0.4}
                />
                {!isNaN(cx) && (
                  <text
                    x={cx} y={cy}
                    textAnchor="middle" dominantBaseline="middle"
                    fontSize={7 / zoomK} fontWeight={level === 'grand-cru' ? '700' : '400'}
                    fontFamily="'Crimson Pro', Georgia, serif"
                    fill="#2C1810"
                    style={{ pointerEvents: 'none' }}
                  >
                    {name}
                  </text>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {tooltip && (
        <div
          className="fixed z-20 pointer-events-none bg-[#2C1810] text-[#F5F0E8] px-3 py-1.5 text-xs shadow-lg"
          style={{ left: tooltip.x + 14, top: tooltip.y - 10 }}
        >
          {tooltip.name}
        </div>
      )}

      {/* Back hint */}
      {selectedVillage && (
        <button
          onClick={() => onSelectVillage(null)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-[#C9A84C] opacity-60 hover:opacity-100 transition-opacity"
        >
          ← Back to {selectedRegion?.name}
        </button>
      )}
      {selectedRegion && !selectedVillage && (
        <button
          onClick={() => onSelectRegion(null)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] tracking-widest uppercase text-[#C9A84C] opacity-60 hover:opacity-100 transition-opacity"
        >
          ← Back to all regions
        </button>
      )}

      {!selectedRegion && (
        <div className="absolute bottom-2 right-3 text-[9px] tracking-widest uppercase text-[#4A3020] pointer-events-none">
          Schematic · not to scale
        </div>
      )}
    </div>
  )
}
