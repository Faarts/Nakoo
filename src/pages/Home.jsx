import React from 'react';
import { Link } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { Button } from '../components/Button';
import {
  Users, Salad, Puzzle, ChevronRight,
  Calendar, ShieldCheck, LineChart
} from 'lucide-react';
import homeHeroImg from '../home-hero.png';

export function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FFFBF8] pb-20">
      <TopBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F2F8F7] to-[#FAF9F6]">
        <div className="absolute top-24 left-6 z-10">
          <h1 className="text-[28px] leading-tight font-medium text-neutral-800 max-w-[300px]">
            Karena setiap si kecil<br />tumbuh <span className="text-nakooGreen-500 font-semibold">berbeda</span>
          </h1>
        </div>

        {/* Mom & Child Illustration */}
        <div className="w-full  relative z-0 flex justify-center">
          <img src={homeHeroImg} alt="Ilustrasi Ibu & Anak" className="w-full h-500px] object-cover" />
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
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=300&q=80" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Alpucok Alpukat Kocok</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center">🍎 Buah</span>
              <span className="text-[10px] font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full flex items-center">🧀 Keju</span>
            </div>
          </Link>
          {/* Card 2 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=300&q=80" alt="Pasta" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Pasta Daging Sapi Sayuran</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center">🍎 Buah</span>
              <span className="text-[10px] font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full flex items-center">🧀 Keju</span>
            </div>
          </Link>
          {/* Card 3 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=300&q=80" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Alpucok Alpukat Kocok</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center">🍎 Buah</span>
              <span className="text-[10px] font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full flex items-center">🧀 Keju</span>
            </div>
          </Link>
          {/* Card 4 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=300&q=80" alt="Pasta" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Pasta Daging Sapi Sayuran</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center">🍎 Buah</span>
              <span className="text-[10px] font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full flex items-center">🧀 Keju</span>
            </div>
          </Link>
          {/* Card 5 */}
          <Link to="/explore/menu" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1554520735-0a6b8b6ce8b7?auto=format&fit=crop&w=300&q=80" alt="Alpucok" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Alpucok Alpukat Kocok</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-red-50 text-red-600 rounded-full flex items-center">🍎 Buah</span>
              <span className="text-[10px] font-medium px-2 py-1 bg-yellow-50 text-yellow-600 rounded-full flex items-center">🧀 Keju</span>
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
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80" alt="Puzzle" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Puzzle Bentuk</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-nakooBlue-50 text-nakooBlue-600 rounded-full">Quiet Time</span>
            </div>
          </Link>
          {/* Card 2 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534448553655-b4618e932454?auto=format&fit=crop&w=300&q=80" alt="Main Air" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Bermain Air</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-primary-50 text-primary-600 rounded-full">Kertas</span>
            </div>
          </Link>
          {/* Card 3 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80" alt="Puzzle" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Puzzle Bentuk</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-nakooBlue-50 text-nakooBlue-600 rounded-full">Quiet Time</span>
            </div>
          </Link>
          {/* Card 4 */}
          <Link to="/explore/activity" className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534448553655-b4618e932454?auto=format&fit=crop&w=300&q=80" alt="Main Air" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Bermain Air</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-primary-50 text-primary-600 rounded-full">Kertas</span>
            </div>
          </Link>
          {/* Card 5 */}
          <Link to="/explore/activity" className="min-w-[160px] max-w-[160px] snap-start bg-white rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-neutral-100">
            <div className="w-full h-24 bg-neutral-200 rounded-xl mb-3 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=300&q=80" alt="Puzzle" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-sm font-medium text-neutral-800 leading-tight mb-3 line-clamp-2">Puzzle Bentuk</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-medium px-2 py-1 bg-nakooBlue-50 text-nakooBlue-600 rounded-full">Quiet Time</span>
            </div>
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 mb-10">
        <div className="bg-primary-50 rounded-[32px] p-8 flex flex-col items-center text-center relative overflow-hidden">
          {/* Placeholder Bowl */}
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Salad className="w-12 h-12 text-nakooGreen-500" />
          </div>

          <h2 className="text-lg font-semibold text-neutral-800 mb-3 leading-snug">
            Sesuaikan menu dan aktivitas sesuai kebutuhan <span className="text-nakooGreen-600">si kecil</span>
          </h2>
          <p className="text-sm text-neutral-500 mb-8 leading-relaxed">
            Isi profil singkat si kecil, dan Nakoo bantu susun rencana harian yang pas setiap hari
          </p>

          <Link to="/login" className="w-full">
            <Button className="w-full flex items-center justify-center gap-2">
              Daftar Sekarang <span className="font-bold text-lg leading-none">→</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Kenapa Nakoo? */}
      <section className="px-6 mb-10">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">Kenapa Nakoo?</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-neutral-100">
            <div className="w-12 h-12 shrink-0 bg-primary-50 text-primary-500 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Sesuai Usia</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Rekomendasi menu & main otomatis menyesuaikan usia si kecil, tanpa perlu riset sendiri.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-neutral-100">
            <div className="w-12 h-12 shrink-0 bg-nakooGreen-50 text-nakooGreen-500 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-800 mb-1">Aman dari Alergen</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Cukup catat alergi si kecil sekali, Nakoo yang saring menu setiap harinya.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-neutral-100">
            <div className="w-12 h-12 shrink-0 bg-nakooRed-50 text-nakooRed-400 rounded-xl flex items-center justify-center">
              <LineChart className="w-6 h-6" />
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
        <div className="bg-primary-50 rounded-2xl p-4 flex items-center gap-4 border border-primary-100">
          {/* Placeholder Blocks */}
          <div className="w-16 h-16 shrink-0 bg-white rounded-xl shadow-sm flex items-center justify-center">
            <Puzzle className="w-8 h-8 text-nakooBlue-500" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-nakooGreen-600 mb-1 flex items-center gap-1">
              Tahukah Ibu? ✨
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Rutinitas harian yang konsisten membantu anak merasa lebih aman dan mendukung tumbuh kembangnya.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 flex flex-col items-center border-t border-neutral-200 mt-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold tracking-tight text-neutral-700 flex items-center gap-2">
            <span className="text-primary-500">🌱</span> nakoo
          </span>
        </div>
        <p className="text-xs text-neutral-500 mb-6">Tumbuh kembang si kecil, terencana</p>
        <p className="text-[10px] text-neutral-400">© 2026 Nakoo. Semua hak dilindungi.</p>
      </footer>

    </div>
  );
}
