import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, addDoc, getDocs, onSnapshot, deleteDoc, doc, setDoc } from 'firebase/firestore';
import {
  Shield,
  PlusCircle,
  Sparkles,
  Users,
  BookOpen,
  Trash2,
  CheckCircle,
  Layers,
  Award,
  RefreshCw,
} from 'lucide-react';
import { CHAPTERS_DATA } from '../data/arabicCurriculum';

interface CustomMaterialItem {
  id: string;
  title: string;
  chapterId: string;
  arabicText: string;
  indonesianText: string;
  grammarNotes: string;
  authorName: string;
  createdAt: string;
}

interface StudentSubmission {
  id: string;
  userName: string;
  userEmail: string;
  chapterTitle: string;
  score: number;
  submittedAt: string;
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'materials' | 'ai_generator' | 'submissions'>('materials');

  // Custom materials state
  const [materials, setMaterials] = useState<CustomMaterialItem[]>([]);
  const [materialTitle, setMaterialTitle] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('bab-1');
  const [arabicText, setArabicText] = useState('');
  const [indonesianText, setIndonesianText] = useState('');
  const [grammarNotes, setGrammarNotes] = useState('');
  const [isSavingMaterial, setIsSavingMaterial] = useState(false);
  const [materialMessage, setMaterialMessage] = useState('');

  // AI Quiz Generator state
  const [aiTopic, setAiTopic] = useState('Kaidah isim isyarah dan mufradat kelas');
  const [aiChapter, setAiChapter] = useState('التحيات والتعارف');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Submissions state
  const [submissions, setSubmissions] = useState<StudentSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  // Load custom materials from Firestore
  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, 'custom_materials'),
        (snapshot) => {
          const list: CustomMaterialItem[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            list.push({
              id: doc.id,
              title: data.title || '',
              chapterId: data.chapterId || '',
              arabicText: data.arabicText || '',
              indonesianText: data.indonesianText || '',
              grammarNotes: data.grammarNotes || '',
              authorName: data.authorName || 'Admin',
              createdAt: data.createdAt || new Date().toISOString(),
            });
          });
          setMaterials(list);
        },
        (error) => {
          console.warn('Custom materials listener notice:', error);
        }
      );
      return () => unsubscribe();
    } catch (e) {
      console.warn('Error attaching materials listener:', e);
    }
  }, []);

  // Load all student submissions
  useEffect(() => {
    if (activeTab === 'submissions') {
      loadSubmissions();
    }
  }, [activeTab]);

  const loadSubmissions = async () => {
    setLoadingSubmissions(true);
    try {
      const snap = await getDocs(collection(db, 'quiz_results'));
      const list: StudentSubmission[] = [];
      snap.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          userName: data.userName || 'Siswa',
          userEmail: data.userEmail || '',
          chapterTitle: data.chapterTitle || 'Kuis',
          score: data.score || 0,
          submittedAt: data.submittedAt || '',
        });
      });
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setSubmissions(list);
    } catch (err) {
      console.warn('Could not load student submissions:', err);
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim() || !arabicText.trim() || !indonesianText.trim()) return;

    setIsSavingMaterial(true);
    setMaterialMessage('');
    const newId = 'mat_' + Date.now();

    try {
      await setDoc(doc(db, 'custom_materials', newId), {
        id: newId,
        title: materialTitle,
        chapterId: selectedChapter,
        arabicText,
        indonesianText,
        grammarNotes,
        authorName: user?.displayName || 'mulmedjaya',
        createdAt: new Date().toISOString(),
      });

      setMaterialMessage('Materi suplemen berhasil ditambahkan ke database Firestore!');
      setMaterialTitle('');
      setArabicText('');
      setIndonesianText('');
      setGrammarNotes('');
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, `custom_materials/${newId}`);
      } catch (e: any) {
        setMaterialMessage('Gagal menyimpan: ' + e.message);
      }
    } finally {
      setIsSavingMaterial(false);
    }
  };

  const handleDeleteMaterial = async (id: string) => {
    if (!confirm('Yakin ingin menghapus materi suplemen ini?')) return;
    try {
      await deleteDoc(doc(db, 'custom_materials', id));
    } catch (err) {
      console.warn('Error deleting material:', err);
    }
  };

  const handleGenerateAiQuiz = async () => {
    setIsGeneratingQuiz(true);
    setGeneratedQuestions([]);
    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapterTitle: aiChapter,
          topic: aiTopic,
          questionCount: 4,
        }),
      });

      const data = await res.json();
      setGeneratedQuestions(data.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-linear-to-r from-amber-900 via-slate-900 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white border border-amber-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 shrink-0">
            <Shield className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-semibold mb-1">
              Akun Khusus: mulmedjaya (Administrator)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Panel Pengelolaan Guru & Admin
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Kelola materi suplemen, buat soal kuis dengan Gemini AI, dan pantau rekapitulasi nilai siswa
            </p>
          </div>
        </div>

        {/* Tab menu */}
        <div className="flex items-center p-1 bg-black/40 border border-white/10 rounded-2xl shrink-0 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('materials')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'materials'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Materi Tambahan
          </button>
          <button
            onClick={() => setActiveTab('ai_generator')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'ai_generator'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Generator Soal AI
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'submissions'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Rekap Nilai Siswa
          </button>
        </div>
      </div>

      {/* TAB 1: CUSTOM MATERIALS */}
      {activeTab === 'materials' && (
        <div className="space-y-6">
          {/* Add form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              Tambah Materi Suplemen / Catatan Guru (Tersimpan di Firestore)
            </h3>

            {materialMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl">
                {materialMessage}
              </div>
            )}

            <form onSubmit={handleAddMaterial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Materi / Topik</label>
                  <input
                    type="text"
                    value={materialTitle}
                    onChange={(e) => setMaterialTitle(e.target.value)}
                    required
                    placeholder="Contoh: Tambahan Kosa Kata Tempat Ibadah"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kaitkan ke Bab</label>
                  <select
                    value={selectedChapter}
                    onChange={(e) => setSelectedChapter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                  >
                    {CHAPTERS_DATA.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        Bab {ch.number}: {ch.titleIndonesian}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Bahasa Arab (Berharakat)</label>
                <textarea
                  rows={2}
                  value={arabicText}
                  onChange={(e) => setArabicText(e.target.value)}
                  required
                  placeholder="Contoh: المَسْجِدُ بَيْتُ اللهِ، يُصَلِّي فِيْهِ المُسْلِمُوْنَ جَمَاعَةً"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 font-arabic text-xl text-right text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Terjemahan Bahasa Indonesia</label>
                <input
                  type="text"
                  value={indonesianText}
                  onChange={(e) => setIndonesianText(e.target.value)}
                  required
                  placeholder="Masjid adalah rumah Allah, orang-orang muslim sholat di dalamnya berjamaah..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan Kaidah / Penjelasan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={grammarNotes}
                  onChange={(e) => setGrammarNotes(e.target.value)}
                  placeholder="Perhatikan lafal majrur setelah fi..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSavingMaterial}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSavingMaterial ? 'Menyimpan ke Database...' : 'Simpan Materi Suplemen'}
              </button>
            </form>
          </div>

          {/* List of custom materials */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Daftar Materi Suplemen Guru ({materials.length}):</h3>
            {materials.length === 0 ? (
              <p className="text-xs text-slate-400 italic">Belum ada materi suplemen yang ditambahkan.</p>
            ) : (
              <div className="space-y-3">
                {materials.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{m.title}</span>
                        <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded-sm text-slate-700 font-medium">{m.chapterId}</span>
                      </div>
                      <div className="font-arabic text-xl font-bold text-emerald-950 text-right leading-loose">
                        {m.arabicText}
                      </div>
                      <div className="text-xs text-slate-600">{m.indonesianText}</div>
                      {m.grammarNotes && <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-1">{m.grammarNotes}</div>}
                    </div>
                    <button
                      onClick={() => handleDeleteMaterial(m.id)}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Hapus materi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI QUIZ GENERATOR */}
      {activeTab === 'ai_generator' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              Generator Soal Kuis Otomatis (Gemini 2.5 Flash)
            </h3>
            <p className="text-xs text-slate-500">
              Buat 4 butir soal pilihan ganda baru secara instan berbasis topik yang Anda tentukan
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pilih Bab</label>
              <select
                value={aiChapter}
                onChange={(e) => setAiChapter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              >
                {CHAPTERS_DATA.map((ch) => (
                  <option key={ch.id} value={ch.titleIndonesian}>
                    Bab {ch.number}: {ch.titleIndonesian} ({ch.titleArabic})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Fokus / Topik Spesifik Soal</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Misal: dhamir munfashil ana, anta, huwa"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateAiQuiz}
            disabled={isGeneratingQuiz}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isGeneratingQuiz ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {isGeneratingQuiz ? 'Gemini Sedang Merancang Soal...' : 'Generate Soal Baru Sekarang'}
          </button>

          {/* Generated Questions Preview */}
          {generatedQuestions.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Pratinjau Soal Hasil Generate AI:</h4>
              <div className="space-y-4">
                {generatedQuestions.map((q, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800">Soal {idx + 1}</span>
                      <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-bold">
                        Kunci: Opsi {String.fromCharCode(65 + q.correctAnswer)}
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900">{q.question}</div>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      {q.options?.map((opt: string, optIdx: number) => (
                        <div
                          key={optIdx}
                          className={`p-2 rounded-xl text-xs border ${
                            optIdx === q.correctAnswer
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className="font-bold mr-1.5">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="font-arabic">{opt}</span>
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div className="text-[11px] text-slate-600 italic pt-1">
                        <strong>Penjelasan:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SUBMISSIONS LEADERBOARD */}
      {activeTab === 'submissions' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Rekapitulasi Nilai & Pengerjaan Siswa</h3>
              <p className="text-xs text-slate-500">Data hasil kuis seluruh siswa yang tersimpan di Firestore</p>
            </div>
            <button
              onClick={loadSubmissions}
              disabled={loadingSubmissions}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSubmissions ? 'animate-spin' : ''}`} />
              Segarkan Data
            </button>
          </div>

          {loadingSubmissions ? (
            <div className="text-center py-8 text-xs text-slate-400">Mengambil data nilai siswa...</div>
          ) : submissions.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              Belum ada data pengerjaan kuis dari siswa.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Nama Siswa</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Materi Kuis</th>
                    <th className="px-4 py-3">Nilai</th>
                    <th className="px-4 py-3">Waktu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{sub.userName}</td>
                      <td className="px-4 py-3 text-slate-500">{sub.userEmail || '-'}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800">{sub.chapterTitle}</td>
                      <td className="px-4 py-3 font-extrabold text-sm text-emerald-700">{sub.score}</td>
                      <td className="px-4 py-3 text-slate-500">
                        {sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
