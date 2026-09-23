import { useEffect, useState } from 'react'
import { Smile, Layers, Utensils, Ban, Flame, Clock, Shapes, Check } from 'lucide-react'
import { BottomSheet } from './BottomSheet'
import { emptyFilters, skillLabels } from '../lib/catalog'

const foodSections = [
  { key: 'tekstur',     title: 'Tekstur makanan',     icon: Layers,  tone: 'lilac', options: ['Halus', 'Lumat', 'Cincang', 'Finger Food'] },
  { key: 'bahanUtama',  title: 'Bahan utama',          icon: Utensils,tone: 'cream', options: ['Sayuran', 'Buah', 'Daging', 'Ikan', 'Telur', 'Seafood', 'Susu', 'Keju', 'Kacang', 'Alpukat'] },
  { key: 'alergen',     title: 'Alergen / pantangan',  icon: Ban,     tone: 'rose',  options: ['Tanpa Telur', 'Tanpa Susu', 'Tanpa Kacang', 'Tanpa Gluten'] },
  { key: 'metodeMasak', title: 'Metode masak',          icon: Flame,   tone: 'blue',  options: ['Kukus', 'Tumis', 'Rebus', 'Panggang'] },
]

const activitySections = [
  { key: 'durasi', title: 'Durasi bermain',      icon: Clock,   tone: 'lilac',  single: true, options: ['10', '20', '30'],                          label: value => `≤ ${value} menit` },
  { key: 'skill',  title: 'Fokus keterampilan',  icon: Layers,  tone: 'green',  options: Object.keys(skillLabels),                                  label: value => skillLabels[value] },
  { key: 'tags',   title: 'Bahan & suasana',     icon: Shapes,  tone: 'blue',   options: ['Kertas', 'Quiet Time', 'Indoor'] },
]

export function FilterBottomSheet({ isOpen, onClose, onApply, value, type = 'food', resultCount }) {
  const [draft, setDraft] = useState(emptyFilters)

  useEffect(() => {
    if (isOpen) setDraft({ ...emptyFilters(), ...value })
  }, [isOpen, value])

  const sections = [
    { key: 'usia', title: 'Usia', icon: Smile, tone: 'cream', single: true, options: ['6–8 bulan', '9–11 bulan', '12–17 bulan', '18–23 bulan', '24–29 bulan', '30–36 bulan'] },
    ...(type === 'food' ? foodSections : activitySections),
  ]

  const toggle = (section, option) =>
    setDraft(current => ({
      ...current,
      [section.key]: section.single
        ? (current[section.key] === option ? '' : option)
        : current[section.key].includes(option)
          ? current[section.key].filter(v => v !== option)
          : [...current[section.key], option],
    }))

  const count = resultCount?.(draft)

  const actionArea = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => setDraft(emptyFilters())}
        className="px-5 min-h-12 rounded-full border border-neutral-200 font-medium text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all duration-150"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={() => { onApply(draft); onClose() }}
        className="flex-1 min-h-12 rounded-full bg-primary-500 text-primary-900 font-semibold hover:bg-primary-600 active:scale-[0.97] transition-all duration-150 shadow-md shadow-primary-500/20"
      >
        Lihat hasil{count !== undefined ? ` (${count})` : ''}
      </button>
    </div>
  )

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'food' ? 'Filter Makanan' : 'Filter Aktivitas'}
      action={actionArea}
    >
      <div className="space-y-6">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <section key={section.key}>
              {/* Section header */}
              <h3 className="flex items-center gap-3 font-semibold mb-3 text-neutral-800">
                <span
                  className={`filter-chip tone-${section.tone} shrink-0`}
                  style={{ width: 36, height: 36, padding: 0, display: 'grid', placeItems: 'center', borderRadius: '10px' }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                {section.title}
              </h3>

              {/* Options */}
              <div className="flex flex-wrap gap-2">
                {section.options.map(option => {
                  const selected = section.single
                    ? draft[section.key] === option
                    : draft[section.key].includes(option)

                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggle(section, option)}
                      className={`filter-chip tone-${section.tone} ${selected ? 'is-selected' : ''}`}
                    >
                      {selected && <Check className="w-3.5 h-3.5 shrink-0" />}
                      {section.label?.(option) || option}
                    </button>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>
    </BottomSheet>
  )
}
