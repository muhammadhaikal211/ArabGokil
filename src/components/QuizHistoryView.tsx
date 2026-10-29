import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';
import { Trophy, Award, CheckCircle2, Calendar, Star, GraduationCap, ArrowRight } from 'lucide-react';
import { CHAPTERS_DATA } from '../data/arabicCurriculum';

interface QuizResultItem {
  id: string;
  chapterId: string;
  chapterTitle: string;
  score: number;
  totalQuestions: number;
  correctCount: number;
  submittedAt: string;
}

interface QuizHistoryViewProps {
  onStartQuiz: (chapterId: string) => void;
}

export const QuizHistoryView: React.FC<QuizHistoryViewProps> = ({ onStartQuiz }) => {
  const { user } = useAuth();
  const [results, setResults] = useState<QuizResultItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.uid) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, 'quiz_results'),
        where('userId', '==', user.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const list: QuizResultItem[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              chapterId: data.chapterId || '',
              chapterTitle: data.chapterTitle || 'Kuis Bahasa Arab',
              score: data.score || 0,
              totalQuestions: data.totalQuestions || 5,
              correctCount: data.correctCount || 0,
              submittedAt: data.submittedAt || new Date().toISOString(),
            });
          });
          // Sort by submittedAt descending
          list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
          setResults(list);
          setLoading(false);
        },
        (error) => {
          try {
            handleFirestoreError(error, OperationType.LIST, 'quiz_results');
          } catch (e) {
            console.warn('Error loading quiz results:', e);
          }
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.warn('Firestore subscription error:', err);
      setLoading(false);
    }
  }, [user]);

  // Metrics
  const totalSubmissions = results.length;
  const averageScore = totalSubmissions > 0
    ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / totalSubmissions)
    : 0;
  const highestScore = totalSubmissions > 0
    ? Math.max(...results.map((r) => r.score))
    : 0;

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Progres Belajar & Rekap Nilai Kuis
            </h1>
            <p className="text-xs text-slate-500">
              Pantau perkembangan evaluasi mandiri dan pencapaian kompetensi bahasa Arab Anda
            </p>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{totalSubmissions}</div>
              <div className="text-xs text-slate-500 font-medium">Kuis Diselesaikan</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Star className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{averageScore}</div>
              <div className="text-xs text-slate-500 font-medium">Rata-Rata Nilai</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900">{highestScore}</div>
              <div className="text-xs text-slate-500 font-medium">Skor Tertinggi</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters Quick Jump */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Pilih Kuis Bab untuk Dikerjakan:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CHAPTERS_DATA.map((ch) => {
            const hasResult = results.some((r) => r.chapterId === ch.id);
            return (
              <div
                key={ch.id}
                onClick={() => onStartQuiz(ch.id)}
                className="p-4 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    Bab {ch.number}: {ch.titleIndonesian}
                  </div>
                  <div className="font-arabic text-sm text-slate-500 mt-0.5">
                    {ch.titleArabic}
                  </div>
                </div>
                <div className="shrink-0">
                  {hasResult ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Tuntas
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-slate-400">
                      Mulai
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-sm">Riwayat Pengerjaan Kuis:</h3>

        {loading ? (
          <div className="text-center py-8 text-xs text-slate-400">Memuat data nilai...</div>
        ) : results.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs text-slate-500">
              Belum ada kuis yang diselesaikan. Buka salah satu bab dan kerjakan kuis evaluasinya!
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                <tr>
                  <th className="px-4 py-3">Bab & Materi</th>
                  <th className="px-4 py-3">Nilai</th>
                  <th className="px-4 py-3">Benar / Soal</th>
                  <th className="px-4 py-3">Predikat</th>
                  <th className="px-4 py-3">Waktu Pengerjaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => {
                  let badge = { label: 'Kurang', color: 'bg-rose-100 text-rose-800' };
                  if (r.score >= 85) badge = { label: 'Mumtaz (Sangat Baik)', color: 'bg-emerald-100 text-emerald-800' };
                  else if (r.score >= 70) badge = { label: 'Jayyid (Baik)', color: 'bg-teal-100 text-teal-800' };
                  else if (r.score >= 60) badge = { label: 'Maqbul (Cukup)', color: 'bg-amber-100 text-amber-800' };

                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {r.chapterTitle}
                      </td>
                      <td className="px-4 py-3 font-extrabold text-sm text-slate-900">
                        {r.score}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {r.correctCount} / {r.totalQuestions}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {new Date(r.submittedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
