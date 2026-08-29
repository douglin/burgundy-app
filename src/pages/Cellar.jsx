import { Link } from 'react-router-dom'
import appellations from '../data/appellations.json'
import { useLog } from '../hooks/useLog'

const apMap = Object.fromEntries(appellations.map(a => [a.id, a.name]))

export default function Cellar() {
  const { entries } = useLog()
  const now = new Date().getFullYear()

  const cellarEntries = entries.filter((e) => e.cellar?.bottlesOwned > 0)

  function status(entry) {
    const { drinkFrom, drinkBy } = entry.cellar
    if (!drinkFrom || !drinkBy) return 'unknown'
    if (now < drinkFrom) return 'not-ready'
    if (now > drinkBy) return 'past'
    return 'ready'
  }

  const totalBottles = cellarEntries.reduce((sum, e) => sum + e.cellar.bottlesOwned, 0)
  const readyNow = cellarEntries.filter((e) => status(e) === 'ready').length

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Inventory</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-2"
      >
        Cellar
      </h1>
      <p className="text-[#6B5244] text-sm mb-8">
        {totalBottles} bottles &nbsp;·&nbsp; {readyNow} ready to drink now
      </p>

      <div className="h-px bg-[#D4C5A9] mb-8" />

      {cellarEntries.length === 0 ? (
        <div className="text-center py-20 text-[#6B5244]">
          <p className="text-2xl mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Cellar is empty
          </p>
          <p className="text-sm mb-6">Log a tasting and add bottle counts to fill your cellar.</p>
          <Link
            to="/log/new"
            className="border border-[#6B0F1A] text-[#6B0F1A] px-6 py-2 text-xs tracking-widest uppercase hover:bg-[#6B0F1A] hover:text-[#F5F0E8] transition-colors"
          >
            Log a tasting
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {cellarEntries.map((entry) => {
            const s = status(entry)
            const { drinkFrom, drinkBy, bottlesOwned } = entry.cellar
            const progress =
              drinkFrom && drinkBy
                ? Math.max(0, Math.min(100, ((now - drinkFrom) / (drinkBy - drinkFrom)) * 100))
                : 0

            const barColor = {
              'not-ready': 'bg-[#D4C5A9]',
              ready: 'bg-[#6B0F1A]',
              past: 'bg-red-400',
              unknown: 'bg-[#D4C5A9]',
            }

            const badge = {
              'not-ready': { cls: 'text-[#6B5244] border-[#D4C5A9]', label: `From ${drinkFrom}` },
              ready: { cls: 'text-green-800 border-green-300', label: 'Ready now' },
              past: { cls: 'text-red-700 border-red-200', label: 'Past peak' },
              unknown: { cls: 'text-[#6B5244] border-[#D4C5A9]', label: 'No window set' },
            }

            return (
              <li key={entry.id} className="bg-[#FDFAF5] border border-[#D4C5A9] px-6 py-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <Link
                      to={`/log/${entry.id}`}
                      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                      className="font-semibold text-[#2C1810] hover:text-[#6B0F1A] transition-colors"
                    >
                      {apMap[entry.appellationId] ?? entry.appellationId} {entry.vintage}
                    </Link>
                    <p className="text-sm text-[#6B5244]">{entry.producer}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#6B0F1A]">{bottlesOwned} btl</p>
                    <span className={`text-xs border px-2 py-0.5 ${badge[s].cls}`}>
                      {badge[s].label}
                    </span>
                  </div>
                </div>

                {drinkFrom && drinkBy && (
                  <div>
                    <div className="flex justify-between text-xs text-[#C9A84C] mb-1">
                      <span>{drinkFrom}</span><span>{drinkBy}</span>
                    </div>
                    <div className="h-1.5 bg-[#EDE6D6] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${barColor[s]}`}
                        style={{ width: `${Math.max(2, progress)}%` }}
                      />
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
