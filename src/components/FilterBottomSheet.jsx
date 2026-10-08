<<<<<<< HEAD
import React, { useState } from 'react';
import { BottomSheet } from './BottomSheet';
import { Smile, Layers, Utensils, Ban, Flame, ChevronDown, ChevronUp, Check } from 'lucide-react';

export function FilterBottomSheet({ isOpen, onClose, onApply }) {
  const [expandedSection, setExpandedSection] = useState({
    bahanUtama: true,
    alergen: true,
  });

  const [filters, setFilters] = useState({
    usia: '',
    tekstur: [],
    bahanUtama: [],
    alergen: [],
    metodeMasak: []
  });

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleMulti = (category, value) => {
    setFilters(prev => {
      const current = prev[category];
      if (current.includes(value)) {
        return { ...prev, [category]: current.filter(v => v !== value) };
      } else {
        return { ...prev, [category]: [...current, value] };
      }
    });
  };

  const setSingle = (category, value) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category] === value ? '' : value
    }));
  };

  const handleReset = () => {
    setFilters({
      usia: '',
      tekstur: [],
      bahanUtama: [],
      alergen: [],
      metodeMasak: []
    });
  };

  const actionButtons = (
    <div className="flex gap-3">
      <button
        onClick={handleReset}
        className="px-6 py-3 rounded-2xl border-2 border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-50 active:scale-95 transition-all cursor-pointer"
=======
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
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc
      >
        Reset
      </button>
      <button
<<<<<<< HEAD
        onClick={() => { onApply?.(filters); onClose(); }}
        className="flex-1 py-3 rounded-2xl bg-nakoo-green-500 text-white font-bold hover:bg-nakoo-green-600 active:scale-[0.98] transition-all shadow-primary cursor-pointer"
      >
        Terapkan Filter
      </button>
    </div>
  );
=======
        type="button"
        onClick={() => { onApply(draft); onClose() }}
        className="flex-1 min-h-12 rounded-full bg-primary-500 text-primary-900 font-semibold hover:bg-primary-600 active:scale-[0.97] transition-all duration-150 shadow-md shadow-primary-500/20"
      >
        Lihat hasil{count !== undefined ? ` (${count})` : ''}
      </button>
    </div>
  )
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
<<<<<<< HEAD
      title="Filter Makanan"
      action={actionButtons}
    >
      <div className="flex flex-col gap-6">

        {/* Usia */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500">
              <Smile className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-800">Usia</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['6–8 bulan', '9–11 bulan', '12–17 bulan', '18–23 bulan', '24–29 bulan', '30–36 bulan'].map(age => {
              const isActive = filters.usia === age;
              return (
                <button
                  key={age}
                  onClick={() => setSingle('usia', age)}
                  className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 cursor-pointer ${isActive ? 'bg-orange-500 text-white' : 'bg-primary-50 text-neutral-600 hover:bg-orange-100'
                    }`}
                >
                  {age}
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-nakoo-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tekstur Makanan */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-500">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-800">Tekstur Makanan</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Halus', 'Lumat', 'Cincang', 'Finger Food'].map(tekstur => {
              const isActive = filters.tekstur.includes(tekstur);
              return (
                <button
                  key={tekstur}
                  onClick={() => toggleMulti('tekstur', tekstur)}
                  className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 cursor-pointer ${isActive ? 'bg-purple-500 text-white' : 'bg-purple-50 text-neutral-600 hover:bg-purple-100'
                    }`}
                >
                  {tekstur}
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-nakoo-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Bahan Utama */}
        <section>
          <button
            className="flex items-center justify-between w-full mb-3 cursor-pointer"
            aria-expanded={expandedSection.bahanUtama}
            onClick={() => toggleSection('bahanUtama')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                <Utensils className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-neutral-800">Bahan Utama</h3>
            </div>
            {expandedSection.bahanUtama ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>
          {expandedSection.bahanUtama && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
              {['Sayuran', 'Buah', 'Daging', 'Ikan', 'Telur', 'Seafood', 'Susu', 'Keju', 'Kacang', 'Alpukat'].map(bahan => {
                const isActive = filters.bahanUtama.includes(bahan);
                return (
                  <button
                    key={bahan}
                    onClick={() => toggleMulti('bahanUtama', bahan)}
                    className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${isActive ? 'bg-yellow-500 text-white' : 'bg-amber-50 text-neutral-600 hover:bg-amber-100'
                      }`}
                  >
                    {bahan}
                    {isActive && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-nakoo-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Alergen / Pantangan */}
        <section>
          <button
            className="flex items-center justify-between w-full mb-3 cursor-pointer"
            aria-expanded={expandedSection.alergen}
            onClick={() => toggleSection('alergen')}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <Ban className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-neutral-800">Alergen / Pantangan</h3>
            </div>
            {expandedSection.alergen ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
          </button>
          {expandedSection.alergen && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-top-2 fade-in duration-200">
              {['Tanpa Telur', 'Tanpa Susu', 'Tanpa Kacang', 'Tanpa Gluten'].map(alergen => {
                const isActive = filters.alergen.includes(alergen);
                return (
                  <button
                    key={alergen}
                    onClick={() => toggleMulti('alergen', alergen)}
                    className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${isActive ? 'bg-red-500 text-white' : 'bg-red-50 text-neutral-600 hover:bg-red-100'
                      }`}
                  >
                    <Ban className="w-3.5 h-3.5" /> {alergen}
                    {isActive && (
                      <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-nakoo-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={4} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Metode Masak */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-500">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-neutral-800">Metode Masak</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Kukus', 'Tumis', 'Rebus', 'Panggang'].map(metode => {
              const isActive = filters.metodeMasak.includes(metode);
              return (
                <button
                  key={metode}
                  onClick={() => toggleMulti('metodeMasak', metode)}
                  className={`relative px-4 py-2.5 rounded-full text-sm font-medium transition-all active:scale-95 cursor-pointer ${isActive ? 'bg-cyan-500 text-white' : 'bg-cyan-50 text-neutral-600 hover:bg-cyan-100'
                    }`}
                >
                  {metode}
                  {isActive && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-nakoo-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={4} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

      </div>
    </BottomSheet>
  );
=======
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
>>>>>>> 1ed2701e131f7d51bcddb49f47f1fd849743e0cc
}
