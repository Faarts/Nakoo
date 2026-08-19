import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../lib/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Check } from 'lucide-react';

const ALERGIES_OPTIONS = ['Susu Sapi', 'Telur', 'Kacang', 'Seafood', 'Gluten', 'Kedelai'];
const SKILLS_OPTIONS = ['Motorik Kasar', 'Motorik Halus', 'Kognitif', 'Bahasa', 'Sosial'];
const MATERIALS_OPTIONS = ['Kertas', 'Kardus', 'Pewarna', 'Plastisin', 'Balok'];

function ChipSelect({ options, selected, onChange }) {
  const toggle = (option) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(option => {
        const isSelected = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => toggle(option)}
            className={`px-4 py-2 text-sm rounded-full border transition-all ${
              isSelected 
                ? 'bg-primary-50 border-primary-500 text-primary-600 font-medium' 
                : 'bg-white border-neutral-200 text-neutral-600'
            }`}
          >
            {isSelected && <Check className="w-4 h-4 inline-block mr-1 -ml-1" />}
            {option}
          </button>
        );
      })}
    </div>
  );
}

export function SetupProfile() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [alergies, setAlergies] = useState([]);
  const [skills, setSkills] = useState([]);
  const [materials, setMaterials] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const calculateAge = (dateString) => {
    if (!dateString) return '';
    const birth = new Date(dateString);
    const today = new Date();
    
    let months = (today.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += today.getMonth();
    
    if (months < 12) {
      return `${months} bulan`;
    }
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return remainingMonths === 0 ? `${years} tahun` : `${years} thn ${remainingMonths} bln`;
  };

  const ageStr = calculateAge(birthDate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!childName || !birthDate) {
      setError("Nama dan tanggal lahir wajib diisi");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from('child_profiles').insert({
        user_id: user.id,
        child_name: childName,
        birth_date: birthDate,
        alergies: alergies,
        focus_skills: skills,
        available_materials: materials
      });

      if (error) throw error;
      
      // Update context profile
      await refreshProfile();
      
      // Ke home
      navigate('/home', { replace: true });

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan profil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 p-6">
      <header className="mb-8 pt-4">
        <h1 className="text-2xl font-bold text-neutral-800 leading-tight mb-2">
          Ceritakan tentang si kecil
        </h1>
        <p className="text-sm text-neutral-500">
          Agar Nakoo bisa memberikan rekomendasi menu dan aktivitas yang paling sesuai.
        </p>
      </header>

      {error && (
        <div className="mb-6 p-3 bg-nakooRed-50 text-nakooRed-500 text-sm rounded-xl border border-nakooRed-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-6">
        
        {/* Basic Info */}
        <div className="space-y-4">
          <Input
            label="Nama Panggilan Anak"
            placeholder="Misal: Budi"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            required
          />
          
          <div>
            <Input
              label="Tanggal Lahir"
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
            />
            {ageStr && (
              <p className="text-sm text-primary-600 mt-1 font-medium bg-primary-50 inline-block px-2 py-1 rounded-md">
                Usia saat ini: {ageStr}
              </p>
            )}
          </div>
        </div>

        <div className="h-px bg-neutral-200 my-2"></div>

        {/* Preferences */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Alergi Makanan (Opsional)
            </label>
            <ChipSelect 
              options={ALERGIES_OPTIONS} 
              selected={alergies} 
              onChange={setAlergies} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Fokus Skill Saat Ini (Opsional)
            </label>
            <ChipSelect 
              options={SKILLS_OPTIONS} 
              selected={skills} 
              onChange={setSkills} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-800 mb-2">
              Bahan Mainan di Rumah (Opsional)
            </label>
            <ChipSelect 
              options={MATERIALS_OPTIONS} 
              selected={materials} 
              onChange={setMaterials} 
            />
          </div>
        </div>

        <div className="mt-auto pt-8 pb-8">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Menyimpan...' : 'Selesai & Mulai →'}
          </Button>
        </div>

      </form>
    </div>
  );
}
