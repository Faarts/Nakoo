import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { BottomSheet } from '../components/BottomSheet';
import { useToast } from '../components/Toast';
import {
  Calendar,
  Heart,
  ArrowRight,
  Check,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Clock,
  Plus,
  Trash2,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import homeHeroImg from '../assets/home-hero.png';
import ctaImg from '../assets/image-5.png';
import tahukahIbuImg from '../assets/image-8.png';
import nakooLogo from '../assets/nako-logo.svg';
import checkIcon from '../assets/icon/check-icon.svg';
import saveIcon from '../assets/icon/save-icon.svg';
import tumbuhIcon from '../assets/icon/tumbuh-icon.svg';
import { DUMMY_RECIPES } from '../../.mock/recipes';
import { DUMMY_ACTIVITIES } from '../../.mock/activities';

// Format Indonesian Date: "Selasa, 17 Jun 2025"
function formatIndonesianDate(date = new Date()) {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const dayName = days[date.getDay()];
  const dayNum = date.getDate();
  const monthName = months[date.getMonth()];
  const year = date.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

// Default slot jadwal harian si kecil
const DEFAULT_SCHEDULE_SLOTS = [
  { id: 'breakfast', name: 'Sarapan', time: '07:00', type: 'meal', mealType: 'breakfast', emoji: '🥣', desc: 'Menu gizi seimbang pembuka hari', enabled: true, optional: false },
  { id: 'morning_act', name: 'Main Pagi', time: '09:00', type: 'activity', emoji: '🧩', desc: 'Stimulasi motorik & sensorik', enabled: true, optional: false },
  { id: 'lunch', name: 'Makan Siang', time: '11:30', type: 'meal', mealType: 'lunch', emoji: '🍛', desc: 'Energi utama siang hari', enabled: true, optional: false },
  { id: 'nap', name: 'Tidur Siang', time: '13:00', type: 'routine', emoji: '🌙', desc: 'Istirahat di kamar', enabled: true, optional: true },
  { id: 'afternoon_act', name: 'Main Sore', time: '15:30', type: 'activity', emoji: '⚽', desc: 'Gerak aktif & eksplorasi sore', enabled: true, optional: false },
  { id: 'dinner', name: 'Makan Malam', time: '18:00', type: 'meal', mealType: 'dinner', emoji: '🍲', desc: 'Menu bernutrisi sebelum malam', enabled: true, optional: false },
];

// Presets rutinitas jadwal harian
const PRESET_ROUTINES = [
  {
    id: 'standard',
    label: '🌟 Standar',
    slots: [
      { id: 'breakfast', name: 'Sarapan', time: '07:00', type: 'meal', mealType: 'breakfast', emoji: '🥣', desc: 'Menu gizi seimbang pembuka hari', enabled: true, optional: false },
      { id: 'morning_act', name: 'Main Pagi', time: '09:00', type: 'activity', emoji: '🧩', desc: 'Stimulasi motorik & sensorik', enabled: true, optional: false },
      { id: 'lunch', name: 'Makan Siang', time: '11:30', type: 'meal', mealType: 'lunch', emoji: '🍛', desc: 'Energi utama siang hari', enabled: true, optional: false },
      { id: 'nap', name: 'Tidur Siang', time: '13:00', type: 'routine', emoji: '🌙', desc: 'Istirahat di kamar', enabled: true, optional: true },
      { id: 'afternoon_act', name: 'Main Sore', time: '15:30', type: 'activity', emoji: '⚽', desc: 'Gerak aktif & eksplorasi sore', enabled: true, optional: false },
      { id: 'dinner', name: 'Makan Malam', time: '18:00', type: 'meal', mealType: 'dinner', emoji: '🍲', desc: 'Menu bernutrisi sebelum malam', enabled: true, optional: false },
    ]
  },
  {
    id: 'early_bird',
    label: '🌅 Bangun Pagi',
    slots: [
      { id: 'breakfast', name: 'Sarapan', time: '06:30', type: 'meal', mealType: 'breakfast', emoji: '🥣', desc: 'Menu gizi seimbang pembuka hari', enabled: true, optional: false },
      { id: 'morning_act', name: 'Main Pagi', time: '08:30', type: 'activity', emoji: '🧩', desc: 'Stimulasi motorik & sensorik', enabled: true, optional: false },
      { id: 'lunch', name: 'Makan Siang', time: '11:00', type: 'meal', mealType: 'lunch', emoji: '🍛', desc: 'Energi utama siang hari', enabled: true, optional: false },
      { id: 'nap', name: 'Tidur Siang', time: '12:30', type: 'routine', emoji: '🌙', desc: 'Istirahat di kamar', enabled: true, optional: true },
      { id: 'afternoon_act', name: 'Main Sore', time: '15:00', type: 'activity', emoji: '⚽', desc: 'Gerak aktif & eksplorasi sore', enabled: true, optional: false },
      { id: 'dinner', name: 'Makan Malam', time: '17:30', type: 'meal', mealType: 'dinner', emoji: '🍲', desc: 'Menu bernutrisi sebelum malam', enabled: true, optional: false },
    ]
  },
  {
    id: 'no_nap',
    label: '🧸 Tanpa Tidur Siang',
    slots: [
      { id: 'breakfast', name: 'Sarapan', time: '07:30', type: 'meal', mealType: 'breakfast', emoji: '🥣', desc: 'Menu gizi seimbang pembuka hari', enabled: true, optional: false },
      { id: 'morning_act', name: 'Main Pagi', time: '09:30', type: 'activity', emoji: '🧩', desc: 'Stimulasi motorik & sensorik', enabled: true, optional: false },
      { id: 'lunch', name: 'Makan Siang', time: '12:00', type: 'meal', mealType: 'lunch', emoji: '🍛', desc: 'Energi utama siang hari', enabled: true, optional: false },
      { id: 'nap', name: 'Tidur Siang', time: '13:00', type: 'routine', emoji: '🌙', desc: 'Istirahat di kamar', enabled: false, optional: true },
      { id: 'afternoon_act', name: 'Main Sore', time: '15:30', type: 'activity', emoji: '⚽', desc: 'Gerak aktif & eksplorasi sore', enabled: true, optional: false },
      { id: 'dinner', name: 'Makan Malam', time: '18:30', type: 'meal', mealType: 'dinner', emoji: '🍲', desc: 'Menu bernutrisi sebelum malam', enabled: true, optional: false },
    ]
  }
];

export function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { showToast } = useToast();

  const [dailyPlan, setDailyPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Form input jadwal state
  const [scheduleInputs, setScheduleInputs] = useState(DEFAULT_SCHEDULE_SLOTS);
  const [activePreset, setActivePreset] = useState('standard');
  const [showAddCustomSlot, setShowAddCustomSlot] = useState(false);
  const [newSlotData, setNewSlotData] = useState({
    name: '',
    time: '10:00',
    type: 'meal',
    emoji: '🍎',
    desc: ''
  });

  const [featuredRecipes, setFeaturedRecipes] = useState(DUMMY_RECIPES.slice(0, 5));
  const [featuredActivities, setFeaturedActivities] = useState(DUMMY_ACTIVITIES.slice(0, 4));

  // Current time & day progress tracking
  const [currentTimeStr, setCurrentTimeStr] = useState('12:00');
  const [dayProgress, setDayProgress] = useState(50);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      setCurrentTimeStr(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);

      // Progress scaled from 06:00 to 20:00
      const startMinutes = 6 * 60;
      const endMinutes = 20 * 60;
      const currentMinutes = h * 60 + m;
      const pct = Math.min(100, Math.max(0, Math.round(((currentMinutes - startMinutes) / (endMinutes - startMinutes)) * 100)));
      setDayProgress(pct);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

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

  // Buka modal input jadwal dengan data rencana aktif (jika ada) atau default
  const handleOpenScheduleModal = () => {
    if (dailyPlan?.slots && dailyPlan.slots.length > 0) {
      const mapped = dailyPlan.slots.map((s, i) => {
        const isDefaultName = ['Sarapan', 'Main Pagi', 'Makan Siang', 'Tidur Siang', 'Main Sore', 'Makan Malam'].includes(s.name);
        return {
          id: `slot_${i}_${Date.now()}`,
          name: s.name || (s.type === 'meal' ? 'Makan' : s.type === 'activity' ? 'Main' : 'Rutinitas'),
          time: s.time || '08:00',
          type: s.type || 'routine',
          emoji: s.iconEmoji || (s.type === 'meal' ? '🥣' : s.type === 'activity' ? '🧩' : '🌙'),
          desc: s.item?.title || s.desc || '',
          enabled: true,
          optional: s.type === 'routine' || (isDefaultName && s.name === 'Tidur Siang'),
          isCustom: !isDefaultName
        };
      });
      setScheduleInputs(mapped);
      setActivePreset(null);
    } else {
      setScheduleInputs(DEFAULT_SCHEDULE_SLOTS);
      setActivePreset('standard');
    }
    setShowAddCustomSlot(false);
    setShowGenerateModal(true);
  };

  const updateSlotTime = (id, newTime) => {
    setScheduleInputs(prev => prev.map(s => s.id === id ? { ...s, time: newTime } : s));
    setActivePreset(null);
  };

  const toggleSlotEnabled = (id) => {
    setScheduleInputs(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
    setActivePreset(null);
  };

  const removeCustomSlot = (id) => {
    setScheduleInputs(prev => prev.filter(s => s.id !== id));
    setActivePreset(null);
  };

  const applyPreset = (presetId) => {
    const found = PRESET_ROUTINES.find(p => p.id === presetId);
    if (found) {
      setScheduleInputs(found.slots);
      setActivePreset(presetId);
    }
  };

  const handleAddCustomSlot = () => {
    if (!newSlotData.name.trim()) return;
    const categoryEmojis = {
      meal: '🍎',
      activity: '🎨',
      routine: '⭐'
    };
    const newSlot = {
      id: `custom_${Date.now()}`,
      name: newSlotData.name.trim(),
      time: newSlotData.time || '10:00',
      type: newSlotData.type,
      emoji: newSlotData.emoji || categoryEmojis[newSlotData.type] || '⭐',
      desc: newSlotData.desc.trim() || (newSlotData.type === 'meal' ? 'Camilan / Menu tambahan' : newSlotData.type === 'activity' ? 'Aktivitas seru' : 'Rutinitas harian'),
      enabled: true,
      isCustom: true
    };
    setScheduleInputs(prev => {
      const combined = [...prev, newSlot];
      return combined.sort((a, b) => {
        const [ah, am] = (a.time || '00:00').split(':').map(Number);
        const [bh, bm] = (b.time || '00:00').split(':').map(Number);
        return (ah * 60 + am) - (bh * 60 + bm);
      });
    });
    setNewSlotData({ name: '', time: '10:00', type: 'meal', emoji: '🍎', desc: '' });
    setShowAddCustomSlot(false);
    setActivePreset(null);
  };

  const handleConfirmGenerate = async () => {
    const activeSlots = scheduleInputs.filter(s => s.enabled);
    if (activeSlots.length === 0) {
      showToast('Pilih minimal 1 jadwal rutinitas', 'error');
      return;
    }

    setGenerating(true);
    try {
      await api.post('/api/daily-plans/generate', {
        customSlots: activeSlots.map(s => ({
          time: s.time,
          type: s.type,
          name: s.name,
          emoji: s.emoji,
          mealType: s.mealType,
          desc: s.desc
        }))
      });
      await fetchDailyPlan();
      setShowGenerateModal(false);
      showToast('Jadwal harian si kecil berhasil disusun! 🌱', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal menyusun jadwal. Coba lagi.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleConfirmCopy = async () => {
    setShowCopyModal(false);
    setGenerating(true);
    try {
      await api.post('/api/daily-plans/generate');
      await fetchDailyPlan();
      showToast('Rencana kemarin berhasil disalin ke hari ini!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Gagal menyalin rencana.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const toggleSlotDone = async (slotIndex) => {
    if (!dailyPlan || !dailyPlan.slots || !dailyPlan.slots[slotIndex]) return;
    const currentStatus = dailyPlan.slots[slotIndex].status;
    const newStatus = currentStatus === 'done' ? 'pending' : 'done';
    const todayStr = new Date().toISOString().split('T')[0];

    try {
      const res = await api.put('/api/daily-plans/slot-status', {
        date: todayStr,
        index: slotIndex,
        status: newStatus
      });
      if (res.ok) {
        setDailyPlan(prev => {
          const newSlots = [...prev.slots];
          newSlots[slotIndex].status = newStatus;
          return { ...prev, slots: newSlots };
        });
      }
    } catch (e) {
      console.error('Failed to update slot status', e);
    }
  };

  const todayFormatted = formatIndonesianDate(new Date());

  // Calculate streak days (defaults to 12 as shown in Figma if newly created)
  const streakDay = profile?.created_at
    ? Math.max(1, Math.floor((new Date() - new Date(profile.created_at)) / (1000 * 60 * 60 * 24)) + 1)
    : 12;

  // Build schedule slots dynamically from dailyPlan
  const buildHydratedSchedule = () => {
    if (!dailyPlan || !dailyPlan.slots || dailyPlan.slots.length === 0) return [];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const backendSlots = dailyPlan.slots;

    // Helper to calculate minutes from HH:MM
    const parseMinutes = (timeStr, defaultMin = 0) => {
      if (!timeStr) return defaultMin;
      const parts = timeStr.split(':');
      if (parts.length < 2) return defaultMin;
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    };

    const hasCustomSlots = backendSlots.some(s => s.name || s.type === 'routine');
    let scheduleList = [];

    if (hasCustomSlots) {
      scheduleList = backendSlots.map((slot, idx) => {
        const startMin = parseMinutes(slot.time, 7 * 60 + idx * 120);
        return {
          backendIndex: idx,
          name: slot.name || (slot.type === 'meal' ? 'Makan' : slot.type === 'activity' ? 'Main' : 'Rutinitas'),
          time: slot.time || '08:00',
          iconEmoji: slot.iconEmoji || (slot.type === 'meal' ? '🥣' : slot.type === 'activity' ? '🧩' : '🌙'),
          desc: slot.item?.title || slot.desc || 'Aktivitas si kecil',
          status: slot.status || 'pending',
          startMin,
          type: slot.type
        };
      });
    } else {
      // Legacy 5-slot format
      scheduleList = [
        {
          backendIndex: 0,
          name: 'Sarapan',
          time: backendSlots[0]?.time || '07:00',
          iconEmoji: '🥣',
          desc: backendSlots[0]?.item?.title || 'Bubur sayur + susu UHT',
          status: backendSlots[0]?.status || 'pending',
          startMin: parseMinutes(backendSlots[0]?.time, 7 * 60),
          type: 'meal'
        },
        {
          backendIndex: 1,
          name: 'Main Pagi',
          time: backendSlots[1]?.time || '09:00',
          iconEmoji: '🧩',
          desc: backendSlots[1]?.item?.title || 'Puzzle & balok warna',
          status: backendSlots[1]?.status || 'pending',
          startMin: parseMinutes(backendSlots[1]?.time, 9 * 60),
          type: 'activity'
        },
        {
          backendIndex: 2,
          name: 'Makan Siang',
          time: backendSlots[2]?.time || '11:30',
          iconEmoji: '🍛',
          desc: backendSlots[2]?.item?.title || 'Nasi tim ayam + brokoli',
          status: backendSlots[2]?.status || 'pending',
          startMin: parseMinutes(backendSlots[2]?.time, 11 * 60 + 30),
          type: 'meal'
        },
        {
          backendIndex: -1,
          name: 'Tidur Siang',
          time: '13:00',
          iconEmoji: '🌙',
          desc: 'Istirahat di kamar',
          status: currentMinutes >= 15 * 60 ? 'done' : 'pending',
          startMin: 13 * 60,
          type: 'routine'
        },
        {
          backendIndex: 3,
          name: 'Main Sore',
          time: backendSlots[3]?.time || '15:30',
          iconEmoji: '⚽',
          desc: backendSlots[3]?.item?.title || 'Halaman / taman bermain',
          status: backendSlots[3]?.status || 'pending',
          startMin: parseMinutes(backendSlots[3]?.time, 15 * 60 + 30),
          type: 'activity'
        },
        {
          backendIndex: 4,
          name: 'Makan Malam',
          time: backendSlots[4]?.time || '18:00',
          iconEmoji: '🍲',
          desc: backendSlots[4]?.item?.title || 'Sup + roti gandum',
          status: backendSlots[4]?.status || 'pending',
          startMin: parseMinutes(backendSlots[4]?.time, 18 * 60),
          type: 'meal'
        }
      ];
    }

    scheduleList.sort((a, b) => a.startMin - b.startMin);

    return scheduleList.map((item, idx) => {
      const nextItem = scheduleList[idx + 1];
      const endMin = nextItem ? nextItem.startMin : item.startMin + 90;
      const isCurrent = currentMinutes >= item.startMin && currentMinutes < endMin;
      return {
        ...item,
        endMin,
        isCurrent
      };
    });
  };

  const hydratedSchedule = buildHydratedSchedule();
  const completedCount = hydratedSchedule.filter(s => s.status === 'done').length;
  const totalSlotsCount = hydratedSchedule.length || 6;

  return (
    <div className="flex flex-col min-h-full bg-[#FFFBF8] pb-10">

      {/* ========================================================================= */}
      {/* 1. REGISTERED USER VIEW (Matches .figma/my profile: Registered & Registered-1) */}
      {/* ========================================================================= */}
      {user ? (
        <div className="px-4 pt-3 pb-6">

          {/* Header Greeting & Mother Profile Avatar */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-neutral-600 font-medium flex items-center gap-1 mb-1">
                Hai, {user.name ? user.name.split(' ')[0] : 'Bunda'}! <span className="inline-block animate-bounce">👋</span>
              </p>
              <h1 className="text-2xl font-bold text-neutral-900 leading-tight">
                Rencana hari ini<br />
                untuk si <span className="text-nakoo-green-600 font-extrabold">{profile?.child_name || 'Buah Hati'}</span> 🌱
              </h1>
            </div>

            {/* Mother Profile Avatar Link */}
            <Link to="/my-page" className="relative group shrink-0 ml-3 mt-1" title="Lihat Profil & Akun Saya">
              <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-orange-300 via-primary-300 to-nakoo-green-300 shadow-md group-hover:scale-108 group-active:scale-95 transition-all duration-300 overflow-hidden">
                <img
                  src="/img/mother-avatar.jpg"
                  alt="Profil Bunda"
                  className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-nakoo-green-500 border-2 border-white flex items-center justify-center text-white shadow-xs group-hover:scale-110 transition-transform">
                <Heart className="w-2.5 h-2.5 fill-white animate-pulse" />
              </div>
            </Link>
          </div>

          {/* Date Chip & Completion Status */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-1.5 bg-[#FFF2E5] border border-orange-200/60 text-orange-900 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs hover:bg-[#ffe8d6] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-orange-600" />
              <span>{todayFormatted}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 bg-white px-3 py-1.5 rounded-full border border-neutral-100 shadow-xs hover:shadow-sm transition-all">
              <span className={`w-2 h-2 rounded-full inline-block ${completedCount === totalSlotsCount ? 'bg-nakoo-green-500 animate-bounce' : 'bg-nakoo-green-500 animate-pulse'}`} />
              <span>{completedCount}/{totalSlotsCount} selesai</span>
            </div>
          </div>

          {/* Top Quick Actions Card Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">

            {/* Left Card: Rencana Hari Ini */}
            <Link
              to="/my-page"
              className="bg-[#FFF5EB] rounded-[28px] p-4 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-[0.98] border border-orange-100/60"
            >
              <div className="relative w-full aspect-square mb-2 rounded-2xl overflow-hidden flex items-center justify-center bg-orange-50/50">
                <img
                  src="/img/dash-child-blocks.jpg"
                  alt="Rencana Hari Ini"
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-108 transition-transform duration-500 ease-out"
                />
              </div>
              <div>
                <h3 className="font-bold text-neutral-800 text-base leading-tight mb-1 group-hover:text-orange-900 transition-colors">
                  Rencana hari ini
                </h3>
                <p className="text-xs text-neutral-500 leading-snug mb-3">
                  Menu makan & aktivitas untuk buah hati
                </p>
                <div className="inline-flex items-center gap-1.5 bg-[#58774C] hover:bg-[#4a6440] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm group-hover:shadow-md group-hover:translate-x-0.5 transition-all">
                  <span>Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            {/* Right Column: 2 Cards */}
            <div className="flex flex-col gap-3">
              {/* Right Top: Eksplor Menu Makan */}
              <Link
                to="/explore/menu"
                className="bg-[#EAF5EC] rounded-[24px] p-3.5 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-[0.98] relative overflow-hidden flex-1 border border-nakoo-green-100/60"
              >
                <div className="flex justify-end mb-1">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs text-nakoo-green-700 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-20 h-20 mx-auto my-1 flex items-center justify-center">
                  <img
                    src="/img/dash-bowl-veggie.jpg"
                    alt="Eksplor Menu Makan"
                    className="w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-bold text-nakoo-green-900 text-sm leading-tight mt-1 group-hover:text-nakoo-green-800 transition-colors">
                  Eksplor<br />menu makan
                </h3>
              </Link>

              {/* Right Bottom: Eksplor Aktivitas */}
              <Link
                to="/explore/activity"
                className="bg-[#FDF0EB] rounded-[24px] p-3.5 flex flex-col justify-between hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-[0.98] relative overflow-hidden flex-1 border border-orange-100/60"
              >
                <div className="flex justify-end mb-1">
                  <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-xs text-orange-600 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="w-20 h-20 mx-auto my-1 flex items-center justify-center">
                  <img
                    src="/img/dash-stack-blocks.jpg"
                    alt="Eksplor Aktivitas"
                    className="w-full h-full object-contain rounded-xl group-hover:scale-110 transition-transform duration-500 ease-out"
                  />
                </div>
                <h3 className="font-bold text-orange-950 text-sm leading-tight mt-1 group-hover:text-orange-800 transition-colors">
                  Eksplor<br />Aktivitas
                </h3>
              </Link>
            </div>
          </div>

          {/* Time Progress Indicator Bar */}
          <div className="mb-6 bg-white rounded-2xl p-3.5 border border-neutral-100 shadow-xs hover:shadow-sm transition-all">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1.5 px-1 font-medium">
              <span className="flex items-center gap-1 text-neutral-600">☀️ Pagi</span>
              <span className="font-bold text-nakoo-red-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-nakoo-red-500 animate-ping" />
                Sekarang: {currentTimeStr}
              </span>
              <span className="flex items-center gap-1 text-neutral-600">🌙 Malam</span>
            </div>
            <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-nakoo-green-500 to-nakoo-green-600 rounded-full transition-all duration-700 shadow-xs relative"
                style={{ width: `${dayProgress}%` }}
              >
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full animate-pulse" />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* BOTTOM SCHEDULE CARD: Registered (Empty) vs Registered-1 (Has Schedule)   */}
          {/* ========================================================================= */}
          {loadingPlan ? (
            <div className="bg-white rounded-[28px] p-8 shadow-card border border-neutral-100 text-center flex flex-col items-center animate-pulse">
              <RefreshCw className="w-8 h-8 text-neutral-300 animate-spin mb-2" />
              <p className="text-sm text-neutral-400">Memuat rencana hari ini...</p>
            </div>
          ) : !dailyPlan || !dailyPlan.slots || dailyPlan.slots.length === 0 ? (

            /* State A: Belum ada rencana hari ini (Registered.png) */
            <div className="bg-white rounded-[28px] p-6 shadow-card border border-neutral-100/80 text-center flex flex-col items-center animate-scale-in">
              <div className="w-36 h-36 mb-2 flex items-center justify-center">
                <img
                  src="/img/dash-plant-pot.jpg"
                  alt="Tanaman Tumbuh"
                  className="w-full h-full object-contain hover:scale-108 transition-transform duration-500 animate-float-subtle"
                />
              </div>
              <h3 className="text-lg font-bold text-neutral-800 mb-1">
                Belum ada rencana<br />untuk hari ini
              </h3>
              <p className="text-sm text-neutral-500 mb-6 max-w-[240px]">
                Tanaman tumbuh ketika dirawat dengan rutin 🌱
              </p>

              <button
                type="button"
                onClick={handleOpenScheduleModal}
                disabled={generating}
                className="w-full py-4 rounded-full bg-[#FBB040] hover:bg-[#faa020] text-white font-bold text-base shadow-lg shadow-orange-400/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:-translate-y-0.5 transition-all duration-200"
              >
                <Calendar className="w-5 h-5" />
                <span>{generating ? 'Menyusun rencana...' : 'Atur & buat rencana hari ini →'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCopyModal(true)}
                disabled={generating}
                className="mt-4 text-xs font-semibold text-neutral-500 hover:text-neutral-700 flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                <span>Salin dari rencana kemarin</span>
              </button>
            </div>

          ) : (

            /* State B: Jadwal Hari Ini (Registered-1.png) */
            <div className="bg-white rounded-[28px] p-5 shadow-card border border-neutral-100/80 animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-neutral-800">
                    Jadwal Hari Ini
                  </h2>
                  <button
                    type="button"
                    onClick={handleOpenScheduleModal}
                    className="p-1 rounded-lg text-neutral-400 hover:text-orange-600 hover:bg-orange-50 active:scale-90 transition-all cursor-pointer"
                    title="Ubah & Sesuaikan Jadwal"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-2">

                  <span className="text-xs font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100 hover:animate-wiggle cursor-default select-none shadow-2xs">
                    Hari ke-{streakDay} 🎉
                  </span>
                </div>
              </div>

              {/* Vertical timeline items */}
              <div className="relative pl-5 space-y-3.5 before:absolute before:left-2 before:top-3 before:bottom-3 before:w-0.5 before:bg-orange-200/70">
                {hydratedSchedule.map((slot, idx) => {
                  const isDone = slot.status === 'done';
                  const isCurrent = slot.isCurrent;

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-2xl transition-all duration-300 ${isCurrent
                        ? 'bg-[#EAF5EC] border border-nakoo-green-300 p-3 -ml-2 -mr-2 shadow-xs animate-pulse-glow'
                        : 'p-1 hover:bg-neutral-50'
                        }`}
                    >
                      {/* Timeline dot / checkmark */}
                      <div
                        onClick={() => slot.backendIndex >= 0 && toggleSlotDone(slot.backendIndex)}
                        className={`absolute -left-[24px] top-3 w-5 h-5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 active:scale-75 ${isDone
                          ? 'bg-nakoo-green-500 text-white shadow-xs'
                          : isCurrent
                            ? 'bg-nakoo-green-500 text-white ring-4 ring-nakoo-green-200 ring-offset-1'
                            : 'bg-white border-2 border-orange-300 text-transparent hover:border-orange-400'
                          }`}
                      >
                        {isDone ? (
                          <Check className="w-3 h-3 stroke-[3] animate-check-pop" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Emoji / Icon Box */}
                        <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 border border-neutral-100 text-xl overflow-hidden hover:scale-110 transition-transform duration-200 select-none">
                          <span>{slot.iconEmoji}</span>
                        </div>

                        {/* Title & Item Name */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className={`font-bold text-sm truncate transition-all duration-200 ${isDone ? 'text-neutral-400 line-through' : 'text-neutral-800'
                              }`}>
                              {slot.name}
                            </h4>
                            {isCurrent && (
                              <span className="bg-nakoo-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-xs animate-bounce-once">
                                SEKARANG
                              </span>
                            )}
                          </div>
                          <p className={`text-xs truncate mt-0.5 transition-colors duration-200 ${isDone ? 'text-neutral-400' : 'text-neutral-500'
                            }`}>
                            {slot.desc}
                          </p>
                        </div>

                        {/* Time & Toggle Status */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-medium text-neutral-400 block mb-0.5">
                            {slot.time}
                          </span>
                          <button
                            type="button"
                            onClick={() => slot.backendIndex >= 0 && toggleSlotDone(slot.backendIndex)}
                            className={`w-6 h-6 rounded-full inline-flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-75 ${isDone
                              ? 'bg-nakoo-green-500 text-white shadow-xs'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-400 hover:text-neutral-600'
                              }`}
                            title={isDone ? 'Tandai belum' : 'Tandai selesai'}
                          >
                            <Check className={`w-3.5 h-3.5 stroke-[3] ${isDone ? 'animate-check-pop' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View Full Schedule CTA Button */}
              <button
                type="button"
                onClick={() => navigate('/my-page')}
                className="w-full py-4 rounded-full bg-[#FBB040] hover:bg-[#faa020] text-white font-bold text-base shadow-lg shadow-orange-400/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:-translate-y-0.5 transition-all duration-200 mt-5"
              >
                <Calendar className="w-5 h-5" />
                <span>Lihat rencana lengkap →</span>
              </button>
            </div>
          )}
        </div>

      ) : (

        /* ========================================================================= */
        /* 2. PUBLIC / UNREGISTERED LANDING HERO & PROMO                             */
        /* ========================================================================= */
        <>
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
        </>
      )}

      {/* ========================================================================= */}
      {/* 3. SHARED EXPLORE SECTIONS: MENU & ACTIVITY RECOMMENDATIONS               */}
      {/* ========================================================================= */}

      {/* Menu Makan Pilihan */}
      <section className="mb-8 mt-4">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="text-base font-bold text-neutral-800">Menu makan pilihan</h2>
          <Link to="/explore/menu" className="text-neutral-400 hover:text-orange-600 flex items-center gap-1 text-sm font-medium transition-colors group">
            <span>Lihat semua</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x hide-scrollbar flex-nowrap">
          {featuredRecipes.map((recipe, idx) => {
            const num = ((idx % 8) + 1).toString().padStart(2, '0');
            const imgSrc = `/img/food-${num}.png`;
            return (
              <Link
                key={recipe.id || idx}
                to={`/explore/menu/${recipe.id}`}
                className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-card-sm border border-neutral-100/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-[0.98]"
              >
                <div className="w-full h-24 bg-neutral-100 rounded-xl mb-3 overflow-hidden">
                  <img src={imgSrc} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 leading-tight mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">{recipe.title}</h3>
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
      <section className="mb-8">
        <div className="flex justify-between items-center px-4 mb-3">
          <h2 className="text-base font-bold text-neutral-800">Aktivitas Pilihan</h2>
          <Link to="/explore/activity" className="text-neutral-400 hover:text-orange-600 flex items-center gap-1 text-sm font-medium transition-colors group">
            <span>Lihat semua</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto px-4 pb-2 snap-x hide-scrollbar flex-nowrap">
          {featuredActivities.map((act, idx) => {
            const num = ((idx % 3) + 1).toString().padStart(2, '0');
            const localImg = `/img/act-${num}.png`;
            const image = act.image || localImg;
            const skill = Array.isArray(act.skills) ? act.skills[0] : (typeof act.skills === 'string' ? JSON.parse(act.skills || '[]')[0] : 'Motorik');

            return (
              <Link
                key={act.id || idx}
                to={`/explore/activity/${act.id}`}
                className="w-[160px] shrink-0 snap-start bg-white rounded-2xl p-3 shadow-card-sm border border-neutral-100/90 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group active:scale-[0.98]"
              >
                <div className="w-full h-24 bg-neutral-100 rounded-xl mb-3 overflow-hidden">
                  <img src={image} alt={act.title} className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out" />
                </div>
                <h3 className="text-sm font-semibold text-neutral-800 leading-tight mb-3 line-clamp-2 group-hover:text-nakoo-green-700 transition-colors">{act.title}</h3>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  <Badge variant="green">{act.age_range} bln</Badge>
                  {skill && <Badge variant="primary">{skill.replace('_', ' ')}</Badge>}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA Banner (Non-logged-in only) */}
      {!user && (
        <section className="px-4 mb-8">
          <div className="bg-gradient-to-br from-primary-50 via-orange-50/50 to-nakoo-blue-50 rounded-[32px] p-6 flex flex-col items-center text-center relative overflow-hidden border border-primary-100 shadow-sm hover:shadow-md transition-shadow">
            <img src={ctaImg} alt="CTA Ilustrasi" className="w-32 h-40 object-contain mb-2 animate-float-subtle" />

            <h2 className="text-xl font-bold text-neutral-800 mb-3 leading-snug">
              Sesuaikan menu dan aktivitas sesuai kebutuhan <span className="text-nakoo-green-600 font-extrabold">si kecil</span>
            </h2>
            <p className="text-sm text-neutral-500 mb-8 leading-relaxed max-w-[280px]">
              Isi profil singkat si kecil, dan Nakoo bantu susun rencana harian yang pas setiap hari
            </p>

            <Button onClick={() => navigate('/login')} className="w-full flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary-500/30">
              Daftar Sekarang <span className="font-bold text-lg leading-none transition-transform group-hover:translate-x-1">→</span>
            </Button>
          </div>
        </section>
      )}

      {/* Kenapa Nakoo? */}
      <section className="px-4 mb-8">
        <h2 className="text-base font-bold text-neutral-800 mb-3">Kenapa Nakoo?</h2>
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-item border border-neutral-100/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 shrink-0 bg-[#FFEBDB] text-[#E58639] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <img src={checkIcon} alt="Check Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-800 mb-1 group-hover:text-orange-600 transition-colors">Sesuai Usia</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Rekomendasi menu & main otomatis menyesuaikan usia si kecil, tanpa perlu riset sendiri.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-item border border-neutral-100/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 shrink-0 bg-[#E4F1DF] text-[#437A32] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <img src={saveIcon} alt="Save Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-800 mb-1 group-hover:text-nakoo-green-700 transition-colors">Aman dari Alergen</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Cukup catat alergi si kecil sekali, Nakoo yang saring menu setiap harinya.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-item border border-neutral-100/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
            <div className="w-12 h-12 shrink-0 bg-[#FFDBD1] text-[#B9411A] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
              <img src={tumbuhIcon} alt="Tumbuh Icon" className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-800 mb-1 group-hover:text-nakoo-red-600 transition-colors">Ikuti Tumbuh Kembang</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">Rencana harian ikut berubah seiring si kecil mencapai tahap perkembangan baru.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tahukah Ibu? */}
      <section className="px-4 mb-8">
        <div className="bg-gradient-to-r from-[#FFEBDB] to-[#FFFBF8] rounded-2xl p-4 flex items-center gap-4 border border-orange-100/60 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <img src={tahukahIbuImg} alt="Tahukah Ibu Icon" className="w-20 h-20 shrink-0 object-contain group-hover:scale-108 transition-transform duration-300" />
          <div>
            <h3 className="text-lg font-bold text-nakoo-green-600 mb-1 flex items-center gap-1">
              Tahukah Ibu? 🌿
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Rutinitas harian yang konsisten membantu anak merasa lebih aman dan mendukung tumbuh kembangnya.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 flex flex-col items-center mt-2">
        <div className="flex items-center gap-2 mb-2">
          <img src={nakooLogo} alt="Nakoo Logo" className="h-7 w-auto" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm text-neutral-500">Tumbuh kembang si kecil, terencana</p>
          <p className="text-[10px] text-neutral-400">© 2026 Nakoo. Semua hak dilindungi.</p>
        </div>
      </footer>

      {/* Modal: Atur & Input Jadwal Hari Ini */}
      <BottomSheet
        isOpen={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        title={`Atur Jadwal untuk ${profile?.child_name || 'Buah Hati'}`}
        action={
          <div className="space-y-2">
            <Button
              onClick={handleConfirmGenerate}
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 bg-[#FBB040] hover:bg-[#faa020] text-white shadow-lg shadow-orange-400/25 cursor-pointer"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Menyusun rencana...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Simpan & Susun Jadwal Hari Ini</span>
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={() => setShowGenerateModal(false)} disabled={generating}>
              Batal
            </Button>
          </div>
        }
      >
        <div className="space-y-4 pb-2">
          {/* Subtitle / Intro */}
          <div>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Atur jam rutinitas makan, main, dan istirahat si kecil. Nakoo akan mencocokkan menu bergizi dan aktivitas motorik sesuai jam yang Ayah/Bunda tentukan.
            </p>
          </div>

          {/* Quick Preset Selector */}
          <div className="bg-orange-50/60 rounded-2xl p-2.5 border border-orange-100/80">
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                Pilihan Rutinitas:
              </span>
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Waktu</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_ROUTINES.map(preset => {
                const isSelected = activePreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset.id)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${isSelected
                      ? 'bg-orange-500 text-white shadow-xs scale-[1.02]'
                      : 'bg-white text-neutral-600 border border-orange-200/80 hover:bg-orange-100/50'
                      }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slot Input List */}
          <div className="space-y-2.5">
            {scheduleInputs.map((slot) => {
              const typeBadges = {
                meal: { label: 'Makan', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                activity: { label: 'Main', class: 'bg-blue-50 text-blue-700 border-blue-200' },
                routine: { label: 'Istirahat', class: 'bg-purple-50 text-purple-700 border-purple-200' },
              };
              const badge = typeBadges[slot.type] || typeBadges.routine;

              return (
                <div
                  key={slot.id}
                  className={`rounded-2xl p-3 border transition-all flex items-center gap-3 ${slot.enabled
                    ? 'bg-white border-neutral-200 shadow-2xs'
                    : 'bg-neutral-50 border-neutral-200/60 opacity-55'
                    }`}
                >
                  {/* Emoji / Icon Box */}
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-xl shrink-0">
                    <span>{slot.emoji}</span>
                  </div>

                  {/* Slot Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-sm font-bold text-neutral-800 truncate">
                        {slot.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${badge.class}`}>
                        {badge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                      {slot.desc}
                    </p>
                  </div>

                  {/* Right Actions: Time Input & Toggle/Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Time Input */}
                    <div className="flex items-center gap-1 bg-neutral-100 hover:bg-neutral-150 px-2 py-1 rounded-xl border border-neutral-200/80 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100 transition-all">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <input
                        type="time"
                        value={slot.time}
                        disabled={!slot.enabled}
                        onChange={(e) => updateSlotTime(slot.id, e.target.value)}
                        className="text-xs font-bold text-neutral-800 bg-transparent outline-none cursor-pointer w-[60px] disabled:text-neutral-400"
                        title="Atur jam rutinitas"
                      />
                    </div>

                    {/* Optional Slot Toggle */}
                    {slot.optional && (
                      <button
                        type="button"
                        onClick={() => toggleSlotEnabled(slot.id)}
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs transition-colors cursor-pointer ${slot.enabled
                          ? 'bg-nakoo-green-50 text-nakoo-green-600 hover:bg-nakoo-green-100'
                          : 'bg-neutral-100 text-neutral-400 hover:bg-neutral-200'
                          }`}
                        title={slot.enabled ? 'Nonaktifkan jadwal ini' : 'Aktifkan jadwal ini'}
                      >
                        {slot.enabled ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Custom Slot Delete */}
                    {slot.isCustom && (
                      <button
                        type="button"
                        onClick={() => removeCustomSlot(slot.id)}
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-neutral-400 hover:text-nakoo-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Hapus jadwal ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Custom Slot Button & Inline Form */}
          {!showAddCustomSlot ? (
            <button
              type="button"
              onClick={() => setShowAddCustomSlot(true)}
              className="w-full py-2.5 px-3 rounded-2xl border-2 border-dashed border-neutral-200 hover:border-orange-300 bg-white/50 hover:bg-orange-50/40 text-neutral-600 hover:text-orange-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99]"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Kustom (Camilan, Mandi, Susu)</span>
            </button>
          ) : (
            <div className="bg-orange-50/60 rounded-2xl p-3.5 border border-orange-200/80 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-orange-500" />
                  Tambah Rutinitas Baru
                </h4>
                <button
                  type="button"
                  onClick={() => setShowAddCustomSlot(false)}
                  className="text-xs text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-medium text-neutral-600 block mb-1">
                    Nama Rutinitas
                  </label>
                  <input
                    type="text"
                    placeholder="Misal: Snack Buah"
                    value={newSlotData.name}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-neutral-200 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-neutral-600 block mb-1">
                    Jam
                  </label>
                  <input
                    type="time"
                    value={newSlotData.time}
                    onChange={(e) => setNewSlotData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full bg-white text-xs px-3 py-2 rounded-xl border border-neutral-200 outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-neutral-600 block mb-1">
                  Kategori
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { type: 'meal', label: '🥣 Makan', emoji: '🍎' },
                    { type: 'activity', label: '🧩 Main', emoji: '🎨' },
                    { type: 'routine', label: '🌙 Rutinitas', emoji: '⭐' },
                  ].map(c => (
                    <button
                      key={c.type}
                      type="button"
                      onClick={() => setNewSlotData(prev => ({ ...prev, type: c.type, emoji: c.emoji }))}
                      className={`py-1.5 px-2 rounded-xl text-xs font-semibold text-center border transition-all cursor-pointer ${newSlotData.type === c.type
                        ? 'bg-orange-500 text-white border-orange-500 shadow-2xs'
                        : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                        }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                size="sm"
                onClick={handleAddCustomSlot}
                disabled={!newSlotData.name.trim()}
                className="w-full text-xs py-2 bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              >
                Tambahkan ke Jadwal
              </Button>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* Modal: Salin dari Rencana Kemarin */}
      <BottomSheet
        isOpen={showCopyModal}
        onClose={() => setShowCopyModal(false)}
        title="Salin dari Rencana Kemarin"
        action={
          <div className="space-y-2">
            <Button onClick={handleConfirmCopy} disabled={generating} className="w-full flex items-center justify-center gap-2">
              {generating ? 'Menyalin...' : 'Ya, salin rencana kemarin'}
            </Button>
            <Button variant="secondary" onClick={() => setShowCopyModal(false)}>
              Batal
            </Button>
          </div>
        }
      >
        <p className="text-sm text-neutral-500">
          Rencana kemarin akan disalin ke hari ini, menggantikan rencana yang ada (jika ada). Lanjutkan?
        </p>
      </BottomSheet>

    </div>
  );
}
