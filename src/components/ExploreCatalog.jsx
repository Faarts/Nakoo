import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, SlidersHorizontal, Heart, AlertTriangle } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { FilterBottomSheet } from './FilterBottomSheet'
import { AuthPromptModal } from './AuthPromptModal'
import { EmptyState } from './EmptyState'
import { Skeleton } from './Skeleton'
import { useAuth } from '../lib/AuthContext'
import { useToast } from './Toast'
import { api } from '../lib/api'
import { emptyFilters, filterCatalog, loadCatalog, mealLabels, normalizeAllergen, parseList, skillLabels } from '../lib/catalog'
import category01 from '../assets/img/category 01.png'
import category02 from '../assets/img/category 02.png'
import category03 from '../assets/img/category 03.png'
import category04 from '../assets/img/category 04.png'
import category05 from '../assets/img/category 05.png'

const categories = [['all', 'Semua', category01], ['breakfast', 'Sarapan', category02], ['lunch', 'Makan siang', category03], ['snack', 'Camilan', category04], ['dinner', 'Makan malam', category05]]
const quick = [{ key: 'durasi', value: '10', label: '≤10 menit', tone: 'lilac' }, { key: 'usia', value: '6–8 bulan', label: '6–8 bulan', tone: 'cream' }, { key: 'skill', value: 'kognitif', label: 'Kognitif', tone: 'green' }, { key: 'tags', value: 'Kertas', label: 'Kertas', tone: 'cream' }]
export function ExploreCatalog({ type }) {
  const food = type === 'food'
  const base = food ? '/explore/menu' : '/explore/activity'
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const [params, setParams] = useSearchParams()
  const savedOnly = params.get('saved') === '1'
  const query = params.get('q') || ''
  const category = params.get('category') || 'all'
  const filters = useMemo(() => {
    try { const saved = JSON.parse(params.get('filters') || '{}'); const result = emptyFilters(); for (const key in result) if (Array.isArray(result[key]) ? Array.isArray(saved[key]) : typeof saved[key] === 'string') result[key] = saved[key]; return result } catch { return emptyFilters() }
  }, [params])
  const update = (key, value) => setParams(current => { const next = new URLSearchParams(current); if (!value || value === 'all') next.delete(key); else next.set(key, value); return next }, { replace: true })
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [pending, setPending] = useState(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  useEffect(() => {
    let active = true
    setLoading(true)
    loadCatalog(type).then(data => { if (active) { setItems(data.items); setPreview(data.preview); setLoading(false) } })
    return () => { active = false }
  }, [type])
  useEffect(() => {
    let active = true
    setFavorites([])
    if (user) api.get('/api/favorites').then(data => { if (active) setFavorites(data.favorites || []) }).catch(() => {})
    return () => { active = false }
  }, [user])
  const selectedItems = savedOnly ? items.filter(item => favorites.some(f => f.item_id === item.id && f.item_type === (food ? 'meal' : 'activity'))) : items
  const visible = filterCatalog(selectedItems, { query, category, filters })
  const activeCount = Object.values(filters).reduce((sum, value) => sum + (Array.isArray(value) ? value.length : value ? 1 : 0), 0)
  const searching = savedOnly || !!query.trim() || category !== 'all' || activeCount > 0
  const reset = () => setParams({}, { replace: true })
  const toggleFavorite = async item => {
    if (!user) { setAuthOpen(true); return }
    if (preview) { showToast('Katalog contoh belum dapat disimpan. Coba lagi saat koneksi tersedia.', 'info'); return }
    const itemType = food ? 'meal' : 'activity'
    const saved = favorites.some(f => f.item_id === item.id && f.item_type === itemType)
    setPending(item.id)
    try {
      if (saved) await api.delete(`/api/favorites/${itemType}/${item.id}`)
      else await api.post('/api/favorites', { item_type: itemType, item_id: item.id })
      setFavorites(current => saved ? current.filter(f => !(f.item_id === item.id && f.item_type === itemType)) : [...current, { item_id: item.id, item_type: itemType }])
      showToast(saved ? 'Dihapus dari favorit' : 'Disimpan ke favorit', 'success')
    } catch (err) { showToast(err.message, 'error') } finally { setPending(null) }
  }
  const renderCard = (item, featured = false) => {
    const favorite = favorites.some(f => f.item_id === item.id && f.item_type === (food ? 'meal' : 'activity'))
    const allergies = parseList(profile?.alergies).map(normalizeAllergen)
    const warning = food && parseList(item.allergens).some(a => allergies.includes(normalizeAllergen(a)))
    const tags = food ? [`${item.age_range} bulan`, mealLabels[item.type]].filter(Boolean) : [...parseList(item.tags), ...parseList(item.skills).map(s => skillLabels[s] || s)]
    return <article key={item.id} className={`catalog-card ${featured ? 'catalog-card-featured' : ''}`}>
      <Link to={`${base}/${item.id}`} className="block rounded-xl focus-visible:outline-offset-4">
        <div className="catalog-image"><img src={item.image} alt={item.title} loading="lazy" /></div>
        <h3 className="catalog-card-title">{item.title}</h3>
      </Link>
      <button type="button" disabled={pending === item.id} aria-label={`${favorite ? 'Hapus' : 'Simpan'} ${item.title} ${favorite ? 'dari' : 'ke'} favorit`} aria-pressed={favorite} onClick={() => toggleFavorite(item)} className="catalog-favorite"><Heart className={`size-4 ${favorite ? 'fill-nakoo-red-500 text-nakoo-red-500' : 'text-nakoo-green-700'}`} /></button>
      <div className="mt-auto flex flex-wrap gap-1 pt-2">{tags.slice(0, 2).map((tag, i) => <span key={tag} className={`catalog-tag tone-${i ? 'blue' : 'cream'}`}>{tag}</span>)}{tags.length > 2 && <span className="catalog-tag tone-lilac">+{tags.length - 2}</span>}</div>
      {warning && <span className="flex items-center gap-1 text-xs text-nakoo-red-700 mt-2"><AlertTriangle className="size-3.5 shrink-0" />Periksa alergen</span>}
    </article>
  }
  return <div className="catalog-page">
    <div className="px-5 pt-1 pb-4"><h1 className="text-2xl font-medium">{savedOnly ? (food ? 'Makanan Favorit' : 'Aktivitas Favorit') : food ? 'Eksplor Makanan' : 'Eksplor Aktivitas'}</h1></div>
    <div className="px-5 flex gap-2 mb-3"><SearchBar value={query} onSearch={value => update('q', value)} placeholder={food ? 'Cari makanan untuk si buah hati...' : 'Cari kegiatan seru untuk si buah hati...'} /><button type="button" onClick={() => setFilterOpen(true)} aria-label={`Buka filter${activeCount ? `, ${activeCount} aktif` : ''}`} className="filter-trigger"><SlidersHorizontal className="size-4" />{activeCount > 0 && <span className="filter-count">{activeCount}</span>}</button></div>
    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-5 pb-4">
      {food ? <><button type="button" onClick={() => setFilterOpen(true)} className="filter-chip tone-cream">{filters.usia || 'Semua usia'}</button>{[['tekstur', 'Tekstur', 'lilac'], ['bahanUtama', 'Bahan utama', 'cream'], ['alergen', 'Pantangan', 'rose']].map(([key, label, tone]) => <button type="button" key={key} onClick={() => setFilterOpen(true)} className={`filter-chip tone-${tone} ${filters[key].length ? 'is-selected' : ''}`}>{filters[key].join(', ') || label}</button>)}</> : quick.map(chip => { const selected = Array.isArray(filters[chip.key]) ? filters[chip.key].includes(chip.value) : filters[chip.key] === chip.value; return <button type="button" key={chip.key} aria-pressed={selected} className={`filter-chip tone-${chip.tone} ${selected ? 'is-selected' : ''}`} onClick={() => { const value = Array.isArray(filters[chip.key]) ? selected ? filters[chip.key].filter(v => v !== chip.value) : [...filters[chip.key], chip.value] : selected ? '' : chip.value; update('filters', JSON.stringify({ ...filters, [chip.key]: value })) }}>{chip.label}</button> })}
    </div>
    {food && <section className="mb-5"><h2 className="px-5 text-base font-semibold mb-2">Kategori</h2><div className="flex gap-4 overflow-x-auto scrollbar-hide px-5 py-1">{categories.map(([value, label, icon]) => <button type="button" key={value} aria-pressed={category === value} onClick={() => update('category', value)} className={`category-option ${category === value ? 'is-selected' : ''}`}><span><img src={icon} alt="" /></span><span>{label}</span></button>)}</div></section>}
    {preview && <p className="mx-5 mb-4 text-xs text-neutral-500">Katalog contoh · penyimpanan memerlukan koneksi ke server.</p>}
    {loading ? <div className="px-5 grid grid-cols-2 gap-3" aria-label="Memuat katalog">{[1, 2, 3, 4].map(n => <Skeleton key={n} className="h-52 rounded-2xl" />)}</div> : <>
      {searching && <div className="flex items-center justify-between px-5 mb-4"><p aria-live="polite" className="text-sm text-neutral-500">{visible.length} {food ? 'resep' : 'aktivitas'} ditemukan</p><button type="button" onClick={reset} className="text-sm text-nakoo-red-700 min-h-11 font-medium">Reset semua</button></div>}
      {!visible.length ? <EmptyState icon={food ? '🥣' : '🧩'} title={savedOnly ? 'Belum ada favorit yang cocok' : food ? 'Resep belum ditemukan' : 'Aktivitas belum ditemukan'} description="Coba kata kunci lain atau kurangi filter. Kamu juga bisa mulai lagi dari semua pilihan." actionLabel="Reset semua" onAction={reset} /> : <>
        {!searching && <section className="mb-5"><div className="px-5 flex justify-between items-center mb-2"><h2 className="text-base font-semibold">{food ? 'Rekomendasi untuk si kecil' : 'Ide bermain untuk si kecil'}</h2><a href="#semua-pilihan" aria-label="Lihat semua pilihan" className="size-11 -mr-2 flex items-center justify-center"><ArrowRight className="size-4" /></a></div><div className="catalog-carousel scrollbar-hide">{visible.slice(0, 4).map(item => renderCard(item, true))}</div></section>}
        <section id="semua-pilihan" className="px-5 scroll-mt-5"><h2 className="text-base font-semibold mb-3">{searching ? 'Hasil pencarian' : food ? 'Pilihan makanan' : 'Pilihan aktivitas'}</h2><div className="grid grid-cols-2 gap-3">{visible.map(item => renderCard(item))}</div></section>
      </>}
    </>}
    <FilterBottomSheet isOpen={filterOpen} onClose={() => setFilterOpen(false)} type={type} value={filters} onApply={value => update('filters', JSON.stringify(value))} resultCount={value => filterCatalog(selectedItems, { query, category, filters: value }).length} />
    <AuthPromptModal isOpen={authOpen} onClose={() => setAuthOpen(false)} title="Simpan ide untuk si kecil" message="Masuk untuk menyimpan favorit. Pilihan pencarianmu tetap tersimpan saat kamu kembali." />
  </div>
}
