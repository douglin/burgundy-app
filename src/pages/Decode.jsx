import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import appellations from '../data/appellations.json'

// ── Helpers ──────────────────────────────────────────────────────────────────

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractYear(text) {
  const m = text.match(/\b(19|20)\d{2}\b/)
  return m ? parseInt(m[0]) : null
}

function findMatch(input, crus, villages) {
  if (!input.trim() || !crus || !villages) return null

  // Remove year from matching text
  const norm = normalize(input).replace(/\b(19|20)\d{2}\b/g, '').replace(/\s+/g, ' ').trim()
  if (!norm) return null

  // 1. Find village context first — needed to avoid GC names that are substrings of
  //    village names (e.g. "Musigny" ⊂ "Chambolle-Musigny", "Chambertin" ⊂ "Gevrey-Chambertin")
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

  // 2. Grand Crus — longest name first; skip GC names that are substrings of the matched village
  const villageNorm = matchedVillage ? normalize(matchedVillage.name) : null
  const gcs = crus.features
    .filter(f => f.properties.level === 'grand-cru')
    .sort((a, b) => b.properties.name.length - a.properties.name.length)

  for (const f of gcs) {
    const gcNorm = normalize(f.properties.name)
    if (villageNorm && villageNorm.includes(gcNorm)) continue
    if (norm.includes(gcNorm)) {
      return { level: 'grand-cru', ...f.properties }
    }
  }

  // 3. Premier Crus — prefer within matched village; min name length 4 to avoid noise
  const pcs = crus.features
    .filter(f => {
      if (f.properties.level !== 'premier-cru') return false
      return matchedVillage ? f.properties.villageId === matchedVillage.id : true
    })
    .sort((a, b) => b.properties.name.length - a.properties.name.length)

  for (const f of pcs) {
    const pcNorm = normalize(f.properties.name)
    if (pcNorm.length >= 4 && norm.includes(pcNorm)) {
      return { level: 'premier-cru', ...f.properties }
    }
  }

  // 4. Village
  if (matchedVillage) return { level: 'village', ...matchedVillage }

  // 5. Region
  const REGIONS = [
    { id: 'cote-de-nuits',     name: 'Côte de Nuits',     regionId: 'cote-de-nuits' },
    { id: 'cote-de-beaune',    name: 'Côte de Beaune',    regionId: 'cote-de-beaune' },
    { id: 'chablis',           name: 'Chablis',            regionId: 'chablis' },
    { id: 'cote-chalonnaise',  name: 'Côte Chalonnaise',  regionId: 'cote-de-beaune' },
    { id: 'maconnais',         name: 'Mâconnais',         regionId: 'maconnais' },
  ]
  for (const r of REGIONS) {
    if (norm.includes(normalize(r.name))) return { level: 'region', ...r }
  }

  return null
}

const SCORE_LABEL = ['', 'Poor', 'Below average', 'Good', 'Very good', 'Exceptional']
const SCORE_COLOR = [
  '',
  { bg: '#F5D0D0', text: '#7B1D1D' },
  { bg: '#F5E4C0', text: '#7B5A1D' },
  { bg: '#F5F0C0', text: '#5A5A1D' },
  { bg: '#D4EAC0', text: '#2A5A1D' },
  { bg: '#B8D9A0', text: '#1A4A0A' },
]

// ── Result Card ───────────────────────────────────────────────────────────────

function MatchCard({ match, year, vintageData, onViewOnMap }) {
  const app = appellations.find(a => a.id === match.id)

  const vintageRegionId = match.regionId
  const vintageYear = vintageData?.years?.[year]
  const score = vintageYear?.[vintageRegionId]
  const regionLabel = vintageData?.regions?.find(r => r.id === vintageRegionId)?.label

  const levelLabel =
    match.level === 'grand-cru' ? 'Grand Cru' :
    match.level === 'premier-cru' ? 'Premier Cru' :
    match.level === 'village' ? 'Village' : 'Region'

  const grapes = app?.grapes
    ? [...(app.grapes.red || []), ...(app.grapes.white || [])].join(', ')
    : null

  return (
    <div className="border border-[#D4C5A9] bg-white/60">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#D4C5A9]">
        <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-1">{levelLabel}</p>
        <h2
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-2xl font-bold text-[#6B0F1A]"
        >
          {match.name}
        </h2>
        {match.villageId && (
          <p className="text-xs text-[#6B5244] mt-0.5 tracking-wide">
            {match.villageId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
            {match.regionId && ` · ${match.regionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`}
          </p>
        )}
        {!match.villageId && match.regionId && (
          <p className="text-xs text-[#6B5244] mt-0.5 tracking-wide">
            {match.regionId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
          </p>
        )}
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Vintage badge */}
        {year && score && (
          <div
            className="inline-flex items-center gap-3 px-4 py-2.5"
            style={{ backgroundColor: SCORE_COLOR[score]?.bg, color: SCORE_COLOR[score]?.text }}
          >
            <span
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-lg font-bold"
            >
              {year}
            </span>
            <span className="text-xs tracking-widest uppercase font-semibold">
              {regionLabel} · {SCORE_LABEL[score]}
            </span>
            <span className="font-bold text-lg">{score}/5</span>
          </div>
        )}
        {year && score && vintageYear?.note && (
          <p className="text-sm text-[#6B5244] italic -mt-3 leading-relaxed">{vintageYear.note}</p>
        )}
        {year && !score && (
          <p className="text-sm text-[#6B5244]">No vintage data for {year}.</p>
        )}

        {grapes && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Grapes</p>
            <p className="text-sm text-[#2C1810]">{grapes}</p>
          </div>
        )}

        {app?.style && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Style</p>
            <p className="text-sm text-[#2C1810] italic leading-relaxed">{app.style}</p>
          </div>
        )}

        {app?.facts?.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">Key Facts</p>
            <ul className="space-y-1.5">
              {app.facts.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#2C1810]">
                  <span className="text-[#C9A84C] flex-shrink-0">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {app?.keyProducers?.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">Key Producers</p>
            <ul className="space-y-1">
              {app.keyProducers.map(name => (
                <li key={name} className="text-sm text-[#2C1810] flex gap-2">
                  <span className="text-[#C9A84C]">·</span> {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Premier Cru with no appellation entry */}
        {!app && match.level === 'premier-cru' && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Classification</p>
            <p className="text-sm text-[#2C1810]">
              One step below Grand Cru. The village name must precede the climat name on the label.
              {match.hectares && ` Total area: ${match.hectares} ha.`}
            </p>
          </div>
        )}

        {!app && match.level === 'region' && (
          <div>
            <p className="text-sm text-[#2C1810]">
              Try adding a village or climat name for more detail — e.g. "{match.name} Gevrey-Chambertin".
            </p>
          </div>
        )}
      </div>

      <div className="px-6 py-4 border-t border-[#D4C5A9]">
        <button
          onClick={onViewOnMap}
          className="w-full border border-[#6B0F1A] text-[#6B0F1A] px-4 py-2 text-[10px] tracking-widest uppercase hover:bg-[#6B0F1A] hover:text-[#F5F0E8] transition-colors"
        >
          View on Map
        </button>
      </div>
    </div>
  )
}

// ── Vintage Quick-Check ───────────────────────────────────────────────────────

function VintageQuickCheck({ vintageData }) {
  const years = vintageData ? Object.keys(vintageData.years).sort((a, b) => b - a) : []
  const [year, setYear] = useState(years[0] || '')

  if (!vintageData) return null

  const data = vintageData.years[year]
  const regions = vintageData.regions

  return (
    <div>
      <div className="flex items-center gap-4 mb-5">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A]"
        >
          Vintage Quick-Check
        </p>
        <select
          value={year}
          onChange={e => setYear(e.target.value)}
          className="border border-[#D4C5A9] bg-[#F5F0E8] text-[#2C1810] text-sm px-3 py-1.5 focus:outline-none focus:border-[#C9A84C]"
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {regions.map(r => {
              const score = data[r.id]
              const c = SCORE_COLOR[score] || { bg: '#EDE6D6', text: '#6B5244' }
              return (
                <div key={r.id} className="px-4 py-3 text-center" style={{ backgroundColor: c.bg, color: c.text }}>
                  <p className="text-[10px] tracking-widest uppercase mb-1 font-medium">{r.label}</p>
                  <p style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-2xl font-bold">{score}/5</p>
                  <p className="text-[10px] mt-0.5 font-medium">{SCORE_LABEL[score]}</p>
                </div>
              )
            })}
          </div>
          {data.note && (
            <p className="text-sm text-[#6B5244] italic leading-relaxed">{data.note}</p>
          )}
        </>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function Decode() {
  const [input, setInput] = useState('')
  const [crus, setCrus] = useState(null)
  const [villages, setVillages] = useState(null)
  const [vintageData, setVintageData] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      fetch('/geo/crus.geojson').then(r => r.json()),
      fetch('/geo/villages.geojson').then(r => r.json()),
      fetch('/data/vintages.json').then(r => r.json()),
    ]).then(([c, v, vt]) => {
      setCrus(c)
      setVillages(v)
      setVintageData(vt)
    })
  }, [])

  const year = useMemo(() => extractYear(input), [input])
  const match = useMemo(() => findMatch(input, crus, villages), [input, crus, villages])
  const hasInput = input.trim().length > 0

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Tool</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-2"
      >
        Label Decoder
      </h1>
      <p className="text-sm text-[#6B5244] mb-8">
        Type any part of a wine label to identify where it's from and how the vintage rated.
      </p>

      <div className="h-px bg-[#D4C5A9] mb-8" />

      {/* Input */}
      <div className="mb-8">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g.  Gevrey-Chambertin Clos Saint-Jacques 2019"
          className="w-full border border-[#D4C5A9] bg-white/60 px-4 py-3 text-[#2C1810] text-base placeholder-[#B8A898] focus:outline-none focus:border-[#C9A84C]"
          style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}
          autoFocus
        />
        <p className="text-[10px] text-[#B8A898] mt-2 tracking-wide">
          Works with village names, Premier Crus, Grand Crus, and vintage years
        </p>
      </div>

      {/* Results */}
      {hasInput && match && (
        <div className="mb-10">
          <MatchCard
            match={match}
            year={year}
            vintageData={vintageData}
            onViewOnMap={() => navigate('/', { state: { highlight: match } })}
          />
        </div>
      )}

      {hasInput && !match && (
        <div className="mb-10 px-6 py-5 border border-[#D4C5A9] text-sm text-[#6B5244]">
          <p className="font-medium text-[#2C1810] mb-1">No match found</p>
          <p>Try typing just the appellation name — e.g. <em>Chambolle-Musigny</em> or <em>Chambertin</em>.</p>
        </div>
      )}

      <div className="h-px bg-[#D4C5A9] mb-8" />

      <VintageQuickCheck vintageData={vintageData} />
    </div>
  )
}
