import { useState } from 'react'
import FactCard from '../components/FactCard/FactCard'
import BurgundyMap from '../components/Map/BurgundyMap'

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedVillage, setSelectedVillage] = useState(null)
  const [cardData, setCardData] = useState(null)
  const [cardType, setCardType] = useState(null)

  function handleSelectRegion(props) {
    if (!props) {
      setSelectedRegion(null)
      setSelectedVillage(null)
      setCardData(null)
      setCardType(null)
      return
    }
    setSelectedRegion(props)
    setSelectedVillage(null)
    setCardData(props)
    setCardType('region')
  }

  function handleSelectVillage(props) {
    if (!props) {
      setSelectedVillage(null)
      setCardData(selectedRegion)
      setCardType('region')
      return
    }
    setSelectedVillage(props)
    setCardData(props)
    setCardType('village')
  }

  function handleSelectCru(props) {
    setCardData(props)
    setCardType('cru')
  }

  function handleClose() {
    setSelectedRegion(null)
    setSelectedVillage(null)
    setCardData(null)
    setCardType(null)
  }

  const panelOpen = !!cardData

  return (
    <div className="flex h-full">

      {/* Left intro — hidden when panel is open */}
      {!panelOpen && (
        <div className="hidden lg:flex flex-col justify-center px-10 text-[#EDE6D6] bg-[#2C1810] w-64 flex-shrink-0">
          <p className="text-[#C9A84C] text-[10px] tracking-[0.3em] uppercase mb-3">
            France · Bourgogne
          </p>
          <p
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            className="text-2xl font-bold leading-snug mb-4"
          >
            Click a region to explore
          </p>
          <p className="text-sm text-[#9A7B6A] leading-relaxed">
            Select any region on the map to see its grapes, style, and key producers. Then click a village to see its Grands Crus.
          </p>
          <div className="mt-8 space-y-2">
            {['Chablis','Côte de Nuits','Côte de Beaune','Côte Chalonnaise','Mâconnais'].map(r => (
              <div key={r} className="flex items-center gap-2 text-xs text-[#9A7B6A]">
                <span className="text-[#C9A84C]">✦</span>{r}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fact card panel */}
      <div
        className={`flex-shrink-0 border-r border-[#D4C5A9] bg-[#FDFAF5] overflow-hidden transition-all duration-300 ${
          panelOpen ? 'w-full sm:w-72' : 'w-0'
        }`}
      >
        {panelOpen && (
          <FactCard
            selection={cardData}
            type={cardType}
            onClose={handleClose}
          />
        )}
      </div>

      {/* Map — hidden on mobile when fact card is open */}
      <div className={`flex-1 bg-[#2C1810] overflow-hidden ${panelOpen ? 'hidden sm:block' : ''}`} style={{ minWidth: 0, isolation: 'isolate' }}>
        <BurgundyMap
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          onSelectCru={handleSelectCru}
        />
      </div>
    </div>
  )
}
