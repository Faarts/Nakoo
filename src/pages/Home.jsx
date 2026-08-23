import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { calculateAge } from '../lib/utils';
import { Button } from '../components/Button';
import { Salad, Puzzle, ChevronRight, Calendar } from 'lucide-react';
import homeHeroImg from '../assets/home-hero.png';
import ctaImg from '../assets/image-5.png';
import tahukahIbuImg from '../assets/image-8.png';
import nakooLogo from '../assets/nako-logo.svg';
import checkIcon from '../assets/icon/check-icon.svg';
import saveIcon from '../assets/icon/save-icon.svg';
import tumbuhIcon from '../assets/icon/tumbuh-icon.svg';
import { Badge } from '../components/Badge';
import { DUMMY_RECIPES } from '../../.mock/recipes';
import { DUMMY_ACTIVITIES } from '../../.mock/activities';

export function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [dailyPlan, setDailyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [featuredRecipes, setFeaturedRecipes] = useState(DUMMY_RECIPES.slice(0, 5));
  const [featuredActivities, setFeaturedActivities] = useState(DUMMY_ACTIVITIES.slice(0, 4));

  useEffect(() => {
    if (user) {
      fetchDailyPlan();
    }
    fetchFeaturedContent();
  }, [user]);

  const fetchDailyPlan = async () => {
    setLoadingPlan(true);
    try {
      const res = await api.get('/api/daily-plans/today');
      setDailyPlan(res.plan);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPlan(false);
    }
  };

  const fetchFeaturedContent = async () => {
    try {
      const [resRec, resAct] = await Promise.allSettled([
        api.get('/api/recipes'),
        api.get('/api/activities')
      ]);
      if (resRec.status === 'fulfilled' && resRec.value.recipes?.length > 0) {
        setFeaturedRecipes(resRec.value.recipes.slice(0, 5));
      }
      if (resAct.status === 'fulfilled' && resAct.value.activities?.length > 0) {
        setFeaturedActivities(resAct.value.activities.slice(0, 4));
      }
    } catch (e) {
      // fallback to initial mock state
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      await api.post('/api/daily-plans/generate');
      await fetchDailyPlan();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const childAgeStr = profile?.birth_date ? calculateAge(profile.birth_date) : '';

  return (
    <div className="flex flex-col min-h-full bg-[#FFFBF8]">

      {/* Hero Section - Public */}
      {!user && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8F7] to-[#FAF9F6]">
          <div className="absolute top-24 left-6 z-10">
            <h1 className="text-[28px] leading-tight font-medium text-neutral-800 max-w-[300px]">
              Karena setiap si kecil<br />tumbuh <span className="text-nakoo-green-500 font-semibold">berbeda</span>
            </h1>
          </div>

          <div className="w-full relative z-0 flex justify-center">
            <img src={homeHeroImg} alt="Ilustrasi Ibu & Anak" className="w-full h-full object-cover" />
          </div>
        </section>
      )}

      {/* Hero Section - Logged In */}
      {user && (
        <section className="px-6 pt-6 pb-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-neutral-800 leading-tight">
              Rencana hari ini untuk {profile?.child_name || 'Si Kecil'}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">Usia {childAgeStr}</p>
          </div>

          {loadingPlan ? (
            <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[160px]">
              <p className="text-neutral-400">Memuat rencana...</p>
            </div>
          ) : dailyPlan && dailyPlan.slots && dailyPlan.slots.length > 0 ? (
            <div className="bg-white rounded-[24px] p-5 shadow-card border border-neutral-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-neutral-800">Ringkasan Jadwal</h2>
                <span className="text-xs text-primary-600 font-medium bg-primary-50 px-2.5 py-1 rounded-full">
                  Hari Ini
                </span>
              </div>

              <div className="space-y-3 mb-5">
                {dailyPlan.slots.map((slot, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center shrink-0 border border-neutral-100">
                      {slot.type === 'meal' ? <Salad className="w-5 h-5 text-[#B9411A]" /> : <Puzzle className="w-5 h-5 text-[#2C6E91]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-medium text-neutral-400">{slot.time}</span>
                        <span className="text-[10px] font-semibold tracking-wide uppercase text-neutral-400">• {slot.type === 'meal' ? 'MAKAN' : 'MAIN'}</span>
                      </div>
                      <p className="text-sm font-medium text-neutral-800 leading-snug">{slot.item?.title || 'Item'}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={() => navigate('/my-page')} variant="secondary" className="w-full cursor-pointer">
                Lihat rencana lengkap
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] p-6 shadow-card border border-neutral-100 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">Belum ada rencana hari ini</h3>
              <p className="text-sm text-neutral-500 mb-6">Mulai buat rencana menu dan aktivitas yang sesuai dengan perkembangan si kecil yuk!</p>
              <Button onClick={handleGeneratePlan} disabled={generating} className="w-full cursor-pointer">
                {generating ? 'Membuat rencana...' : 'Buat rencana hari ini'}
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Menu Makan Pilihan */}
      <section className="mb-8 mt-4">
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-base font-semibold text-neutral-800">Menu makan pilihan</h2>
          <Link to="/explore/menu" className="text-neutral-400 hover:text-neutral-600 flex items-center gap-1 text-sm">
            <span>Lihat semua</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x hide-scrollbar flex-nowrap">
          {featuredRecipes.map((recipe, idx) => {
            const num = ((idx % 8) + 1).toString().padStart(2, '0');
            const imgSrc = `/img/food-${num}.png`;
            return (
              <Link 
                key={recipe.id || idx} 
                to={`/explore/menu/${recipe.id}`} 
                className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-card-sm border border-neutral-100 hover:shadow-md transition-all group"
              >
                <div className="w-full h-24 bg-neutral-100 rounded-xl mb-3 overflow-hidden">
                  <img src={imgSrc} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">{recipe.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  <Badge variant="yellow">{recipe.age_range} bln</Badge>
                  <Badge variant="primary">{recipe.prep_time || 20} mnt</Badge>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Aktivitas Pilihan */}
      <section className="mb-10">
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-base font-semibold text-neutral-800">Aktivitas Pilihan</h2>
          <Link to="/explore/activity" className="text-neutral-400 hover:text-neutral-600 flex items-center gap-1 text-sm">
            <span>Lihat semua</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x hide-scrollbar flex-nowrap">
          {featuredActivities.map((act, idx) => {
            const num = ((idx % 3) + 1).toString().padStart(2, '0');
            const localImg = `/img/act-${num}.png`;
            const image = act.image || localImg;
            const skill = Array.isArray(act.skills) ? act.skills[0] : (typeof act.skills === 'string' ? JSON.parse(act.skills || '[]')[0] : 'Motorik');

            return (
              <Link 
                key={act.id || idx} 
                to={`/explore/activity/${act.id}`} 
                className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-card-sm border border-neutral-100 hover:shadow-md transition-all group"
              >
                <div className="w-full h-24 bg-neutral-100 rounded-xl mb-3 overflow-hidden">
                  <img src={image} alt={act.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">{act.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  <Badge variant="green">{act.age_range} bln</Badge>
                  {skill && <Badge variant="primary">{skill.replace('_', ' ')}</Badge>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Banner */}
      {!user && (
        <section className="px-6 mb-10">
          <div className="bg-gradient-to-br from-primary-50 to-nakoo-blue-50 rounded-[32px] p-5 flex flex-col items-center text-center relative overflow-hidden border border-primary-100">
            {/* CTA Illustration */}
            <img src={ctaImg} alt="CTA Ilustrasi" className="w-32 h-40 object-contain mb-2" />

            <h2 className="text-xl font-semibold text-neutral-800 mb-3 leading-snug">
              Sesuaikan menu dan aktivitas sesuai kebutuhan <span className="text-nakoo-green-600">si kecil</span>
            </h2>
            <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
              Isi profil singkat si kecil, dan Nakoo bantu susun rencana harian yang pas setiap hari
            </p>

            <Button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-2 cursor-pointer">
              Daftar Sekarang <span className="font-bold text-lg leading-none">→</span>
            </Button>
          </div>
        </section>
      )}

      {/* Kenapa Nakoo? */}
      <section className="px-6 mb-10">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Kenapa Nakoo?</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-item">
            <div className="w-12 h-12 shrink-0 bg-[#FFEBDB] text-[#E58639] rounded-xl flex items-center justify-center">
              <img src={checkIcon} alt="Check Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Sesuai Usia</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Rekomendasi menu & main otomatis menyesuaikan usia si kecil, tanpa perlu riset sendiri.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-item">
            <div className="w-12 h-12 shrink-0 bg-[#E4F1DF] text-[#437A32] rounded-xl flex items-center justify-center">
              <img src={saveIcon} alt="Save Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Aman dari Alergen</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Cukup catat alergi si kecil sekali, Nakoo yang saring menu setiap harinya.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-item">
            <div className="w-12 h-12 shrink-0 bg-[#FFDBD1] text-[#B9411A] rounded-xl flex items-center justify-center">
              <img src={tumbuhIcon} alt="Tumbuh Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Ikuti Tumbuh Kembang</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Rencana harian ikut berubah seiring si kecil mencapai tahap perkembangan baru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tahukah Ibu? */}
      <section className="px-6 mb-10">
        <div className="bg-gradient-to-r from-[#FFEBDB] to-[#FFFBF8] rounded-2xl p-4 flex items-center gap-4">
          {/* Placeholder Blocks */}
          <img src={tahukahIbuImg} alt="Tahukah Ibu Icon" className="w-20 h-20 shrink-0 object-contain" />
          <div>
            <h3 className="text-lg font-semibold text-nakoo-green-600 mb-1 flex items-center gap-1">
              Tahukah Ibu? 🌿
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Rutinitas harian yang konsisten membantu anak merasa lebih aman dan mendukung tumbuh kembangnya.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 flex flex-col items-center mt-4">
        <div className="flex items-center gap-2 mb-3">
          <img src={nakooLogo} alt="Nakoo Logo" className="h-8 w-auto" />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <p className="text-lg text-neutral-500">Tumbuh kembang si kecil, terencana</p>
          <p className="text-[10px] text-neutral-400">© 2026 Nakoo. Semua hak dilindungi.</p>
        </div>
      </footer>

    </div>
  );
}
