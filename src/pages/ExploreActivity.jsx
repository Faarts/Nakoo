import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import { Heart, Clock, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { DUMMY_ACTIVITIES } from '../../.mock/activities';

const ageFilters = [
  { label: 'Semua', value: 'all' },
  { label: '6-12 bln', value: '6-12' },
  { label: '12-24 bln', value: '12-24' },
  { label: '24-36 bln', value: '24-36' }
];

export function ExploreActivity() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [activities, setActivities] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  // Default age filter to 'all' or profile's age range
  const [activeFilter, setActiveFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(null);

  useEffect(() => {
    if (profile?.birth_date) {
      const birthDate = new Date(profile.birth_date);
      const now = new Date();
      const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth();
      if (months < 12) setActiveFilter('6-12');
      else if (months < 24) setActiveFilter('12-24');
      else setActiveFilter('24-36');
    }
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          setActivities(DUMMY_ACTIVITIES);
        } else {
          const resActs = await api.get('/api/activities');
          setActivities(resActs.activities || DUMMY_ACTIVITIES);
        }
        if (user) {
          const resFavs = await api.get('/api/favorites');
          setFavorites(resFavs.favorites || []);
        }
      } catch (err) {
        console.error(err);
        setActivities(DUMMY_ACTIVITIES);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleFavorite = async (e, activity) => {
    e.preventDefault();
    if (!user) {
      showToast("Silakan login untuk menyimpan favorit", "error");
      return;
    }
    const isFav = favorites.find(f => f.item_id === activity.id && f.item_type === 'activity');
    try {
      if (isFav) {
        setFavorites(prev => prev.filter(f => f.id !== isFav.id));
        await api.delete(`/api/favorites/activity/${activity.id}`);
      } else {
        const tempFav = { id: Date.now().toString(), item_type: 'activity', item_id: activity.id };
        setFavorites(prev => [...prev, tempFav]);
        await api.post('/api/favorites', { item_type: 'activity', item_id: activity.id });
        const resFavs = await api.get('/api/favorites');
        setFavorites(resFavs.favorites || []);
      }
    } catch (e) {
      showToast("Gagal mengubah favorit", "error");
    }
  };

  const filteredActivities = activities.filter(a => {
    if (activeFilter !== 'all' && a.age_range !== activeFilter) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (advancedFilters) {
      if (advancedFilters.skill?.length > 0) {
        const actSkills = JSON.parse(a.skills || '[]');
        const shouldInclude = advancedFilters.skill.some(s => actSkills.includes(s));
        if (!shouldInclude) return false;
      }
    }
    return true;
  });

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 pt-6 pb-2 shadow-sm">
        <div className="px-4 mb-3">
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Eksplorasi Aktivitas</h1>
          <p className="text-neutral-600 text-sm">Temukan ide bermain dan stimulasi untuk si kecil</p>
        </div>
        <div className="px-4 mb-3 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar placeholder="Cari aktivitas..." onSearch={setSearchQuery} />
          </div>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white hover:bg-neutral-50 active:scale-95 transition-all relative shadow-inner-white"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-5 h-5 text-nakoo-green-700" />
            {advancedFilters && Object.values(advancedFilters).some(v => v.length > 0) && (
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-nakoo-red-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
        <div className="pl-4 pb-2">
          <FilterBar
            filters={ageFilters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>
      </div>

      {/* Grid Content */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
            <Skeleton className="h-48 rounded-3xl" />
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="mt-12">
            <EmptyState
              title="Aktivitas tidak ditemukan"
              message="Coba ubah kata kunci atau kurangi filter untuk menemukan lebih banyak ide."
              icon={<SearchX className="w-12 h-12 text-neutral-300" />}
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filteredActivities.map((act) => {
              const isFav = favorites.some(f => f.item_id === act.id && f.item_type === 'activity');
              const skills = JSON.parse(act.skills || '[]');
              const image = DUMMY_ACTIVITIES.find(a => a.id === act.id)?.image || "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600";
              
              return (
                <Link to={`/explore/activity/${act.id}`} key={act.id} className="block relative group">
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={(e) => toggleFavorite(e, act)}
                      className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-nakoo-red-500 text-nakoo-red-500' : 'text-neutral-400'}`} />
                    </button>
                  </div>

                  <Card className="p-0 overflow-hidden h-full flex flex-col group-hover:shadow-md transition-shadow duration-300 border border-neutral-100">
                    <div className="h-32 bg-neutral-200 relative overflow-hidden">
                      <img src={image} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-2 left-2 flex gap-1">
                        <Badge variant="glass" icon={<Clock className="w-3 h-3" />}>
                          {act.duration} mnt
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {skills.map(skill => (
                          <span key={skill} className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                            {skill.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                      <h3 className="font-bold text-neutral-900 text-sm leading-tight mb-2 line-clamp-2">
                        {act.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs font-semibold text-nakoo-green-700 bg-nakoo-green-50 px-2 py-1 rounded-md">
                          {act.age_range} bln
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-nakoo-green-600 transition-colors" />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        type="activity"
        onApply={(filters) => {
          setAdvancedFilters(filters);
          setIsFilterOpen(false);
        }}
      />
    </div>
  );
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
