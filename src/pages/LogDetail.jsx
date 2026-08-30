import { Link, useNavigate, useParams } from 'react-router-dom'
import appellations from '../data/appellations.json'
import { useLog } from '../hooks/useLog'

const apMap = Object.fromEntries(appellations.map(a => [a.id, a.name]))

export default function LogDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { entries, deleteEntry } = useLog()
  const entry = entries.find((e) => e.id === id)

  if (!entry) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center text-[#6B5244]">
        Entry not found.{' '}
        <Link to="/log" className="text-[#6B0F1A] underline">Back to log</Link>
      </div>
    )
  }

  function handleDelete() {
    if (confirm('Delete this tasting entry?')) {
      deleteEntry(id)
      navigate('/log')
    }
  }

  const now = new Date().getFullYear()
  const { drinkFrom, drinkBy } = entry.cellar || {}
  const windowStatus =
    drinkFrom && drinkBy
      ? now < drinkFrom ? 'not-ready' : now > drinkBy ? 'past' : 'ready'
      : null

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <Link to="/log" className="text-xs tracking-widest uppercase text-[#6B5244] hover:text-[#6B0F1A] mb-6 inline-block">
        ← Tasting Log
      </Link>

      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">{entry.dateTasted}</p>
          <h1
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-3xl font-bold text-[#6B0F1A]"
          >
            {apMap[entry.appellationId] ?? entry.appellationId} {entry.vintage}
          </h1>
          <p className="text-[#6B5244] mt-1">{entry.producer}</p>
        </div>
        <div className="text-right">
          <span
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-5xl font-bold text-[#6B0F1A]"
          >
            {entry.score}
          </span>
          <span className="text-[#6B5244] text-lg">/10</span>
        </div>
      </div>

      <div className="h-px bg-[#D4C5A9] my-6" />

      {entry.photoPath && (
        <img
          src={entry.photoPath}
          alt="Wine label"
          className="w-full max-h-72 object-contain border border-[#D4C5A9] mb-6"
        />
      )}

      {entry.notes && (
        <div className="mb-6">
          <p className="text-xs tracking-widest uppercase text-[#6B5244] mb-2">Tasting Notes</p>
          <p className="text-[#2C1810] leading-relaxed italic">{entry.notes}</p>
        </div>
      )}

      {entry.cellar?.bottlesOwned > 0 && (
        <div className="border border-[#D4C5A9] p-5 mb-6">
          <p className="text-xs tracking-widest uppercase text-[#6B5244] mb-3">Cellar</p>
          <p className="text-[#2C1810]">
            {entry.cellar.bottlesOwned} bottle{entry.cellar.bottlesOwned !== 1 ? 's' : ''}
          </p>
          {drinkFrom && drinkBy && (
            <>
              <p className="text-sm text-[#6B5244]">Drink {drinkFrom}–{drinkBy}</p>
              <span className={`mt-3 inline-block text-xs px-3 py-1 tracking-wide ${
                windowStatus === 'ready' ? 'bg-green-50 text-green-800 border border-green-200' :
                windowStatus === 'not-ready' ? 'bg-[#F5F0E8] text-[#6B5244] border border-[#D4C5A9]' :
                'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {windowStatus === 'not-ready' && `Not ready — from ${drinkFrom}`}
                {windowStatus === 'ready' && 'In drinking window'}
                {windowStatus === 'past' && 'Past peak — drink now'}
              </span>
            </>
          )}
        </div>
      )}

      <div className="flex items-center gap-6">
        <Link
          to={`/log/${id}/edit`}
          className="text-xs tracking-widest uppercase text-[#6B5244] hover:text-[#6B0F1A] transition-colors border border-[#D4C5A9] px-4 py-2 hover:border-[#6B0F1A]"
        >
          Edit entry
        </Link>
        <button
          onClick={handleDelete}
          className="text-xs tracking-widest uppercase text-[#6B5244] hover:text-red-700 transition-colors"
        >
          Delete entry
        </button>
      </div>
    </div>
  )
}
