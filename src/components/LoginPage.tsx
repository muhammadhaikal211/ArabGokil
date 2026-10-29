import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, ShieldCheck, UserCheck, Sparkles, GraduationCap, ArrowRight, Lock, Key } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginWithAdminCredentials, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'google' | 'admin'>('google');

  // Admin login form state
  const [adminUsername, setAdminUsername] = useState('mulmedjaya');
  const [adminPassword, setAdminPassword] = useState('mulmed123');
  const [adminError, setAdminError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    setIsSubmitting(true);
    const result = await loginWithAdminCredentials(adminUsername, adminPassword);
    if (!result.success) {
      setAdminError(result.message || 'Username atau password salah');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-900 via-teal-900 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Decorative Islamic geometric subtle backdrops */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Header bar */}
      <header className="py-6 px-6 sm:px-12 flex items-center justify-between border-b border-white/10 relative z-10 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-emerald-950 font-bold shadow-lg shadow-emerald-500/20">
            <BookOpen className="w-5 h-5 text-emerald-950" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">اللُّغَةُ العَرَبِيَّةُ</h1>
            <p className="text-xs text-emerald-200/80">Pembelajaran Bahasa Arab • Kelas X SMA/MA</p>
          </div>
        </div>
        <div className="text-xs bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          Kurikulum Merdeka 2024/2025
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12 flex flex-col lg:flex-row items-center justify-center gap-10 relative z-10">
        {/* Left column: Overview & Value proposition */}
        <div className="lg:w-1/2 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Portal Belajar Mandiri & Interaktif
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Belajar Bahasa Arab Jadi Lebih{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-200">
              Mudah & Menyenangkan
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Aplikasi resmi untuk siswa Kelas X. Lengkap dengan mufradat berharakat, audio pengucapan fasih, percakapan sehari-hari, latihan kaidah tata bahasa, dan asisten cerdas <strong className="text-amber-300 font-semibold">Ustadz AI</strong>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl font-bold text-amber-300 font-arabic">٦ أَبْوَابٍ</div>
              <div className="text-xs text-slate-300 mt-1">6 Bab Kurikulum</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs">
              <div className="text-2xl font-bold text-emerald-300">Audio TTS</div>
              <div className="text-xs text-slate-300 mt-1">Pelafalan Fasih</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 backdrop-blur-xs col-span-2 sm:col-span-1">
              <div className="text-2xl font-bold text-teal-300">Asisten AI</div>
              <div className="text-xs text-slate-300 mt-1">Tanya Kaidah 24/7</div>
            </div>
          </div>
        </div>

        {/* Right column: Login Card */}
        <div className="lg:w-1/2 w-full max-w-md">
          <div className="bg-slate-900/80 backdrop-blur-md border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-emerald-950/60 relative">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 mb-3 shadow-lg shadow-emerald-500/30">
                <GraduationCap className="w-8 h-8 text-slate-950" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Masuk ke Ruang Belajar</h3>
              <p className="text-slate-400 text-sm mt-1">Silakan masuk menggunakan akun siswa atau guru/admin</p>
            </div>

            {/* Tab switch */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-950/60 border border-white/10 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => { setActiveTab('google'); setAdminError(''); }}
                className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'google'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                Siswa (Google)
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('admin'); setAdminError(''); }}
                className={`py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin / Guru
              </button>
            </div>

            {/* TAB 1: Google Sign-In */}
            {activeTab === 'google' && (
              <div className="space-y-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 px-4 rounded-xl bg-white text-slate-900 font-semibold flex items-center justify-center gap-3 shadow-lg hover:bg-slate-100 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  {loading ? 'Menghubungkan...' : 'Masuk dengan Akun Google'}
                </button>

                <div className="bg-emerald-950/40 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-emerald-200 leading-relaxed">
                  <div className="font-semibold text-emerald-300 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Info Masuk Siswa:
                  </div>
                  Gunakan akun Google sekolah atau pribadi untuk menyimpan kemajuan belajar, skor kuis, dan riwayat chat dengan AI Ustadz.
                </div>
              </div>
            )}

            {/* TAB 2: Admin Login */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminSubmit} className="space-y-4">
                {adminError && (
                  <div className="bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs p-3 rounded-xl">
                    {adminError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username Admin</label>
                  <div className="relative">
                    <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                      placeholder="Masukkan username admin"
                      className="w-full bg-slate-950/70 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                      placeholder="Masukkan password admin"
                      className="w-full bg-slate-950/70 border border-white/15 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Quick Auto-fill button for testing convenience */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsername('mulmedjaya');
                      setAdminPassword('mulmed123');
                    }}
                    className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 cursor-pointer"
                  >
                    <Key className="w-3 h-3" />
                    Gunakan Akun: mulmedjaya / mulmed123
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Memeriksa Kredensial...' : 'Masuk sebagai Admin'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-xs text-slate-400 border-t border-white/10 relative z-10">
        <p>© 2025 Madrasah & Sekolah Menengah Atas — Pembelajaran Bahasa Arab Terpadu Kelas X</p>
      </footer>
    </div>
  );
};
