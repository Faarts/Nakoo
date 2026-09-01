import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import { Calendar, Heart, User, CheckCircle2, Clock, ChevronRight, RefreshCw, Settings, Ban, Target, LogOut } from 'lucide-react';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function MyPage() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState('jadwal');
  
  const [plan, setPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(true);
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const isToday = selectedDate === todayStr;
  
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(true);

  // Profile Form States
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [alergies, setAlergies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setChildName(profile.child_name || '');
      setBirthDate(profile.birth_date || '');
      try {
        setAlergies(profile.alergies ? JSON.parse(profile.alergies) : []);
        setSkills(profile.focus_skills ? JSON.parse(profile.focus_skills) : []);
      } catch (e) {
        setAlergies([]);
        setSkills([]);
      }
    }
    
    const fetchFavorites = async () => {
      try {
        const [resFav, resRec, resAct] = await Promise.all([
          api.get('/api/favorites'),
          api.get('/api/recipes'),
          api.get('/api/activities')
        ]);
        setFavorites(resFav.favorites || []);
        setRecipes(resRec.recipes || []);
        setActivities(resAct.activities || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingFavs(false);
      }
    };
    fetchFavorites();
  }, [user, profile, navigate]);

  useEffect(() => {
    if (!user) return;
    
    const fetchPlan = async () => {
      setLoadingPlan(true);
      try {
        const res = await api.get(`/api/daily-plans?date=${selectedDate}`);
        setPlan(res.plan);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [user, selectedDate]);

  const toggleSlotStatus = async (index, currentStatus) => {
    if (!isToday) return; // Only allow edit for today
    const newStatus = currentStatus === 'pending' ? 'done' : 'pending';
    try {
      const res = await api.put('/api/daily-plans/slot-status', {
        date: selectedDate,
        index,
        status: newStatus
      });
      if (res.ok) {
        setPlan(prev => {
          const newSlots = [...prev.slots];
          newSlots[index].status = newStatus;
          return { ...prev, slots: newSlots };
        });
      }
    } catch (e) {
      showToast("Gagal mengupdate status", "error");
    }
  };

  const handleRegenerateSlot = async (index) => {
    if (!isToday) return;
    try {
      const res = await api.post('/api/daily-plans/regenerate-slot', {
        date: selectedDate,
        index
      });
      if (res.ok) {
        setPlan(prev => {
          const newSlots = [...prev.slots];
          newSlots[index] = res.slot;
          return { ...prev, slots: newSlots };
        });
        showToast("Berhasil mengganti item");
      }
    } catch (e) {
      showToast("Gagal mengganti item", "error");
    }
  };

  const handleRegenerateAll = async () => {
    if (!isToday) return;
    try {
      const res = await api.post('/api/daily-plans/generate');
      if (res.ok) {
        const planRes = await api.get(`/api/daily-plans?date=${selectedDate}`);
        setPlan(planRes.plan);
        showToast("Jadwal hari ini diacak ulang");
      }
    } catch (e) {
      showToast("Gagal mengacak jadwal", "error");
    }
  };

  const getFavoriteItemDetails = (fav) => {
    if (fav.item_type === 'meal') return recipes.find(r => r.id === fav.item_id);
    return activities.find(a => a.id === fav.item_id);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.post('/api/child-profiles', {
        child_name: childName,
        birth_date: birthDate,
        alergies,
        focus_skills: skills,
        available_materials: []
      });
      await refreshProfile();
      showToast("Profil berhasil diperbarui", "success");
    } catch (e) {
      showToast("Gagal menyimpan profil", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) setArray(array.filter(i => i !== item));
    else setArray([...array, item]);
  };

  return (
    <div className="pb-24 bg-neutral-50 min-h-screen">
      {/* Header Profile */}
      <div className="bg-white pt-6 pb-6 px-6 rounded-b-[32px] shadow-sm mb-6 border-b border-neutral-100/60">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-orange-300 via-primary-300 to-nakoo-green-300 shadow-sm overflow-hidden">
              <img 
                src="/img/mother-avatar.jpg" 
                alt="Profil Bunda" 
                className="w-full h-full object-cover rounded-full" 
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-nakoo-green-500 border-2 border-white flex items-center justify-center text-white shadow-xs">
              <Heart className="w-2.5 h-2.5 fill-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-bold text-neutral-900 truncate">
              {user?.name || 'Bunda'}
            </h1>
            <p className="text-sm font-medium text-nakoo-green-700 truncate">
              Anak: <span className="font-semibold">{profile?.child_name || 'Si Kecil'}</span>
            </p>
            <p className="text-xs text-neutral-400">
              Lahir: {profile?.birth_date || '-'}
            </p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl relative">
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-xl z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'jadwal' ? 'text-nakoo-green-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('jadwal')}
          >
            <Calendar className="w-4 h-4" /> Jadwal
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-xl z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'favorit' ? 'text-nakoo-green-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('favorit')}
          >
            <Heart className="w-4 h-4" /> Favorit
          </button>
          <button 
            className={`flex-1 py-3 text-sm font-bold rounded-xl z-10 flex items-center justify-center gap-2 transition-colors ${activeTab === 'profil' ? 'text-nakoo-green-800' : 'text-neutral-500 hover:text-neutral-700'}`}
            onClick={() => setActiveTab('profil')}
          >
            <Settings className="w-4 h-4" /> Profil
          </button>
          
          <div 
            className={`absolute top-1 bottom-1 w-[calc(33.33%-2px)] bg-white rounded-xl transition-all duration-300 shadow-sm`}
            style={{
              left: activeTab === 'jadwal' ? '4px' : activeTab === 'favorit' ? 'calc(33.33% + 2px)' : 'calc(66.66% - 4px)'
            }}
          />
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4">
        {activeTab === 'jadwal' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Date Navigation */}
            <div className="flex items-center justify-between mb-6 bg-white p-3 rounded-2xl shadow-sm">
              <input 
                type="date" 
                value={selectedDate}
                max={todayStr}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-neutral-100 px-3 py-2 rounded-xl text-sm font-medium text-neutral-800 border-none outline-none focus:ring-2 focus:ring-nakoo-green-500"
              />
              {!isToday && (
                <button 
                  onClick={() => setSelectedDate(todayStr)}
                  className="text-xs font-bold text-nakoo-green-600 px-3 py-2 rounded-xl bg-nakoo-green-50 active:bg-nakoo-green-100"
                >
                  Hari Ini
                </button>
              )}
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <h2 className="text-lg font-bold text-neutral-900">
                {isToday ? "Jadwal Hari Ini" : "Riwayat Jadwal"}
              </h2>
              {isToday && plan && plan.slots && plan.slots.length > 0 && (
                <button 
                  onClick={handleRegenerateAll}
                  className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full flex items-center gap-1.5 active:scale-95 transition-transform"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Acak Ulang
                </button>
              )}
            </div>
            
            {loadingPlan ? (
              <p className="text-center text-neutral-500 py-10">Memuat jadwal...</p>
            ) : !plan || !plan.slots || plan.slots.length === 0 ? (
              <EmptyState 
                title={isToday ? "Belum ada rencana" : "Tidak ada riwayat"}
                message={isToday ? "Pergi ke Home untuk membuat rencana hari ini." : "Tidak ada rencana yang tercatat pada tanggal ini."}
                icon={<Calendar className="w-12 h-12 text-neutral-300" />}
              />
            ) : (
              <div className="relative border-l-2 border-neutral-200 ml-4 pl-6 pb-4 space-y-6">
                {plan.slots.map((slot, i) => {
                  const isDone = slot.status === 'done';
                  const isMeal = slot.type === 'meal';
                  return (
                    <div key={i} className="relative">
                      {/* Timeline Dot */}
                      <button 
                        onClick={() => toggleSlotStatus(i, slot.status)}
                        disabled={!isToday}
                        className={`absolute -left-[35px] w-6 h-6 rounded-full flex items-center justify-center border-2 bg-white transition-colors ${isToday ? 'cursor-pointer' : 'cursor-default'} ${isDone ? 'border-nakoo-green-500 text-nakoo-green-500' : 'border-neutral-300 text-transparent'}`}
                      >
                        {isDone && <CheckCircle2 className="w-5 h-5 fill-nakoo-green-500 text-white" />}
                      </button>
                      
                      <Card className={`p-4 transition-opacity ${isDone ? 'opacity-60' : ''}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Clock className="w-3.5 h-3.5 text-orange-500" />
                              <span className="text-xs font-bold text-orange-600">{slot.time}</span>
                              <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider bg-neutral-100 px-1.5 py-0.5 rounded">
                                {isMeal ? 'Makan' : 'Main'}
                              </span>
                            </div>
                            <h3 className="font-bold text-neutral-900 text-base leading-tight mb-1">
                              {slot.item?.title || 'Memuat...'}
                            </h3>
                            <p className="text-xs text-neutral-500">{slot.item?.duration} {isMeal ? 'menit masak' : 'menit'}</p>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Link 
                              to={isMeal ? `/explore/menu/${slot.item_id}` : `/explore/activity/${slot.item_id}`}
                              className="w-8 h-8 rounded-full bg-neutral-50 flex items-center justify-center hover:bg-neutral-100 transition-colors"
                            >
                              <ChevronRight className="w-4 h-4 text-neutral-400" />
                            </Link>
                            
                            {isToday && !isDone && (
                              <button 
                                onClick={() => handleRegenerateSlot(i)}
                                className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 hover:bg-orange-100 transition-colors active:scale-95"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorit' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 px-2">Tersimpan</h2>
            
            {loadingFavs ? (
              <p className="text-center text-neutral-500 py-10">Memuat favorit...</p>
            ) : favorites.length === 0 ? (
              <EmptyState 
                title="Belum ada favorit"
                message="Mulai simpan resep atau aktivitas yang Anda suka."
                icon={<Heart className="w-12 h-12 text-neutral-300" />}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {favorites.map(fav => {
                  const item = getFavoriteItemDetails(fav);
                  if (!item) return null;
                  
                  return (
                    <Link 
                      key={fav.id} 
                      to={fav.item_type === 'meal' ? `/explore/menu/${fav.item_id}` : `/explore/activity/${fav.item_id}`}
                    >
                      <Card className="p-3 h-full flex flex-col hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-1 mb-2">
                          <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white ${fav.item_type === 'meal' ? 'bg-orange-500' : 'bg-purple-500'}`}>
                            {fav.item_type === 'meal' ? 'Resep' : 'Aktivitas'}
                          </span>
                        </div>
                        <h3 className="font-bold text-neutral-900 text-sm leading-tight line-clamp-2">
                          {item.title}
                        </h3>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profil' && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-lg font-bold text-neutral-900 mb-4 px-2">Edit Profil Anak</h2>
            
            <form onSubmit={handleSaveProfile} className="space-y-6">
              <Card className="p-5 space-y-4">
                <Input 
                  label="Nama Panggilan Anak" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Contoh: Raka"
                  required
                />
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-bold text-neutral-700">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-nakoo-green-500 focus:bg-white transition-all"
                    required
                  />
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Ban className="w-4 h-4 text-red-500" />
                  </div>
                  <h3 className="font-bold text-neutral-900">Alergi & Pantangan</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Telur', 'Susu', 'Kacang', 'Seafood', 'Gluten'].map(al => (
                    <button
                      key={al}
                      type="button"
                      onClick={() => toggleArrayItem(al, alergies, setAlergies)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${alergies.includes(al) ? 'border-red-500 bg-red-50 text-red-600' : 'border-neutral-200 bg-white text-neutral-600'}`}
                    >
                      {al}
                    </button>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <Target className="w-4 h-4 text-purple-500" />
                  </div>
                  <h3 className="font-bold text-neutral-900">Fokus Skill Utama</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Motorik Halus', 'Motorik Kasar', 'Kognitif', 'Bahasa', 'Sosial Emosional'].map(sk => (
                    <button
                      key={sk}
                      type="button"
                      onClick={() => toggleArrayItem(sk, skills, setSkills)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border-2 ${skills.includes(sk) ? 'border-purple-500 bg-purple-50 text-purple-600' : 'border-neutral-200 bg-white text-neutral-600'}`}
                    >
                      {sk}
                    </button>
                  ))}
                </div>
              </Card>

              <div className="pb-4 flex flex-col gap-3">
                <Button 
                  type="submit" 
                  fullWidth 
                  loading={savingProfile}
                >
                  Simpan Perubahan
                </Button>

                <button
                  type="button"
                  onClick={async () => {
                    await logout();
                    navigate('/login');
                  }}
                  className="w-full py-3 rounded-2xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar dari Akun</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
