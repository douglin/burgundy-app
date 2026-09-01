import L from 'leaflet'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CircleMarker, GeoJSON, MapContainer, TileLayer, Tooltip, useMap, useMapEvents } from 'react-leaflet'

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

// ── Label-search helpers ──────────────────────────────────────────────────────

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findMatch(input, crus, villages) {
  if (!input.trim() || !crus || !villages) return null

  const norm = normalize(input).replace(/\b(19|20)\d{2}\b/g, '').replace(/\s+/g, ' ').trim()
  if (!norm) return null

  // Village context first — prevents GC names that are substrings of village names from matching
  let matchedVillage = null
  const villagesSorted = [...villages.features].sort(
    (a, b) => b.properties.name.length - a.properties.name.length
  )
  for (const f of villagesSorted) {
    if (norm.includes(normalize(f.properties.name))) {
      matchedVillage = f.properties
      break
    }
  }

  const villageNorm = matchedVillage ? normalize(matchedVillage.name) : null
  const gcs = crus.features
    .filter(f => f.properties.level === 'grand-cru')
    .sort((a, b) => b.properties.name.length - a.properties.name.length)

  for (const f of gcs) {
    const gcNorm = normalize(f.properties.name)
    if (villageNorm && villageNorm.includes(gcNorm)) continue
    if (norm.includes(gcNorm)) return { level: 'grand-cru', ...f.properties }
  }

  const pcs = crus.features
    .filter(f => {
      if (f.properties.level !== 'premier-cru') return false
      return matchedVillage ? f.properties.villageId === matchedVillage.id : true
    })
    .sort((a, b) => b.properties.name.length - a.properties.name.length)

  for (const f of pcs) {
    const pcNorm = normalize(f.properties.name)
    if (pcNorm.length >= 4 && norm.includes(pcNorm)) return { level: 'premier-cru', ...f.properties }
  }

  if (matchedVillage) return { level: 'village', ...matchedVillage }

  const REGIONS = [
    { id: 'cote-de-nuits',    name: 'Côte de Nuits',    regionId: 'cote-de-nuits' },
    { id: 'cote-de-beaune',   name: 'Côte de Beaune',   regionId: 'cote-de-beaune' },
    { id: 'chablis',          name: 'Chablis',           regionId: 'chablis' },
    { id: 'cote-chalonnaise', name: 'Côte Chalonnaise',  regionId: 'cote-chalonnaise' },
    { id: 'maconnais',        name: 'Mâconnais',         regionId: 'maconnais' },
  ]
  for (const r of REGIONS) {
    if (norm.includes(normalize(r.name))) return { level: 'region', ...r }
  }

  return null
}

// ── Map internals ─────────────────────────────────────────────────────────────

function regionStyle(id, selectedRegion) {
  const isDimmed = selectedRegion && selectedRegion.id !== id
  const isSelected = selectedRegion?.id === id
  return {
    fillColor: REGION_FILL[id],
    fillOpacity: isDimmed ? 0.10 : 0.72,
    color: '#F5F0E8',
    weight: isSelected ? 2.5 : 0.8,
    opacity: isDimmed ? 0.4 : 1,
  }
}

function MapController({ selectedRegion, selectedVillage, regions, crus }) {
  const map = useMap()
  const mounted = useRef(false)

  useEffect(() => {
    if (!regions) return
    if (!selectedRegion) {
      if (!mounted.current) { mounted.current = true; return }
      map.flyToBounds(L.geoJSON(regions).getBounds().pad(0.05), { duration: 0.55 })
      return
    }
    mounted.current = true
    if (selectedVillage) {
      const vc = crus?.features.filter(f => f.properties.villageId === selectedVillage.id) || []
      if (vc.length) {
        map.flyToBounds(
          L.geoJSON({ type: 'FeatureCollection', features: vc }).getBounds().pad(0.6),
          { duration: 0.7, maxZoom: 15 }
        )
      } else {
        const [lon, lat] = selectedVillage.coordinates
        map.flyTo([lat, lon], 13, { duration: 0.7 })
      }
      return
    }
    const feat = regions.features.find(f => f.properties.id === selectedRegion.id)
    if (feat) {
      map.flyToBounds(L.geoJSON(feat).getBounds().pad(0.2), { duration: 0.65, maxZoom: 11 })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRegion?.id, selectedVillage?.id])

  return null
}

function BackgroundClick({ onClearRef }) {
  useMapEvents({
    click() { onClearRef.current() }
  })
  return null
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function BurgundyMap({
  selectedRegion, onSelectRegion,
  selectedVillage, onSelectVillage,
  onSelectCru,
  sheetOpen,
  sheetExpanded,
}) {
  const [regions, setRegions] = useState(null)
  const [villages, setVillages] = useState(null)
  const [crus, setCrus] = useState(null)
  const [searchInput, setSearchInput] = useState('')

  const regionLayerRef = useRef(null)
  const selectedRegionRef = useRef(selectedRegion)
  const selectedVillageRef = useRef(selectedVillage)
  const onClearRef = useRef(null)

  useEffect(() => { selectedRegionRef.current = selectedRegion }, [selectedRegion])
  useEffect(() => { selectedVillageRef.current = selectedVillage }, [selectedVillage])

  onClearRef.current = () => {
    if (selectedVillageRef.current) { onSelectVillage(null); return }
    if (selectedRegionRef.current) { onSelectRegion(null) }
  }

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
    regionLayerRef.current?.eachLayer(layer => {
      const id = layer.feature.properties.id
      layer.setStyle(regionStyle(id, selectedRegion))
    })
  }, [selectedRegion])

  const searchMatch = useMemo(() => findMatch(searchInput, crus, villages), [searchInput, crus, villages])

  function applySearchMatch(match) {
    if (!match || !regions || !villages) return
    const { level, id, regionId, villageId } = match
    const regionFeature = regions.features.find(f => f.properties.id === regionId)
    if (!regionFeature) { setSearchInput(''); return }
    onSelectRegion(regionFeature.properties)
    if (level === 'region') { setSearchInput(''); return }
    const villageId_ = level === 'village' ? id : villageId
    const villageFeature = villages.features.find(f => f.properties.id === villageId_)
    if (!villageFeature) { setSearchInput(''); return }
    onSelectVillage({ ...villageFeature.properties, coordinates: villageFeature.geometry.coordinates })
    if (level === 'village') { setSearchInput(''); return }
    onSelectCru(match)
    setSearchInput('')
  }

  const onEachRegion = useMemo(() => (feature, layer) => {
    const { id, name } = feature.properties
    layer.on({
      mouseover() {
        if (selectedRegionRef.current && selectedRegionRef.current.id !== id) return
        layer.setStyle({ fillColor: REGION_HOVER[id], fillOpacity: 0.88 })
      },
      mouseout() {
        layer.setStyle(regionStyle(id, selectedRegionRef.current))
      },
      click(e) {
        L.DomEvent.stopPropagation(e)
        if (selectedRegionRef.current && selectedRegionRef.current.id !== id) return
        onSelectRegion(feature.properties)
      },
    })
    layer.bindTooltip(name, { className: 'burg-tooltip', sticky: false, direction: 'top', offset: [0, -4] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const villagesInRegion = useMemo(() => {
    if (!villages || !selectedRegion) return []
    return villages.features.filter(f => f.properties.regionId === selectedRegion.id)
  }, [villages, selectedRegion])

  const crusForVillage = useMemo(() => {
    if (!crus || !selectedVillage) return []
    return crus.features.filter(f => f.properties.villageId === selectedVillage.id)
  }, [crus, selectedVillage])

  const onEachCru = useMemo(() => (feature, layer) => {
    const { name, level } = feature.properties
    const label = `${name} · ${level === 'grand-cru' ? 'Grand Cru' : 'Premier Cru'} · ${feature.properties.hectares} ha`
    layer.on({
      mouseover() { layer.setStyle({ fillColor: CRU_HOVER[level], fillOpacity: 0.95 }) },
      mouseout() { layer.setStyle({ fillColor: CRU_FILL[level], fillOpacity: 0.85 }) },
      click(e) {
        L.DomEvent.stopPropagation(e)
        onSelectCru && onSelectCru(feature.properties)
      },
    })
    layer.bindTooltip(label, { className: 'burg-tooltip', sticky: false, direction: 'top', offset: [0, -4] })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function cruStyle(feature) {
    return {
      fillColor: CRU_FILL[feature.properties.level],
      fillOpacity: 0.85,
      color: '#F5F0E8',
      weight: 0.8,
    }
  }

  if (!regions) return <div className="w-full h-full bg-[#2C1810]" />

  const levelLabel = m =>
    m.level === 'grand-cru' ? 'Grand Cru' :
    m.level === 'premier-cru' ? 'Premier Cru' :
    m.level === 'village' ? 'Village' : 'Region'

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={[47.0, 4.35]}
        zoom={8}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          maxZoom={16}
        />

        <GeoJSON
          key="regions"
          data={regions}
          style={feature => regionStyle(feature.properties.id, selectedRegion)}
          onEachFeature={onEachRegion}
          ref={regionLayerRef}
        />

        {selectedRegion && !selectedVillage && villagesInRegion.map(feature => {
          const { id, name } = feature.properties
          const [lon, lat] = feature.geometry.coordinates
          return (
            <CircleMarker
              key={id}
              center={[lat, lon]}
              radius={6}
              pathOptions={{ fillColor: '#C9A84C', fillOpacity: 1, color: '#F5F0E8', weight: 1.5 }}
              eventHandlers={{
                click(e) {
                  L.DomEvent.stopPropagation(e)
                  onSelectVillage({ ...feature.properties, coordinates: feature.geometry.coordinates })
                },
              }}
            >
              <Tooltip className="burg-tooltip" direction="right" offset={[8, 0]} permanent={false}>
                {name}
              </Tooltip>
            </CircleMarker>
          )
        })}

        {selectedVillage && crusForVillage.length > 0 && (
          <GeoJSON
            key={selectedVillage.id}
            data={{ type: 'FeatureCollection', features: crusForVillage }}
            style={cruStyle}
            onEachFeature={onEachCru}
          />
        )}

        <MapController
          selectedRegion={selectedRegion}
          selectedVillage={selectedVillage}
          regions={regions}
          crus={crus}
        />
        <BackgroundClick onClearRef={onClearRef} />
      </MapContainer>

      {/* Search bar — main map view only */}
      {!selectedRegion && <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[900] w-64 sm:w-80">
        <input
          type="text"
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && searchMatch) applySearchMatch(searchMatch) }}
          placeholder="Search appellation or label…"
          className="w-full bg-[#FDFAF5]/95 border border-[#D4C5A9] px-3 py-2 text-sm text-[#2C1810] placeholder-[#B8A898] focus:outline-none focus:border-[#C9A84C] shadow-sm"
        />
        {searchInput.trim() && searchMatch && (
          <button
            onClick={() => applySearchMatch(searchMatch)}
            className="w-full text-left bg-[#FDFAF5]/95 border-x border-b border-[#D4C5A9] px-3 py-2 text-xs shadow-sm hover:bg-[#EDE6D6] transition-colors"
          >
            <span className="text-[#C9A84C] mr-1.5">✦</span>
            <span className="text-[#6B0F1A] font-medium">{searchMatch.name}</span>
            <span className="text-[#9A7B6A] ml-1.5">· {levelLabel(searchMatch)}</span>
          </button>
        )}
        {searchInput.trim() && !searchMatch && (
          <div className="w-full bg-[#FDFAF5]/95 border-x border-b border-[#D4C5A9] px-3 py-2 text-xs text-[#9A7B6A] shadow-sm">
            No match found
          </div>
        )}
      </div>}

      {/* Back buttons — float above the bottom sheet on mobile */}
      {selectedVillage && (
        <button
          onClick={() => onSelectVillage(null)}
          className={`absolute left-1/2 -translate-x-1/2 z-[1000] text-[10px] tracking-widest uppercase text-[#C9A84C] bg-[#2C1810]/80 px-3 py-1.5 hover:bg-[#2C1810] transition-colors sm:bottom-4 ${sheetExpanded ? 'bottom-[92vh]' : sheetOpen ? 'bottom-[128px]' : 'bottom-4'}`}
        >
          ← Back to {selectedRegion?.name}
        </button>
      )}
      {selectedRegion && !selectedVillage && (
        <button
          onClick={() => onSelectRegion(null)}
          className={`absolute left-1/2 -translate-x-1/2 z-[1000] text-[10px] tracking-widest uppercase text-[#C9A84C] bg-[#2C1810]/80 px-3 py-1.5 hover:bg-[#2C1810] transition-colors sm:bottom-4 ${sheetExpanded ? 'bottom-[92vh]' : sheetOpen ? 'bottom-[128px]' : 'bottom-4'}`}
        >
          ← Back to all regions
        </button>
      )}

      {!selectedRegion && (
        <div className="absolute bottom-2 right-3 z-[1000] text-[9px] tracking-widest uppercase text-[#4A3020] pointer-events-none bg-white/60 px-1">
          © Esri
        </div>
      )}
    </div>
  )
}
