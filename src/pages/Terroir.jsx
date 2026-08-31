const SLOPE_ZONES = [
  {
    zone: 'Hilltop & Forest',
    bg: '#4A5A3A',
    text: '#EDE6D6',
    desc: 'Too cold and exposed. Thin soil over bare rock. No AOC designation.',
  },
  {
    zone: 'Grand Cru Zone',
    bg: '#C9A84C',
    text: '#2C1810',
    desc: 'Mid-slope. Optimal sun exposure, natural drainage, and the deepest limestone-clay soil. Where the greatest wines grow.',
    highlight: true,
  },
  {
    zone: 'Premier Cru & Village',
    bg: '#8B2F3A',
    text: '#F5F0E8',
    desc: 'Lower mid-slope and upper valley. More clay, slightly cooler air. Good wines, but the terroir advantage diminishes.',
  },
  {
    zone: 'Valley Floor',
    bg: '#5A4535',
    text: '#F5F0E8',
    desc: 'Heavy clay, poor drainage, frost pockets. Mainly regional appellations.',
  },
]

const REGIONS_COMPARE = [
  {
    name: 'Côte de Nuits',
    color: '#6B0F1A',
    soil: 'Harder limestone, thinner topsoil',
    climate: 'Cooler, more continental',
    grape: 'Almost exclusively Pinot Noir',
    style: 'Structured, firm, long-lived. Deep colour, dark fruit, earthy notes. The great CdN reds age for decades.',
    grandCrus: 24,
    note: 'Home to Burgundy\'s most famous red Grand Crus — Chambertin, Musigny, Romanée-Conti.',
  },
  {
    name: 'Côte de Beaune',
    color: '#8B1D2E',
    soil: 'More marl (limestone + clay mix), deeper topsoil',
    climate: 'Slightly warmer, more varied exposures',
    grape: 'Both Pinot Noir and Chardonnay',
    style: 'Reds are rounder and more approachable. Whites (Meursault, Puligny, Chassagne) are the world standard for Chardonnay.',
    grandCrus: 8,
    note: 'The only region where Chardonnay reaches Grand Cru level — Montrachet, Corton-Charlemagne.',
  },
]

export default function Terroir() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Learn</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-2"
      >
        Terroir
      </h1>
      <p className="text-sm text-[#6B5244] mb-8">
        The French concept that explains why two wines made from the same grape, by the same producer, in the same vintage, can taste completely different — because the land they come from is different.
      </p>

      <div className="h-px bg-[#D4C5A9] mb-8" />

      {/* What is terroir */}
      <div className="mb-10">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-4"
        >
          What Is Terroir?
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed mb-4">
          Terroir (tair-WAHR) is the combination of soil, subsoil, slope, orientation to the sun, drainage,
          and microclimate that shapes a wine's character. In Burgundy, terroir is the organizing principle
          of the entire classification system: the better and more distinct the terroir, the higher the
          appellation. A Grand Cru isn't classified as such because someone decided it was prestigious —
          it's classified because, over centuries, wines from that specific plot consistently outperformed
          their neighbours.
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed">
          Burgundy is the world's clearest argument for terroir because the same two grapes —
          Pinot Noir and Chardonnay — are used almost everywhere. The only variable between a
          village wine and a Grand Cru is where the vines grow. That makes the differences you
          taste directly attributable to the land.
        </p>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* The Côte d'Or slope */}
      <div className="mb-10">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-2"
        >
          The Côte d'Or: A 50km Slope
        </p>
        <p className="text-sm text-[#6B5244] mb-5 leading-relaxed">
          Côte d'Or means "golden slope." It's a limestone escarpment running north-south for about 50km.
          The magic of the Côte d'Or is almost entirely about position on that slope.
        </p>

        {/* Slope diagram */}
        <div className="mb-5">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[#6B5244] mb-2">
            Cross-section of the slope — west to east
          </p>
          <div className="flex flex-col gap-px">
            {SLOPE_ZONES.map(zone => (
              <div
                key={zone.zone}
                style={{ backgroundColor: zone.bg, color: zone.text }}
                className={`px-5 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 ${
                  zone.highlight ? 'ring-1 ring-[#C9A84C] ring-inset' : ''
                }`}
              >
                <p
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="font-bold text-sm flex-shrink-0"
                >
                  {zone.zone}
                </p>
                <p className="text-xs opacity-80 sm:text-right sm:max-w-sm leading-relaxed">{zone.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-[#B8A898] mt-2 tracking-wide">
            ↑ Higher elevation west · Valley floor east ↓ &nbsp;·&nbsp; East-facing exposure catches morning sun
          </p>
        </div>

        <p className="text-sm text-[#2C1810] leading-relaxed mb-3">
          The Grand Cru zone captures the optimal position: far enough up the slope for good natural drainage,
          but low enough to have accumulated the deep, weathered limestone-clay soil that gives wine its
          complexity. Move 50 metres uphill and the soil is too thin; move 50 metres downhill and it's too
          heavy with clay, too cold from valley air, and waterlogged after rain.
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed">
          This is why a Grand Cru and a Village wine from the same commune can taste so different —
          they might be 200 metres apart, but one is on the optimal part of the slope and the other isn't.
        </p>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* Soil */}
      <div className="mb-10">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-4"
        >
          The Soil: Jurassic Limestone and Clay
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed mb-4">
          The bedrock of the Côte d'Or is Jurassic limestone — ancient marine sediment deposited 150
          million years ago. This is overlaid with clay in varying proportions depending on where you
          are on the slope. The ratio of limestone to clay is one of the key variables that differentiates
          one climat from another.
        </p>
        <ul className="space-y-3">
          {[
            { label: 'Limestone', desc: 'Gives wine its minerality and backbone. Encourages deep root growth — vines reach down 10+ metres to find water, which contributes to wine complexity.' },
            { label: 'Clay', desc: 'Retains water and nutrients. Higher clay content = richer, rounder wines. Too much clay and drainage suffers. The great whites of the Côte de Beaune come from marl — a limestone-clay mix with more clay than the CdN.' },
            { label: 'Iron', desc: 'Some plots in Pommard and Corton have iron-rich soil (reddish colour), which contributes to fuller-bodied, more tannic wines.' },
          ].map(item => (
            <li key={item.label} className="flex gap-3 text-sm text-[#2C1810] leading-relaxed">
              <span className="text-[#C9A84C] flex-shrink-0 font-semibold w-20">{item.label}</span>
              <span>{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* CdN vs CdB */}
      <div className="mb-10">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-5"
        >
          Côte de Nuits vs. Côte de Beaune
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {REGIONS_COMPARE.map(r => (
            <div key={r.name} className="border border-[#D4C5A9] bg-white/50">
              <div style={{ backgroundColor: r.color }} className="px-5 py-3">
                <p
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  className="text-lg font-bold text-[#F5F0E8]"
                >
                  {r.name}
                </p>
              </div>
              <div className="px-5 py-4 space-y-3">
                {[
                  { label: 'Soil', value: r.soil },
                  { label: 'Climate', value: r.climate },
                  { label: 'Grapes', value: r.grape },
                  { label: 'Style', value: r.style },
                ].map(row => (
                  <div key={row.label}>
                    <p className="text-[10px] tracking-[0.2em] uppercase text-[#6B5244] mb-0.5">{row.label}</p>
                    <p className="text-sm text-[#2C1810] leading-relaxed">{row.value}</p>
                  </div>
                ))}
                <p className="text-xs text-[#6B5244] italic pt-1 border-t border-[#EDE6D6] leading-relaxed">{r.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* Chablis */}
      <div className="mb-10">
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-4"
        >
          Chablis: A Completely Different Terroir
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed mb-4">
          Chablis sits 80km northwest of the Côte d'Or, geographically isolated and climatically distinct.
          It grows only Chardonnay, and the wines taste nothing like Côte de Beaune whites — not because
          of winemaking differences, but because the soil is completely different.
        </p>
        <p className="text-sm text-[#2C1810] leading-relaxed mb-4">
          The best Chablis vineyards sit on <em>Kimmeridgian limestone</em> — a specific type of rock
          formed from ancient seabed, visible as a blue-grey marl packed with fossilised oyster shells.
          This is what gives Chablis its characteristic flinty, saline, high-acid character that no amount
          of winemaking technique can replicate elsewhere.
        </p>
        <div className="flex gap-3">
          <span className="text-[#C9A84C] flex-shrink-0 mt-0.5">✦</span>
          <p className="text-sm text-[#6B5244] italic leading-relaxed">
            The seven Grand Cru vineyards of Chablis all sit on the steepest south-facing Kimmeridgian slopes
            above the Serein river. The Petit Chablis appellation, by contrast, sits on younger Portlandian
            limestone — nearby, but geologically younger and less complex.
          </p>
        </div>
      </div>

      <div className="h-px bg-[#D4C5A9] mb-10" />

      {/* The grapes */}
      <div>
        <p
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          className="text-xl font-bold text-[#6B0F1A] mb-5"
        >
          Why These Two Grapes?
        </p>
        <div className="space-y-6">
          <div>
            <p
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-base font-bold text-[#6B0F1A] mb-2"
            >
              Pinot Noir
            </p>
            <p className="text-sm text-[#2C1810] leading-relaxed mb-3">
              Thin-skinned, difficult to grow, prone to disease, and early-ripening. In a warmer region it
              ripens too quickly, losing the acidity that makes it interesting. Burgundy's cool, marginal
              climate forces Pinot Noir to ripen slowly — building complexity while preserving freshness.
            </p>
            <p className="text-sm text-[#2C1810] leading-relaxed">
              Pinot Noir is also unusually transparent to terroir. Unlike Cabernet Sauvignon, which expresses
              a dominant fruit character in many climates, Pinot Noir is a chameleon — the soil and position
              of the vineyard come through clearly in the wine. This is why tasting across Burgundy villages
              is so educational: you're tasting the land, not the grape.
            </p>
          </div>
          <div>
            <p
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-base font-bold text-[#6B0F1A] mb-2"
            >
              Chardonnay
            </p>
            <p className="text-sm text-[#2C1810] leading-relaxed mb-3">
              More adaptable than Pinot Noir, but in Burgundy it expresses terroir as clearly as anywhere
              in the world. The contrast is stark: Chablis Chardonnay is lean, mineral, and tightly wound
              from cold Kimmeridgian limestone; Meursault Chardonnay is richer and nutty from the clay-heavy
              marl of the Côte de Beaune; Mâcon-Villages is rounder and fruit-forward from warmer, less
              complex soils.
            </p>
            <p className="text-sm text-[#2C1810] leading-relaxed">
              The reason Burgundy produces white wines of world-class quality from a single grape is that the
              range of terroir within the region gives Chardonnay a spectrum of conditions to express — from
              the coldest Grand Cru of Chablis to the richest marl of Puligny-Montrachet.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
