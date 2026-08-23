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

  // Find base recipe from mock, fallback to dummy
  const baseRecipe = DUMMY_RECIPES.find(r => r.id === id) || { id, title: 'Menu Bernutrisi', age_range: '12-24' };
  
  // Merge base recipe with contextual details
  const detail = RECIPE_DETAILS[id] || getDefaultDetail(baseRecipe, id);
  const recipe = { ...baseRecipe, ...detail };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    showToast(isFavorite ? 'Dihapus dari favorit' : 'Disimpan ke favorit', 'info');
  };

  const handleAddToPlan = () => {
    showToast('Berhasil ditambahkan ke rencana hari ini', 'success');
    // Eventually this will trigger an API call to update the daily plan
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 relative">
      {/* Header (Absolute/Fixed) */}
      <header className="fixed top-0 left-0 right-0 max-w-md mx-auto px-4 py-4 flex items-center justify-between z-20">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-neutral-600 hover:bg-white"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={handleToggleFavorite}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm text-neutral-600 hover:bg-white"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-nakoo-red-500 text-nakoo-red-500' : ''}`} />
        </button>
      </header>

      {/* Hero Section */}
      <div className="pt-20 px-4 bg-white rounded-b-[32px] shadow-sm pb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">{recipe.title}</h1>
        
        {/* Tags */}
        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1 bg-[#FFF5EB] text-orange-700 text-xs font-semibold rounded-full">
            {recipe.tags[0]}
          </span>
          <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-xs font-semibold rounded-full">
            {recipe.tags[1]}
          </span>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full">
            {recipe.tags[2]}
          </span>
        </div>

        {/* Gallery */}
        <div className="mb-6">
          <div className="w-full h-64 rounded-3xl overflow-hidden mb-3">
            <img src={recipe.images[0]} alt={recipe.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3">
            <div className="flex-1 h-20 rounded-2xl overflow-hidden">
              <img src={recipe.images[1]} alt="thumb 1" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 h-20 rounded-2xl overflow-hidden">
              <img src={recipe.images[2]} alt="thumb 2" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 h-20 rounded-2xl overflow-hidden relative">
              <img src={recipe.images[3]} alt="thumb 3" className="w-full h-full object-cover brightness-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <MoreHorizontal className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-6">
          {recipe.description}
          <button className="text-nakoo-red-500 font-semibold ml-1 hover:underline">Lihat Semua</button>
        </p>

        {/* Nutrition Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#FFF5EB] rounded-2xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-orange-700 mb-2">Calories</span>
            <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center mb-1">
              <Flame className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-orange-900">{recipe.calories} kcal</span>
          </div>
          <div className="bg-[#FFF5EB] rounded-2xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-orange-700 mb-2">Protein</span>
            <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center mb-1">
              <Dna className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-orange-900">{recipe.protein} gr</span>
          </div>
          <div className="bg-[#FFF5EB] rounded-2xl p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-orange-700 mb-2">Fat</span>
            <div className="w-8 h-8 rounded-full border border-orange-200 flex items-center justify-center mb-1">
              <Droplet className="w-4 h-4 text-orange-600" />
            </div>
            <span className="text-sm font-bold text-orange-900">{recipe.fat} gr</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6 mb-6">
        <div className="bg-neutral-200/50 p-1 rounded-full flex relative">
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold z-10 transition-colors ${activeTab === 'bahan' ? 'text-nakoo-green-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('bahan')}
          >
            <LayoutList className="w-4 h-4" /> Bahan
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold z-10 transition-colors ${activeTab === 'arahan' ? 'text-nakoo-green-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('arahan')}
          >
            <ListOrdered className="w-4 h-4" /> Arahan
          </button>
          
          {/* Tab active indicator (slider) */}
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#E6F4EA] rounded-full transition-all duration-300 shadow-sm ${activeTab === 'bahan' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'bahan' && (
          <div className="bg-[#F0F8F1] rounded-3xl p-5 mb-8">
            <ul className="flex flex-col gap-4">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-neutral-800">{ing.name}</span>
                  <span className="text-neutral-500">{ing.qty}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {activeTab === 'arahan' && (
          <div className="flex flex-col gap-6 mb-8">
            {recipe.steps.map((step, i) => (
              <div key={i} className="flex flex-col">
                <span className="inline-block px-2.5 py-1 bg-nakoo-green-500 text-white text-[10px] font-bold rounded-full w-max mb-2">
                  Step {i + 1}
                </span>
                <h3 className="font-bold text-neutral-900 text-lg mb-1">{step.title}</h3>
                <p className="text-sm text-neutral-500 mb-3">{step.desc}</p>
                <div className="w-full h-40 bg-neutral-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t border-neutral-100 z-20">
        <button 
          onClick={handleAddToPlan}
          className="w-full py-4 rounded-full bg-[#FBB040] text-white font-bold text-lg hover:bg-orange-400 transition-colors shadow-lg shadow-orange-400/30 flex items-center justify-center gap-2"
        >
          <span>+</span> Tambahkan ke rencana hari ini
        </button>
      </div>
    </div>
  );
}
