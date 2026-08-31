const TIERS = [
  {
    level: 'Grand Cru',
    color: '#C9A84C',
    textColor: '#2C1810',
    production: '~1.5%',
    count: '33 appellations',
    description:
      'The pinnacle of Burgundy. Grand Cru status was determined historically by soil quality, slope position, and centuries of reputation. These are the finest individual vineyard plots (called climats) in the region — predominantly mid-slope, with optimal drainage, sun exposure, and limestone-clay soil ratios.',
    labelNote:
      'The climat name alone. No village name appears — the vineyard speaks for itself.',
    labelLines: ['CHAMBERTIN'],
    labelSub: 'Grand Cru de Bourgogne',
    examples: ['Chambertin', 'Musigny', 'Clos Vougeot', 'Montrachet', 'Corton-Charlemagne', 'Romanée-Conti'],
    insight:
      'A Grand Cru label shows only the vineyard name. If you see a single name with no village qualifier, you are at the top of the hierarchy.',
  },
  {
    level: 'Premier Cru',
    color: '#A8A8A8',
    textColor: '#2C1810',
    production: '~10%',
    count: '~640 named climats',
    description:
      'Individually mapped and legally defined vineyard plots one step below Grand Cru. There are hundreds of Premier Cru climats across Burgundy. A wine may come from a single named climat or from a blend of several premiers crus within the same village.',
    labelNote:
      'Village name first, then the climat name. If blended from multiple premiers crus, the label reads "Premier Cru" after the village name without naming a specific climat.',
    labelLines: ['GEVREY-CHAMBERTIN', 'Les Cazetiers'],
    labelSub: '1er Cru · Appellation Contrôlée',
    examples: ['Les Cazetiers', 'Clos Saint-Jacques', 'Les Amoureuses', 'Perrières', 'Vaillons'],
    insight:
      'Two names on the label — village name, then a second word or phrase — and the second is the climat. This is the tell for a Premier Cru.',
  },
  {
    level: 'Village',
    color: '#8B2F3A',
    textColor: '#F5F0E8',
    production: '~36%',
    count: '~44 village appellations',
    description:
      "Wine from anywhere within a specific village's defined AOC boundary. The village name itself is the appellation. Quality can vary widely between producers and between plots — some village-level vineyards sit directly adjacent to Premier Crus.",
    labelNote: 'The village name only, nothing more.',
    labelLines: ['GEVREY-CHAMBERTIN'],
    labelSub: 'Appellation Gevrey-Chambertin Contrôlée',
    examples: ['Gevrey-Chambertin', 'Chambolle-Musigny', 'Pommard', 'Meursault', 'Chablis'],
    insight:
      'A village wine from a great producer whose vines adjoin a Premier Cru can outperform a Premier Cru from a mediocre one. Classification describes place, not quality of craft.',
  },
  {
    level: 'Régionale',
    color: '#5A4535',
    textColor: '#F5F0E8',
    production: '~53%',
    count: '23 regional appellations',
    description:
      "The broadest category. Grapes may come from anywhere within the defined Burgundy zone, sometimes spanning multiple sub-regions. This is the entry point to the region — wines simply labeled 'Bourgogne' fall here, as do sub-regional names like Bourgogne Hautes-Côtes de Nuits.",
    labelNote: 'A regional name, sometimes with a geographic qualifier.',
    labelLines: ['BOURGOGNE'],
    labelSub: 'Appellation Bourgogne Contrôlée',
    examples: ['Bourgogne', 'Bourgogne Hautes-Côtes de Nuits', 'Bourgogne Aligoté', 'Petit Chablis', 'Mâcon-Villages'],
    insight:
      'Regional wines are the most accessible entry into Burgundy. Many top producers make a Bourgogne from younger vines or declassified fruit — the same winemaking philosophy at a fraction of the price.',
  },
]

const REGIONAL_LEVELS = [
  { region: 'Côte de Nuits',     gc: '24',  pc: '~140 named climats', v: '11 villages' },
  { region: 'Côte de Beaune',    gc: '8',   pc: '~200 named climats', v: '16 villages' },
  { region: 'Chablis',           gc: '7',   pc: '~40 named climats',  v: '1' },
  { region: 'Côte Chalonnaise',  gc: '—',   pc: 'Some villages',      v: 'Several' },
  { region: 'Mâconnais',         gc: '—',   pc: '— †',                v: 'Several' },
]

export default function Classification() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Learn</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-2"
      >
        The Burgundy Classification
      </h1>
      <p className="text-sm text-[#6B5244] mb-8">
        Burgundy organises its wines into four quality levels based strictly on where the grapes grow — not who makes the wine. Understanding the hierarchy is the foundation for reading any Burgundy label.
      </p>

      <div className="h-px bg-[#D4C5A9] mb-8" />

      <p className="text-sm text-[#2C1810] leading-relaxed mb-10">
        Unlike Bordeaux's château rankings or a generic "reserve" label, Burgundy's classification is geographic.
        Each level corresponds to a legally defined set of vineyard plots with increasingly strict rules on
        permitted yields, minimum alcohol, and aging. The same Pinot Noir grape, planted in two adjacent plots
        100 metres apart, can produce wines at different classification levels. The classification describes
        the land, not the bottle.
      </p>

      {/* Pyramid */}
      <div className="mb-12">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-6"
        >
          The Four Levels
        </p>
        <div className="flex flex-col items-center gap-px mb-3">
          {[
            { label: 'Grand Cru',    width: '28%',  bg: '#C9A84C', text: '#2C1810', pct: '~1.5%' },
            { label: 'Premier Cru',  width: '50%',  bg: '#A8A8A8', text: '#2C1810', pct: '~10%' },
            { label: 'Village',      width: '72%',  bg: '#8B2F3A', text: '#F5F0E8', pct: '~36%' },
            { label: 'Régionale',    width: '100%', bg: '#5A4535', text: '#F5F0E8', pct: '~53%' },
          ].map(tier => (
            <div
              key={tier.label}
              style={{ width: tier.width, backgroundColor: tier.bg, color: tier.text }}
              className="flex justify-between items-center px-4 py-2.5"
            >
              <span style={{ fontFamily: "'Playfair Display', Georgia, serif" }} className="text-sm font-bold">
                {tier.label}
              </span>
              <span className="text-xs opacity-75">{tier.pct} of production</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-[#B8A898] text-center tracking-wide">
          Width reflects share of total Burgundy production · Prestige increases upward
        </p>
      </div>

      {/* Tier detail sections */}
      {TIERS.map((tier, i) => (
        <div key={tier.level}>
          <div className="mb-10">
            {/* Level header */}
            <div className="flex items-baseline gap-3 mb-4">
              <div style={{ backgroundColor: tier.color }} className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
              <p
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                className="text-xl font-bold text-[#6B0F1A]"
              >
                {tier.level}
              </p>
              <p className="text-xs text-[#6B5244] tracking-wide">
                {tier.production} of production &nbsp;·&nbsp; {tier.count}
              </p>
            </div>

            <p className="text-sm text-[#2C1810] leading-relaxed mb-5">{tier.description}</p>

            {/* Label example */}
            <div className="border border-[#D4C5A9] bg-white/50 p-5 mb-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-1">Reading the label</p>
              <p className="text-sm text-[#6B5244] mb-4 leading-relaxed">{tier.labelNote}</p>
              <div className="border border-[#D4C5A9] p-5 text-center bg-[#FDFAF5] inline-block">
                {tier.labelLines.map((line, j) => (
                  <p
                    key={j}
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    className={`text-[#2C1810] tracking-[0.2em] ${j === 0 ? 'text-base font-bold' : 'text-sm font-medium'}`}
                  >
                    {line}
                  </p>
                ))}
                <p className="text-[9px] text-[#6B5244] tracking-widest mt-2 uppercase">{tier.labelSub}</p>
              </div>
            </div>

            {/* Examples */}
            <div className="mb-5">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">Examples</p>
              <div className="flex flex-wrap gap-2">
                {tier.examples.map(ex => (
                  <span key={ex} className="text-xs text-[#2C1810] border border-[#D4C5A9] px-3 py-1 bg-white/40">
                    {ex}
                  </span>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div className="flex gap-3">
              <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">✦</span>
              <p className="text-sm text-[#6B5244] italic leading-relaxed">{tier.insight}</p>
            </div>
          </div>
          {i < TIERS.length - 1 && <div className="h-px bg-[#D4C5A9] mb-10" />}
        </div>
      ))}

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* Regional variation */}
      <div className="mb-10">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-2"
        >
          Not Every Region Has Every Level
        </p>
        <p className="text-sm text-[#6B5244] mb-6 leading-relaxed">
          The full four-tier hierarchy exists only in the Côte d'Or. Other regions have a simpler structure,
          which partly explains their more accessible prices.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse min-w-[420px]">
            <thead>
              <tr className="border-b border-[#D4C5A9]">
                <th className="text-left py-2 pr-6 text-xs tracking-widest uppercase text-[#6B5244] font-medium">Region</th>
                <th className="text-center py-2 px-4 text-xs tracking-widest uppercase text-[#6B5244] font-medium">Grand Cru</th>
                <th className="text-center py-2 px-4 text-xs tracking-widest uppercase text-[#6B5244] font-medium">Premier Cru</th>
                <th className="text-center py-2 px-4 text-xs tracking-widest uppercase text-[#6B5244] font-medium">Village</th>
              </tr>
            </thead>
            <tbody>
              {REGIONAL_LEVELS.map(row => (
                <tr key={row.region} className="border-b border-[#EDE6D6]">
                  <td className="py-2.5 pr-6 font-medium text-[#2C1810]">{row.region}</td>
                  <td className="py-2.5 px-4 text-center text-[#6B5244]">{row.gc}</td>
                  <td className="py-2.5 px-4 text-center text-[#6B5244]">{row.pc}</td>
                  <td className="py-2.5 px-4 text-center text-[#6B5244]">{row.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-[#B8A898] mt-2 italic">
            † Pouilly-Fuissé in the Mâconnais received its first Premier Crus in 2020.
          </p>
        </div>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* Key takeaways */}
      <div>
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-5"
        >
          Key Takeaways
        </p>
        <ul className="space-y-4">
          {[
            'The classification describes geography, not quality of winemaking. A Grand Cru from a careless producer can be outclassed by a Village wine made by someone meticulous.',
            'Within any village appellation, individual plots vary enormously. The best plots were elevated to Premier Cru; the best premiers crus eventually became Grand Crus.',
            "When only a vineyard name appears on the label — no village, no qualifier — it's a Grand Cru. The name is sufficient.",
            'Regional wines (Bourgogne, Mâcon-Villages) are often made by the same producers as the Grand Crus, from the same grapes, with the same care. They exist because the vines are younger or the plot is outside the classified boundary.',
          ].map((point, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#2C1810] leading-relaxed">
              <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">✦</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
