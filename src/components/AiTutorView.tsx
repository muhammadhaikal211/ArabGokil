import React, { useState, useRef, useEffect } from 'react';
import { playArabicSpeech } from '../lib/speech';
import {
  Sparkles,
  Send,
  Volume2,
  Bot,
  User,
  Lightbulb,
  Search,
  BookOpen,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface SentenceAnalysis {
  original: string;
  translation: string;
  vocabulary: {
    word: string;
    meaning: string;
    type: string;
  }[];
  grammarExplanation: string;
  tips: string;
}

export const AiTutorView: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'chat' | 'analyzer'>('chat');

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ! أَهْلًا وَسَهْلًا يَا طَالِبِي العَزِيْز! \n\nSaya **Ustadz Zaki**, asisten belajar Bahasa Arab Kelas X. Anda bisa bertanya tentang kosa kata, kaidah tata bahasa (Nahwu & Sharaf), latihan membuat kalimat, atau koreksi PR bahasa Arab. Ada yang bisa saya bantu hari ini?',
      timestamp: 'Baru saja',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Sentence Analyzer state
  const [sentenceInput, setSentenceInput] = useState('أَنَا طَالِبٌ جَدِيْدٌ فِي المَدْرَسَةِ الثَّانَوِيَّةِ');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<SentenceAnalysis | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeMode === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeMode]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      const botReply = data.reply || 'Maaf, terjadi kendala saat memproses jawaban.';

      const botMsg: ChatMessage = {
        id: 'b-' + Date.now(),
        sender: 'assistant',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: 'b-err-' + Date.now(),
          sender: 'assistant',
          text: 'Afwan, koneksi ke server AI Ustadz terganggu. Pastikan koneksi internet Anda aktif dan silakan coba lagi.',
          timestamp: 'Gagal',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleAnalyzeSentence = async () => {
    if (!sentenceInput.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-sentence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sentence: sentenceInput }),
      });

      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const promptChips = [
    'Jelaskan perbedaan هَذَا dan هَذِهِ beserta contohnya',
    'Bantu saya membuat teks perkenalan diri bahasa Arab Kelas 10',
    'Koreksi kalimat ini: "أَنَا يَذْهَبُ إِلَى المَسْجِدِ"',
    'Apa saja macam-macam huruf Jar dan fungsinya?',
    'Bagaimana cara membaca jam dalam bahasa Arab?',
  ];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-linear-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20 shrink-0">
            <Sparkles className="w-8 h-8 text-slate-950" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-semibold mb-1">
              Didukung Gemini AI Server-Side
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Asisten Belajar • Ustadz AI
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              Tanya tata bahasa Arab, minta koreksi kalimat, atau bedah struktur I'rab secara otomatis
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 bg-black/30 border border-white/10 rounded-2xl shrink-0 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'chat'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4" />
            Tanya Jawab Ustadz
          </button>
          <button
            onClick={() => setActiveMode('analyzer')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === 'analyzer'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Bedah Kalimat (I'rab)
          </button>
        </div>
      </div>

      {/* MODE 1: CHAT TUTOR */}
      {activeMode === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gradient-to-tr from-amber-500 to-emerald-600 text-white shadow-xs'
                    }`}
                  >
                    {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                  </div>

                  <div className={`max-w-[85%] sm:max-w-[75%] space-y-1.5`}>
                    <div
                      className={`p-4 sm:p-5 rounded-3xl text-sm leading-relaxed ${
                        isUser
                          ? 'bg-emerald-600 text-white rounded-tr-xs'
                          : 'bg-slate-100 text-slate-800 rounded-tl-xs border border-slate-200/70'
                      }`}
                    >
                      {/* Check if content has Arabic text and format with nice line-height */}
                      <div className="whitespace-pre-wrap font-sans">
                        {msg.text}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                      <span>{msg.timestamp}</span>
                      {!isUser && (
                        <>
                          <span>•</span>
                          <button
                            onClick={() => playArabicSpeech(msg.text)}
                            className="text-emerald-700 hover:text-emerald-800 flex items-center gap-1 font-medium cursor-pointer"
                            title="Dengarkan pelafalan teks Arab"
                          >
                            <Volume2 className="w-3 h-3" /> Suara
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="text-slate-500 hover:text-slate-700 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            {copiedId === msg.id ? 'Tersalin' : 'Salin'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isSending && (
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-600 text-white flex items-center justify-center">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  Ustadz Zaki sedang menyusun penjelasan...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Prompt chips suggestions */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 overflow-x-auto flex items-center gap-2 text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" /> Contoh:
            </span>
            {promptChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(chip)}
                disabled={isSending}
                className="px-3 py-1.5 rounded-full bg-white border border-slate-200 hover:border-emerald-400 text-slate-700 hover:text-emerald-700 whitespace-nowrap transition-colors cursor-pointer text-xs"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input form */}
          <div className="p-3 sm:p-4 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tanyakan kaidah tata bahasa, arti kata, atau koreksi kalimat Arab..."
                disabled={isSending}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:outline-hidden focus:border-emerald-500 focus:bg-white text-slate-900"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODE 2: SENTENCE ANALYZER & I'RAB BREAKDOWN */}
      {activeMode === 'analyzer' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Bedah & Analisis Kalimat Arab</h3>
              <p className="text-xs text-slate-500">
                Ketik kalimat bahasa Arab (dengan atau tanpa harakat) untuk dianalisis struktur Nahwu, I'rab, dan kosa katanya
              </p>
            </div>

            <div className="space-y-3">
              <textarea
                rows={3}
                value={sentenceInput}
                onChange={(e) => setSentenceInput(e.target.value)}
                placeholder="Contoh: أَنَا طَالِبٌ جَدِيْدٌ فِي المَدْرَسَةِ"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 font-arabic text-2xl text-right text-slate-900 focus:outline-hidden focus:border-amber-500"
              />

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold">Coba contoh:</span>
                  <button
                    type="button"
                    onClick={() => setSentenceInput('الكِتَابُ عَلَى المَكْتَبِ فِي الفَصْلِ')}
                    className="text-emerald-700 hover:underline cursor-pointer"
                  >
                    الكِتَابُ عَلَى المَكْتَبِ
                  </button>
                  <span>•</span>
                  <button
                    type="button"
                    onClick={() => setSentenceInput('يَذْهَبُ أَحْمَدُ إِلَى المَدْرَسَةِ كُلَّ صَبَاحٍ')}
                    className="text-emerald-700 hover:underline cursor-pointer"
                  >
                    يَذْهَبُ أَحْمَدُ...
                  </button>
                </div>

                <button
                  onClick={handleAnalyzeSentence}
                  disabled={isAnalyzing || !sentenceInput.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 text-white font-bold text-xs flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {isAnalyzing ? 'Menganalisis Kalimat...' : 'Analisis Struktur Kalimat'}
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full uppercase">
                  Hasil Analisis Kalimat
                </span>
                <button
                  onClick={() => playArabicSpeech(analysisResult.original)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-100 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  Dengarkan Pelafalan
                </button>
              </div>

              {/* Original with harakat */}
              <div className="p-5 rounded-2xl bg-linear-to-r from-emerald-950 to-slate-900 text-white space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  Kalimat dengan Harakat Lengkap:
                </div>
                <div className="font-arabic text-3xl sm:text-4xl text-right font-bold leading-loose text-amber-300">
                  {analysisResult.original}
                </div>
                <div className="text-sm text-slate-300 pt-2 border-t border-white/10 font-normal">
                  <strong>Terjemahan:</strong> "{analysisResult.translation}"
                </div>
              </div>

              {/* Vocabulary breakdown */}
              {analysisResult.vocabulary && analysisResult.vocabulary.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm">Bedah Kosa Kata Per Kata:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {analysisResult.vocabulary.map((voc, vIdx) => (
                      <div key={vIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {voc.type}
                          </span>
                        </div>
                        <div className="font-arabic text-2xl font-bold text-slate-900 text-right leading-loose">
                          {voc.word}
                        </div>
                        <div className="text-xs text-slate-600 font-semibold">
                          {voc.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grammar Explanation */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  Penjelasan Struktur Nahwu / Sharaf:
                </h4>
                <p className="text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-wrap">
                  {analysisResult.grammarExplanation}
                </p>
              </div>

              {/* Pedagogical Tips */}
              {analysisResult.tips && (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-950">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Tips Mengingat: </strong>
                    <span>{analysisResult.tips}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
