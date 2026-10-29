import React from 'react';
import { CHAPTERS_DATA, Chapter } from '../data/arabicCurriculum';
import {
  BookOpen,
  Trophy,
  Volume2,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
} from 'lucide-react';

interface ChapterListProps {
  onSelectChapter: (chapterId: string) => void;
  onOpenAiTutor: () => void;
  completedChapters?: string[];
}

export const ChapterList: React.FC<ChapterListProps> = ({
  onSelectChapter,
  onOpenAiTutor,
  completedChapters = [],
}) => {
  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 border border-emerald-500/30 p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Mata Pelajaran Bahasa Arab • Kelas X (Fase E)
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ahlan wa Sahlan di Ruang Pembelajaran Bahasa Arab!
          </h1>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
            <p className="font-arabic text-xl sm:text-2xl text-amber-300 text-right leading-relaxed mb-1.5">
              "تَعَلَّمُوا العَرَبِيَّةَ فَإِنَّهَا مِنْ دِينِكُمْ، وَأَعْرِبُوا الكَلَامَ"
            </p>
            <p className="text-xs text-slate-300 italic">
              "Pelajarilah bahasa Arab, karena ia adalah bagian dari agamamu, dan fasihkanlah perkataan."
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onSelectChapter(CHAPTERS_DATA[0].id)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-950" />
              Mulai dari Bab 1
            </button>

            <button
              onClick={onOpenAiTutor}
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-200 font-semibold text-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              Tanya Ustadz AI (Gemini)
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-emerald-600" />
              Daftar Bab Pembelajaran Kelas X
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Silakan pilih bab untuk mempelajari kosa kata, percakapan, tata bahasa, dan kuis
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hidden sm:flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            6 Bab Terstruktur
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CHAPTERS_DATA.map((chapter) => {
            const isCompleted = completedChapters.includes(chapter.id);
            return (
              <div
                key={chapter.id}
                onClick={() => onSelectChapter(chapter.id)}
                className="group relative bg-white rounded-3xl p-6 border border-slate-200/90 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Badge and Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      {chapter.badge}
                    </span>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5" /> {chapter.estimatedMinutes} mnt
                      </span>
                    )}
                  </div>

                  {/* Arabic Title */}
                  <div className="font-arabic text-2xl sm:text-3xl text-right font-bold text-slate-900 group-hover:text-emerald-700 transition-colors leading-loose my-2">
                    {chapter.titleArabic}
                  </div>

                  {/* Indonesian Title */}
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-slate-900">
                    Bab {chapter.number}: {chapter.titleIndonesian}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {chapter.description}
                  </p>

                  {/* Mini feature tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-4">
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      {chapter.vocabulary.length} Kosa Kata
                    </span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      Hiwar & Qawa'id
                    </span>
                    <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200/60 px-2 py-0.5 rounded-md font-medium">
                      Kuis Evaluasi
                    </span>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>Buka Materi Pembelajaran</span>
                  <div className="w-7 h-7 rounded-full bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
