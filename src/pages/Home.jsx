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
    <div className="flex h-full relative">

      {/* Left intro — desktop only, hidden when panel is open */}
      {!panelOpen && (
        <div className="hidden lg:flex flex-col justify-center px-10 text-[#EDE6D6] bg-[#2C1810] w-64 flex-shrink-0">
          <p className="text-[#9A7B6A] text-[10px] tracking-[0.3em] uppercase mb-3">
            France · Burgundy
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

      {/* Map — always visible */}
      <div className="flex-1 bg-[#2C1810] overflow-hidden" style={{ minWidth: 0, isolation: 'isolate' }}>
        <BurgundyMap
          selectedRegion={selectedRegion}
          onSelectRegion={handleSelectRegion}
          selectedVillage={selectedVillage}
          onSelectVillage={handleSelectVillage}
          onSelectCru={handleSelectCru}
          sheetOpen={panelOpen}
        />
      </div>

      {/* Fact card:
            mobile  — fixed bottom sheet sliding up over the map
            desktop — static side panel to the left of the map          */}
      <div
        className={`
          bg-[#FDFAF5] border-[#D4C5A9] overflow-hidden transition-all duration-300
          fixed bottom-0 left-0 right-0 z-[500] border-t
          sm:static sm:flex-shrink-0 sm:border-r sm:border-t-0 sm:z-auto sm:order-first
          ${panelOpen ? 'h-[45vh] sm:h-auto sm:w-72' : 'h-0 sm:w-0'}
        `}
      >
        {panelOpen && (
          <FactCard
            selection={cardData}
            type={cardType}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  )
}
