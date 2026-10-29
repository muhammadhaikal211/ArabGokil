import React, { useState } from 'react';
import { Chapter, VocabularyItem, DialogueLine } from '../data/arabicCurriculum';
import { playArabicSpeech } from '../lib/speech';
import { useAuth } from '../context/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Volume2,
  VolumeX,
  ArrowLeft,
  MessageSquare,
  Sparkles,
  FileText,
  HelpCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Eye,
  EyeOff,
  Trophy,
  Layers,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

interface ChapterDetailProps {
  chapter: Chapter;
  onBack: () => void;
  onChapterCompleted?: (chapterId: string) => void;
}

export const ChapterDetail: React.FC<ChapterDetailProps> = ({
  chapter,
  onBack,
  onChapterCompleted,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'vocabulary' | 'dialogue' | 'grammar' | 'reading' | 'quiz'>('vocabulary');

  // Audio playing state
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Flashcard mode for vocabulary
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Translation visibility in dialogue & reading
  const [showTranslation, setShowTranslation] = useState(true);

  // Quiz state
  const [userAnswers, setUserAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: number]: boolean }>({});

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingId(id);
    playArabicSpeech(text, () => {
      setPlayingId(null);
    });
  };

  const handleQuizAnswer = (qId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
  };

  const handleQuizSubmit = async () => {
    if (Object.keys(userAnswers).length < chapter.quiz.length) {
      if (!confirm('Anda belum menjawab semua soal. Tetap selesaikan kuis?')) {
        return;
      }
    }

    let correct = 0;
    chapter.quiz.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const calculatedScore = Math.round((correct / chapter.quiz.length) * 100);
    setScore(calculatedScore);
    setQuizSubmitted(true);

    if (calculatedScore >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
      if (onChapterCompleted) {
        onChapterCompleted(chapter.id);
      }
    }

    // Save score to Firestore if user is authenticated
    if (user && user.uid) {
      setIsSavingScore(true);
      const resultDocId = `quiz_${user.uid}_${chapter.id}_${Date.now()}`;
      try {
        await setDoc(doc(db, 'quiz_results', resultDocId), {
          id: resultDocId,
          userId: user.uid,
          userName: user.displayName || 'Siswa',
          userEmail: user.email || '',
          chapterId: chapter.id,
          chapterTitle: chapter.titleIndonesian,
          score: calculatedScore,
          totalQuestions: chapter.quiz.length,
          correctCount: correct,
          submittedAt: new Date().toISOString(),
        });
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.CREATE, `quiz_results/${resultDocId}`);
        } catch (handled) {
          console.warn('Firestore quiz record save notice:', handled);
        }
      } finally {
        setIsSavingScore(false);
      }
    }
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setQuizSubmitted(false);
    setScore(null);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            title="Kembali ke Daftar Bab"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <span>{chapter.badge}</span>
              <span>•</span>
              <span className="font-arabic text-sm">{chapter.titleArabic}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
              Bab {chapter.number}: {chapter.titleIndonesian}
            </h1>
          </div>
        </div>

        {/* Global Voice Test Button */}
        <button
          onClick={() => handlePlayAudio('title', chapter.titleArabic)}
          className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200 cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Volume2 className="w-4 h-4 text-emerald-600" />
          Dengarkan Judul Bab
        </button>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('vocabulary')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'vocabulary'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          المُفْرَدَاتُ (Kosa Kata)
        </button>

        <button
          onClick={() => setActiveTab('dialogue')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'dialogue'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          الحِوَارُ (Percakapan)
        </button>

        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'grammar'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          القَوَاعِدُ (Tata Bahasa)
        </button>

        <button
          onClick={() => setActiveTab('reading')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reading'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          القِرَاءَةُ (Membaca)
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`px-4 py-2.5 rounded-2xl transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-600" />
          الاِخْتِبَارُ (Kuis Evaluasi)
        </button>
      </div>

      {/* TAB 1: VOCABULARY / MUFRADAT */}
      {activeTab === 'vocabulary' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Kosa Kata Inti (المُفْرَدَاتُ الأَسَاسِيَّةُ)</h3>
              <p className="text-xs text-slate-600">Klik tombol audio untuk mendengarkan lafal berharakat dengan benar</p>
            </div>
            <button
              onClick={() => {
                setIsFlashcardMode(!isFlashcardMode);
                setIsFlipped(false);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isFlashcardMode ? 'Mode Daftar Kosa Kata' : 'Buka Mode Kartu Hafalan (Flashcard)'}
            </button>
          </div>

          {/* Flashcard View */}
          {isFlashcardMode ? (
            <div className="max-w-md mx-auto py-6">
              {chapter.vocabulary.length > 0 && (
                <div className="space-y-4 text-center">
                  <div className="text-xs text-slate-500 font-semibold">
                    Kartu {flashcardIndex + 1} dari {chapter.vocabulary.length}
                  </div>

                  {/* Card Element with flip */}
                  <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className="h-64 bg-linear-to-br from-white to-emerald-50/50 rounded-3xl border-2 border-emerald-500/30 p-6 flex flex-col items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all relative select-none"
                  >
                    <span className="absolute top-4 right-4 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {isFlipped ? 'Arti & Contoh' : 'Kata Arab'}
                    </span>

                    {!isFlipped ? (
                      <div className="space-y-3">
                        <div className="font-arabic text-4xl sm:text-5xl text-emerald-950 font-bold leading-normal">
                          {chapter.vocabulary[flashcardIndex].arabic}
                        </div>
                        <div className="text-sm text-slate-500 font-medium italic">
                          {chapter.vocabulary[flashcardIndex].transliteration}
                        </div>
                        <div className="text-xs text-emerald-600 font-medium pt-2">
                          (Ketuk kartu untuk melihat arti)
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-2xl font-bold text-slate-800">
                          {chapter.vocabulary[flashcardIndex].indonesian}
                        </div>
                        {chapter.vocabulary[flashcardIndex].exampleArabic && (
                          <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200">
                            <div className="font-arabic text-lg text-emerald-900 font-bold">
                              {chapter.vocabulary[flashcardIndex].exampleArabic}
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              {chapter.vocabulary[flashcardIndex].exampleIndonesian}
                            </div>
                          </div>
                        )}
                        <div className="text-xs text-emerald-600 font-medium pt-1">
                          (Ketuk untuk kembali ke bahasa Arab)
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Controls */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => {
                        setFlashcardIndex((prev) => (prev > 0 ? prev - 1 : chapter.vocabulary.length - 1));
                        setIsFlipped(false);
                      }}
                      className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() =>
                        handlePlayAudio(
                          `card-${flashcardIndex}`,
                          chapter.vocabulary[flashcardIndex].arabic
                        )
                      }
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-semibold text-xs flex items-center gap-2 hover:bg-emerald-700 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      Dengarkan Suara
                    </button>

                    <button
                      onClick={() => {
                        setFlashcardIndex((prev) => (prev < chapter.vocabulary.length - 1 ? prev + 1 : 0));
                        setIsFlipped(false);
                      }}
                      className="p-3 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {chapter.vocabulary.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                      {item.category}
                    </span>

                    <button
                      onClick={() => handlePlayAudio(item.id, item.arabic)}
                      className={`p-2 rounded-xl transition-all cursor-pointer ${
                        playingId === item.id
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                      }`}
                      title="Dengarkan pengucapan fasih"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="my-3">
                    <div className="font-arabic text-3xl text-right font-bold text-slate-900 leading-relaxed">
                      {item.arabic}
                    </div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      {item.transliteration}
                    </div>
                    <div className="text-base font-bold text-slate-800 mt-1.5">
                      {item.indonesian}
                    </div>
                  </div>

                  {item.exampleArabic && (
                    <div className="mt-2 pt-3 border-t border-slate-100 bg-slate-50/60 -mx-5 -mb-5 p-4 rounded-b-2xl">
                      <div className="text-[11px] font-semibold text-slate-400 mb-1">Contoh Penggunaan:</div>
                      <div className="font-arabic text-lg text-right font-bold text-emerald-900 leading-relaxed">
                        {item.exampleArabic}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        {item.exampleIndonesian}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DIALOGUE / HIWAR */}
      {activeTab === 'dialogue' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl">
            <div>
              <h3 className="font-bold text-slate-900 text-base">الحِوَارُ التَّفَاعُلِيُّ (Percakapan Interaktif)</h3>
              <p className="text-xs text-slate-600">Pelajari dialog nyata untuk melatih percakapan sehari-hari</p>
            </div>
            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {showTranslation ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showTranslation ? 'Sembunyikan Terjemahan' : 'Tampilkan Terjemahan'}
            </button>
          </div>

          <div className="space-y-4">
            {chapter.dialogue.map((line, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <div
                  key={line.id}
                  className={`flex items-start gap-3.5 p-4 sm:p-5 rounded-3xl border transition-all ${
                    isEven
                      ? 'bg-white border-slate-200'
                      : 'bg-emerald-50/40 border-emerald-100'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-100 to-teal-50 border border-emerald-200/70 flex items-center justify-center text-2xl shrink-0 shadow-xs">
                    {line.avatar}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{line.speaker}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                          {line.speakerRole}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlayAudio(line.id, line.arabic)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          playingId === line.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800'
                        }`}
                        title="Dengarkan dialog ini"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="font-arabic text-2xl sm:text-3xl text-right font-bold text-slate-900 leading-loose">
                      {line.arabic}
                    </div>

                    {showTranslation && (
                      <p className="text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-2 font-normal">
                        {line.indonesian}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: GRAMMAR / QAWA'ID */}
      {activeTab === 'grammar' && (
        <div className="space-y-6">
          {chapter.grammar.map((g, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Kaidah Tata Bahasa
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-arabic leading-snug">
                  {g.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 font-medium">{g.concept}</p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{g.explanation}</p>
              </div>

              {/* Rules List */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/70 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Poin Penting & Rumus:</h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {g.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Table if present */}
              {g.table && (
                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-emerald-900 text-white uppercase text-[11px] font-bold">
                      <tr>
                        {g.table.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {g.table.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-emerald-50/50 transition-colors">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} className={`px-4 py-3 ${cellIdx === row.length - 1 ? 'font-arabic text-base font-bold text-slate-900' : 'text-slate-700'}`}>
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Examples */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Contoh Kalimat Terapan:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {g.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex flex-col justify-between">
                      <div className="font-arabic text-xl font-bold text-slate-900 text-right leading-loose">
                        {ex.arabic}
                      </div>
                      <div className="text-xs text-slate-600 mt-2 font-medium">
                        {ex.indonesian}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 4: READING / QIRA'AH */}
      {activeTab === 'reading' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Teks Bacaan (القِرَاءَةُ)
              </span>
              <h3 className="font-arabic text-2xl font-bold text-slate-900 mt-1">
                {chapter.reading.titleArabic}
              </h3>
              <p className="text-xs text-slate-500">{chapter.reading.titleIndonesian}</p>
            </div>

            <button
              onClick={() => {
                const fullText = chapter.reading.paragraphs.map((p) => p.arabic).join(' ');
                handlePlayAudio('reading-full', fullText);
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 border border-emerald-200 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-emerald-600" />
              Bacakan Teks Lengkap
            </button>
          </div>

          {/* Paragraphs */}
          <div className="space-y-6">
            {chapter.reading.paragraphs.map((p, pIdx) => (
              <div key={pIdx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3">
                <div className="font-arabic text-2xl sm:text-3xl text-right font-bold text-slate-900 leading-loose">
                  {p.arabic}
                </div>
                <div className="text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-200">
                  {p.indonesian}
                </div>
              </div>
            ))}
          </div>

          {/* Comprehension Questions (Fahmul Maqru') */}
          <div className="mt-8 pt-6 border-t border-slate-200 space-y-4">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Pertanyaan Pemahaman Bacaan (فَهْمُ المَقْرُوءِ)
            </h4>
            <div className="space-y-3">
              {chapter.reading.comprehensionQuestions.map((cq, qIdx) => (
                <div key={qIdx} className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700">Pertanyaan {qIdx + 1}:</span>
                    <button
                      onClick={() =>
                        setRevealedAnswers((prev) => ({
                          ...prev,
                          [qIdx]: !prev[qIdx],
                        }))
                      }
                      className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                    >
                      {revealedAnswers[qIdx] ? 'Sembunyikan Kunci' : 'Lihat Kunci Jawaban'}
                    </button>
                  </div>
                  <div className="font-arabic text-xl text-right font-bold text-slate-900">
                    {cq.questionArabic}
                  </div>
                  <div className="text-xs text-slate-500 italic">
                    {cq.questionIndonesian}
                  </div>
                  {revealedAnswers[qIdx] && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 font-arabic text-lg text-emerald-950 font-bold text-right mt-2">
                      {cq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: QUIZ & EVALUATION */}
      {activeTab === 'quiz' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md uppercase tracking-wider">
                Uji Kompetensi Mandiri
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                Kuis Evaluasi Bab {chapter.number}
              </h3>
              <p className="text-xs text-slate-500">
                Jawablah {chapter.quiz.length} soal pilihan ganda berikut untuk mengukur penguasaan materi
              </p>
            </div>

            {quizSubmitted && score !== null && (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-500 uppercase">Nilai Akhir</div>
                  <div
                    className={`text-2xl sm:text-3xl font-extrabold ${
                      score >= 70 ? 'text-emerald-600' : 'text-amber-600'
                    }`}
                  >
                    {score} / 100
                  </div>
                </div>
                <button
                  onClick={handleResetQuiz}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" /> Ulangi
                </button>
              </div>
            )}
          </div>

          {/* Quiz Questions List */}
          <div className="space-y-6">
            {chapter.quiz.map((q, idx) => {
              const selectedAnswer = userAnswers[q.id];
              const isAnswered = selectedAnswer !== undefined;
              const isCorrect = isAnswered && selectedAnswer === q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    quizSubmitted
                      ? isCorrect
                        ? 'bg-emerald-50/50 border-emerald-300'
                        : 'bg-rose-50/50 border-rose-300'
                      : 'bg-slate-50/50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="font-bold text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700">
                      Soal No. {idx + 1}
                    </span>

                    {quizSubmitted && (
                      <span className="flex items-center gap-1 text-xs font-bold">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Jawaban Benar (+20)
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <XCircle className="w-4 h-4" /> Kurang Tepat
                          </span>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="text-sm font-semibold text-slate-800 mb-2 leading-relaxed">
                    {q.question}
                  </p>

                  {q.arabicContext && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 font-arabic text-2xl text-right font-bold text-slate-900 leading-loose my-2">
                      {q.arabicContext}
                    </div>
                  )}

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                    {q.options.map((option, optIdx) => {
                      const isSelected = selectedAnswer === optIdx;
                      let optionClasses = 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100';

                      if (quizSubmitted) {
                        if (optIdx === q.correctAnswer) {
                          optionClasses = 'bg-emerald-600 text-white font-bold border-emerald-600';
                        } else if (isSelected) {
                          optionClasses = 'bg-rose-500 text-white font-semibold border-rose-500';
                        } else {
                          optionClasses = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                        }
                      } else if (isSelected) {
                        optionClasses = 'bg-emerald-600 text-white font-bold border-emerald-600 shadow-md';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => handleQuizAnswer(q.id, optIdx)}
                          className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-center gap-3 cursor-pointer disabled:cursor-default ${optionClasses}`}
                        >
                          <span className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="font-arabic text-base">{option}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation after submitting */}
                  {quizSubmitted && (
                    <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
                      <strong className="text-slate-900">Penjelasan: </strong>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Submit Quiz Action */}
          {!quizSubmitted ? (
            <div className="pt-4 flex items-center justify-between border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Terjawab: {Object.keys(userAnswers).length} dari {chapter.quiz.length} soal
              </div>
              <button
                onClick={handleQuizSubmit}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Trophy className="w-4 h-4" />
                Selesaikan & Kumpulkan Jawaban
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>
                  {isSavingScore ? 'Menyimpan nilai ke Firestore...' : 'Nilai kuis tersimpan di akun Anda.'}
                </span>
              </div>
              <button
                onClick={handleResetQuiz}
                className="px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-emerald-900 font-semibold hover:bg-emerald-100 cursor-pointer"
              >
                Uji Kembali
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
