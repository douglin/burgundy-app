import { Link } from 'react-router-dom'

const TOPICS = [
  {
    to: '/learn/classification',
    eyebrow: 'Foundation',
    title: 'The Classification System',
    desc: 'How Burgundy divides its wines into four levels — Grand Cru, Premier Cru, Village, and Régionale — and what each level means on the label.',
    detail: 'The key to reading any Burgundy label.',
  },
  {
    to: '/learn/terroir',
    eyebrow: 'Concept',
    title: 'Terroir',
    desc: "Why two wines from the same grape taste so different depending on where the vines grow. Covers the Côte d'Or slope, soil types, the difference between Côte de Nuits and Côte de Beaune, and why Chablis is unlike anything else.",
    detail: 'The organizing principle behind the whole classification.',
  },
  {
    to: '/learn/quiz',
    eyebrow: 'Practice',
    title: 'Quiz',
    desc: 'Test your knowledge of Burgundy geography, producers, grape varieties, and vintages with a 10-question session drawn from a curated question bank.',
    detail: 'See what you know — and what to revisit on the map.',
  },
]

export default function Learn() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p className="text-[#4A2A1A] text-xs tracking-[0.3em] uppercase mb-1">Reference</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-2"
      >
        Learn
      </h1>
      <p className="text-sm text-[#6B5244] mb-8">
        Core concepts for understanding Burgundy wine.
      </p>

      <div className="h-px bg-[#D4C5A9] mb-8" />

      <div className="space-y-4">
        {TOPICS.map(topic => (
          <Link
            key={topic.to}
            to={topic.to}
            className="block border border-[#D4C5A9] bg-white/50 hover:bg-white/80 transition-colors group"
          >
            <div className="px-6 py-5">
              <p className="text-[#4A2A1A] text-[10px] tracking-[0.3em] uppercase mb-1">{topic.eyebrow}</p>
              <p
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-xl font-bold text-[#6B0F1A] mb-2 group-hover:underline"
              >
                {topic.title}
              </p>
              <p className="text-sm text-[#6B5244] leading-relaxed mb-3">{topic.desc}</p>
              <p className="text-xs text-[#4A2A1A] tracking-wide italic">{topic.detail}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
