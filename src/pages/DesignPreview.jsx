import React, { useState } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { ChipSelect } from '../components/ChipSelect';
import { SearchBar } from '../components/SearchBar';
import { FilterBar } from '../components/FilterBar';
import { Skeleton } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { BottomSheet } from '../components/BottomSheet';
import { TopBar } from '../components/TopBar';
import { Search, Mail, Lock, CheckCircle2, Frown } from 'lucide-react';
import { useToast } from '../components/Toast';

export function DesignPreview() {
  const [selectedChips, setSelectedChips] = useState(['telur']);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const toast = useToast();
  return (
    <div className="p-6 space-y-8 pb-20 bg-neutral-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-800">Preview Desain Nakoo</h1>
        <p className="text-sm text-neutral-500">Melihat kesesuaian palet warna, tipografi, dan komponen dasar.</p>
      </div>

      {/* 1. Color Palette */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">1. Palet Warna</h2>
        <div className="grid grid-cols-4 gap-2">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-primary-500 shadow-sm"></div>
            <span className="text-xs mt-1 text-neutral-600">Primary</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-nakooGreen-500 shadow-sm"></div>
            <span className="text-xs mt-1 text-neutral-600">Success</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-nakooRed-500 shadow-sm"></div>
            <span className="text-xs mt-1 text-neutral-600">Error</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-nakooBlue-500 shadow-sm"></div>
            <span className="text-xs mt-1 text-neutral-600">Info</span>
          </div>
        </div>
      </section>

      {/* 2. Typography */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">2. Tipografi (Inter)</h2>
        <Card className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-800">Heading 1</h1>
          <h2 className="text-xl font-semibold text-neutral-800">Heading 2</h2>
          <p className="text-base text-neutral-800">Teks tubuh utama (Body). Karena setiap si kecil tumbuh berbeda, rutinitas harian yang konsisten membantunya berkembang.</p>
          <p className="text-sm text-neutral-500">Teks sekunder (Caption). Digunakan untuk deskripsi kecil atau tanggal.</p>
        </Card>
      </section>

      {/* 3. Buttons */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">3. Komponen: Button</h2>
        <div className="space-y-4">
          <Button variant="primary">Masuk ke Nakoo</Button>
          <Button variant="primary" icon={CheckCircle2}>Selesai</Button>
          
          <div className="flex gap-2">
            <Button variant="auth" fullWidth={false} className="flex-1">Google</Button>
            <Button variant="auth" fullWidth={false} className="flex-1">Apple</Button>
          </div>
          
          <Button variant="danger">Hapus Profil</Button>
        </div>
      </section>

      {/* 4. Inputs */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">4. Komponen: Input Field</h2>
        <div className="space-y-4">
          <Card>
            <p className="text-sm font-semibold mb-2">Style: Boxed (Default)</p>
            <Input 
              label="Cari resep" 
              placeholder="Cari bubur ayam..." 
              icon={Search} 
            />
          </Card>
          
          <Card>
            <p className="text-sm font-semibold mb-2">Style: Underline (Auth)</p>
            <Input 
              variant="underline"
              placeholder="Email / Nomor handphone" 
              icon={Mail} 
            />
            <Input 
              variant="underline"
              type="password"
              placeholder="Kata sandi" 
              icon={Lock} 
              error="Kata sandi salah"
            />
          </Card>
        </div>
      </section>
      
      {/* 5. Cards */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">5. Komponen: Card</h2>
        <div className="space-y-3">
          <Card interactive>
            <h3 className="font-semibold text-neutral-800">Card Standar (Interactive)</h3>
            <p className="text-sm text-neutral-500 mt-1">Bisa di-tap, ada shadow saat hover/press.</p>
          </Card>
          
          <Card highlight>
            <h3 className="font-semibold text-primary-700">Card Highlight</h3>
            <p className="text-sm text-primary-600 mt-1">Untuk jadwal aktif / sedang berlangsung.</p>
          </Card>
        </div>
      </section>

      {/* 5.5 TopBar */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">5.5. Komponen: TopBar</h2>
        <div className="bg-primary-50 -mx-6 p-6">
          <TopBar 
            onNotificationClick={() => alert('Notif diklik')}
            onMenuClick={() => alert('Menu diklik')}
          />
        </div>
      </section>

      {/* 6. ChipSelect */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">6. Komponen: ChipSelect</h2>
        <ChipSelect 
          options={[
            { label: 'Telur', value: 'telur' },
            { label: 'Susu Sapi', value: 'susu' },
            { label: 'Kacang', value: 'kacang' }
          ]} 
          selectedValues={selectedChips} 
          onChange={setSelectedChips} 
        />
      </section>

      {/* 7. SearchBar & FilterBar */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">7. Komponen: Search & Filter</h2>
        <div className="space-y-4">
          <SearchBar placeholder="Cari resep atau aktivitas..." />
          <div className="-mx-6">
            <FilterBar 
              filters={[
                { label: 'Semua', value: 'all' },
                { label: 'Sarapan', value: 'breakfast' },
                { label: 'Makan Siang', value: 'lunch' },
                { label: 'Cemilan', value: 'snack' }
              ]} 
              activeFilter={activeFilter} 
              onFilterClick={setActiveFilter} 
            />
          </div>
        </div>
      </section>

      {/* 8. Toast Trigger */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">8. Komponen: Toast</h2>
        <div className="flex gap-2 flex-wrap">
          <Button size="sm" onClick={() => toast.showToast('Berhasil disimpan!', 'success')}>Success</Button>
          <Button size="sm" variant="danger" onClick={() => toast.showToast('Gagal memuat data.', 'error')}>Error</Button>
          <Button size="sm" variant="secondary" onClick={() => toast.showToast('Data diperbarui.', 'info')}>Info</Button>
        </div>
      </section>

      {/* 9. Skeleton & EmptyState */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">9. Komponen: State</h2>
        <div className="space-y-6">
          <Card>
            <p className="text-sm font-semibold mb-2">Skeleton Loading</p>
            <div className="flex gap-4 items-center mb-4">
              <Skeleton type="avatar" />
              <div className="flex-1 space-y-2">
                <Skeleton type="text" className="w-full" />
                <Skeleton type="text" className="w-2/3" />
              </div>
            </div>
            <Skeleton type="card" className="h-32" />
          </Card>

          <Card>
            <p className="text-sm font-semibold mb-2">Empty State</p>
            <EmptyState 
              icon={<Frown className="w-16 h-16 mx-auto text-neutral-300" />}
              title="Belum ada favorit"
              description="Simpan resep atau aktivitas favoritmu dari Explore."
              actionLabel="Jelajahi Sekarang"
              onAction={() => alert('Jelajahi ditekan')}
            />
          </Card>
        </div>
      </section>

      {/* 10. BottomSheet */}
      <section>
        <h2 className="text-lg font-semibold text-neutral-800 mb-3 border-b pb-2">10. Komponen: BottomSheet</h2>
        <Button onClick={() => setIsSheetOpen(true)}>Buka Bottom Sheet</Button>
        <BottomSheet 
          isOpen={isSheetOpen} 
          onClose={() => setIsSheetOpen(false)}
          title="Pilih Rentang Usia"
          action={<Button fullWidth onClick={() => setIsSheetOpen(false)}>Terapkan</Button>}
        >
          <div className="py-4 space-y-4">
            <p className="text-neutral-600">Konten di dalam bottom sheet...</p>
            <div className="h-32 bg-neutral-100 rounded-xl flex items-center justify-center">
              Area Scrollable
            </div>
          </div>
        </BottomSheet>
      </section>
    </div>
  );
}
