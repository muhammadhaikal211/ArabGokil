import React, { useState, useMemo } from 'react';
import { CHAPTERS_DATA, VocabularyItem } from '../data/arabicCurriculum';
import { playArabicSpeech } from '../lib/speech';
import { Search, Volume2, BookA, Tag, Sparkles } from 'lucide-react';

export const DictionaryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Combine all vocabularies from all chapters
  const allVocabularies: (VocabularyItem & { chapterTitle: string })[] = useMemo(() => {
    const list: (VocabularyItem & { chapterTitle: string })[] = [];
    CHAPTERS_DATA.forEach((ch) => {
      ch.vocabulary.forEach((v) => {
        list.push({
          ...v,
          chapterTitle: `Bab ${ch.number}: ${ch.titleIndonesian}`,
        });
      });
    });
    return list;
  }, []);

  const filteredVocab = useMemo(() => {
    return allVocabularies.filter((v) => {
      const matchesSearch =
        v.arabic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.indonesian.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat = selectedCategory === 'all' || v.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [allVocabularies, searchQuery, selectedCategory]);

  const handlePlay = (id: string, text: string) => {
    setPlayingId(id);
    playArabicSpeech(text, () => setPlayingId(null));
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <BookA className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Kamus Mini Digital Bahasa Arab Kelas X
            </h1>
            <p className="text-xs text-slate-500">
              Koleksi kosa kata terpadu berharakat lengkap dengan audio pelafalan
            </p>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kata dalam bahasa Arab, latin, atau artinya (misal: salam, madrasah, buku)..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'isim', label: 'Isim (Kata Benda)' },
              { id: 'fiil', label: 'Fi’il (Kata Kerja)' },
              { id: 'ibarah', label: 'Ungkapan / Frasa' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-2">
        <span>Menampilkan {filteredVocab.length} kosa kata</span>
        <span>Klik tombol speaker untuk mendengarkan lafal</span>
      </div>

      {/* Vocabulary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredVocab.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400">
                  {item.chapterTitle}
                </span>
              </div>

              <div className="font-arabic text-3xl font-bold text-slate-900 text-right leading-loose my-2">
                {item.arabic}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                {item.transliteration}
              </div>

              <div className="text-sm font-bold text-slate-800 mt-1">
                {item.indonesian}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Audio Fusha</span>
              <button
                onClick={() => handlePlay(item.id, item.arabic)}
                className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  playingId === item.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
