import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import appellations from '../data/appellations.json'
import { useLog } from '../hooks/useLog'

const apMap = Object.fromEntries(appellations.map(a => [a.id, a.name]))

const SORTS = [
  { key: 'date', label: 'Date' },
  { key: 'score', label: 'Score' },
  { key: 'appellation', label: 'Appellation' },
  { key: 'vintage', label: 'Vintage' },
]

export default function Log() {
  const { entries } = useLog()
  const [sort, setSort] = useState('date')
  const [dir, setDir] = useState('desc')

  function toggleSort(key) {
    if (sort === key) setDir(d => (d === 'desc' ? 'asc' : 'desc'))
    else { setSort(key); setDir('desc') }
  }

  const sorted = useMemo(() => {
    return [...entries].sort((a, b) => {
      let av, bv
      if (sort === 'date') { av = a.dateTasted; bv = b.dateTasted }
      else if (sort === 'score') { av = a.score; bv = b.score }
      else if (sort === 'appellation') { av = apMap[a.appellationId] ?? a.appellationId; bv = apMap[b.appellationId] ?? b.appellationId }
      else if (sort === 'vintage') { av = a.vintage; bv = b.vintage }
      if (av < bv) return dir === 'asc' ? -1 : 1
      if (av > bv) return dir === 'asc' ? 1 : -1
      return 0
    })
  }, [entries, sort, dir])

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">
            Personal record
          </p>
          <h1
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl font-bold text-[#6B0F1A]"
          >
            Tasting Log
          </h1>
        </div>
        <Link
          to="/log/new"
          className="bg-[#6B0F1A] text-[#F5F0E8] px-5 py-2 text-xs tracking-widest uppercase hover:bg-[#4A0A12] transition-colors"
        >
          + New Entry
        </Link>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-6" />

      {entries.length === 0 ? (
        <div className="text-center py-20 text-[#6B5244]">
          <p className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            No tastings yet
          </p>
          <p className="text-sm mb-6">Begin recording your journey through Burgundy.</p>
          <Link
            to="/log/new"
            className="border border-[#6B0F1A] text-[#6B0F1A] px-6 py-2 text-xs tracking-widest uppercase hover:bg-[#6B0F1A] hover:text-[#F5F0E8] transition-colors"
          >
            Log your first tasting
          </Link>
        </div>
      ) : (
        <>
          {/* Sort controls */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs tracking-widest uppercase text-[#6B5244] mr-2">Sort:</span>
            {SORTS.map(s => (
              <button
                key={s.key}
                onClick={() => toggleSort(s.key)}
                className={`px-3 py-1 text-xs tracking-widest uppercase border transition-colors ${
                  sort === s.key
                    ? 'bg-[#6B0F1A] text-[#F5F0E8] border-[#6B0F1A]'
                    : 'border-[#D4C5A9] text-[#6B5244] hover:border-[#6B0F1A]'
                }`}
              >
                {s.label}
                {sort === s.key && (
                  <span className="ml-1">{dir === 'desc' ? '↓' : '↑'}</span>
                )}
              </button>
            ))}
          </div>

          <ul className="space-y-2">
            {sorted.map(entry => (
              <li key={entry.id}>
                <Link
                  to={`/log/${entry.id}`}
                  className="flex justify-between items-center bg-[#FDFAF5] border border-[#D4C5A9] px-6 py-4 hover:border-[#6B0F1A] transition-colors group"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    {entry.photoPath && (
                      <img
                        src={entry.photoPath}
                        alt=""
                        className="w-10 h-10 object-cover border border-[#D4C5A9] flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                        className="font-semibold text-[#2C1810] group-hover:text-[#6B0F1A] transition-colors truncate"
                      >
                        {apMap[entry.appellationId] ?? entry.appellationId} {entry.vintage}
                      </p>
                      <p className="text-sm text-[#6B5244] truncate">{entry.producer}</p>
                      <p className="text-xs text-[#C9A84C] mt-0.5 tracking-wide">
                        {entry.dateTasted}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="text-2xl font-bold text-[#6B0F1A]"
                    >
                      {entry.score}
                    </span>
                    <span className="text-sm text-[#6B5244]">/10</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-xs text-[#C9A84C] text-center mt-6">
            {entries.length} tasting{entries.length !== 1 ? 's' : ''} recorded
          </p>
        </>
      )}
    </div>
  )
}
