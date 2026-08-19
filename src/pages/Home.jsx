import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { Link } from 'react-router-dom';
import { CalendarHeart, Utensils, Puzzle, ChevronRight, PlusCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { TopBar } from '../components/TopBar';

export function Home() {
  const { profile } = useAuth();
  
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const { plan } = await api.get('/api/daily-plans/today');
      setPlan(plan);
    } catch (err) {
      console.error("Failed to fetch plan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post('/api/daily-plans/generate');
      await fetchPlan();
    } catch (err) {
      console.error("Failed to generate plan:", err);
      setGenerating(false);
    }
  };

  const hasPlan = !!plan;
  const completedCount = plan?.slots?.filter(s => s.status === 'done').length || 0;
  const totalCount = plan?.slots?.length || 0;

  // Helper untuk hitung usia (bulan)
  const getAgeInMonths = (birthDateString) => {
    if (!birthDateString) return '';
    const birthDate = new Date(birthDateString);
    const today = new Date();
    const ageInMonths = (today.getFullYear() - birthDate.getFullYear()) * 12 + (today.getMonth() - birthDate.getMonth());
    return `${ageInMonths} bulan`;
  };

  const childName = profile?.child_name || 'Si Kecil';
  const childAge = getAgeInMonths(profile?.birth_date);

  return (
    <div className="flex flex-col min-h-screen pb-6 bg-neutral-50">
      
      {/* Header Container */}
      <div className="bg-white rounded-b-[32px] shadow-sm pb-8 pt-safe">
        <TopBar 
          onMenuClick={() => console.log('Menu clicked')} 
          onNotificationClick={() => console.log('Notification clicked')} 
        />
        
        <header className="px-6 mt-4">
          <h1 className="text-2xl font-semibold text-neutral-800 leading-tight">
            Rencana hari ini <br/>untuk <span className="text-primary-500">{childName}</span>
          </h1>
          {childAge && (
            <p className="mt-1 text-sm font-medium text-neutral-500">
              Usia {childAge}
            </p>
          )}
        </header>
      </div>

      <main className="px-6 py-6 flex-1 flex flex-col gap-6">
        
        {/* State: Belum/Sudah Ada Rencana */}
        <section>
          {loading ? (
             <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex items-center justify-center min-h-[200px]">
               <p className="text-neutral-400">Memuat rencana...</p>
             </div>
          ) : !hasPlan ? (
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mb-4">
                <CalendarHeart className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-800 mb-2">Belum Ada Rencana</h2>
              <p className="text-sm text-neutral-500 mb-6">
                Yuk, buat rencana makan dan bermain {childName} untuk hari ini agar lebih terstruktur!
              </p>
              <Button onClick={handleGenerate} disabled={generating} className="w-full flex justify-center items-center gap-2">
                <PlusCircle className="w-5 h-5" /> {generating ? 'Membuat...' : 'Buat Rencana Hari Ini'}
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-base font-semibold text-neutral-800">Preview Hari Ini</h2>
                <span className="text-xs font-medium bg-nakooGreen-50 text-nakooGreen-600 px-2 py-1 rounded-full">
                  {completedCount}/{totalCount} Selesai
                </span>
              </div>
              
              <div className="flex flex-col gap-3 mb-5">
                {plan.slots.map((slot, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${slot.status === 'done' ? 'bg-nakooGreen-500' : 'bg-primary-400'}`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-800">
                        {slot.type === 'meal' ? 'Menu Makan' : 'Aktivitas'} ({slot.time})
                      </p>
                      <p className="text-xs text-neutral-500">{slot.item?.title || 'Tidak ada judul'}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${slot.status === 'done' ? 'bg-nakooGreen-500 border border-nakooGreen-500' : 'border-2 border-neutral-200'}`}>
                       {slot.status === 'done' && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/my-page">
                <Button variant="secondary" className="w-full">
                  Lihat Rencana Lengkap
                </Button>
              </Link>
            </div>
          )}
        </section>

        {/* Shortcuts */}
        <section>
          <h3 className="text-sm font-semibold text-neutral-600 mb-3 px-1">Eksplorasi</h3>
          <div className="grid grid-cols-2 gap-4">
            
            <Link to="/explore/menu" className="block bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 hover:border-primary-200 transition-colors">
              <div className="w-10 h-10 bg-nakooRed-50 text-nakooRed-500 rounded-xl flex items-center justify-center mb-3">
                <Utensils className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-neutral-800 text-sm">Resep Makan</h4>
              <p className="text-xs text-neutral-500 mt-1 flex items-center">
                Lihat menu <ChevronRight className="w-3 h-3 ml-1" />
              </p>
            </Link>

            <Link to="/explore/activity" className="block bg-white p-4 rounded-2xl shadow-sm border border-neutral-100 hover:border-primary-200 transition-colors">
              <div className="w-10 h-10 bg-nakooBlue-50 text-nakooBlue-500 rounded-xl flex items-center justify-center mb-3">
                <Puzzle className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-neutral-800 text-sm">Ide Aktivitas</h4>
              <p className="text-xs text-neutral-500 mt-1 flex items-center">
                Lihat ide <ChevronRight className="w-3 h-3 ml-1" />
              </p>
            </Link>

          </div>
        </section>

      </main>
    </div>
  );
}
