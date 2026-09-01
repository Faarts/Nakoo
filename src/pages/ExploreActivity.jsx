import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SearchBar } from '../components/SearchBar'
import { FilterBottomSheet } from '../components/FilterBottomSheet'
import { Skeleton } from '../components/Skeleton'
import { EmptyState } from '../components/EmptyState'
import { useAuth } from '../lib/AuthContext'
import { useToast } from '../components/Toast'
import { api } from '../lib/api'
import { AuthPromptModal } from '../components/AuthPromptModal'
import { Heart, SlidersHorizontal, ArrowRight } from 'lucide-react'
import { DUMMY_ACTIVITIES } from '../../.mock/activities'

const quickFilters = [
  { label: '<10 min', value: 'dur_10' },
  { label: '6-8 bulan', value: 'age_6-12' },
  { label: '🧠 Kognitif', value: 'skill_kognitif' },
  { label: 'Kertas', value: 'tag_Kertas' },
  { label: 'Quiet Time', value: 'tag_Quiet Time' },
  { label: 'Indoor', value: 'tag_Indoor' },
]

// Safely parse skills — handles both JS array and JSON string
function parseSkills(skills) {
  if (Array.isArray(skills)) return skills
  if (typeof skills === 'string') {
    try {
      const parsed = JSON.parse(skills)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

// Get activity image, fallback to rotating public images
function getActivityImage(activity, idx) {
  if (activity?.image) return activity.image
  const num = ((idx % 3) + 1).toString().padStart(2, '0')
  return `/img/act-${num}.png`
}

// Translate skill names to readable labels
const skillLabels = {
  motorik_halus: 'Motorik Halus',
  motorik_kasar: 'Motorik Kasar',
  kognitif: 'Kognitif',
  kreativitas: 'Kreativitas',
  sensori: 'Sensori',
  bahasa: 'Bahasa',
  sosial_emosional: 'Sosial & Emosi',
}

export function ExploreActivity() {
  const { user, profile } = useAuth()
  const { showToast } = useToast()

  const [activities, setActivities] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeQuickFilters, setActiveQuickFilters] = useState([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          setActivities(DUMMY_ACTIVITIES)
        } else {
          const resActs = await api.get('/api/activities')
          setActivities(resActs.activities?.length > 0 ? resActs.activities : DUMMY_ACTIVITIES)
        }
        if (user) {
          try {
            const resFavs = await api.get('/api/favorites')
            setFavorites(resFavs.favorites || [])
          } catch {
            // not logged in or favorites failed — no problem
          }
        }
      } catch (err) {
        console.error(err)
        setActivities(DUMMY_ACTIVITIES)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const toggleFavorite = async (e, activity) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      setShowAuthModal(true)
      return
    }
    const isFav = favorites.find(f => f.item_id === activity.id && f.item_type === 'activity')
    try {
      if (isFav) {
        setFavorites(prev => prev.filter(f => f.id !== isFav.id))
        await api.delete(`/api/favorites/activity/${activity.id}`)
      } else {
        const tempFav = { id: Date.now().toString(), item_type: 'activity', item_id: activity.id }
        setFavorites(prev => [...prev, tempFav])
        await api.post('/api/favorites', { item_type: 'activity', item_id: activity.id })
        const resFavs = await api.get('/api/favorites')
        setFavorites(resFavs.favorites || [])
      }
    } catch {
      showToast('Gagal mengubah favorit', 'error')
    }
  }

  const toggleQuickFilter = (value) => {
    setActiveQuickFilters(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  // Filter activities
  const filteredActivities = activities.filter(a => {
    // Search
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

    // Quick filters
    for (const qf of activeQuickFilters) {
      if (qf.startsWith('dur_')) {
        const maxDur = parseInt(qf.split('_')[1])
        if (a.duration > maxDur) return false
      }
      if (qf.startsWith('age_')) {
        const ageVal = qf.split('_')[1]
        if (a.age_range !== ageVal) return false
      }
      if (qf.startsWith('skill_')) {
        const skillVal = qf.split('_')[1]
        const skills = parseSkills(a.skills)
        if (!skills.includes(skillVal)) return false
      }
      if (qf.startsWith('tag_')) {
        const tagVal = qf.split('_')[1]
        const tags = a.tags || []
        if (!tags.includes(tagVal)) return false
      }
    }

    // Advanced filters
    if (advancedFilters) {
      if (advancedFilters.skill?.length > 0) {
        const actSkills = parseSkills(a.skills)
        const shouldInclude = advancedFilters.skill.some(s => actSkills.includes(s))
        if (!shouldInclude) return false
      }
    }

    return true
  })

  // Split into trending (first 2) and all
  const trendingActivities = filteredActivities.slice(0, 2)
  const allActivities = filteredActivities

  return (
    <div className="pb-4">
      {/* Page Title */}
      <div className="px-4 pt-1 pb-4">
        <h1 className="text-2xl font-bold text-neutral-900">Eksplor Aktivitas</h1>
      </div>

      {/* Search + Filter Button */}
      <div className="px-4 mb-3 flex items-center gap-3">
        <div className="flex-1">
          <SearchBar placeholder="Cari kegiatan seru untuk si buah hati..." onSearch={setSearchQuery} />
        </div>
        <button
          type="button"
          onClick={() => setIsFilterOpen(true)}
          className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-nakoo-green-50 border border-nakoo-green-100 hover:bg-nakoo-green-100 active:scale-95 transition-all relative cursor-pointer"
          aria-label="Filter"
        >
          <SlidersHorizontal className="w-5 h-5 text-nakoo-green-600" strokeWidth={2.5} />
          {advancedFilters && Object.values(advancedFilters).some(v => Array.isArray(v) ? v.length > 0 : !!v) && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-nakoo-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex overflow-x-auto gap-2 px-4 pb-4 scrollbar-hide">
        {quickFilters.map(qf => {
          const isActive = activeQuickFilters.includes(qf.value)
          return (
            <button
              key={qf.value}
              type="button"
              onClick={() => toggleQuickFilter(qf.value)}
              className={`h-9 px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ease-out active:scale-95 cursor-pointer border ${
                isActive
                  ? 'bg-orange-500 text-white border-orange-500 shadow-xs scale-105'
                  : 'bg-white text-neutral-600 border-neutral-200/80 hover:bg-orange-50/50 hover:border-orange-200'
              }`}
            >
              {qf.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="px-4">
          {/* Skeleton Trending */}
          <div className="mb-6">
            <Skeleton className="h-5 w-24 rounded-md mb-3" />
            <div className="flex gap-4 overflow-hidden">
              <Skeleton className="h-52 w-[55%] shrink-0 rounded-2xl" />
              <Skeleton className="h-52 w-[55%] shrink-0 rounded-2xl" />
            </div>
          </div>
          {/* Skeleton Grid */}
          <Skeleton className="h-5 w-32 rounded-md mb-3" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      ) : filteredActivities.length === 0 ? (
        <div className="mt-12 px-4">
          <EmptyState
            title="Aktivitas tidak ditemukan"
            message="Coba ubah kata kunci atau kurangi filter untuk menemukan lebih banyak ide bermain."
            icon="🧩"
          />
        </div>
      ) : (
        <div className="animate-slide-up-fade">
          {/* Trending Section */}
          {trendingActivities.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center px-4 mb-3">
                <h2 className="text-base font-bold text-neutral-800">Trending</h2>
                <ArrowRight className="w-5 h-5 text-neutral-400" />
              </div>
              <div className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide">
                {trendingActivities.map((act, idx) => {
                  const isFav = favorites.some(f => f.item_id === act.id && f.item_type === 'activity')
                  const skills = parseSkills(act.skills)
                  const tags = act.tags || skills.map(s => skillLabels[s] || s)
                  const image = getActivityImage(act, idx)

                  return (
                    <Link
                      to={`/explore/activity/${act.id}`}
                      key={`trending-${act.id}`}
                      className="shrink-0 w-[55%] group"
                    >
                      <div className="relative bg-white rounded-2xl p-3 border border-neutral-100/80 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleFavorite(e, act)}
                          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs hover:scale-110 active:scale-75 transition-all duration-200 cursor-pointer"
                        >
                          <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-nakoo-red-500 text-nakoo-red-500 animate-heart-burst' : 'text-neutral-400'}`} />
                        </button>

                        {/* Image */}
                        <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-2.5">
                          <img
                            src={image}
                            alt={act.title}
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                        </div>

                        {/* Title */}
                        <h3 className="font-bold text-neutral-800 text-sm mb-2 line-clamp-1 group-hover:text-nakoo-green-700 transition-colors">
                          {act.title}
                        </h3>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {tags.slice(0, 2).map(tag => (
                            <span
                              key={tag}
                              className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {tags.length > 2 && (
                            <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full border border-neutral-200/40">
                              +{tags.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )}

          {/* Aktivitas Hari Ini Section */}
          <div className="px-4">
            <h2 className="text-base font-bold text-neutral-800 mb-3">Aktivitas Hari Ini</h2>
            <div className="grid grid-cols-2 gap-4">
              {allActivities.map((act, idx) => {
                const isFav = favorites.some(f => f.item_id === act.id && f.item_type === 'activity')
                const skills = parseSkills(act.skills)
                const tags = act.tags || skills.map(s => skillLabels[s] || s)
                const image = getActivityImage(act, idx)

                return (
                  <Link
                    to={`/explore/activity/${act.id}`}
                    key={act.id}
                    className="block group"
                  >
                    <div className="relative bg-white rounded-2xl p-3 border border-neutral-100/80 shadow-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                      {/* Favorite button */}
                      <button
                        onClick={(e) => toggleFavorite(e, act)}
                        className="absolute top-4 right-4 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-xs hover:scale-110 active:scale-75 transition-all duration-200 cursor-pointer"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${isFav ? 'fill-nakoo-red-500 text-nakoo-red-500 animate-heart-burst' : 'text-neutral-400'}`} />
                      </button>

                      {/* Image */}
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-neutral-100 mb-2.5">
                        <img
                          src={image}
                          alt={act.title}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-neutral-800 text-sm mb-2 line-clamp-1 group-hover:text-nakoo-green-700 transition-colors">
                        {act.title}
                      </h3>

                      {/* Tags */}
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        {tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-200/50"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        type="activity"
        onApply={(filters) => {
          setAdvancedFilters(filters)
          setIsFilterOpen(false)
        }}
      />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        title="Simpan Aktivitas ke Favorit"
        message="Untuk menyimpan aktivitas ke favorit atau menyusunnya dalam rencana bermain si kecil, Bunda perlu masuk atau membuat akun Nakoo terlebih dahulu."
        itemType="aktivitas"
      />
    </div>
  )
}

function SearchX(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m13.5 8.5-5 5" />
      <path d="m8.5 8.5 5 5" />
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
