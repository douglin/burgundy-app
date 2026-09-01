import { useState } from 'react'
import { Link } from 'react-router-dom'
import producers from '../data/producers.json'

export default function Producers() {
  const [filter, setFilter] = useState('')
  const regions = [...new Set(producers.map((p) => p.regionId))]
  const filtered = filter ? producers.filter((p) => p.regionId === filter) : producers

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-[#4A2A1A] text-xs tracking-[0.3em] uppercase mb-1">Estates</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-6"
      >
        Producers
      </h1>

      <div className="h-px bg-[#D4C5A9] mb-6" />

      <div className="flex gap-2 mb-8 flex-wrap">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors ${
            filter === '' ? 'bg-[#6B0F1A] text-[#F5F0E8] border-[#6B0F1A]' : 'border-[#D4C5A9] text-[#6B5244] hover:border-[#6B0F1A] hover:text-[#6B0F1A]'
          }`}
        >
          All
        </button>
        {regions.map((r) => (
          <button
            key={r}
            onClick={() => setFilter(r)}
            className={`px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors capitalize ${
              filter === r ? 'bg-[#6B0F1A] text-[#F5F0E8] border-[#6B0F1A]' : 'border-[#D4C5A9] text-[#6B5244] hover:border-[#6B0F1A] hover:text-[#6B0F1A]'
            }`}
          >
            {r.replace(/-/g, ' ')}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <li key={p.id}>
            <Link
              to={`/producers/${p.id}`}
              className="block bg-[#FDFAF5] border border-[#D4C5A9] px-5 py-5 hover:border-[#6B0F1A] transition-colors h-full"
            >
              <p
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="font-semibold text-[#2C1810] mb-0.5"
              >
                {p.name}
              </p>
              <p className="text-xs tracking-wide text-[#4A2A1A] mb-3 capitalize">
                {p.village?.replace(/-/g, ' ')} · Est. {p.founded}
              </p>
              <p className="text-sm text-[#6B5244] leading-relaxed line-clamp-2">{p.style}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
