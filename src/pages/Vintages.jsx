import { useState } from 'react'
import vintageData from '../data/vintages.json'

const years = Object.keys(vintageData.years).sort((a, b) => b - a)
const regions = vintageData.regions

function cellStyle(score) {
  const styles = [
    '',
    { bg: '#F5D0D0', text: '#7B1D1D' },
    { bg: '#F5E4C0', text: '#7B5A1D' },
    { bg: '#F5F0C0', text: '#5A5A1D' },
    { bg: '#D4EAC0', text: '#2A5A1D' },
    { bg: '#B8D9A0', text: '#1A4A0A' },
  ]
  return styles[score] || { bg: '#EDE6D6', text: '#6B5244' }
}

export default function Vintages() {
  const [tooltip, setTooltip] = useState(null)

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Reference</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-2"
      >
        Vintage Chart
      </h1>
      <p className="text-sm text-[#6B5244] mb-8">
        1 = poor &nbsp;·&nbsp; 3 = good &nbsp;·&nbsp; 5 = exceptional
      </p>

      <div className="h-px bg-[#D4C5A9] mb-8" />

      <p className="sm:hidden text-xs text-[#C9A84C] mb-3 tracking-wide">← Scroll to see all regions →</p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[480px]">
          <thead>
            <tr>
              <th className="text-left pr-6 py-3 text-xs tracking-widest uppercase text-[#6B5244] font-medium">
                Year
              </th>
              {regions.map((r) => (
                <th
                  key={r.id}
                  className="px-4 py-3 text-xs tracking-wider uppercase text-[#6B5244] font-medium text-center whitespace-nowrap"
                >
                  {r.label}
                </th>
              ))}
            </tr>
            <tr>
              <td colSpan={regions.length + 1}>
                <div className="h-px bg-[#D4C5A9] mb-2" />
              </td>
            </tr>
          </thead>
          <tbody>
            {years.map((year) => (
              <tr key={year}>
                <td
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="pr-6 py-2 font-semibold text-[#2C1810]"
                >
                  {year}
                </td>
                {regions.map((r) => {
                  const score = vintageData.years[year]?.[r.id]
                  const style = cellStyle(score)
                  return (
                    <td
                      key={r.id}
                      className="px-4 py-2 text-center font-bold cursor-pointer transition-opacity hover:opacity-80"
                      style={{ backgroundColor: style.bg, color: style.text }}
                      onMouseEnter={() =>
                        setTooltip({ year, region: r.label, note: vintageData.years[year]?.note })
                      }
                      onMouseLeave={() => setTooltip(null)}
                    >
                      {score ?? '–'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tooltip && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#2C1810] text-[#F5F0E8] text-sm px-5 py-3 max-w-sm text-center pointer-events-none shadow-lg">
          <p
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="font-semibold text-[#C9A84C] mb-1"
          >
            {tooltip.year} · {tooltip.region}
          </p>
          {tooltip.note && <p className="text-[#EDE6D6] text-xs leading-relaxed">{tooltip.note}</p>}
        </div>
      )}
    </div>
  )
}
