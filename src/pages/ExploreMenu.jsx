import React, { useState, useEffect } from 'react';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { Badge } from '../components/Badge';
import { useAuth } from '../lib/AuthContext';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import { Heart, Clock, AlertTriangle, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { DUMMY_RECIPES } from '../../.mock/recipes';

const ageFilters = [
  { label: 'Semua', value: 'all' },
  { label: '6-12 bln', value: '6-12' },
  { label: '12-24 bln', value: '12-24' },
  { label: '24-36 bln', value: '24-36' }
];

const categories = [
  { label: 'Semua', value: 'all', icon: '🍲' },
  { label: 'Sarapan', value: 'breakfast', icon: '🥣' },
  { label: 'Makan Siang', value: 'lunch', icon: '🍛' },
  { label: 'Cemilan', value: 'snack', icon: '🥮' },
  { label: 'Makan Malam', value: 'dinner', icon: '🍝' }
];

export function ExploreMenu() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  // Default age filter to 'all' or profile's age range
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    if (profile?.birth_date) {
      const birthDate = new Date(profile.birth_date);
      const now = new Date();
      const months = (now.getFullYear() - birthDate.getFullYear()) * 12 + now.getMonth() - birthDate.getMonth();
      let ageRange = '6-12';
      if (months >= 12 && months < 24) ageRange = '12-24';
      if (months >= 24) ageRange = '24-36';
      setActiveFilter(ageRange);
    }
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          setRecipes(DUMMY_RECIPES);
        } else {
          const { recipes } = await api.get('/api/recipes');
          setRecipes(recipes || []);
        }

        if (user) {
          const resFavs = await api.get('/api/favorites');
          setFavorites(resFavs.favorites || []);
        }
      } catch (err) {
        console.error("Failed to fetch recipes", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const toggleFavorite = async (recipe) => {
    if (!user) {
      showToast("Silakan masuk (login) untuk menyimpan resep favorit", "error");
      return;
    }

    const isFav = favorites.find(f => f.item_type === 'meal' && f.item_id === recipe.id);
    try {
      if (isFav) {
        // optimistically remove
        setFavorites(prev => prev.filter(f => f.id !== isFav.id));
        await api.delete(`/api/favorites/meal/${recipe.id}`);
      } else {
        // optimistically add
        const tempFav = { id: Date.now().toString(), item_type: 'meal', item_id: recipe.id };
        setFavorites(prev => [...prev, tempFav]);
        await api.post('/api/favorites', { item_type: 'meal', item_id: recipe.id });
        // re-fetch to get real ID
        const resFavs = await api.get('/api/favorites');
        setFavorites(resFavs.favorites || []);
      }
    } catch (e) {
      showToast("Gagal mengubah favorit", "error");
    }
  };

  const filteredRecipes = recipes.filter(r => {
    if (activeFilter !== 'all' && r.age_range !== activeFilter) return false;
    if (activeCategory !== 'all' && r.type !== activeCategory) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const childAllergies = profile?.alergies ? JSON.parse(profile.alergies) : [];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 pt-6 pb-2 shadow-sm">
        <div className="px-4 mb-3">
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Eksplorasi Menu</h1>
          <p className="text-neutral-500 text-sm">Temukan ide resep bernutrisi untuk si kecil</p>
        </div>
        <div className="px-4 mb-3 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar placeholder="Cari resep..." onSearch={setSearchQuery} />
          </div>
          <button
            type="button"
            onClick={() => {
              // TODO: Implementasi filter
              console.log("Filter ditekan");
            }}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white hover:bg-neutral-50 active:scale-95 transition-all relative shadow-[inset_0_4px_12px_white]"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-5 h-5 text-nakoo-green-500" strokeWidth={2.5} />
          </button>
        </div>

        {/* Kategori Section */}
        <div className="mb-2 mt-4">
          <h2 className="text-base font-bold text-neutral-800 mb-1 px-4">Kategori</h2>
          <div className="flex overflow-x-auto gap-4 py-2 px-4 scrollbar-hide">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCategory(cat.value)}
                  className="flex flex-col items-center gap-2 min-w-fit"
                >
                  <div
                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl shadow-sm transition-all ${isActive
                      ? 'bg-orange-100 ring-2 ring-orange-400 ring-offset-1'
                      : 'bg-[#FFF5EB] hover:bg-orange-100'
                      }`}
                  >
                    {cat.icon}
                  </div>
                  <span className={`text-xs ${isActive ? 'text-neutral-900 font-semibold' : 'text-neutral-600 font-medium'}`}>
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-32 w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="Resep Tidak Ditemukan"
              description="Coba ubah kata kunci pencarian atau longgarkan filter umur untuk melihat lebih banyak pilihan."
              actionLabel="Reset Filter"
              onAction={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6 -mx-4">
            {/* Rekomendasi Section */}
            {filteredRecipes.length > 0 && (
              <div>
                <div className="flex justify-between items-center px-4 mb-3">
                  <h2 className="text-base font-bold text-neutral-800">Rekomendasi untuk si kecil</h2>
                  <ArrowRight className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide">
                  {filteredRecipes.slice(0, 2).map(recipe => (
                    <Card key={`rec-${recipe.id}`} className="!p-0 overflow-hidden shrink-0 w-[280px] border border-neutral-100 shadow-sm rounded-2xl">
                      <div className="aspect-[16/9] bg-neutral-100 relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 opacity-60" />
                      </div>
                      <div className="p-3">
                        <h3 className="font-semibold text-neutral-900 text-sm mb-2 line-clamp-1">{recipe.title}</h3>
                        <div className="flex gap-2">
                          <Badge variant="yellow" className="bg-[#FFF5EB] text-orange-700 !px-2 !py-0.5 font-medium">{recipe.age_range} bulan</Badge>
                          <Badge variant="default" className="bg-purple-50 text-purple-600 !px-2 !py-0.5 font-medium">+3</Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Makanan Hari Ini Section */}
            {filteredRecipes.length > 0 && (
              <div className="px-4">
                <h2 className="text-base font-bold text-neutral-800 mb-3">Makanan Hari Ini</h2>
                <div className="grid grid-cols-2 gap-4">
                  {filteredRecipes.map(recipe => {
                    const recipeAllergens = JSON.parse(recipe.allergens || "[]");
                    const hasAllergenWarning = recipeAllergens.some(a => childAllergies.includes(a));
                    const isFav = favorites.some(f => f.item_type === 'meal' && f.item_id === recipe.id);

                    return (
                      <Card key={recipe.id} className="!p-0 overflow-hidden group flex flex-col h-full border border-neutral-100 shadow-sm hover:shadow-md rounded-2xl">
                        <div className="aspect-[4/3] bg-neutral-100 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-100 opacity-50" />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              toggleFavorite(recipe);
                            }}
                            className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full text-neutral-400 hover:text-red-500 transition-colors"
                          >
                            <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                          </button>
                          {hasAllergenWarning && (
                            <div className="absolute bottom-2 left-2 right-2 bg-red-100/90 backdrop-blur text-red-800 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium shadow-sm">
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                              <span className="truncate">Alergen: {recipeAllergens.find(a => childAllergies.includes(a))}</span>
                            </div>
                          )}
                        </div>
                        <div className="p-3 flex flex-col grow">
                          <h3 className="font-semibold text-neutral-900 text-sm mb-2 line-clamp-2 leading-tight">
                            {recipe.title}
                          </h3>
                          <div className="mt-auto flex items-center gap-2 flex-wrap">
                            <Badge variant="red" className="!px-1.5 !py-0.5 !text-[10px] gap-1 bg-red-50 text-red-600">🍎 Buah</Badge>
                            <Badge variant="yellow" className="!px-1.5 !py-0.5 !text-[10px] gap-1 bg-yellow-50 text-yellow-600">🧀 Keju</Badge>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
