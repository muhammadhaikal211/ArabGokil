import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navbar } from './components/Navbar';
import { ChapterList } from './components/ChapterList';
import { ChapterDetail } from './components/ChapterDetail';
import { AiTutorView } from './components/AiTutorView';
import { DictionaryView } from './components/DictionaryView';
import { QuizHistoryView } from './components/QuizHistoryView';
import { AdminPanel } from './components/AdminPanel';
import { CHAPTERS_DATA } from './data/arabicCurriculum';
import { BookOpen } from 'lucide-react';

type ViewMode = 'chapters' | 'chapter_detail' | 'quiz' | 'ai_tutor' | 'dictionary' | 'history' | 'admin';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<ViewMode>('chapters');
  const [selectedChapterId, setSelectedChapterId] = useState<string>(CHAPTERS_DATA[0].id);
  const [completedChapters, setCompletedChapters] = useState<string[]>([]);

  // If authentication is initializing, show modern spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-500 flex items-center justify-center font-bold shadow-lg shadow-emerald-500/20 animate-bounce">
          <span className="font-arabic text-2xl text-slate-950 font-bold">ع</span>
        </div>
        <div className="text-center">
          <h2 className="font-bold text-lg">اللُّغَةُ العَرَبِيَّةُ لِلصَّفِّ العَاشِرِ</h2>
          <p className="text-xs text-emerald-400 mt-1">Memuat Aplikasi Pembelajaran Bahasa Arab...</p>
        </div>
      </div>
    );
  }

  // Wajib Login requirement: If not logged in, render LoginPage
  if (!user) {
    return <LoginPage />;
  }

  const selectedChapter = CHAPTERS_DATA.find((c) => c.id === selectedChapterId) || CHAPTERS_DATA[0];

  const handleSelectChapter = (chapterId: string) => {
    setSelectedChapterId(chapterId);
    setCurrentView('chapter_detail');
  };

  const handleChapterCompleted = (chapterId: string) => {
    setCompletedChapters((prev) => {
      if (!prev.includes(chapterId)) {
        return [...prev, chapterId];
      }
      return prev;
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        selectedChapterId={selectedChapterId}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {currentView === 'chapters' && (
          <ChapterList
            onSelectChapter={handleSelectChapter}
            onOpenAiTutor={() => setCurrentView('ai_tutor')}
            completedChapters={completedChapters}
          />
        )}

        {currentView === 'chapter_detail' && (
          <ChapterDetail
            chapter={selectedChapter}
            onBack={() => setCurrentView('chapters')}
            onChapterCompleted={handleChapterCompleted}
          />
        )}

        {currentView === 'quiz' && (
          <QuizHistoryView
            onStartQuiz={(chId) => {
              setSelectedChapterId(chId);
              setCurrentView('chapter_detail');
            }}
          />
        )}

        {currentView === 'ai_tutor' && <AiTutorView />}

        {currentView === 'dictionary' && <DictionaryView />}

        {currentView === 'history' && (
          <QuizHistoryView
            onStartQuiz={(chId) => {
              setSelectedChapterId(chId);
              setCurrentView('chapter_detail');
            }}
          />
        )}

        {currentView === 'admin' && <AdminPanel />}
      </main>

      {/* App Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center font-bold text-[10px]">
              ع
            </div>
            <span className="font-semibold text-slate-700">
              Pembelajaran Bahasa Arab Kelas X SMA/MA
            </span>
          </div>
          <div>
            Kurikulum Merdeka • Dilengkapi Firebase Auth, Firestore & Gemini AI
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
