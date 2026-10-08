import React, { useState } from 'react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { api } from '../lib/api';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import logo from '../assets/nako-logo.svg';
import imgLogin from '../assets/img-login.png';
import googleIcon from '../assets/icon/google.svg';
import appleIcon from '../assets/icon/apple.svg';

export function Login() {
  const { user, profile, loading: authLoading, refreshAuth } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.initialTab || 'masuk'); // 'masuk' | 'daftar'
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Jika sudah login, redirect ke halaman asal atau ke home
  if (user && !authLoading) {
    const fromPath = location.state?.from || '/';
    return <Navigate to={profile ? fromPath : '/setup-profile'} state={{ from: fromPath }} replace />;
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
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setActiveTab(tab);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen p-4 relative overflow-hidden bg-white">
      {/* Ilustrasi 3D Anak */}
      <div className="absolute top-0 left-0 w-full h-auto pointer-events-none z-0">
        <img src={imgLogin} alt="" aria-hidden="true" className="w-full h-auto object-cover rounded-b-[40px]" />
      </div>

      {/* Header */}
      <header className="mb-[64px] mt-4 z-10">
        <div className="flex items-center gap-2 mb-8">
          <img src={logo} alt="Nakoo Logo" className="w-auto h-8" />
        </div>

        <h1 className="text-3xl font-medium text-neutral-800 leading-tight mb-2 max-w-[260px]">
          {activeTab === 'masuk' ? (
            <>Selamat datang<br />kembali!</>
          ) : (
            <>Mulai rencanakan<br />hari si kecil!</>
          )}
        </h1>
        <p className="text-sm text-neutral-500 max-w-[260px]">
          {activeTab === 'masuk'
            ? 'Masuk untuk melanjutkan rencana harian si kecil'
            : 'Daftar sekarang untuk susun menu & aktivitas harian'}
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-primary-50 rounded-2xl mb-8 z-10 relative shadow-inner-white">
        {/* Sliding pill indicator */}
        <div
          className="absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-sm transition-all duration-300"
          style={{
            width: 'calc(50% - 6px)',
            left: activeTab === 'masuk' ? '6px' : 'calc(50%)',
            transitionTimingFunction: 'cubic-bezier(0.34, 1.2, 0.64, 1)',
          }}
          aria-hidden="true"
        />

        <button
          type="button"
          id="tab-masuk"
          role="tab"
          aria-selected={activeTab === 'masuk'}
          onClick={() => switchTab('masuk')}
          className={`flex-1 py-2.5 text-base rounded-xl transition-colors duration-200 cursor-pointer z-10 active:scale-95 ${
            activeTab === 'masuk'
              ? 'font-bold text-orange-950'
              : 'font-medium text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Masuk
        </button>
        <button
          type="button"
          id="tab-daftar"
          role="tab"
          aria-selected={activeTab === 'daftar'}
          onClick={() => switchTab('daftar')}
          className={`flex-1 py-2.5 text-base rounded-xl transition-colors duration-200 cursor-pointer z-10 active:scale-95 ${
            activeTab === 'daftar'
              ? 'font-bold text-orange-950'
              : 'font-medium text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Daftar
        </button>
      </div>

      {/* Form Area — key ensures re-animation on tab switch */}
      <div key={activeTab} className="flex-1 z-10 flex flex-col animate-slide-up-fade">
        {/* Error message with icon */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-nakoo-red-50 text-nakoo-red-700 text-sm rounded-2xl border border-nakoo-red-200 flex items-start gap-2.5 animate-scale-in"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-nakoo-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col flex-1">
          <div className="bg-white p-5 flex flex-col gap-3 rounded-3xl border border-neutral-100 shadow-card">
            {activeTab === 'daftar' && (
              <Input
                icon={UserIcon}
                placeholder="Nama Ibu / Ayah"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            )}

            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? 'text' : 'password'}
                placeholder="Kata sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete={activeTab === 'masuk' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                className="absolute right-0 top-0 h-12 w-12 flex items-center justify-center text-neutral-400 hover:text-neutral-600 active:scale-75 transition-all cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="mt-8 mb-8">
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              className="mb-6"
            >
              {activeTab === 'masuk' ? 'Masuk →' : 'Daftar →'}
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-neutral-200" />
              <span className="text-xs font-semibold text-neutral-400 whitespace-nowrap uppercase tracking-wider">
                atau masuk dengan
              </span>
              <div className="flex-1 h-px bg-neutral-200" />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="auth"
                disabled
                aria-describedby="social-login-status"
                fullWidth={false}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <img src={googleIcon} alt="" aria-hidden="true" className="w-5 h-5" />
                Google
              </Button>
              <Button
                type="button"
                variant="auth"
                disabled
                aria-describedby="social-login-status"
                fullWidth={false}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <img src={appleIcon} alt="" aria-hidden="true" className="w-5 h-5" />
                Apple
              </Button>
            </div>

            <p id="social-login-status" className="mt-3 text-xs text-center text-neutral-500">
              Google dan Apple belum tersedia. Silakan masuk dengan email.
            </p>

            <div className="mt-8 flex justify-center">
              <Link
                to="/explore/menu"
                className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-all hover:translate-x-1 inline-flex items-center gap-1"
              >
                Lewati &amp; Eksplor Resep →
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
