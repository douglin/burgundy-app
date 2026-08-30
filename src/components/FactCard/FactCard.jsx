import { Link } from 'react-router-dom'
import appellations from '../../data/appellations.json'
import producers from '../../data/producers.json'

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

  // Cru card — simple focused display
  if (type === 'cru') {
    return (
      <div className="h-full flex flex-col">
        <div className="px-6 py-5 border-b border-[#D4C5A9]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-1">
                {selection.level === 'grand-cru' ? 'Grand Cru' : 'Premier Cru'}
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-xl font-bold text-[#6B0F1A] leading-tight"
              >
                {selection.name}
              </h2>
            </div>
            <button onClick={onClose} className="text-[#6B5244] hover:text-[#6B0F1A] text-lg leading-none mt-0.5 ml-4 flex-shrink-0" aria-label="Close">×</button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Size</p>
            <p className="text-[#2C1810] text-sm">{selection.hectares} hectares</p>
          </div>
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Classification</p>
            <p className="text-[#2C1810] text-sm">
              {selection.level === 'grand-cru'
                ? 'Burgundy\'s highest classification — wines may omit the village name entirely.'
                : 'One step below Grand Cru. The village name must precede the climat name on the label.'}
            </p>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-[#D4C5A9]">
          <Link
            to={`/log/new`}
            className="block w-full text-center border border-[#6B0F1A] text-[#6B0F1A] px-4 py-2 text-[10px] tracking-widest uppercase hover:bg-[#6B0F1A] hover:text-[#F5F0E8] transition-colors"
          >
            Log a Tasting
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-[#D4C5A9]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-1">
              {type === 'region' ? 'Region' : selection.level || 'Village'}
            </p>
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-xl font-bold text-[#6B0F1A] leading-tight"
            >
              {selection.name}
            </h2>
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

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* Grapes */}
        {(selection.grapes || appellation?.grapes) && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Grapes</p>
            <p className="text-[#2C1810] text-sm">
              {typeof selection.grapes === 'string'
                ? selection.grapes
                : [...(appellation?.grapes?.red || []), ...(appellation?.grapes?.white || [])].join(', ')}
            </p>
          </div>
        )}

        {/* Style */}
        {(selection.style || appellation?.style) && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Style</p>
            <p className="text-[#2C1810] text-sm leading-relaxed italic">
              {appellation?.style || selection.style}
            </p>
          </div>
        )}

        {/* Summary (region level) */}
        {type === 'region' && selection.summary && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">About</p>
            <p className="text-[#2C1810] text-sm leading-relaxed">
              {selection.summary}
            </p>
          </div>
        )}

        {/* Aging rules */}
        {appellation?.agingRules && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Aging Rules</p>
            <p className="text-[#2C1810] text-sm">{appellation.agingRules}</p>
          </div>
        )}

        {/* Facts */}
        {appellation?.facts?.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">Key Facts</p>
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

        {/* Related producers */}
        {relatedProducers.length > 0 && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">
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

        {/* Key producers list (from appellation data, text only) */}
        {appellation?.keyProducers?.length > 0 && relatedProducers.length === 0 && (
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">Key Producers</p>
            <ul className="space-y-1">
              {appellation.keyProducers.map(name => (
                <li key={name} className="text-sm text-[#2C1810] flex gap-2">
                  <span className="text-[#C9A84C]">·</span> {name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="px-6 py-4 border-t border-[#D4C5A9]">
        <Link
          to={`/log/new${appellation ? `?appellation=${appellation.id}` : ''}`}
          className="block w-full text-center border border-[#6B0F1A] text-[#6B0F1A] px-4 py-2 text-[10px] tracking-widest uppercase hover:bg-[#6B0F1A] hover:text-[#F5F0E8] transition-colors"
        >
          Log a Tasting
        </Link>
      </div>
    </div>
  )
}
