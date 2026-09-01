import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import appellations from '../../data/appellations.json'
import producers from '../../data/producers.json'
import vintages from '../../data/vintages.json'

const SCORE_STYLE = [
  null,
  { bg: '#F5D0D0', text: '#7B1D1D' },
  { bg: '#F5E4C0', text: '#7B5A1D' },
  { bg: '#F5F0C0', text: '#5A5A1D' },
  { bg: '#D4EAC0', text: '#2A5A1D' },
  { bg: '#B8D9A0', text: '#1A4A0A' },
]
const SCORE_LABEL = ['', 'Poor', 'Below avg', 'Good', 'Very good', 'Exceptional']

const REGION_TO_VINTAGE = {
  'cote-de-nuits':    'cote-de-nuits',
  'cote-de-beaune':   'cote-de-beaune',
  'chablis':          'chablis',
  'cote-chalonnaise': 'cote-de-beaune',
  'maconnais':        'maconnais',
}

const RECENT_YEARS = Object.keys(vintages.years).sort((a, b) => b - a).slice(0, 6)

function VintageStrip({ regionId }) {
  const vintageRegionId = REGION_TO_VINTAGE[regionId]
  if (!vintageRegionId) return null

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-2">Recent Vintages</p>
      <div className="flex gap-1">
        {RECENT_YEARS.map(year => {
          const score = vintages.years[year]?.[vintageRegionId]
          const s = SCORE_STYLE[score] ?? { bg: '#EDE6D6', text: '#6B5244' }
          return (
            <div key={year} className="flex-1 text-center" title={score ? SCORE_LABEL[score] : '–'}>
              <div
                className="h-8 flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: s.bg, color: s.text }}
              >
                {score ?? '–'}
              </div>
              <p className="text-[9px] text-[#9A7B6A] mt-0.5">{year.slice(2)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const LEVEL_CONTEXT = {
  'grand-cru':   "Burgundy's highest classification. The vineyard name appears alone on the label — no village qualifier.",
  'premier-cru': 'Second highest level. Label shows village name first, then the climat name.',
  'village':     'The village name is the appellation. One step below Premier Cru.',
  'region':      'Broadest category — the entry point to Burgundy.',
}

function NotesField({ id }) {
  const key = `burg-note-${id}`
  const [note, setNote] = useState(() => localStorage.getItem(key) ?? '')

  useEffect(() => {
    setNote(localStorage.getItem(`burg-note-${id}`) ?? '')
  }, [id])

  function handleChange(e) {
    const text = e.target.value
    setNote(text)
    if (text) localStorage.setItem(key, text)
    else localStorage.removeItem(key)
  }

  return (
    <div>
      <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">My Notes</p>
      <textarea
        rows={3}
        value={note}
        onChange={handleChange}
        placeholder="Tasting notes, impressions…"
        className="w-full text-sm text-[#2C1810] bg-[#F5F0E8] border border-[#D4C5A9] px-3 py-2 resize-none focus:outline-none focus:border-[#C9A84C] placeholder-[#B8A898]"
      />
    </div>
  )
}

const Footer = () => (
  <div className="px-6 py-4 border-t border-[#D4C5A9]">
    <div className="flex gap-3 text-[10px] tracking-widest uppercase text-[#6B5244]">
      <Link to="/learn/classification" className="hover:text-[#6B0F1A] transition-colors">Classification ↗</Link>
      <span className="opacity-40">·</span>
      <Link to="/learn/terroir" className="hover:text-[#6B0F1A] transition-colors">Terroir ↗</Link>
    </div>
  </div>
)

export default function FactCard({ selection, type, onClose }) {
  if (!selection) return null

  const appellation = type === 'village'
    ? appellations.find(a => a.id === selection.id)
    : null

  const relatedProducers = appellation
    ? producers.filter(p => p.village === appellation.id)
    : type === 'region'
      ? producers.filter(p => p.regionId === selection.id).slice(0, 3)
      : []

  // Cru card
  if (type === 'cru') {
    const cruApp = appellations.find(a => a.id === selection.id)
    return (
      <div className="h-full flex flex-col">
        <div className="px-6 py-5 border-b border-[#D4C5A9]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#4A2A1A] text-xs font-medium tracking-[0.3em] uppercase mb-1">
                {selection.level === 'grand-cru' ? 'Grand Cru' : 'Premier Cru'}
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-xl font-bold text-[#6B0F1A] leading-tight"
              >
                {selection.name}
              </h2>
              <p className="text-sm text-[#6B5244] mt-1 leading-snug">
                {LEVEL_CONTEXT[selection.level]}
              </p>
            </div>
            <button onClick={onClose} className="text-[#6B5244] hover:text-[#6B0F1A] text-lg leading-none mt-0.5 ml-4 flex-shrink-0" aria-label="Close">×</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Size</p>
            <p className="text-[#2C1810] text-sm">{selection.hectares} hectares</p>
          </div>

          {cruApp?.grapes && (
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Grapes</p>
              <p className="text-[#2C1810] text-sm">
                {[...(cruApp.grapes.red || []), ...(cruApp.grapes.white || [])].join(', ')}
              </p>
            </div>
          )}

          {cruApp?.style && (
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Style</p>
              <p className="text-[#2C1810] text-sm leading-relaxed italic">{cruApp.style}</p>
            </div>
          )}

          {cruApp?.terroir && (
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Terroir</p>
              <p className="text-[#2C1810] text-sm leading-relaxed">{cruApp.terroir}</p>
            </div>
          )}

          {cruApp?.facts?.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-2">Key Facts</p>
              <ul className="space-y-1.5">
                {cruApp.facts.map((f, i) => (
                  <li key={i} className="flex gap-2 text-sm text-[#2C1810]">
                    <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {cruApp?.keyProducers?.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-2">Key Producers</p>
              <ul className="space-y-1">
                {cruApp.keyProducers.map(name => (
                  <li key={name} className="text-sm text-[#2C1810] flex gap-2">
                    <span className="text-[#C9A84C]">·</span> {name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!cruApp && (
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Classification</p>
              <p className="text-[#2C1810] text-sm">
                {selection.level === 'grand-cru'
                  ? "Burgundy's highest classification — wines may omit the village name entirely."
                  : 'One step below Grand Cru. The village name must precede the climat name on the label.'}
              </p>
            </div>
          )}

          <VintageStrip regionId={selection.regionId} />
          <NotesField id={selection.id} />
        </div>
        <Footer />
      </div>
    )
  }

  // Region / Village card
  return (
    <div className="h-full flex flex-col">
      <div className="px-6 py-5 border-b border-[#D4C5A9]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#4A2A1A] text-xs font-medium tracking-[0.3em] uppercase mb-1">
              {type === 'region' ? 'Region' : selection.level || 'Village'}
            </p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-xl font-bold text-[#6B0F1A] leading-tight"
            >
              {selection.name}
            </h2>
            <p className="text-sm text-[#6B5244] mt-1 leading-snug">
              {LEVEL_CONTEXT[type === 'region' ? 'region' : 'village']}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#6B5244] hover:text-[#6B0F1A] text-lg leading-none mt-0.5 ml-4 flex-shrink-0"
            aria-label="Close"
          >
            ×
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
        {(selection.grapes || appellation?.grapes) && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Grapes</p>
            <p className="text-[#2C1810] text-sm">
              {typeof selection.grapes === 'string'
                ? selection.grapes
                : [...(appellation?.grapes?.red || []), ...(appellation?.grapes?.white || [])].join(', ')}
            </p>
          </div>
        )}

        {(selection.style || appellation?.style) && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Style</p>
            <p className="text-[#2C1810] text-sm leading-relaxed italic">
              {appellation?.style || selection.style}
            </p>
          </div>
        )}

        {type !== 'region' && appellation?.terroir && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Terroir</p>
            <p className="text-[#2C1810] text-sm leading-relaxed">{appellation.terroir}</p>
          </div>
        )}

        {type === 'region' && selection.summary && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">About</p>
            <p className="text-[#2C1810] text-sm leading-relaxed">{selection.summary}</p>
          </div>
        )}

        {appellation?.agingRules && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-1">Aging Rules</p>
            <p className="text-[#2C1810] text-sm">{appellation.agingRules}</p>
          </div>
        )}

        {appellation?.facts?.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-2">Key Facts</p>
            <ul className="space-y-1.5">
              {appellation.facts.map((f, i) => (
                <li key={i} className="flex gap-2 text-sm text-[#2C1810]">
                  <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {relatedProducers.length > 0 && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-2">
              {type === 'region' ? 'Notable Producers' : 'Key Producers'}
            </p>
            <ul className="space-y-1.5">
              {relatedProducers.map(p => (
                <li key={p.id}>
                  <Link
                    to={`/producers/${p.id}`}
                    className="text-sm text-[#6B0F1A] hover:underline"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {appellation?.keyProducers?.length > 0 && relatedProducers.length === 0 && (
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#6B5244] mb-2">Key Producers</p>
            <ul className="space-y-1">
              {appellation.keyProducers.map(name => (
                <li key={name} className="text-sm text-[#2C1810] flex gap-2">
                  <span className="text-[#C9A84C]">·</span> {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <VintageStrip regionId={type === 'region' ? selection.id : selection.regionId} />
        <NotesField id={selection.id} />
      </div>

      <Footer />
    </div>
  )
}
