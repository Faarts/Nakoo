import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Heart, Clock, Check, Plus, ListOrdered, Utensils, Flame } from 'lucide-react'
import { loadCatalog, mealLabels, parseList, skillLabels } from '../lib/catalog'
import { api } from '../lib/api'
import { useAuth } from '../lib/AuthContext'
import { useToast } from './Toast'
import { AuthPromptModal } from './AuthPromptModal'
import { EmptyState } from './EmptyState'
import { Skeleton } from './Skeleton'

export function CatalogDetail({ type }) {
  const food = type === 'food'
  const itemType = food ? 'meal' : 'activity'
  const base = food ? '/explore/menu' : '/explore/activity'
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { showToast } = useToast()
  const [item, setItem] = useState(null)
  const [preview, setPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [favorite, setFavorite] = useState(false)
  const [busy, setBusy] = useState('')
  const [authOpen, setAuthOpen] = useState(false)
  const [tab, setTab] = useState('materials')
  const [checked, setChecked] = useState({})
  useEffect(() => {
    let active = true
    setLoading(true); setChecked({}); setTab('materials')
    loadCatalog(type).then(data => { if (active) { setItem(data.items.find(entry => String(entry.id) === id) || null); setPreview(data.preview); setLoading(false) } })
    return () => { active = false }
  }, [id, type])
  useEffect(() => {
    let active = true
    setFavorite(false)
    if (user) api.get('/api/favorites').then(data => { if (active) setFavorite((data.favorites || []).some(f => f.item_id === id && f.item_type === itemType)) }).catch(() => {})
    return () => { active = false }
  }, [id, user, itemType])
  const act = async action => {
    if (!user) { setAuthOpen(true); return }
    if (!profile && action === 'plan') { navigate('/setup-profile', { state: { from: `${base}/${id}` } }); return }
    if (preview) { showToast('Ide dari katalog contoh belum dapat disimpan. Sambungkan ke server lalu coba lagi.', 'info'); return }
    setBusy(action)
    try {
      if (action === 'favorite') {
        if (favorite) await api.delete(`/api/favorites/${itemType}/${id}`)
        else await api.post('/api/favorites', { item_type: itemType, item_id: id })
        setFavorite(!favorite)
        showToast(favorite ? 'Dihapus dari favorit' : 'Disimpan ke favorit', 'success')
      } else {
        await api.post(`/api/daily-plans/add-${food ? 'recipe' : 'activity'}`, food ? { recipe_id: id } : { activity_id: id })
        showToast('Ditambahkan ke rencana hari ini', 'success')
        navigate('/#rencana-hari-ini')
      }
    } catch (error) { showToast(error.message || 'Belum berhasil. Silakan coba lagi.', 'error') } finally { setBusy('') }
  }
  const back = () => { if (window.history.state?.idx > 0) navigate(-1); else navigate(base, { replace: true }) }
  const materials = parseList(food ? item?.ingredients : item?.materials)
  const steps = parseList(item?.steps)
  return <div className="app-surface pb-28">
    <header className="px-5 py-5 flex items-center justify-between"><button type="button" onClick={back} aria-label="Kembali ke katalog" className="filter-trigger"><ArrowLeft className="size-5" /></button><span className="text-xs text-neutral-500">{food ? 'Inspirasi menu' : 'Ide bermain'}</span>{item ? <button type="button" disabled={!!busy} onClick={() => act('favorite')} aria-label={favorite ? 'Hapus dari favorit' : 'Simpan ke favorit'} aria-pressed={favorite} className="filter-trigger"><Heart className={`size-5 ${favorite ? 'fill-nakoo-red-500 text-nakoo-red-500' : ''}`} /></button> : <span className="w-11" />}</header>
    {loading ? <div className="px-5 space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-64 rounded-2xl" /><Skeleton className="h-32 rounded-2xl" /></div> : !item ? <EmptyState title={food ? 'Resep tidak ditemukan' : 'Aktivitas tidak ditemukan'} description="Pilihan ini mungkin sudah tidak tersedia. Temukan ide lainnya di katalog." actionLabel="Kembali ke katalog" onAction={() => navigate(base)} /> : <main className="px-5">
      <h1 className="text-[22px] font-semibold leading-snug mb-3">{item.title}</h1>
      <div className="flex flex-wrap gap-2 mb-4"><span className="catalog-tag tone-cream">{item.age_range} bulan</span>{(food ? [mealLabels[item.type]].filter(Boolean) : parseList(item.skills).map(s => skillLabels[s] || s)).map(tag => <span key={tag} className="catalog-tag tone-lilac">{tag}</span>)}{(item.prep_time || item.duration) && <span className="catalog-tag tone-blue gap-1"><Clock className="size-3" />{item.prep_time || item.duration} menit</span>}</div>
      <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover rounded-2xl mb-5" />
      {item.description && <p className="text-sm text-neutral-500 leading-relaxed mb-5">{item.description}</p>}
      {food && item.calories && <div className="grid grid-cols-3 gap-2 mb-5">{[['Kalori', `${item.calories} kcal`], ['Protein', `${item.protein} gr`], ['Lemak', `${item.fat} gr`]].map(([label, value]) => <div key={label} className="rounded-2xl bg-primary-100 p-3 text-center text-primary-800"><p className="text-xs mb-2">{label}</p><Flame className="size-5 mx-auto mb-2" /><p className="text-sm font-medium">{value}</p></div>)}</div>}
      {food && parseList(item.allergens).length > 0 && <p className="rounded-xl bg-nakoo-red-50 text-nakoo-red-800 p-3 mb-5 text-sm">Informasi alergen: {parseList(item.allergens).join(', ')}</p>}
      <div role="tablist" aria-label="Panduan" className="flex bg-nakoo-green-50 rounded-xl p-1 mb-4">{[['materials', food ? 'Bahan' : 'Perlengkapan', Utensils], ['steps', food ? 'Arahan' : 'Cara bermain', ListOrdered]].map(([key, label, Icon]) => <button key={key} type="button" role="tab" aria-selected={tab === key} aria-controls={`panel-${key}`} id={`tab-${key}`} onClick={() => setTab(key)} className={`flex-1 min-h-11 rounded-lg flex items-center justify-center gap-2 text-sm ${tab === key ? 'bg-nakoo-green-200 text-nakoo-green-900 font-medium' : 'text-neutral-500'}`}><Icon className="size-4" />{label}</button>)}</div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="rounded-2xl bg-nakoo-green-50 p-4">
        {(tab === 'materials' ? materials : steps).length ? <ul className="space-y-2">{(tab === 'materials' ? materials : steps).map((entry, index) => { const key = `${tab}-${index}`; return <li key={key}><button type="button" aria-pressed={!!checked[key]} onClick={() => setChecked(current => ({ ...current, [key]: !current[key] }))} className="flex items-start gap-3 w-full text-left py-2 min-h-11"><span className={`size-5 shrink-0 mt-0.5 border rounded-md flex items-center justify-center ${checked[key] ? 'bg-nakoo-green-600 border-nakoo-green-600 text-white' : 'border-nakoo-green-300 bg-white'}`}>{checked[key] && <Check className="size-3.5" />}</span><span className="flex-1 min-w-0"><span className={`text-sm ${checked[key] ? 'line-through text-neutral-400' : ''}`}>{entry.name || entry.title || entry}</span>{entry.desc && <span className="block text-xs leading-relaxed text-neutral-500 mt-1">{entry.desc}</span>}</span>{entry.qty && <span className="text-xs text-neutral-500 shrink-0 pt-0.5">{entry.qty}</span>}</button></li> })}</ul> : <p className="text-sm leading-relaxed text-neutral-500">{tab === 'materials' ? 'Rincian bahan belum tersedia untuk pilihan ini.' : 'Panduan langkah belum tersedia untuk pilihan ini.'}</p>}
      </div>
      {item.tips && <p className="mt-4 text-sm leading-relaxed rounded-2xl bg-primary-50 p-4"><strong>Tips bermain</strong><br />{item.tips}</p>}
      {preview && <p className="text-xs text-neutral-500 mt-4">Katalog contoh. Penyimpanan memerlukan koneksi ke server.</p>}
      <Link to={base} className="inline-flex items-center min-h-12 text-sm text-nakoo-green-700 mt-3">Jelajahi pilihan lainnya →</Link>
      <div className="detail-footer fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/95 backdrop-blur px-5 pt-3 border-t border-neutral-100 z-20"><button type="button" disabled={!!busy} onClick={() => act('plan')} className="w-full min-h-14 rounded-full bg-primary-500 text-primary-900 font-semibold text-sm flex items-center justify-center gap-2"><Plus className="size-4 shrink-0" />{busy === 'plan' ? 'Menyimpan rencana...' : 'Tambahkan ke rencana hari ini'}</button></div>
    </main>}
    <AuthPromptModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
  </div>
}
