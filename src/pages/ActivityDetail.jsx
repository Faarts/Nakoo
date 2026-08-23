import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Clock, Play, ListOrdered } from 'lucide-react';
import { DUMMY_ACTIVITIES } from '../../.mock/activities';
import { useToast } from '../components/Toast';
import { api } from '../lib/api';
import { useAuth } from '../lib/AuthContext';

export function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('bahan');
  const [isFavorite, setIsFavorite] = useState(false);

  const activity = DUMMY_ACTIVITIES.find(a => a.id === id) || DUMMY_ACTIVITIES[0];

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
        showToast('Disimpan ke favorit', 'info');
      }
    } catch (e) {
      setIsFavorite(!isFavorite); // revert
      showToast('Gagal mengubah favorit', 'error');
    }
  };

  const handleAddToPlan = () => {
    showToast('Berhasil ditambahkan ke rencana hari ini', 'success');
    // This will trigger a backend call to update the daily plan
  };

  return (
    <div className="min-h-screen bg-neutral-50 pb-28 relative">
      {/* Header */}
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
        <h1 className="text-2xl font-bold text-neutral-900 mb-3">{activity.title}</h1>
        
        {/* Tags */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <span className="px-3 py-1 bg-nakoo-green-50 text-nakoo-green-700 text-xs font-semibold rounded-full border border-nakoo-green-100">
            {activity.age_range} bln
          </span>
          {activity.skills.map((skill, idx) => (
            <span key={idx} className="px-3 py-1 bg-[#FFF5EB] text-orange-700 text-xs font-semibold rounded-full border border-orange-100 uppercase tracking-wider">
              {skill.replace('_', ' ')}
            </span>
          ))}
        </div>

        {/* Image */}
        <div className="mb-6">
          <div className="w-full h-64 rounded-3xl overflow-hidden shadow-inner">
            <img src={activity.image} alt={activity.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Description */}
        <p className="text-neutral-600 text-sm leading-relaxed mb-6">
          {activity.description}
        </p>

        {/* Quick Info */}
        <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <p className="text-xs text-neutral-500 font-medium">Estimasi Waktu</p>
            <p className="text-sm font-bold text-neutral-900">{activity.duration} menit</p>
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
            <Play className="w-4 h-4" /> Persiapan
          </button>
          <button 
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold z-10 transition-colors ${activeTab === 'arahan' ? 'text-nakoo-green-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('arahan')}
          >
            <ListOrdered className="w-4 h-4" /> Langkah
          </button>
          
          <div 
            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#E6F4EA] rounded-full transition-all duration-300 shadow-sm ${activeTab === 'bahan' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'bahan' && (
          <div className="flex flex-col gap-4">
            <div className="bg-[#F0F8F1] rounded-3xl p-5 border border-[#E1F0E3]">
              <h3 className="font-bold text-nakoo-green-900 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-nakoo-green-500"></span> Alat & Bahan
              </h3>
              <ul className="flex flex-col gap-3">
                {activity.materials.map((mat, i) => (
                  <li key={i} className="flex justify-between items-center text-sm pb-2 border-b border-nakoo-green-100 last:border-0 last:pb-0">
                    <span className="font-semibold text-neutral-700">{mat.name}</span>
                    <span className="text-neutral-500 bg-white px-2 py-1 rounded-md text-xs font-medium shadow-sm">{mat.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
            {activity.tips && (
              <div className="bg-orange-50 rounded-3xl p-5 border border-orange-100">
                <h3 className="font-bold text-orange-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span> Tips Keamanan
                </h3>
                <p className="text-sm text-orange-800 leading-relaxed">{activity.tips}</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'arahan' && (
          <div className="flex flex-col gap-6 mb-8">
            {activity.steps.map((step, i) => (
              <div key={i} className="flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-6 h-6 bg-nakoo-green-500 text-white text-xs font-bold rounded-full">
                    {i + 1}
                  </span>
                  <h3 className="font-bold text-neutral-900 text-lg">{step.title}</h3>
                </div>
                <p className="text-sm text-neutral-600 pl-9 leading-relaxed">{step.desc}</p>
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
