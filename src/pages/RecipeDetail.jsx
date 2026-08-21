import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Flame, Dna, Droplet, LayoutList, ListOrdered, MoreHorizontal } from 'lucide-react';
import { DUMMY_RECIPES } from '../../.mock/recipes';
import { useToast } from '../components/Toast';

// Mock enriched data for the detail page since DUMMY_RECIPES lacks details
const MOCK_DETAIL = {
  description: "Indulge in layers of rich, cheesy goodness with our Cheesy Lasagna featuring tender smoked beef. This classic Italian dish is a hearty blend of savory flavors, perfectly com...",
  calories: 320,
  protein: 5,
  fat: 4,
  tags: ['9–11 bulan', 'Rebus', 'Cincang'],
  images: [
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=200',
  ],
  ingredients: [
    { name: 'Lasagna Noodles', qty: '8 pcs' },
    { name: 'Smoked Beef', qty: '1 lbs' },
    { name: 'Marinara Sauce', qty: '2 cups' },
    { name: 'Ricotta Cheese', qty: '1 cup' },
    { name: 'Mozarella Cheese', qty: '1 cup' },
    { name: 'Parmesan Cheese', qty: '1/2 cup' },
  ],
  steps: [
    { title: 'Belah Alpukat', desc: 'Ambil daging alpukat yang sudah matang.' },
    { title: 'Haluskan', desc: 'Hancurkan alpukat menggunakan garpu hingga lembut.' },
    { title: 'Tambahkan susu UHT', desc: 'Tambahkan susu UHT secukupnya agar makin anjay' },
  ]
};

export function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState('bahan');
  const [isFavorite, setIsFavorite] = useState(false);

  // Find base recipe from mock, fallback to dummy
  const baseRecipe = DUMMY_RECIPES.find(r => r.id === id) || { title: 'Alpucok Alpukat Kocok' };
  
  // Merge base recipe with mock details
  const recipe = { ...baseRecipe, ...MOCK_DETAIL };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    addToast({
      title: isFavorite ? 'Dihapus dari favorit' : 'Disimpan ke favorit',
      type: 'info'
    });
  };

  const handleAddToPlan = () => {
    addToast({
      title: 'Berhasil ditambahkan ke rencana hari ini',
      type: 'success'
    });
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
