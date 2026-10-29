import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  BookA,
  Trophy,
  Shield,
  LogOut,
  Menu,
  X,
  Volume2,
} from 'lucide-react';

interface NavbarProps {
  currentView: 'chapters' | 'chapter_detail' | 'quiz' | 'ai_tutor' | 'dictionary' | 'history' | 'admin';
  setCurrentView: (view: any) => void;
  selectedChapterId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, setCurrentView }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'chapters', label: 'Materi Bab 1-6', icon: BookOpen },
    { id: 'quiz', label: 'Kuis & Evaluasi', icon: Trophy },
    { id: 'ai_tutor', label: 'Ustadz AI', icon: Sparkles, highlight: true },
    { id: 'dictionary', label: 'Kamus Mini', icon: BookA },
    { id: 'history', label: 'Progres Belajar', icon: GraduationCap },
  ];

  if (user?.isAdmin) {
    navItems.push({ id: 'admin', label: 'Kelola Admin', icon: Shield });
  }

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-emerald-500/20 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div
            onClick={() => setCurrentView('chapters')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="font-arabic text-xl leading-none font-bold">ع</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight leading-tight">
                  Bahasa Arab X
                </span>
                <span className="text-[10px] bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-1.5 py-0.5 rounded-sm font-semibold">
                  SMA / MA
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-arabic leading-tight">
                اللُّغَةُ العَرَبِيَّةُ لِلصَّفِّ العَاشِرِ
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'chapters' && currentView === 'chapter_detail');
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? item.highlight
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold'
                        : 'bg-emerald-600 text-white shadow-sm'
                      : item.highlight
                      ? 'text-amber-300/90 hover:bg-amber-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.highlight ? 'text-amber-400' : ''}`} />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Profile & Logout Button */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-white/10">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-7 h-7 rounded-full border border-emerald-400/40 object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center text-xs font-bold uppercase">
                  {(user?.displayName || 'U')[0]}
                </div>
              )}
              <div className="text-left">
                <div className="text-xs font-semibold text-white max-w-[120px] truncate leading-tight">
                  {user?.displayName || 'Siswa'}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium leading-none flex items-center gap-1">
                  {user?.isAdmin ? (
                    <span className="text-amber-400 font-bold flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" /> Guru/Admin
                    </span>
                  ) : (
                    'Siswa Kelas X'
                  )}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              title="Keluar dari Aplikasi"
              className="py-2 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-slate-900/95 px-4 pt-3 pb-5 space-y-3">
          {/* User Info on Mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-8 h-8 rounded-full border border-emerald-400/40"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-700 text-emerald-100 flex items-center justify-center text-xs font-bold">
                  {(user?.displayName || 'U')[0]}
                </div>
              )}
              <div>
                <div className="text-sm font-semibold text-white">{user?.displayName}</div>
                <div className="text-xs text-emerald-400">{user?.isAdmin ? 'Admin / Guru' : 'Siswa Kelas X'}</div>
              </div>
            </div>

            <button
              onClick={logout}
              className="py-1.5 px-3 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-medium flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id || (item.id === 'chapters' && currentView === 'chapter_detail');
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 text-left ${
                    isActive
                      ? 'bg-emerald-600 text-white'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4 text-emerald-400" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
