import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Clock, Play, ListOrdered } from 'lucide-react';
import { DUMMY_ACTIVITIES } from '../../.mock/activities';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

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

const skillLabels = {
  motorik_halus: 'Motorik Halus',
  motorik_kasar: 'Motorik Kasar',
  kognitif: 'Kognitif',
  kreativitas: 'Kreativitas',
  sensori: 'Sensori',
  bahasa: 'Bahasa',
  sosial_emosional: 'Sosial & Emosi',
}

export function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('bahan');
  const [isFavorite, setIsFavorite] = useState(false);
  const [checkedMaterials, setCheckedMaterials] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const activity = DUMMY_ACTIVITIES.find(a => a.id === id) || DUMMY_ACTIVITIES[0];
  const skills = parseSkills(activity.skills);
  const tags = activity.tags || skills.map(s => skillLabels[s] || s);

  React.useEffect(() => {
    if (user) {
      api.get('/api/favorites').then(res => {
        if (res.favorites) {
          setIsFavorite(res.favorites.some(f => f.item_id === activity.id && f.item_type === 'activity'));
        }
      }).catch(console.error);
    }
  }, [user, activity.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      showToast('Silakan login terlebih dahulu', 'error');
      return;
    }
    try {
      if (isFavorite) {
        setIsFavorite(false);
        await api.delete(`/api/favorites/activity/${activity.id}`);
        showToast('Dihapus dari favorit', 'info');
      } else {
        setIsFavorite(true);
        await api.post('/api/favorites', { item_type: 'activity', item_id: activity.id });
        showToast('Disimpan ke favorit ❤️', 'success');
      }
    } catch (e) {
      setIsFavorite(!isFavorite); // revert
      showToast('Gagal mengubah favorit', 'error');
    }
  };

  const handleAddToPlan = () => {
    showToast('Berhasil ditambahkan ke rencana hari ini 🌱', 'success');
  };

  const toggleMaterial = (idx) => {
    setCheckedMaterials(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 relative">
      {/* Header */}
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
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">{activity.title}</h1>
        
        {/* Tags */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="px-3 py-1 bg-nakoo-green-50 text-nakoo-green-700 text-xs font-semibold rounded-full border border-nakoo-green-100/80 shadow-2xs">
            {activity.age_range} bln
          </span>
          {tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-[#FFF5EB] text-orange-700 text-xs font-semibold rounded-full border border-orange-100/80 shadow-2xs">
              {tag}
            </span>
          ))}
        </div>

        {/* Image */}
        <div className="mb-6">
          <div className="w-full h-64 rounded-3xl overflow-hidden shadow-inner bg-neutral-100 group">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" 
            />
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-6">
          {activity.description}
        </p>

        {/* Quick Info */}
        <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100 hover:shadow-xs transition-shadow">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shadow-2xs">
            <Clock className="w-5 h-5 text-orange-600 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Estimasi Waktu</p>
            <p className="text-sm font-bold text-neutral-900">{activity.duration} menit</p>
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
            <Play className="w-4 h-4" /> Persiapan
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold z-10 transition-all duration-200 cursor-pointer active:scale-95 ${activeTab === 'arahan' ? 'text-nakoo-green-900 font-extrabold' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('arahan')}
          >
            <ListOrdered className="w-4 h-4" /> Langkah
          </button>
          
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full transition-all duration-300 ease-out shadow-sm ${activeTab === 'bahan' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 animate-slide-up-fade">
        {activeTab === 'bahan' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#F0F8F1] rounded-3xl p-5 border border-nakoo-green-100 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-nakoo-green-200/50">
                <h3 className="font-bold text-nakoo-green-900 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-nakoo-green-500 animate-pulse"></span> Alat & Bahan
                </h3>
                <span className="text-[11px] text-nakoo-green-700">Ketuk untuk menandai</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {(activity.materials || []).map((mat, i) => {
                  const isChecked = !!checkedMaterials[i];
                  return (
                    <li 
                      key={i} 
                      onClick={() => toggleMaterial(i)}
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
                          isChecked ? 'line-through text-neutral-400' : 'text-neutral-700'
                        }`}>
                          {mat.name}
                        </span>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors duration-200 ${
                        isChecked ? 'bg-neutral-200/60 text-neutral-400' : 'bg-white text-neutral-600 shadow-2xs border border-neutral-100'
                      }`}>
                        {mat.qty}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
            {activity.tips && (
              <div className="bg-orange-50/80 rounded-3xl p-5 border border-orange-100 shadow-xs hover:shadow-sm transition-shadow">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Tips Pendampingan & Keamanan
                </h3>
                <p className="text-sm text-orange-800 leading-relaxed">{activity.tips}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'arahan' && (
          <div className="flex flex-col gap-4 mb-8">
            {(activity.steps || []).map((step, i) => {
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
                      isStepDone ? 'bg-nakoo-green-500 text-white shadow-xs' : 'bg-nakoo-green-600 text-white'
                    }`}>
                      {isStepDone ? <Check className="w-3 h-3 stroke-[3] animate-check-pop" /> : null}
                      Langkah {i + 1}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {isStepDone ? 'Selesai 🎉' : 'Ketuk jika selesai'}
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
