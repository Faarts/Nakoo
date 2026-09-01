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
import { Heart, AlertTriangle, SlidersHorizontal, ArrowRight, Plus } from 'lucide-react';
import { DUMMY_RECIPES } from '../../.mock/recipes';
import category01 from '../assets/img/category 01.png';
import category02 from '../assets/img/category 02.png';
import category03 from '../assets/img/category 03.png';
import category04 from '../assets/img/category 04.png';
import category05 from '../assets/img/category 05.png';

const ageFilters = [
  { label: 'Semua', value: 'all' },
  { label: '6-12 bln', value: '6-12' },
  { label: '12-24 bln', value: '12-24' },
  { label: '24-36 bln', value: '24-36' }
];

const categories = [
  { label: 'Semua', value: 'all', icon: category01 },
  { label: 'Sarapan', value: 'breakfast', icon: category02 },
  { label: 'Makan Siang', value: 'lunch', icon: category03 },
  { label: 'Cemilan', value: 'snack', icon: category04 },
  { label: 'Makan Malam', value: 'dinner', icon: category05 }
];

const getRecipeImage = (recipe, idx) => {
  if (recipe?.image) return recipe.image;
  const num = ((idx % 8) + 1).toString().padStart(2, '0');
  return `/img/food-${num}.png`;
};

export function ExploreMenu() {
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');

  // Default age filter to 'all' or profile's age range
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState(null);

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
          const res = await api.get('/api/recipes');
          setRecipes(res?.recipes && res.recipes.length > 0 ? res.recipes : DUMMY_RECIPES);
        }

        if (user) {
          const resFavs = await api.get('/api/favorites');
          setFavorites(resFavs.favorites || []);
        }
      } catch (err) {
        console.error("Failed to fetch recipes", err);
        setRecipes(DUMMY_RECIPES);
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

  const addToPlan = async (recipe) => {
    if (!user) {
      showToast("Silakan masuk (login) untuk menambahkan ke rencana", "error");
      return;
    }
    setAddingId(recipe.id);
    try {
      await api.post('/api/daily-plans/add-recipe', { recipe_id: recipe.id });
      showToast("Ditambahkan ke rencana hari ini", "success");
    } catch (e) {
      showToast("Gagal menambahkan ke rencana", "error");
    } finally {
      setAddingId(null);
    }
  };

  const filteredRecipes = recipes.filter(r => {
    if (activeFilter !== 'all' && r.age_range !== activeFilter) return false;
    if (activeCategory !== 'all' && r.type !== activeCategory) return false;
    if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    // Advanced filters from FilterBottomSheet
    if (advancedFilters) {
      if (advancedFilters.alergen?.length > 0) {
        const recipeAllergens = JSON.parse(r.allergens || '[]');
        const shouldExclude = advancedFilters.alergen.some(a => {
          const allergenMap = { 'Tanpa Telur': 'telur', 'Tanpa Susu': 'susu sapi', 'Tanpa Kacang': 'kacang', 'Tanpa Gluten': 'gluten' };
          return recipeAllergens.includes(allergenMap[a]);
        });
        if (shouldExclude) return false;
      }
    }
    return true;
  });

  const childAllergies = profile?.alergies ? JSON.parse(profile.alergies) : [];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 pt-6 pb-2 shadow-sm">
        <div className="px-4 mb-3">
          <h1 className="text-2xl font-display font-bold text-neutral-900 mb-1">Eksplorasi Menu</h1>
          <p className="text-neutral-600 text-sm">Temukan ide resep bernutrisi untuk si kecil</p>
        </div>
        <div className="px-4 mb-3 flex items-center gap-3">
          <div className="flex-1">
            <SearchBar placeholder="Cari resep..." onSearch={setSearchQuery} />
          </div>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="w-11 h-11 shrink-0 flex items-center justify-center rounded-full bg-nakoo-green-50 border border-white hover:bg-neutral-50 active:scale-95 transition-all relative shadow-inner-white cursor-pointer"
            aria-label="Filter"
          >
            <SlidersHorizontal className="w-5 h-5 text-nakoo-green-700" strokeWidth={2.5} />
            {advancedFilters && Object.values(advancedFilters).some(v => Array.isArray(v) ? v.length > 0 : !!v) && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-nakoo-red-500 rounded-full border border-white"></span>
            )}
          </button>
        </div>

        {/* Filter Usia Bar */}
        <div className="pl-4 pb-2">
          <FilterBar
            filters={ageFilters}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </div>

        {/* Kategori Section */}
        <div className="mb-2 mt-2">
          <h2 className="text-base font-bold text-neutral-800 mb-1 px-4">Kategori</h2>
          <div className="flex overflow-x-auto gap-4 py-2 px-4 scrollbar-hide">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setActiveCategory(cat.value)}
                  className="flex flex-col items-center gap-2 min-w-fit cursor-pointer group"
                >
                  <div
                    className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-3xl transition-all duration-300 ease-out active:scale-90 group-hover:scale-105 ${isActive
                      ? 'bg-orange-100 ring-2 ring-orange-400 ring-offset-2 shadow-xs scale-105'
                      : 'bg-primary-50 hover:bg-orange-100/70'
                      }`}
                  >
                    {cat.icon && <img src={cat.icon} alt={cat.label} className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300" />}
                  </div>
                  <span className={`text-xs transition-colors duration-200 ${isActive ? 'text-orange-950 font-bold' : 'text-neutral-600 font-medium group-hover:text-neutral-900'}`}>
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
              <div className="animate-slide-up-fade">
                <div className="flex justify-between items-center px-4 mb-3">
                  <h2 className="text-base font-bold text-neutral-800">Rekomendasi untuk si kecil</h2>
                  <ArrowRight className="w-5 h-5 text-neutral-600" />
                </div>
                <div className="flex overflow-x-auto gap-4 px-4 pb-2 scrollbar-hide">
                  {filteredRecipes.slice(0, 2).map((recipe, idx) => (
                    <Link key={`rec-${recipe.id}`} to={`/explore/menu/${recipe.id}`} className="shrink-0 w-[280px]">
                      <Card className="!p-0 overflow-hidden border border-neutral-100/80 shadow-card rounded-2xl h-full group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                        <div className="aspect-[16/9] bg-neutral-100 relative overflow-hidden">
                          <img 
                            src={getRecipeImage(recipe, idx)} 
                            alt={recipe.title} 
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" 
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        </div>
                        <div className="p-3.5">
                          <h3 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{recipe.title}</h3>
                          <div className="flex gap-2">
                            <Badge variant="yellow" className="bg-[#FFF5EB] text-orange-700 !px-2 !py-0.5 font-semibold">{recipe.age_range} bulan</Badge>
                            <Badge variant="default" className="bg-purple-50 text-purple-600 !px-2 !py-0.5 font-semibold">{recipe.type || 'Menu'}</Badge>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Makanan Hari Ini Section */}
            {filteredRecipes.length > 0 && (
              <div className="px-4">
                <h2 className="text-base font-bold text-neutral-800 mb-3">Makanan Hari Ini</h2>
                <div className="grid grid-cols-2 gap-4">
                  {filteredRecipes.map((recipe, idx) => {
                    const recipeAllergens = JSON.parse(recipe.allergens || "[]");
                    const hasAllergenWarning = recipeAllergens.some(a => childAllergies.includes(a));
                    const isFav = favorites.some(f => f.item_type === 'meal' && f.item_id === recipe.id);

                    return (
                      <Link key={recipe.id} to={`/explore/menu/${recipe.id}`} className="block h-full group">
                        <Card className="!p-0 overflow-hidden flex flex-col h-full border border-neutral-100/80 shadow-card hover:shadow-lg hover:-translate-y-1 rounded-2xl transition-all duration-300">
                          <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                            <img 
                              src={getRecipeImage(recipe, idx)} 
                              alt={recipe.title} 
                              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" 
                              loading="lazy"
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleFavorite(recipe);
                              }}
                              className="absolute top-2 right-2 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur rounded-full text-neutral-400 hover:text-red-500 active:scale-75 hover:scale-110 transition-all duration-200 z-10 shadow-xs cursor-pointer"
                              aria-label={isFav ? 'Hapus dari favorit' : 'Simpan ke favorit'}
                            >
                              <Heart className={`w-4 h-4 transition-colors ${isFav ? 'fill-red-500 text-red-500 animate-heart-burst' : ''}`} />
                            </button>
                            {hasAllergenWarning && (
                              <div className="absolute bottom-2 left-2 right-2 bg-red-100/90 backdrop-blur text-red-800 text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium shadow-sm animate-pulse">
                                <AlertTriangle className="w-3 h-3 shrink-0" />
                                <span className="truncate">Alergen: {recipeAllergens.find(a => childAllergies.includes(a))}</span>
                              </div>
                            )}
                          </div>
                          <div className="p-3 flex flex-col grow">
                            <h3 className="font-bold text-neutral-900 text-sm mb-2 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                              {recipe.title}
                            </h3>
                            <div className="mt-auto flex items-center gap-2 flex-wrap">
                              <Badge variant="yellow" className="!px-2 !py-0.5 !text-[10px] bg-primary-50 text-primary-700 font-semibold">{recipe.age_range} bln</Badge>
                              {recipe.prep_time && <Badge variant="default" className="!px-2 !py-0.5 !text-[10px] font-semibold">{recipe.prep_time} mnt</Badge>}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addToPlan(recipe);
                              }}
                              disabled={addingId === recipe.id}
                              className="mt-2.5 w-full py-2 rounded-full bg-[#FBB040] hover:bg-[#faa020] text-white text-xs font-bold flex items-center justify-center gap-1 active:scale-95 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {addingId === recipe.id ? 'Menambahkan...' : 'Tambahkan rencana'}
                            </button>
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <FilterBottomSheet
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={(filters) => setAdvancedFilters(filters)}
      />
    </div>
  );
}
