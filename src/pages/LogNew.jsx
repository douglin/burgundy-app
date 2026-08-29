import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import appellations from '../data/appellations.json'
import { useLog } from '../hooks/useLog'

// Deduplicate and sort by name for the dropdown
const appellationOptions = [...new Map(appellations.map(a => [a.id, a])).values()]
  .sort((a, b) => a.name.localeCompare(b.name))

function makeEmpty(prefilledId = '') {
  return {
    appellationId: prefilledId,
    producer: '',
    vintage: new Date().getFullYear(),
    dateTasted: new Date().toISOString().slice(0, 10),
    score: 8,
    notes: '',
    photoPath: '',
    cellar: { bottlesOwned: 0, drinkFrom: '', drinkBy: '' },
  }
}

const inputCls =
  'mt-1 block w-full border border-[#D4C5A9] bg-[#FDFAF5] rounded-none px-3 py-2 text-sm text-[#2C1810] focus:outline-none focus:border-[#6B0F1A] transition-colors'
const labelCls = 'text-xs tracking-widest uppercase text-[#6B5244]'

export default function LogNew() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { addEntry } = useLog()
  const [form, setForm] = useState(() => makeEmpty(params.get('appellation') ?? ''))
  const [photoPreview, setPhotoPreview] = useState(null)

  function set(field, value) {
    setForm(f => ({ ...f, [field]: value }))
  }

  function setCellar(field, value) {
    setForm(f => ({ ...f, cellar: { ...f.cellar, [field]: value } }))
  }

  function handlePhoto(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      set('photoPath', reader.result)
      setPhotoPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const id = addEntry(form)
    navigate(`/log/${id}`)
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-1">Record</p>
      <h1
        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        className="text-3xl font-bold text-[#6B0F1A] mb-8"
      >
        New Tasting
      </h1>
      <div className="h-px bg-[#D4C5A9] mb-8" />

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Appellation */}
        <label className="block">
          <span className={labelCls}>Appellation</span>
          <select
            required
            value={form.appellationId}
            onChange={e => set('appellationId', e.target.value)}
            className={inputCls}
          >
            <option value="">Select appellation…</option>
            {appellationOptions.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </label>

        {/* Producer */}
        <label className="block">
          <span className={labelCls}>Producer / Domaine</span>
          <input
            type="text"
            value={form.producer}
            onChange={e => set('producer', e.target.value)}
            className={inputCls}
            placeholder="e.g. Domaine Rousseau"
          />
        </label>

        {/* Vintage + Date */}
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className={labelCls}>Vintage</span>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={form.vintage}
              onChange={e => set('vintage', Number(e.target.value))}
              className={inputCls}
            />
          </label>
          <label className="block">
            <span className={labelCls}>Date Tasted</span>
            <input
              type="date"
              value={form.dateTasted}
              onChange={e => set('dateTasted', e.target.value)}
              className={inputCls}
            />
          </label>
        </div>

        {/* Score slider */}
        <label className="block">
          <span className={labelCls}>
            Score —{' '}
            <span className="text-[#6B0F1A] font-semibold text-sm">{form.score}</span>
            /10
          </span>
          <input
            type="range"
            min="1"
            max="10"
            value={form.score}
            onChange={e => set('score', Number(e.target.value))}
            className="mt-2 block w-full accent-[#6B0F1A]"
          />
          <div className="flex justify-between text-xs text-[#C9A84C] mt-1">
            <span>1</span><span>5</span><span>10</span>
          </div>
        </label>

        {/* Tasting notes */}
        <label className="block">
          <span className={labelCls}>Tasting Notes</span>
          <textarea
            rows={4}
            value={form.notes}
            onChange={e => set('notes', e.target.value)}
            className={inputCls}
            placeholder="Nose, palate, finish…"
          />
        </label>

        {/* Photo upload + preview */}
        <div>
          <p className={labelCls}>Label Photo</p>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhoto}
            className="mt-2 block w-full text-sm text-[#6B5244] file:mr-4 file:py-1.5 file:px-4 file:border file:border-[#6B0F1A] file:text-xs file:tracking-widest file:uppercase file:text-[#6B0F1A] file:bg-transparent file:cursor-pointer hover:file:bg-[#6B0F1A] hover:file:text-[#F5F0E8] file:transition-colors"
          />
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Label preview"
              className="mt-3 max-h-48 object-contain border border-[#D4C5A9]"
            />
          )}
        </div>

        {/* Cellar */}
        <fieldset className="border border-[#D4C5A9] p-5">
          <legend className="text-xs tracking-widest uppercase text-[#6B5244] px-2">
            Cellar
          </legend>
          <div className="grid grid-cols-3 gap-4 mt-2">
            <label className="block">
              <span className={labelCls}>Bottles</span>
              <input
                type="number"
                min="0"
                value={form.cellar.bottlesOwned}
                onChange={e => setCellar('bottlesOwned', Number(e.target.value))}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className={labelCls}>Drink From</span>
              <input
                type="number"
                min="2000"
                value={form.cellar.drinkFrom}
                onChange={e => setCellar('drinkFrom', Number(e.target.value))}
                className={inputCls}
                placeholder="year"
              />
            </label>
            <label className="block">
              <span className={labelCls}>Drink By</span>
              <input
                type="number"
                min="2000"
                value={form.cellar.drinkBy}
                onChange={e => setCellar('drinkBy', Number(e.target.value))}
                className={inputCls}
                placeholder="year"
              />
            </label>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-[#6B0F1A] text-[#F5F0E8] py-3 text-xs tracking-widest uppercase hover:bg-[#4A0A12] transition-colors"
        >
          Save Tasting
        </button>
      </form>
    </div>
  )
}
