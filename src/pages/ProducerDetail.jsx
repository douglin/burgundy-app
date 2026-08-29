import { Link, useParams } from 'react-router-dom'
import producers from '../data/producers.json'

export default function ProducerDetail() {
  const { id } = useParams()
  const producer = producers.find((p) => p.id === id)

  if (!producer) {
    return (
      <div className="max-w-xl mx-auto px-6 py-20 text-center text-[#6B5244]">
        Producer not found.{' '}
        <Link to="/producers" className="text-[#6B0F1A] underline">Back to producers</Link>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <Link
        to="/producers"
        className="text-xs tracking-widest uppercase text-[#6B5244] hover:text-[#6B0F1A] mb-6 inline-block"
      >
        ← Producers
      </Link>

      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1 capitalize">
        {producer.village?.replace(/-/g, ' ')} · Est. {producer.founded}
      </p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-6"
      >
        {producer.name}
      </h1>

      <div className="h-px bg-[#D4C5A9] mb-6" />

      <p className="text-[#2C1810] leading-relaxed mb-8">{producer.style}</p>

      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-[#6B5244] mb-3">Key Wines</p>
        <ul className="space-y-2">
          {producer.keyWines.map((wine) => (
            <li
              key={wine}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="flex items-center gap-3 text-[#2C1810]"
            >
              <span className="text-[#C9A84C]">✦</span>
              {wine}
            </li>
          ))}
        </ul>
      </div>

      <Link
        to="/log/new"
        className="inline-block border border-[#6B0F1A] text-[#6B0F1A] px-6 py-2.5 text-xs tracking-widest uppercase hover:bg-[#6B0F1A] hover:text-[#F5F0E8] transition-colors"
      >
        Log a tasting
      </Link>
    </div>
  )
}
