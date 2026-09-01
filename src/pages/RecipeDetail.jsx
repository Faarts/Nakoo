import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Flame, Dna, Droplet, LayoutList, ListOrdered, MoreHorizontal } from 'lucide-react';
import { DUMMY_RECIPES } from '../../.mock/recipes';
import { useToast } from '../components/Toast';

// Contextual recipe details map
const RECIPE_DETAILS = {
  r1: {
    description: "Minuman puree alpukat kocok lezat dan bergizi tinggi, kaya akan lemak sehat (asam folat) yang sangat baik untuk perkembangan otak dan daya tahan tubuh si kecil.",
    calories: 140,
    protein: 3,
    fat: 8,
    tags: ['6–12 bulan', 'Lumat', 'Camilan'],
    images: ['/img/food-01.png', '/img/food-03.png', '/img/food-05.png', '/img/food-07.png'],
    ingredients: [
      { name: 'Alpukat Mentega Matang', qty: '1/2 buah' },
      { name: 'ASI / Susu Formula / UHT', qty: '50 ml' },
      { name: 'Keju parut lembut', qty: '1 sdt' }
    ],
    steps: [
      { title: 'Belah Alpukat', desc: 'Ambil daging alpukat matang dengan sendok bersih.' },
      { title: 'Haluskan Sesuai Tekstur', desc: 'Hancurkan alpukat menggunakan garpu atau saringan kawat hingga lembut.' },
      { title: 'Tambahkan Susu & Keju', desc: 'Campurkan susu sedikit demi sedikit dan taburi sedikit parutan keju di atasnya.' }
    ]
  },
  r2: {
    description: "Pasta empuk dengan saus cincang daging sapi dan sayuran bergizi. Mengandung zat besi dan protein tinggi untuk pertumbuhan optimal si kecil.",
    calories: 280,
    protein: 12,
    fat: 6,
    tags: ['12–24 bulan', 'Rebus', 'Makan Siang'],
    images: ['/img/food-02.png', '/img/food-04.png', '/img/food-06.png', '/img/food-08.png'],
    ingredients: [
      { name: 'Pasta Makaroni / Fusilli', qty: '50 gr' },
      { name: 'Daging Sapi Cincang', qty: '40 gr' },
      { name: 'Wortel & Tomat Cincang', qty: '2 sdm' },
      { name: 'Minyak Kelapa / Canola', qty: '1 sdt' }
    ],
    steps: [
      { title: 'Rebus Pasta', desc: 'Rebus pasta hingga matang dan sangat empuk untuk si kecil.' },
      { title: 'Tumis Daging & Sayur', desc: 'Tumis daging cincang bersama wortel dan tomat sampai harum dan matang.' },
      { title: 'Campur & Sajikan', desc: 'Campurkan saus daging ke dalam pasta rebus, aduk rata dan sajikan hangat.' }
    ]
  }
};

const getDefaultDetail = (recipe, id) => {
  const num = (parseInt(id?.replace('r', '') || '1') % 8) || 1;
  const numStr = num.toString().padStart(2, '0');
  return {
    description: `${recipe?.title || 'Menu bernutrisi'} dirancang khusus sesuai tahapan usia si kecil dengan gizi seimbang untuk mendukung tumbuh kembang hariannya.`,
    calories: 180,
    protein: 6,
    fat: 5,
    tags: [`${recipe?.age_range || '12-24'} bln`, 'Gizi Seimbang', recipe?.type || 'Menu'],
    images: [`/img/food-${numStr}.png`, '/img/food-01.png', '/img/food-02.png', '/img/food-03.png'],
    ingredients: [
      { name: 'Bahan Utama Pilihan', qty: '1 porsi' },
      { name: 'Sayuran Segar', qty: 'Secukupnya' },
      { name: 'Kaldu Homemade', qty: '50 ml' }
    ],
    steps: [
      { title: 'Persiapan Bahan', desc: 'Cuci bersih semua bahan dan potong sesuai tekstur usia si kecil.' },
      { title: 'Proses Memasak', desc: 'Masak dengan api sedang hingga semua bahan matang sempurna dan empuk.' },
      { title: 'Penyajian', desc: 'Sajikan selagi hangat dan pastikan suhunya aman sebelum diberikan ke si kecil.' }
    ]
  };
};

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('bahan');
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  // Find base recipe from mock, fallback to dummy
  const baseRecipe = DUMMY_RECIPES.find(r => r.id === id) || { id, title: 'Menu Bernutrisi', age_range: '12-24' };
  
  // Merge base recipe with contextual details
  const detail = RECIPE_DETAILS[id] || getDefaultDetail(baseRecipe, id);
  const recipe = { ...baseRecipe, ...detail };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(isFavorite ? 'Dihapus dari favorit' : 'Disimpan ke favorit ❤️', isFavorite ? 'info' : 'success');
  };

  const handleAddToPlan = () => {
    showToast('Berhasil ditambahkan ke rencana hari ini 🌱', 'success');
  };

  const toggleIngredient = (idx) => {
    setCheckedIngredients(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 relative">
      {/* Header (Absolute/Fixed) */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto px-4 py-4 flex items-center justify-between z-20 pointer-events-none">
        <button 
          onClick={() => navigate(-1)}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md text-neutral-700 hover:bg-white hover:scale-110 active:scale-75 transition-all duration-200 cursor-pointer"
          aria-label="Kembali"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleToggleFavorite}
          className="pointer-events-auto w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-md text-neutral-700 hover:bg-white hover:scale-110 active:scale-75 transition-all duration-200 cursor-pointer"
          aria-label={isFavorite ? 'Hapus favorit' : 'Simpan favorit'}
        >
          <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-nakoo-red-500 text-nakoo-red-500 animate-heart-burst' : 'text-neutral-400'}`} />
        </button>
      </header>

      {/* Hero Section */}
      <div className="pt-20 px-4 bg-white rounded-b-[32px] shadow-sm pb-6 animate-slide-up-fade">
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">{recipe.title}</h1>
        
        {/* Tags */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="px-3 py-1 bg-[#FFF5EB] text-orange-700 text-xs font-semibold rounded-full border border-orange-100/60 shadow-2xs">
            {recipe.tags[0]}
          </span>
          <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full border border-cyan-100/60 shadow-2xs">
            {recipe.tags[1]}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full border border-purple-100/60 shadow-2xs">
            {recipe.tags[2]}
          </span>
        </div>

        {/* Gallery */}
        <div className="mb-6">
          <div className="w-full h-64 rounded-3xl overflow-hidden mb-3 bg-neutral-100 shadow-inner relative">
            <img 
              key={activeImageIdx}
              src={recipe.images[activeImageIdx] || recipe.images[0]} 
              alt={recipe.title} 
              className="w-full h-full object-cover animate-scale-in transition-transform duration-500" 
            />
          </div>
          <div className="flex gap-3">
            {recipe.images.slice(0, 4).map((img, i) => {
              const isSelected = activeImageIdx === i;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImageIdx(i)}
                  className={`flex-1 h-20 rounded-2xl overflow-hidden relative cursor-pointer transition-all duration-200 active:scale-95 ${
                    isSelected 
                      ? 'ring-3 ring-orange-500 ring-offset-2 scale-[1.03]' 
                      : 'opacity-70 hover:opacity-100 hover:scale-[1.02]'
                  }`}
                >
                  <img src={img} alt={`thumb ${i}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-6">
          {recipe.description}
        </p>

        {/* Nutrition Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#FFF5EB] hover:bg-[#ffeada] rounded-2xl p-3 flex flex-col items-center justify-center border border-orange-100/60 transition-all hover:scale-105 hover:shadow-xs cursor-default select-none">
            <span className="text-xs font-semibold text-orange-700 mb-2">Kalori</span>
            <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center mb-1 bg-white/70 shadow-2xs">
              <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
            </div>
            <span className="text-sm font-bold text-orange-900">{recipe.calories} kcal</span>
          </div>
          <div className="bg-[#FFF5EB] hover:bg-[#ffeada] rounded-2xl p-3 flex flex-col items-center justify-center border border-orange-100/60 transition-all hover:scale-105 hover:shadow-xs cursor-default select-none">
            <span className="text-xs font-semibold text-orange-700 mb-2">Protein</span>
            <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center mb-1 bg-white/70 shadow-2xs">
              <Dna className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-orange-900">{recipe.protein} gr</span>
          </div>
          <div className="bg-[#FFF5EB] hover:bg-[#ffeada] rounded-2xl p-3 flex flex-col items-center justify-center border border-orange-100/60 transition-all hover:scale-105 hover:shadow-xs cursor-default select-none">
            <span className="text-xs font-semibold text-orange-700 mb-2">Lemak Sehat</span>
            <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center mb-1 bg-white/70 shadow-2xs">
              <Droplet className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-orange-900">{recipe.fat} gr</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-neutral-200/60 p-1.5 rounded-full flex relative shadow-inner-white">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold z-10 transition-all duration-200 cursor-pointer active:scale-95 ${activeTab === 'bahan' ? 'text-nakoo-green-900 font-extrabold' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('bahan')}
          >
            <LayoutList className="w-4 h-4" /> Bahan
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold z-10 transition-all duration-200 cursor-pointer active:scale-95 ${activeTab === 'arahan' ? 'text-nakoo-green-900 font-extrabold' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('arahan')}
          >
            <ListOrdered className="w-4 h-4" /> Cara Masak
          </button>
          
          {/* Tab active indicator (slider) */}
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full transition-all duration-300 ease-out shadow-sm ${activeTab === 'bahan' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 animate-slide-up-fade">
        {activeTab === 'bahan' && (
          <div className="bg-[#F0F8F1] rounded-3xl p-5 mb-8 border border-nakoo-green-100 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-nakoo-green-200/50">
              <span className="text-xs font-bold text-nakoo-green-800 uppercase tracking-wider">Daftar Bahan</span>
              <span className="text-[11px] text-nakoo-green-700">Ketuk untuk menandai</span>
            </div>
            <ul className="flex flex-col gap-2.5">
              {recipe.ingredients.map((ing, i) => {
                const isChecked = !!checkedIngredients[i];
                return (
                  <li 
                    key={i} 
                    onClick={() => toggleIngredient(i)}
                    className={`flex justify-between items-center text-sm p-2.5 rounded-2xl transition-all duration-200 cursor-pointer select-none active:scale-[0.98] ${
                      isChecked ? 'bg-white/80 border border-nakoo-green-300' : 'hover:bg-white/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-200 ${
                        isChecked ? 'bg-nakoo-green-500 text-white shadow-xs' : 'border-2 border-neutral-300 bg-white'
                      }`}>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3] animate-check-pop" />}
                      </div>
                      <span className={`font-semibold transition-all duration-200 ${
                        isChecked ? 'line-through text-neutral-400' : 'text-neutral-800'
                      }`}>
                        {ing.name}
                      </span>
                    </div>
                    <span className={`text-xs transition-colors duration-200 ${isChecked ? 'text-neutral-400' : 'text-neutral-600 font-medium'}`}>
                      {ing.qty}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {activeTab === 'arahan' && (
          <div className="flex flex-col gap-4 mb-8">
            {recipe.steps.map((step, i) => {
              const isStepDone = !!completedSteps[i];
              return (
                <div 
                  key={i} 
                  onClick={() => toggleStep(i)}
                  className={`bg-white rounded-3xl p-5 border transition-all duration-300 cursor-pointer active:scale-[0.99] shadow-xs ${
                    isStepDone ? 'border-nakoo-green-300 bg-nakoo-green-50/40' : 'border-neutral-100 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
                      isStepDone ? 'bg-nakoo-green-500 text-white shadow-xs' : 'bg-orange-500 text-white'
                    }`}>
                      {isStepDone ? <Check className="w-3 h-3 stroke-[3] animate-check-pop" /> : null}
                      Langkah {i + 1}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {isStepDone ? 'Selesai ✨' : 'Ketuk jika selesai'}
                    </span>
                  </div>
                  <h3 className={`font-bold text-base mb-1 transition-colors duration-200 ${isStepDone ? 'text-nakoo-green-900' : 'text-neutral-900'}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white/95 backdrop-blur-md border-t border-neutral-100 z-20">
        <button 
          onClick={handleAddToPlan}
          className="w-full py-4 rounded-full bg-[#FBB040] hover:bg-[#faa020] text-white font-bold text-base hover:shadow-xl hover:-translate-y-0.5 active:scale-95 transition-all duration-200 shadow-lg shadow-orange-400/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span className="text-xl leading-none">+</span> Tambahkan ke rencana hari ini
        </button>
      </div>
    </div>
  );
}
