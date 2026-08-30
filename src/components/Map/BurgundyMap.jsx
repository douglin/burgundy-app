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

  useEffect(() => {
    if (!regions) return
    if (!selectedRegion) {
      map.flyToBounds(L.geoJSON(regions).getBounds().pad(0.05), { duration: 0.55 })
      return
    }
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

export default function BurgundyMap({
  selectedRegion, onSelectRegion,
  selectedVillage, onSelectVillage,
  onSelectCru,
}) {
  const [regions, setRegions] = useState(null)
  const [villages, setVillages] = useState(null)
  const [crus, setCrus] = useState(null)

  const regionLayerRef = useRef(null)
  const selectedRegionRef = useRef(selectedRegion)
  const selectedVillageRef = useRef(selectedVillage)
  const onClearRef = useRef(null)

  useEffect(() => { selectedRegionRef.current = selectedRegion }, [selectedRegion])
  useEffect(() => { selectedVillageRef.current = selectedVillage }, [selectedVillage])

  // onClear: clicking map background deselects
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

  // Restyle regions imperatively when selection changes
  useEffect(() => {
    regionLayerRef.current?.eachLayer(layer => {
      const id = layer.feature.properties.id
      layer.setStyle(regionStyle(id, selectedRegion))
    })
  }, [selectedRegion])

  const onEachRegion = useMemo(() => (feature, layer) => {
    const { id, name } = feature.properties
    layer.on({
      mouseover(e) {
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
  // onSelectRegion is stable (defined in Home.jsx)
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

  const initialBounds = useMemo(() => {
    // Burgundy corridor + Chablis
    return L.latLngBounds([[46.20, 3.60], [47.95, 5.10]])
  }, [])

  if (!regions) return <div className="w-full h-full bg-[#2C1810]" />

  return (
    <div className="relative w-full h-full">
      <MapContainer
        bounds={initialBounds}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        {/* Region polygons */}
        <GeoJSON
          key="regions"
          data={regions}
          style={feature => regionStyle(feature.properties.id, selectedRegion)}
          onEachFeature={onEachRegion}
          ref={regionLayerRef}
        />

        {/* Village dots — shown when a region is selected */}
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

        {/* Cru polygons — shown when a village is selected */}
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

      {/* Back buttons */}
      {selectedVillage && (
        <button
          onClick={() => onSelectVillage(null)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] text-[10px] tracking-widest uppercase text-[#C9A84C] bg-[#2C1810]/80 px-3 py-1.5 hover:bg-[#2C1810] transition-colors"
        >
          ← Back to {selectedRegion?.name}
        </button>
      )}
      {selectedRegion && !selectedVillage && (
        <button
          onClick={() => onSelectRegion(null)}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] text-[10px] tracking-widest uppercase text-[#C9A84C] bg-[#2C1810]/80 px-3 py-1.5 hover:bg-[#2C1810] transition-colors"
        >
          ← Back to all regions
        </button>
      )}

      {!selectedRegion && (
        <div className="absolute bottom-2 right-3 z-[1000] text-[9px] tracking-widest uppercase text-[#4A3020] pointer-events-none bg-white/60 px-1">
          © OpenStreetMap contributors
        </div>
      )}
    </div>
  )
}
