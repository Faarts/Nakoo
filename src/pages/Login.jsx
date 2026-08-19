import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { Mail, Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import logo from '../assets/nako-logo.svg';
import imgLogin from '../assets/img-login.png';

export function Login() {
  const { user, refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState('masuk'); // 'masuk' | 'daftar'
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Jika sudah login, redirect ke home (ProfileGuard akan handle jika belum setup profile)
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (activeTab === 'daftar') {
        await api.post('/api/auth/register', { name, email, password });
      } else {
        await api.post('/api/auth/login', { email, password });
      }
      await refreshAuth();
    } catch (err) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen p-4 relative overflow-hidden bg-white">
      {/* Ilustrasi 3D Anak */}
      <div className="absolute top-0 left-0 w-full h-auto pointer-events-none z-0">
        <img src={imgLogin} alt="Ilustrasi Anak" className="w-full h-auto object-cover rounded-b-[40px]" />
      </div>

      {/* Header */}
      <header className="mb-[64px] mt-4 z-10">
        <div className="flex items-center gap-2 mb-8">
          <img src={logo} alt="Nakoo Logo" className="w-auto h-8" />
        </div>

        <h1 className="text-3xl font-medium text-neutral-800 leading-tight mb-2 max-w-[239px]">
          {activeTab === 'masuk' ? 'Selamat datang\nkembali!' : 'Selamat datang\nkembali!'}
        </h1>
        <p className="text-sm text-neutral-500 max-w-[239px]">
          {activeTab === 'masuk'
            ? 'Masuk untuk melanjutkan rencana harian si kecil'
            : 'Mulai rencanakan hari terbaik untuk si kecil'}
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="flex p-1 bg-primary-50 rounded-[12px] mb-8 z-10 relative">
        <button
          type="button"
          onClick={() => { setActiveTab('masuk'); setError(null); }}
          className={`flex-1 py-2.5 text-base rounded-[12px] transition-all duration-200 ${activeTab === 'masuk'
            ? 'bg-white border-2 border-primary-100 font-semibold text-primary-800'
            : 'bg-transparent border-none font-medium text-neutral-400'
            }`}
        >
          Masuk
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('daftar'); setError(null); }}
          className={`flex-1 py-2.5 text-base rounded-[12px] transition-all duration-200 ${activeTab === 'daftar'
            ? 'bg-white border-2 border-primary-100 font-semibold text-primary-800'
            : 'bg-transparent border-none font-medium text-neutral-400'
            }`}
        >
          Daftar
        </button>
      </div>

      {/* Form Area */}
      <div className="flex-1 z-10 flex flex-col">
        {error && (
          <div className="mb-4 p-3 bg-nakooRed-50 text-nakooRed-500 text-sm rounded-xl border border-nakooRed-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="bg-white p-[20px] flex flex-col gap-[12px] rounded-3xl">
            {activeTab === 'daftar' && (
              <Input
                icon={UserIcon}
                placeholder="Nama Ibu / Ayah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-neutral-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mt-[32px] mb-8">
            <Button
              type="submit"
              disabled={loading}
              className="mb-6"
            >
              {loading ? 'Memproses...' : (activeTab === 'masuk' ? 'Masuk →' : 'Daftar →')}
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-neutral-200"></div>
              <span className="text-sm text-neutral-400 whitespace-nowrap">atau masuk dengan</span>
              <div className="flex-1 h-px bg-neutral-200"></div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="auth" fullWidth={false} className="flex-1">
                Google
              </Button>
              <Button type="button" variant="auth" fullWidth={false} className="flex-1">
                Apple
              </Button>
            </div>

            <div className="mt-8 flex justify-center">
              <Link to="/explore/menu" className="text-sm font-medium text-primary-500 hover:text-primary-600 transition-colors">
                Lewati & Eksplor Resep →
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
