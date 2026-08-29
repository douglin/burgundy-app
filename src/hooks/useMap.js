import { useCallback, useState } from 'react'

export function useMap() {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedVillage, setSelectedVillage] = useState(null)
  const [selectedCru, setSelectedCru] = useState(null)
  const [zoomLevel, setZoomLevel] = useState('region')

  const selectRegion = useCallback((region) => {
    setSelectedRegion(region)
    setSelectedVillage(null)
    setSelectedCru(null)
    setZoomLevel('village')
  }, [])

  const selectVillage = useCallback((village) => {
    setSelectedVillage(village)
    setSelectedCru(null)
    setZoomLevel('cru')
  }, [])

  const selectCru = useCallback((cru) => {
    setSelectedCru(cru)
  }, [])

  const reset = useCallback(() => {
    setSelectedRegion(null)
    setSelectedVillage(null)
    setSelectedCru(null)
    setZoomLevel('region')
  }, [])

  return {
    selectedRegion,
    selectedVillage,
    selectedCru,
    zoomLevel,
    selectRegion,
    selectVillage,
    selectCru,
    reset,
  }
}
