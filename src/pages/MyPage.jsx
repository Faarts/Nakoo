import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../components/Toast';
import {
  Bell,
  SlidersHorizontal,
  Camera,
  Calendar as CalendarIcon,
  ArrowRight,
  Edit2,
  Ban,
  Target,
  LogOut,
  Check
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { BottomSheet } from '../components/BottomSheet';
import { DUMMY_ACTIVITIES } from '../../.mock/activities';

// Helper to format date in Indonesian format e.g. "05 Januari 2024"
function formatIndonesianDate(dateStr) {
  if (!dateStr) return '05 Januari 2024';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateStr;
  }
}

// Helper to calculate age in months
function calculateAgeInMonths(birthDateStr) {
  if (!birthDateStr) return 14;
  try {
    const birth = new Date(birthDateStr);
    const now = new Date();
    const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
    return months > 0 ? months : 14;
  } catch (e) {
    return 14;
  }
}

export function MyPage() {
  const { user, profile, refreshProfile, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activities, setActivities] = useState(DUMMY_ACTIVITIES);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Form State for editing child & parent profile
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('Perempuan');
  const [alergies, setAlergies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (profile) {
      setChildName(profile.child_name || 'Aruna');
      setBirthDate(profile.birth_date || '2024-01-05');
      try {
        setAlergies(profile.alergies ? (typeof profile.alergies === 'string' ? JSON.parse(profile.alergies) : profile.alergies) : ['Telur', 'Udang']);
        setSkills(profile.focus_skills ? (typeof profile.focus_skills === 'string' ? JSON.parse(profile.focus_skills) : profile.focus_skills) : ['Motorik halus']);
      } catch (e) {
        setAlergies(['Telur', 'Udang']);
        setSkills(['Motorik halus']);
      }
    } else {
      setChildName('Aruna');
      setBirthDate('2024-01-05');
      setAlergies(['Telur', 'Udang']);
      setSkills(['Motorik halus']);
    }

    // Fetch activities
    api.get('/api/activities')
      .then(res => {
        if (res.activities && res.activities.length > 0) {
          setActivities(res.activities);
        }
      })
      .catch(() => {
        setActivities(DUMMY_ACTIVITIES);
      });
  }, [user, profile, navigate]);

  const toggleArrayItem = (item, array, setArray) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
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
      setIsEditOpen(false);
    } catch (e) {
      showToast("Gagal menyimpan profil", "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const formattedBirthDate = formatIndonesianDate(birthDate || profile?.birth_date || '2024-01-05');
  const ageInMonths = calculateAgeInMonths(birthDate || profile?.birth_date || '2024-01-05');
  const displayChildName = childName || profile?.child_name || 'Aruna';
  const allergiesString = (alergies && alergies.length > 0) ? alergies.join(', ') : 'Telur, Udang';
  const skillsString = (skills && skills.length > 0) ? skills.join(', ') : 'Motorik halus';

  // Activities mapping for Trending and Hari Ini
  const trendingList = activities.slice(0, 4);
  const dailyActivitiesList = activities.slice(0, 6);

  return (
    <div className="pb-28 bg-[#FBFBFB] min-h-screen">
      <div className="px-5 pt-4">
        {/* Title & Subtitle */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-neutral-900 leading-tight">Profil</h1>
          <p className="text-sm text-neutral-400 font-normal mt-0.5">
            Kelola informasi akun dan profil anak anda
          </p>
        </div>

        {/* 1. Parent Account Card (Ayu Lestari) */}
        <div
          onClick={() => setIsEditOpen(true)}
          className="bg-[#FFF9F3] border border-[#F6C6A0] rounded-[24px] p-3.5 sm:p-4 mb-4 flex items-center gap-3.5 shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
        >
          {/* Parent Avatar with Camera Badge */}
          <div className="relative shrink-0">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-xs">
              <img
                src="/img/mother-avatar.jpg"
                alt="Profil Ibu"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-[#5B8353] rounded-full border-2 border-white flex items-center justify-center text-white shadow-2xs">
              <Camera className="w-2.5 h-2.5" />
            </div>
          </div>

          {/* Parent Name & Email */}
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-bold text-neutral-900 leading-tight truncate group-hover:text-orange-900 transition-colors">
              {user?.name || 'Ayu Lestari'}
            </h2>
            <p className="text-xs text-neutral-500 font-normal mt-0.5 truncate">
              {user?.email || 'ayulestari@gmail.com'}
            </p>
          </div>
        </div>

        {/* 2. Child Profile Card (Aruna) */}
        <div className="bg-white rounded-[24px] p-4.5 mb-6 border border-neutral-100/90 shadow-card hover:shadow-md transition-all duration-300">
          {/* Top Row: Avatar, Name, Gender/Age, Date & Edit Icon */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-neutral-100 shadow-2xs bg-neutral-100">
                <img
                  src="/img/child-avatar.jpg"
                  alt={displayChildName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-base font-bold text-neutral-900 leading-tight truncate">
                  {displayChildName}
                </h3>
                <p className="text-xs text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
                  <span className="text-pink-500 font-semibold">♀</span> {gender} • {ageInMonths} bulan
                </p>
                <p className="text-xs text-neutral-500 font-medium flex items-center gap-1.5 mt-0.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>{formattedBirthDate}</span>
                </p>
              </div>
            </div>

            {/* Quick Edit Icon */}
            <button
              type="button"
              onClick={() => setIsEditOpen(true)}
              className="w-8 h-8 rounded-full bg-neutral-50 hover:bg-orange-50 text-neutral-400 hover:text-orange-600 flex items-center justify-center transition-all active:scale-90 cursor-pointer shrink-0"
              title="Edit Profil Anak"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="h-px bg-neutral-100 my-3.5" />

          {/* Bottom Row: 2 Columns (Alergi & Fokus Skill) */}
          <div className="grid grid-cols-2 divide-x divide-neutral-100 items-center">
            {/* Alergi Column */}
            <div className="flex items-center gap-2.5 pr-2 min-w-0">
              <img
                src="/img/cereal-bowl.jpg"
                alt="Alergi"
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-orange-100 shadow-2xs"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 leading-tight">Alergi</h4>
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  {allergiesString}
                </p>
              </div>
            </div>

            {/* Fokus Skill Column */}
            <div className="flex items-center gap-2.5 pl-3.5 min-w-0">
              <img
                src="/img/cereal-bowl.jpg"
                alt="Fokus Skill"
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-orange-100 shadow-2xs"
              />
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-neutral-900 leading-tight">Fokus Skill</h4>
                <p className="text-xs text-neutral-500 truncate mt-0.5">
                  {skillsString}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Trending Section */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-base font-bold text-neutral-900">Trending</h3>
            <Link
              to="/explore/activity"
              className="text-neutral-700 hover:text-orange-600 transition-colors p-1"
              aria-label="Lihat semua aktivitas trending"
            >
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex overflow-x-auto gap-3.5 pb-2 -mx-5 px-5 scrollbar-hide">
            {trendingList.map((act, idx) => {
              const actImage = act.image || `/img/act-0${(idx % 3) + 1}.png`;
              return (
                <Link
                  key={act.id || idx}
                  to={`/explore/activity/${act.id}`}
                  className="w-[185px] shrink-0 group"
                >
                  <div className="bg-white rounded-2xl p-2.5 border border-neutral-100/90 shadow-card-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[16/11] rounded-xl overflow-hidden mb-2.5 bg-neutral-100">
                      <img
                        src={actImage}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm leading-tight mb-1.5 line-clamp-1 group-hover:text-orange-700 transition-colors">
                      {act.title}
                    </h4>
                    <div className="mt-auto">
                      <span className="text-[10px] font-semibold text-nakoo-green-700 bg-nakoo-green-50 px-2 py-0.5 rounded-full inline-block border border-nakoo-green-100/70">
                        {act.age_range || '6+'} bulan
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 4. Aktivitas Hari Ini Section */}
        <section className="mb-6">
          <h3 className="text-base font-bold text-neutral-900 mb-3">Aktivitas Hari Ini</h3>

          <div className="grid grid-cols-2 gap-3.5">
            {dailyActivitiesList.map((act, idx) => {
              const actImage = act.image || `/img/act-0${(idx % 3) + 1}.png`;
              return (
                <Link
                  key={act.id || idx}
                  to={`/explore/activity/${act.id}`}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl p-2.5 border border-neutral-100/90 shadow-card-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2.5 bg-neutral-100">
                      <img
                        src={actImage}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                    </div>
                    <h4 className="font-bold text-neutral-900 text-sm leading-tight mb-1.5 line-clamp-1 group-hover:text-orange-700 transition-colors">
                      {act.title}
                    </h4>
                    <div className="mt-auto">
                      <span className="text-[10px] font-semibold text-nakoo-green-700 bg-nakoo-green-50 px-2 py-0.5 rounded-full inline-block border border-nakoo-green-100/70">
                        {act.age_range || '6+'} bulan
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Edit Profile BottomSheet Modal */}
      <BottomSheet
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Profil & Preferensi"
      >
        <form onSubmit={handleSaveProfile} className="space-y-5 pb-6">
          <div className="space-y-4">
            <Input
              label="Nama Panggilan Anak"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Contoh: Aruna"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-neutral-700">Tanggal Lahir</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-neutral-900 text-base focus:outline-none focus:ring-2 focus:ring-nakoo-green-500 focus:bg-white transition-all cursor-pointer"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-neutral-700">Jenis Kelamin</label>
              <div className="grid grid-cols-2 gap-2">
                {['Perempuan', 'Laki-laki'].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${gender === g
                        ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                      }`}
                  >
                    {g === 'Perempuan' ? '♀ Perempuan' : '♂ Laki-laki'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alergi & Pantangan */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center text-red-500">
                <Ban className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900">Alergi & Pantangan Makanan</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Telur', 'Susu Sapi', 'Kacang', 'Udang', 'Seafood', 'Gluten', 'Kedelai'].map(al => {
                const isSelected = alergies.includes(al);
                return (
                  <button
                    key={al}
                    type="button"
                    onClick={() => toggleArrayItem(al, alergies, setAlergies)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer border ${isSelected
                        ? 'border-red-500 bg-red-50 text-red-600 shadow-2xs scale-105'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline-block mr-1 -ml-0.5 stroke-[3] animate-check-pop" />}
                    {al}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fokus Skill Utama */}
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <Target className="w-3.5 h-3.5" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900">Fokus Skill Utama</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Motorik halus', 'Motorik kasar', 'Kognitif', 'Bahasa', 'Sosial emosional', 'Kreativitas'].map(sk => {
                const isSelected = skills.includes(sk);
                return (
                  <button
                    key={sk}
                    type="button"
                    onClick={() => toggleArrayItem(sk, skills, setSkills)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 cursor-pointer border ${isSelected
                        ? 'border-purple-500 bg-purple-50 text-purple-600 shadow-2xs scale-105'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    {isSelected && <Check className="w-3 h-3 inline-block mr-1 -ml-0.5 stroke-[3] animate-check-pop" />}
                    {sk}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-3">
            <Button
              type="submit"
              fullWidth
              loading={savingProfile}
              className="bg-[#FBB040] hover:bg-[#faa020] text-white shadow-md shadow-orange-400/30"
            >
              Simpan Perubahan
            </Button>

            <button
              type="button"
              onClick={async () => {
                await logout();
                navigate('/login');
              }}
              className="w-full py-3 rounded-2xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar dari Akun</span>
            </button>
          </div>
        </form>
      </BottomSheet>

      {/* Notifications BottomSheet Modal */}
      <BottomSheet
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        title="Notifikasi"
      >
        <div className="py-4 text-center">
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mx-auto mb-3 text-orange-500">
            <Bell className="w-8 h-8" />
          </div>
          <h4 className="text-base font-bold text-neutral-900 mb-1">Semua Notifikasi Terbaca</h4>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-6">
            Rencana harian dan rekomendasi gizi untuk {displayChildName} akan muncul di sini secara berkala.
          </p>
          <Button onClick={() => setIsNotificationOpen(false)} fullWidth>
            Tutup
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
