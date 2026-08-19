import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import {
  Salad, Puzzle, ChevronRight,
  Calendar, ShieldCheck, LineChart,
  Shield,
  ChartBar,
  ChartLine
} from 'lucide-react';
import homeHeroImg from '../assets/home-hero.png';
import ctaImg from '../assets/image-5.png';
import tahukahIbuImg from '../assets/image-8.png';
import nakooLogo from '../assets/nako-logo.svg';
import checkIcon from '../assets/icon/check-icon.svg';
import saveIcon from '../assets/icon/save-icon.svg';
import tumbuhIcon from '../assets/icon/tumbuh-icon.svg';
import { Badge } from '../components/Badge';

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-full bg-[#FFFBF8] pb-20">
      <TopBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8F7] to-[#FAF9F6]">
        <div className="absolute top-24 left-6 z-10">
          <h1 className="text-[28px] leading-tight font-medium text-neutral-800 max-w-[300px]">
            Karena setiap si kecil<br />tumbuh <span className="text-nakoo-green-500 font-semibold">berbeda</span>
          </h1>
        </div>

        {/* Mom & Child Illustration */}
        <div className="w-full  relative z-0 flex justify-center">
          <img src={homeHeroImg} alt="Ilustrasi Ibu & Anak" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Menu Makan Pilihan */}
      <section className="mb-8 mt-4">
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-base font-semibold text-neutral-800">Menu makan pilihan</h2>
          <Link to="/explore/menu" className="text-neutral-400 hover:text-neutral-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x hide-scrollbar flex-nowrap">
          {/* Card 1 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/food-01.png" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Alpucok Alpukat Kocok</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">🍎 Buah</Badge>
              <Badge variant="yellow">🧀 Keju</Badge>
            </div>
          </Link>
          {/* Card 2 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/food-02.png" alt="Pasta" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Pasta Daging Sapi Sayuran</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">🍎 Buah</Badge>
              <Badge variant="yellow">🧀 Keju</Badge>
            </div>
          </Link>
          {/* Card 3 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/food-03.png" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Alpucok Alpukat Kocok</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">🍎 Buah</Badge>
              <Badge variant="yellow">🧀 Keju</Badge>
            </div>
          </Link>
          {/* Card 4 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/food-04.png" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Pasta Daging Sapi Sayuran</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">🍎 Buah</Badge>
              <Badge variant="yellow">🧀 Keju</Badge>
            </div>
          </Link>
          {/* Card 5 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/food-05.png" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Alpucok Alpukat Kocok</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="red">🍎 Buah</Badge>
              <Badge variant="yellow">🧀 Keju</Badge>
            </div>
          </Link>
        </div>
      </section>

      {/* Aktivitas Pilihan */}
      <section className="mb-10">
        <div className="flex justify-between items-center px-6 mb-4">
          <h2 className="text-base font-semibold text-neutral-800">Aktivitas Pilihan</h2>
          <Link to="/explore/activity" className="text-neutral-400 hover:text-neutral-600">
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x hide-scrollbar flex-nowrap">
          {/* Card 1 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/act-01.png" alt="Main Air" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Bermain Air</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Kertas</Badge>
            </div>
          </Link>
          {/* Card 2 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/act-02.png" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Bermain Air</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Kertas</Badge>
            </div>
          </Link>
          {/* Card 3 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/act-03.png" alt="Main Air" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Bermain Air</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Kertas</Badge>
            </div>
          </Link>
          {/* Card 4 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="/img/act-03.png" alt="Main Air" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Bermain Air</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Kertas</Badge>
            </div>
          </Link>
          {/* Card 5 */}
          <Link to="/explore/activity" className="min-w-[160px] max-w-[160px] snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80" alt="Puzzle" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Puzzle Bentuk</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="blue">Quiet Time</Badge>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 mb-10">
        <div className="bg-gradient-to-br from-primary-50 to-nakooBlue-100 rounded-[32px] p-5 flex flex-col items-center text-center relative overflow-hidden">
          {/* Placeholder Bowl */}
          <img src={ctaImg} alt="CTA Ilustrasi" className="w-32 h-40 object-contain mb-2" />

          <h2 className="text-xl font-semibold text-neutral-800 mb-3 leading-snug">
            Sesuaikan menu dan aktivitas sesuai kebutuhan <span className="text-nakooGreen-600">si kecil</span>
          </h2>
          <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
            Isi profil singkat si kecil, dan Nakoo bantu susun rencana harian yang pas setiap hari
          </p>

          <Button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-2">
            Daftar Sekarang <span className="font-bold text-lg leading-none">→</span>
          </Button>
        </div>
      </section>

      {/* Kenapa Nakoo? */}
      <section className="px-6 mb-10">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Kenapa Nakoo?</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_4px_16px_rgba(196,101,74,0.04)]">
            <div className="w-12 h-12 shrink-0 bg-[#FFEBDB] text-[#E58639] rounded-xl flex items-center justify-center">
              <img src={checkIcon} alt="Check Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Sesuai Usia</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Rekomendasi menu & main otomatis menyesuaikan usia si kecil, tanpa perlu riset sendiri.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_4px_16px_rgba(196,101,74,0.04)]">
            <div className="w-12 h-12 shrink-0 bg-[#E4F1DF] text-[#437A32] rounded-xl flex items-center justify-center">
              <img src={saveIcon} alt="Save Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Aman dari Alergen</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Cukup catat alergi si kecil sekali, Nakoo yang saring menu setiap harinya.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-[0_4px_16px_rgba(196,101,74,0.04)]">
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
