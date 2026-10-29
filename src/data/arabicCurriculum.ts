export interface VocabularyItem {
  id: string;
  arabic: string;
  transliteration: string;
  indonesian: string;
  category: 'isim' | 'fiil' | 'harf' | 'ibarah';
  exampleArabic?: string;
  exampleIndonesian?: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: string;
  avatar: string;
  arabic: string;
  indonesian: string;
}

export interface GrammarPoint {
  title: string;
  concept: string;
  explanation: string;
  rules: string[];
  examples: {
    arabic: string;
    indonesian: string;
    note?: string;
  }[];
  table?: {
    headers: string[];
    rows: string[][];
  };
}

export interface ReadingText {
  titleArabic: string;
  titleIndonesian: string;
  paragraphs: {
    arabic: string;
    indonesian: string;
  }[];
  comprehensionQuestions: {
    questionArabic: string;
    questionIndonesian: string;
    answer: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  arabicContext?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  number: number;
  titleArabic: string;
  titleIndonesian: string;
  description: string;
  color: string;
  badge: string;
  estimatedMinutes: number;
  vocabulary: VocabularyItem[];
  dialogue: DialogueLine[];
  grammar: GrammarPoint[];
  reading: ReadingText;
  quiz: QuizQuestion[];
}

export const CHAPTERS_DATA: Chapter[] = [
  {
    id: 'bab-1',
    number: 1,
    titleArabic: 'التَّحِيَّاتُ وَالتَّعَارُفُ',
    titleIndonesian: 'Salam dan Perkenalan',
    description: 'Mempelajari ucapan salam, ungkapan sapaan, identitas diri, dan dhamir munfashil (kata ganti tunggal & jamak).',
    color: 'emerald',
    badge: 'Semester 1 - Bab 1',
    estimatedMinutes: 45,
    vocabulary: [
      {
        id: 'v1-1',
        arabic: 'السَّلَامُ عَلَيْكُمْ',
        transliteration: 'Assalāmu ‘alaikum',
        indonesian: 'Semoga keselamatan tercurah kepadamu',
        category: 'ibarah',
        exampleArabic: 'السَّلَامُ عَلَيْكُمْ يَا أَخِي',
        exampleIndonesian: 'Semoga keselamatan tercurah kepadamu, wahai saudaraku.',
      },
      {
        id: 'v1-2',
        arabic: 'صَبَاحُ الخَيْرِ',
        transliteration: 'Shabāhul khair',
        indonesian: 'Selamat pagi',
        category: 'ibarah',
        exampleArabic: 'صَبَاحُ الخَيْرِ يَا أُسْتَاذُ',
        exampleIndonesian: 'Selamat pagi, wahai guru.',
      },
      {
        id: 'v1-3',
        arabic: 'أَهْلًا وَسَهْلًا',
        transliteration: 'Ahlan wa sahlan',
        indonesian: 'Selamat datang',
        category: 'ibarah',
        exampleArabic: 'أَهْلًا وَسَهْلًا بِكُمْ فِي مَدْرَسَتِنَا',
        exampleIndonesian: 'Selamat datang di sekolah kami.',
      },
      {
        id: 'v1-4',
        arabic: 'طَالِبٌ / طَالِبَةٌ',
        transliteration: 'Thālibun / Thālibatun',
        indonesian: 'Siswa / Siswi',
        category: 'isim',
        exampleArabic: 'أَنَا طَالِبٌ جَدِيْدٌ فِي الفَصْلِ العَاشِرِ',
        exampleIndonesian: 'Saya siswa baru di kelas sepuluh.',
      },
      {
        id: 'v1-5',
        arabic: 'مُدَرِّسٌ / أُسْتَاذٌ',
        transliteration: 'Mudarrisun / Ustādzun',
        indonesian: 'Guru / Pengajar',
        category: 'isim',
        exampleArabic: 'الأُسْتَاذُ عُمَرُ يُدَرِّسُ اللُّغَةَ العَرَبِيَّةَ',
        exampleIndonesian: 'Ustadz Umar mengajar bahasa Arab.',
      },
      {
        id: 'v1-6',
        arabic: 'مَا اسْمُكَ؟',
        transliteration: 'Mas-muka?',
        indonesian: 'Siapa namamu? (untuk laki-laki)',
        category: 'ibarah',
        exampleArabic: 'مَا اسْمُكَ يَا أَخِي؟ اِسْمِي حَسَنٌ',
        exampleIndonesian: 'Siapa namamu saudaraku? Namaku Hasan.',
      },
      {
        id: 'v1-7',
        arabic: 'مِنْ أَيْنَ أَنْتَ؟',
        transliteration: 'Min aina anta?',
        indonesian: 'Dari mana kamu berasal?',
        category: 'ibarah',
        exampleArabic: 'مِنْ أَيْنَ أَنْتَ؟ أَنَا مِنْ جَاكَرْتَا',
        exampleIndonesian: 'Dari mana kamu berasal? Saya dari Jakarta.',
      },
      {
        id: 'v1-8',
        arabic: 'شُكْرًا جَزِيلًا',
        transliteration: 'Syukran jazīlan',
        indonesian: 'Terima kasih banyak',
        category: 'ibarah',
        exampleArabic: 'شُكْرًا جَزِيلًا عَلَى مُسَاعَدَتِكَ',
        exampleIndonesian: 'Terima kasih banyak atas bantuanmu.',
      },
    ],
    dialogue: [
      {
        id: 'd1-1',
        speaker: 'فَرِحَان',
        speakerRole: 'Siswa Baru',
        avatar: '👨‍🎓',
        arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ.',
        indonesian: 'Assalamu’alaikum warahmatullahi wabarakatuh.',
      },
      {
        id: 'd1-2',
        speaker: 'عَزَّام',
        speakerRole: 'Teman Sekelas',
        avatar: '🧑‍🎓',
        arabic: 'وَعَلَيْكُمُ السَّلَامُ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ.',
        indonesian: 'Wa’alaikumussalam warahmatullahi wabarakatuh.',
      },
      {
        id: 'd1-3',
        speaker: 'فَرِحَان',
        speakerRole: 'Siswa Baru',
        avatar: '👨‍🎓',
        arabic: 'صَبَاحُ الخَيْرِ! مَا اسْمُكَ يَا أَخِي؟',
        indonesian: 'Selamat pagi! Siapa namamu wahai saudaraku?',
      },
      {
        id: 'd1-4',
        speaker: 'عَزَّام',
        speakerRole: 'Teman Sekelas',
        avatar: '🧑‍🎓',
        arabic: 'صَبَاحُ النُّورِ! اِسْمِي عَزَّام، وَأَنَا طَالِبٌ جَدِيْدٌ فِي هَذَا المَعْهَدِ. وَمَا اسْمُكَ؟',
        indonesian: 'Selamat pagi juga! Namaku Azzam, dan saya siswa baru di pesantren/sekolah ini. Dan siapa namamu?',
      },
      {
        id: 'd1-5',
        speaker: 'فَرِحَان',
        speakerRole: 'Siswa Baru',
        avatar: '👨‍🎓',
        arabic: 'اِسْمِي فَرِحَان. مِنْ أَيْنَ أَنْتَ يَا عَزَّام؟',
        indonesian: 'Namaku Farhan. Dari mana kamu berasal wahai Azzam?',
      },
      {
        id: 'd1-6',
        speaker: 'عَزَّام',
        speakerRole: 'Teman Sekelas',
        avatar: '🧑‍🎓',
        arabic: 'أَنَا مِنْ سُوْرَابَايَا، جَاوَى الشَّرْقِيَّةِ. وَأَنْتَ، مِنْ أَيْنَ؟',
        indonesian: 'Saya dari Surabaya, Jawa Timur. Dan kamu, dari mana?',
      },
      {
        id: 'd1-7',
        speaker: 'فَرِحَان',
        speakerRole: 'Siswa Baru',
        avatar: '👨‍🎓',
        arabic: 'أَنَا مِنْ بَانْدُونج، جَاوَى الغَرْبِيَّةِ. فُرْصَةٌ سَعِيْدَةٌ يَا عَزَّام!',
        indonesian: 'Saya dari Bandung, Jawa Barat. Senang berkenalan denganmu wahai Azzam!',
      },
      {
        id: 'd1-8',
        speaker: 'عَزَّام',
        speakerRole: 'Teman Sekelas',
        avatar: '🧑‍🎓',
        arabic: 'أَنَا أَسْعَدُ، شُكْرًا جَزِيْلًا يَا صَدِيْقِي!',
        indonesian: 'Saya lebih senang lagi, terima kasih banyak kawan!',
      },
    ],
    grammar: [
      {
        title: 'الضَّمِيْرُ المُنْفَصِلُ (Dhamir Munfashil / Kata Ganti Orang)',
        concept: 'Dhamir Munfashil adalah kata ganti yang berdiri sendiri dan tidak bersambung dengan kata lain.',
        explanation: 'Dalam bahasa Arab kelas 10, dhamir munfashil dibagi berdasarkan persona (orang pertama, kedua, dan ketiga) serta jenis kelamin (mudzakkar & muannats).',
        rules: [
          'أَنَا (Ana) digunakan untuk Saya (laki-laki / perempuan).',
          'نَحْنُ (Nahnu) digunakan untuk Kami / Kita.',
          'أَنْتَ (Anta) digunakan untuk Kamu laki-laki tunggal (Mufrod Mudzakkar).',
          'أَنْتِ (Anti) digunakan untuk Kamu perempuan tunggal (Mufrod Muannats).',
          'هُوَ (Huwa) digunakan untuk Dia laki-laki tunggal (Ghaib Mudzakkar).',
          'هِيَ (Hiya) digunakan untuk Dia perempuan tunggal (Ghaib Muannats).',
        ],
        examples: [
          { arabic: 'أَنَا طَالِبٌ', indonesian: 'Saya seorang siswa (laki-laki).' },
          { arabic: 'أَنَا طَالِبَةٌ', indonesian: 'Saya seorang siswi (perempuan).' },
          { arabic: 'أَنْتَ مُدَرِّسٌ مَاهِرٌ', indonesian: 'Kamu adalah guru yang mahir.' },
          { arabic: 'هُوَ صَدِيْقِي مِنْ جَاكَرْتَا', indonesian: 'Dia adalah temanku dari Jakarta.' },
          { arabic: 'هِيَ طَبِيْبَةٌ فِي المُسْتَشْفَى', indonesian: 'Dia seorang dokter di rumah sakit.' },
        ],
        table: {
          headers: ['Kata Ganti (Dhamir)', 'Makna', 'Jenis / Jumlah', 'Contoh Kalimat'],
          rows: [
            ['هُوَ (Huwa)', 'Dia (L)', 'Mufrod Mudzakkar (Tunggal Lk)', 'هُوَ طَالِبٌ نَشِيْطٌ'],
            ['هِيَ (Hiya)', 'Dia (P)', 'Mufrod Muannats (Tunggal Pr)', 'هِيَ طَالِبَةٌ نَشِيْطَةٌ'],
            ['أَنْتَ (Anta)', 'Kamu (L)', 'Mukhatab Mudzakkar', 'أَنْتَ صَدِيْقِي'],
            ['أَنْتِ (Anti)', 'Kamu (P)', 'Mukhatab Muannats', 'أَنْتِ صَدِيْقَتِي'],
            ['أَنَا (Ana)', 'Saya', 'Mutakallim Wahdah (L/P)', 'أَنَا مَحْمُودٌ'],
            ['نَحْنُ (Nahnu)', 'Kami / Kita', 'Mutakallim Ma’al Ghair', 'نَحْنُ طُلَّابُ المَدْرَسَةِ'],
          ],
        },
      },
    ],
    reading: {
      titleArabic: 'التَّعَارُفُ فِي اليَوْمِ الأَوَّلِ',
      titleIndonesian: 'Perkenalan di Hari Pertama Sekolah',
      paragraphs: [
        {
          arabic: 'فِي اليَوْمِ الأَوَّلِ مِنَ العَامِ الدِّرَاسِيِّ الجَدِيْدِ، يَجْتَمِعُ الطُّلَّابُ فِي فِنَاءِ المَدْرَسَةِ الثَّانَوِيَّةِ الإِسْلَامِيَّةِ الحُكُومِيَّةِ. جَمِيْعُ الطُّلَّابِ مَسْرُوْرُوْنَ بِلِقَاءِ أَصْدِقَائِهِمْ وَمُعَلِّمِيْهِمْ الجُدُدِ.',
          indonesian: 'Pada hari pertama tahun ajaran baru, para siswa berkumpul di halaman Madrasah Aliyah Negeri. Semua siswa berbahagia bertemu dengan teman-teman dan guru-guru baru mereka.',
        },
        {
          arabic: 'يَقِفُ عُمَرُ أَمَامَ الفَصْلِ وَيُعَرِّفُ بِنَفْسِهِ: "اِسْمِي عُمَرُ، أَنَا قَادِمٌ مِنْ مَدِيْنَةِ يُوجْيَاكَارْتَا. هِوَايَتِي القِرَاءَةُ وَمُمَارَسَةُ الرِّيَاضَةِ، وَأَتَمَنَّى أَنْ نَكُوْنَ جَمِيْعًا نَاجِحِيْنَ فِي هَذِهِ المَدْرَسَةِ المُبَارَكَةِ".',
          indonesian: 'Umar berdiri di depan kelas dan memperkenalkan dirinya: "Namaku Umar, saya berasal dari kota Yogyakarta. Hobiku membaca dan berolahraga, dan saya berharap kita semua menjadi orang-orang yang sukses di sekolah yang berkah ini."',
        },
      ],
      comprehensionQuestions: [
        {
          questionArabic: 'أَيْنَ يَجْتَمِعُ الطُّلَّابُ فِي اليَوْمِ الأَوَّلِ؟',
          questionIndonesian: 'Di mana para siswa berkumpul pada hari pertama?',
          answer: 'يَجْتَمِعُ الطُّلَّابُ فِي فِنَاءِ المَدْرَسَةِ الثَّانَوِيَّةِ الإِسْلَامِيَّةِ.',
        },
        {
          questionArabic: 'مَا هِيَ هِوَايَةُ عُمَرَ؟',
          questionIndonesian: 'Apa hobi Umar?',
          answer: 'هِوَايَةُ عُمَرَ هِيَ القِرَاءَةُ وَمُمَارَسَةُ الرِّيَاضَةِ.',
        },
      ],
    },
    quiz: [
      {
        id: 'q1-1',
        question: 'Dhamir yang tepat untuk melengkapi kalimat: "... طَالِبَةٌ مَاهِرَةٌ فِي الفَصْلِ" adalah:',
        arabicContext: '... طَالِبَةٌ مَاهِرَةٌ فِي الفَصْلِ',
        options: ['هُوَ', 'هِيَ', 'أَنْتَ', 'نَحْنُ'],
        correctAnswer: 1,
        explanation: 'Kata "طَالِبَةٌ" berakhiran ta’ marbuthah (muannats tunggal), sehingga dhamir ghaib yang sesuai adalah "هِيَ" (Dia perempuan).',
      },
      {
        id: 'q1-2',
        question: 'Jawaban yang benar untuk sapaan "صَبَاحُ الخَيْرِ" adalah:',
        arabicContext: 'صَبَاحُ الخَيْرِ',
        options: ['مَسَاءُ الخَيْرِ', 'صَبَاحُ النُّورِ', 'أَهْلًا بِكَ', 'عَفْوًا'],
        correctAnswer: 1,
        explanation: 'Jawaban standar yang santun untuk "صَبَاحُ الخَيْرِ" (selamat pagi) adalah "صَبَاحُ النُّورِ".',
      },
      {
        id: 'q1-3',
        question: 'Jika kamu bertanya kepada seorang teman laki-laki tentang asalnya, ungkapan yang tepat adalah:',
        options: ['مِنْ أَيْنَ أَنْتِ؟', 'مِنْ أَيْنَ أَنْتَ؟', 'مَا اسْمُكِ؟', 'كَيْفَ حَالُكِ؟'],
        correctAnswer: 1,
        explanation: 'Untuk mukhatab mudzakkar (kamu laki-laki), digunakan "أَنْتَ" dengan harakat fathah pada huruf ta: "مِنْ أَيْنَ أَنْتَ؟".',
      },
      {
        id: 'q1-4',
        question: 'Arti dari ungkapan "أَهْلًا وَسَهْلًا" adalah:',
        options: ['Sampai jumpa lagi', 'Selamat datang', 'Semoga selamat di jalan', 'Terima kasih banyak'],
        correctAnswer: 1,
        explanation: 'Ahlan wa sahlan bermakna selamat datang (ungkapan menyambut tamu atau teman baru).',
      },
      {
        id: 'q1-5',
        question: 'Bentuk jamak mutakallim (kami/kita) dalam bahasa Arab adalah:',
        options: ['أَنَا', 'أَنْتُمْ', 'نَحْنُ', 'هُمْ'],
        correctAnswer: 2,
        explanation: 'Dhamir munfashil untuk "Kami / Kita" adalah "نَحْنُ" (Nahnu).',
      },
    ],
  },
  {
    id: 'bab-2',
    number: 2,
    titleArabic: 'الأُسْرَةُ وَالبَيْتُ',
    titleIndonesian: 'Keluarga dan Rumah',
    description: 'Mengenal kosa kata anggota keluarga, bagian-bagian rumah, serta penggunaan Isim Isyarah (هَذَا / هَذِهِ dan ذَلِكَ / تِلْكَ).',
    color: 'sky',
    badge: 'Semester 1 - Bab 2',
    estimatedMinutes: 50,
    vocabulary: [
      {
        id: 'v2-1',
        arabic: 'أَبٌ / وَالِدٌ',
        transliteration: 'Abun / Wālidun',
        indonesian: 'Ayah',
        category: 'isim',
        exampleArabic: 'أَبِي يَعْمَلُ مُهَنْدِسًا',
        exampleIndonesian: 'Ayahku bekerja sebagai insinyur.',
      },
      {
        id: 'v2-2',
        arabic: 'أُمٌّ / وَالِدَةٌ',
        transliteration: 'Ummun / Wālidatun',
        indonesian: 'Ibu',
        category: 'isim',
        exampleArabic: 'أُمِّي تُعِدُّ الطَّعَامَ فِي المَطْبَخِ',
        exampleIndonesian: 'Ibuku menyiapkan makanan di dapur.',
      },
      {
        id: 'v2-3',
        arabic: 'أَخٌ كَبِيرٌ / أُخْتٌ كَبِيرَةٌ',
        transliteration: 'Akhun kabīr / Ukhtun kabīrah',
        indonesian: 'Kakak laki-laki / Kakak perempuan',
        category: 'isim',
      },
      {
        id: 'v2-4',
        arabic: 'غُرْفَةُ الجُلُوسِ',
        transliteration: 'Ghurfatul julūs',
        indonesian: 'Ruang tamu / Ruang keluarga',
        category: 'isim',
        exampleArabic: 'نَجْلِسُ فِي غُرْفَةِ الجُلُوسِ مَعَ الأُسْرَةِ',
        exampleIndonesian: 'Kami duduk di ruang tamu bersama keluarga.',
      },
      {
        id: 'v2-5',
        arabic: 'غُرْفَةُ النَّوْمِ',
        transliteration: 'Ghurfatun naum',
        indonesian: 'Kamar tidur',
        category: 'isim',
        exampleArabic: 'أَنَامُ فِي غُرْفَةِ النَّوْمِ المُرَتَّبَةِ',
        exampleIndonesian: 'Saya tidur di kamar tidur yang rapi.',
      },
      {
        id: 'v2-6',
        arabic: 'مَطْبَخٌ / حَمَّامٌ',
        transliteration: 'Mathbakhun / Hammāmun',
        indonesian: 'Dapur / Kamar mandi',
        category: 'isim',
      },
      {
        id: 'v2-7',
        arabic: 'حَدِيقَةٌ وَاسِعَةٌ',
        transliteration: 'Hadīqatun wāsi‘ah',
        indonesian: 'Taman yang luas',
        category: 'isim',
      },
    ],
    dialogue: [
      {
        id: 'd2-1',
        speaker: 'زَيْد',
        speakerRole: 'Tamu',
        avatar: '👦',
        arabic: 'بَيْتُكَ جَمِيْلٌ جِدًّا يَا خَالِد! هَلْ هَذِهِ صُورَةُ أُسْرَتِكَ؟',
        indonesian: 'Rumahmu sangat indah wahai Khalid! Apakah ini foto keluargamu?',
      },
      {
        id: 'd2-2',
        speaker: 'خَالِد',
        speakerRole: 'Tuan Rumah',
        avatar: '🧒',
        arabic: 'نَعَمْ، هَذِهِ صُورَةُ أُسْرَتِي الكَرِيمَةِ. تَعَالَ أُعَرِّفْكَ بِهِمْ.',
        indonesian: 'Ya, ini foto keluargaku tercinta. Kemarilah, aku kenalkan kepadamu.',
      },
      {
        id: 'd2-3',
        speaker: 'زَيْد',
        speakerRole: 'Tamu',
        avatar: '👦',
        arabic: 'مَنْ هَذَا الرَّجُلُ الَّذِي يَلْبَسُ النَّظَّارَةَ؟',
        indonesian: 'Siapa pria yang memakai kacamata ini?',
      },
      {
        id: 'd2-4',
        speaker: 'خَالِد',
        speakerRole: 'Tuan Rumah',
        avatar: '🧒',
        arabic: 'هَذَا وَالِدِي، هُوَ طَبِيْبٌ فِي المُسْتَشْفَى، وَتِلْكَ وَالِدَتِي، هِيَ مُعَلِّمَةٌ.',
        indonesian: 'Ini ayahku, beliau seorang dokter di rumah sakit, dan itu ibuku, beliau seorang guru.',
      },
    ],
    grammar: [
      {
        title: 'اسْمُ الإِشَارَةِ (Isim Isyarah / Kata Tunjuk)',
        concept: 'Isim Isyarah adalah kata yang digunakan untuk menunjuk sesuatu yang dekat (قَرِيْب) atau jauh (بَعِيْد).',
        explanation: 'Pemilihan isim isyarah harus menyesuaikan jenis kata benda (mudzakkar atau muannats) serta jaraknya.',
        rules: [
          'هَذَا (Hadza) = Ini (untuk benda laki-laki / mudzakkar, jarak dekat).',
          'هَذِهِ (Hadzihi) = Ini (untuk benda perempuan / muannats atau jamak taksir benda mati, jarak dekat).',
          'ذَلِكَ (Dzalika) = Itu (untuk benda laki-laki / mudzakkar, jarak jauh).',
          'تِلْكَ (Tilka) = Itu (untuk benda perempuan / muannats, jarak jauh).',
        ],
        examples: [
          { arabic: 'هَذَا بَيْتِي', indonesian: 'Ini rumahku (Baitun = mudzakkar).' },
          { arabic: 'هَذِهِ غُرْفَتِي', indonesian: 'Ini kamarku (Ghurfatun = muannats).' },
          { arabic: 'ذَلِكَ مَسْجِدٌ كَبِيرٌ', indonesian: 'Itu masjid yang besar.' },
          { arabic: 'تِلْكَ شَجَرَةٌ مُثْمِرَةٌ', indonesian: 'Itu pohon yang berbuah.' },
        ],
      },
    ],
    reading: {
      titleArabic: 'فِي بَيْتِنَا المِثَالِيِّ',
      titleIndonesian: 'Di Rumah Kami yang Ideal',
      paragraphs: [
        {
          arabic: 'أَسْكُنُ مَعَ أُسْرَتِي فِي بَيْتٍ جَمِيْلٍ وَنَظِيْفٍ. يَتَكَوَّنُ البَيْتُ مِنْ غُرْفَةِ الجُلُوسِ، وَثَلَاثِ غُرَفٍ لِلنَّوْمِ، وَمَطْبَخٍ، وَحَمَّامٍ. أَمَامَ البَيْتِ حَدِيْقَةٌ صَغِيْرَةٌ فِيهَا أَزْهَارٌ مُتَنَوِّعَةٌ.',
          indonesian: 'Saya tinggal bersama keluarga di rumah yang indah dan bersih. Rumah tersebut terdiri dari ruang tamu, tiga kamar tidur, dapur, dan kamar mandi. Di depan rumah ada taman kecil dengan berbagai macam bunga.',
        },
      ],
      comprehensionQuestions: [
        {
          questionArabic: 'مِمَّ يَتَكَوَّنُ البَيْتُ؟',
          questionIndonesian: 'Terdiri dari apa sajakah rumah tersebut?',
          answer: 'يَتَكَوَّنُ مِنْ غُرْفَةِ الجُلُوسِ، وَثَلَاثِ غُرَفِ نَوْمٍ، وَمَطْبَخٍ، وَحَمَّامٍ.',
        },
      ],
    },
    quiz: [
      {
        id: 'q2-1',
        question: 'Isim isyarah yang tepat untuk kata "سَيَّارَةٌ" (jarak dekat) adalah:',
        options: ['هَذَا', 'هَذِهِ', 'ذَلِكَ', 'هُوَ'],
        correctAnswer: 1,
        explanation: 'Kata "سَيَّارَةٌ" berakhiran ta marbuthah (muannats), sehingga kata tunjuk dekat yang benar adalah "هَذِهِ".',
      },
      {
        id: 'q2-2',
        question: 'Arti dari "غُرْفَةُ النَّوْمِ" adalah:',
        options: ['Ruang tamu', 'Kamar mandi', 'Kamar tidur', 'Ruang makan'],
        correctAnswer: 2,
        explanation: 'Ghurfatun naum berasal dari kata naum (tidur), berarti kamar tidur.',
      },
      {
        id: 'q2-3',
        question: 'Lengkapi kalimat: "... بَابٌ مَفْتُوحٌ" (jarak jauh mudzakkar):',
        options: ['تِلْكَ', 'ذَلِكَ', 'هَذِهِ', 'هِيَ'],
        correctAnswer: 1,
        explanation: 'Bāb (pintu) adalah isim mudzakkar, untuk jarak jauh digunakan "ذَلِكَ".',
      },
    ],
  },
  {
    id: 'bab-3',
    number: 3,
    titleArabic: 'المَدْرَسَةُ وَمَرَافِقُهَا',
    titleIndonesian: 'Sekolah dan Fasilitasnya',
    description: 'Mengenal sarana sekolah (kelas, perpustakaan, laboratorium, masjid) serta menguasai Huruf Jar dan Zharf Makan.',
    color: 'amber',
    badge: 'Semester 1 - Bab 3',
    estimatedMinutes: 50,
    vocabulary: [
      {
        id: 'v3-1',
        arabic: 'فَصْلٌ / صَفٌّ',
        transliteration: 'Fashlun / Shaffun',
        indonesian: 'Ruang kelas',
        category: 'isim',
      },
      {
        id: 'v3-2',
        arabic: 'مَكْتَبَةٌ شَامِلَةٌ',
        transliteration: 'Maktabatun syāmilah',
        indonesian: 'Perpustakaan yang lengkap',
        category: 'isim',
      },
      {
        id: 'v3-3',
        arabic: 'مُخْتَبَرُ اللُّغَةِ',
        transliteration: 'Mukhtabarul lughah',
        indonesian: 'Laboratorium bahasa',
        category: 'isim',
      },
      {
        id: 'v3-4',
        arabic: 'مَسْجِدُ المَدْرَسَةِ',
        transliteration: 'Masjidul madrasah',
        indonesian: 'Masjid sekolah',
        category: 'isim',
      },
      {
        id: 'v3-5',
        arabic: 'مَقْصَفٌ / كَانْتِين',
        transliteration: 'Maqshafun',
        indonesian: 'Kantin sekolah',
        category: 'isim',
      },
      {
        id: 'v3-6',
        arabic: 'مَلْعَبٌ وَاسِعٌ',
        transliteration: 'Mal‘abun wāsi‘',
        indonesian: 'Lapangan yang luas',
        category: 'isim',
      },
    ],
    dialogue: [
      {
        id: 'd3-1',
        speaker: 'سَلْمَان',
        speakerRole: 'Siswa',
        avatar: '🙋‍♂️',
        arabic: 'أَيْنَ تَقَعُ مَكْتَبَةُ المَدْرَسَةِ يَا عَلِيُّ؟',
        indonesian: 'Di mana letak perpustakaan sekolah wahai Ali?',
      },
      {
        id: 'd3-2',
        speaker: 'عَلِيّ',
        speakerRole: 'Ketua Kelas',
        avatar: '👨‍💼',
        arabic: 'تَقَعُ المَكْتَبَةُ جَانِبَ مُخْتَبَرِ العُلُومِ، أَمَامَ مَسْجِدِ المَدْرَسَةِ.',
        indonesian: 'Perpustakaan terletak di samping laboratorium IPA, di depan masjid sekolah.',
      },
    ],
    grammar: [
      {
        title: 'حُرُوفُ الجَرِّ وَظُرُوفُ المَكَانِ (Huruf Jar & Keterangan Tempat)',
        concept: 'Huruf jar menyebabkan isim setelahnya berharakat kasrah (majrur). Zharf makan menunjukkan letak posisi.',
        explanation: 'Contoh Huruf Jar: فِي (di dalam), عَلَى (di atas), إِلَى (ke), مِنْ (dari), بِـ (dengan), لِـ (untuk). Contoh Zharf Makan: أَمَامَ (di depan), وَرَاءَ (di belakang), فَوْقَ (di atas), تَحْتَ (di bawah), جَانِبَ (di samping).',
        rules: [
          'Isim setelah huruf jar menjadi majrur (tanda aslinya berharakat kasrah).',
          'Contoh: فِي الفَصْلِ (bukan Fashlu atau Fashla).',
        ],
        examples: [
          { arabic: 'الكِتَابُ عَلَى المَكْتَبِ', indonesian: 'Buku itu di atas meja.' },
          { arabic: 'الطُّلَّابُ فِي المَسْجِدِ', indonesian: 'Para siswa berada di dalam masjid.' },
          { arabic: 'المَلْعَبُ أَمَامَ الفُصُولِ', indonesian: 'Lapangan itu di depan ruang kelas.' },
        ],
      },
    ],
    reading: {
      titleArabic: 'مَرَافِقُ مَدْرَسَتِنَا العَصْرِيَّةِ',
      titleIndonesian: 'Fasilitas Sekolah Modern Kami',
      paragraphs: [
        {
          arabic: 'مَدْرَسَتُنَا مَدْرَسَةٌ كَبِيْرَةٌ وَعَصْرِيَّةٌ. فِيْهَا مَرَافِقُ كَثِيْرَةٌ، مِثْلُ الفُصُوْلِ الدِّرَاسِيَّةِ المُكَيَّفَةِ، وَمُخْتَبَرَاتِ العُلُوْمِ وَالحَاسُوْبِ، وَمَكْتَبَةٍ ضَخْمَةٍ تَحْتَوِي عَلَى آلَافِ الكُتُبِ المُفِيْدَةِ.',
          indonesian: 'Sekolah kami adalah sekolah yang besar dan modern. Di dalamnya terdapat banyak fasilitas, seperti ruang-ruang kelas ber-AC, laboratorium sains dan komputer, serta perpustakaan besar yang memuat ribuan buku bermanfaat.',
        },
      ],
      comprehensionQuestions: [
        {
          questionArabic: 'مَاذَا يُوْجَدُ فِي مَكْتَبَةِ المَدْرَسَةِ؟',
          questionIndonesian: 'Apa yang terdapat di perpustakaan sekolah?',
          answer: 'يُوْجَدُ فِيْهَا آلَافُ الكُتُبِ المُفِيْدَةِ.',
        },
      ],
    },
    quiz: [
      {
        id: 'q3-1',
        question: 'Harakat akhir yang benar pada kata "المَكْتَب" dalam kalimat "القَلَمُ عَلَى ..." adalah:',
        options: ['المَكْتَبُ (Dhammah)', 'المَكْتَبِ (Kasrah)', 'المَكْتَبَ (Fathah)', 'المَكْتَبْ (Sukun)'],
        correctAnswer: 1,
        explanation: 'Karena didahului huruf jar "عَلَى", maka isim setelahnya majrur dengan tanda kasrah: "عَلَى المَكْتَبِ".',
      },
      {
        id: 'q3-2',
        question: 'Lawan kata dari "أَمَامَ" (di depan) adalah:',
        options: ['فَوْقَ', 'وَرَاءَ / خَلْفَ', 'تَحْتَ', 'جَانِبَ'],
        correctAnswer: 1,
        explanation: 'Amāma artinya di depan, lawannya adalah warā’a / khalfa yang artinya di belakang.',
      },
    ],
  },
  {
    id: 'bab-4',
    number: 4,
    titleArabic: 'الحَيَاةُ اليَوْمِيَّةُ',
    titleIndonesian: 'Kehidupan Sehari-hari',
    description: 'Menceritakan rutinitas harian dari bangun tidur hingga istirahat malam, membaca jam/waktu, dan Fi’il Mudhari’.',
    color: 'violet',
    badge: 'Semester 2 - Bab 4',
    estimatedMinutes: 55,
    vocabulary: [
      {
        id: 'v4-1',
        arabic: 'يَسْتَيْقِظُ مِنَ النَّوْمِ',
        transliteration: 'Yastaiqidzu minan naumi',
        indonesian: 'Bangun dari tidur',
        category: 'fiil',
      },
      {
        id: 'v4-2',
        arabic: 'يُصَلِّي الصُّبْحَ جَمَاعَةً',
        transliteration: 'Yushallish shubha jamā‘atan',
        indonesian: 'Sholat Subuh berjamaah',
        category: 'fiil',
      },
      {
        id: 'v4-3',
        arabic: 'يَتَنَاوَلُ الفُطُورَ',
        transliteration: 'Yatanāwalul futhūra',
        indonesian: 'Sarapan pagi',
        category: 'fiil',
      },
      {
        id: 'v4-4',
        arabic: 'يَذْهَبُ إِلَى المَدْرَسَةِ',
        transliteration: 'Yadzhabu ilal madrasati',
        indonesian: 'Pergi ke sekolah',
        category: 'fiil',
      },
      {
        id: 'v4-5',
        arabic: 'السَّاعَةُ السَّادِسَةُ صَبَاحًا',
        transliteration: 'As-sā‘atus sādisatu shabāhan',
        indonesian: 'Pukul enam pagi',
        category: 'ibarah',
      },
      {
        id: 'v4-6',
        arabic: 'يُذَاكِرُ الدُّرُوسَ',
        transliteration: 'Yudzākirud durūsa',
        indonesian: 'Mengulang pelajaran',
        category: 'fiil',
      },
    ],
    dialogue: [
      {
        id: 'd4-1',
        speaker: 'طَارِق',
        speakerRole: 'Siswa A',
        avatar: '🏃‍♂️',
        arabic: 'فِي أَيِّ سَاعَةٍ تَسْتَيْقِظُ مِنَ النَّوْمِ يَا يُوْسُفُ؟',
        indonesian: 'Pada jam berapa kamu bangun dari tidur wahai Yusuf?',
      },
      {
        id: 'd4-2',
        speaker: 'يُوْسُف',
        speakerRole: 'Siswa B',
        avatar: '🧎‍♂️',
        arabic: 'أَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ صَبَاحًا، ثُمَّ أَتَوَضَّأُ وَأُصَلِّي فِي المَسْجِدِ.',
        indonesian: 'Saya bangun pada jam empat pagi, kemudian saya berwudhu dan shalat di masjid.',
      },
    ],
    grammar: [
      {
        title: 'الفِعْلُ المُضَارِعُ (Fi’il Mudhari’ / Kata Kerja Masa Sekarang / Akan Datang)',
        concept: 'Fi’il Mudhari menunjukkan perbuatan yang sedang atau akan berlangsung. Memiliki huruf mudhara’ah (أ - ن - ي - ت) di depannya.',
        explanation: 'Perubahan bentuk fiil mudhari menyesuaikan subjek (dhamir):',
        rules: [
          'أَنَا -> أَذْهَبُ (Saya pergi - diawali huruf Alif)',
          'نَحْنُ -> نَذْهَبُ (Kami pergi - diawali huruf Nun)',
          'هُوَ -> يَذْهَبُ (Dia Lk pergi - diawali huruf Ya)',
          'هِيَ -> تَذْهَبُ (Dia Pr pergi - diawali huruf Ta)',
          'أَنْتَ -> تَذْهَبُ (Kamu Lk pergi - diawali huruf Ta)',
          'أَنْتِ -> تَذْهَبِيْنَ (Kamu Pr pergi - diawali huruf Ta dan diakhiri Ya Nun)',
        ],
        examples: [
          { arabic: 'أَنَا أَقْرَأُ القُرْآنَ كُلَّ يَوْمٍ', indonesian: 'Saya membaca Al-Qur’an setiap hari.' },
          { arabic: 'فَاطِمَةُ تَكْتُبُ الوَاجِبَ المَنْزِلِيَّ', indonesian: 'Fatimah sedang menulis PR.' },
        ],
      },
    ],
    reading: {
      titleArabic: 'يَوْمِيَّاتُ طَالِبٍ نَشِيْطٍ',
      titleIndonesian: 'Keseharian Siswa yang Rajin',
      paragraphs: [
        {
          arabic: 'يَبْدَأُ إِبْرَاهِيمُ يَوْمَهُ مُبَكِّرًا. يَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ، فَيَتَوَضَّأُ وَيُصَلِّي صَلَاةَ الفَجْرِ مَعَ جَمَاعَةِ المُسْلِمِينَ فِي المَسْجِدِ. بَعْدَ الصَّلَاةِ، يَقْرَأُ بَعْضَ الآيَاتِ مِنَ القُرْآنِ الكَرِيمِ، ثُمَّ يُسَاعِدُ وَالِدَيْهِ.',
          indonesian: 'Ibrahim memulai harinya pagi-pagi sekali. Dia bangun pada pukul empat, lalu berwudhu dan menunaikan shalat Subuh berjamaah di masjid. Setelah shalat, ia membaca beberapa ayat Al-Qur’an lalu membantu kedua orang tuanya.',
        },
      ],
      comprehensionQuestions: [
        {
          questionArabic: 'مَتَى يَسْتَيْقِظُ إِبْرَاهِيمُ؟',
          questionIndonesian: 'Kapan Ibrahim bangun tidur?',
          answer: 'يَسْتَيْقِظُ فِي السَّاعَةِ الرَّابِعَةِ صَبَاحًا.',
        },
      ],
    },
    quiz: [
      {
        id: 'q4-1',
        question: 'Bentuk fiil mudhari yang tepat untuk "أَنَا ... اللُّغَةَ العَرَبِيَّةَ" adalah:',
        options: ['يَتَعَلَّمُ', 'تَتَعَلَّمُ', 'أَتَعَلَّمُ', 'نَتَعَلَّمُ'],
        correctAnswer: 2,
        explanation: 'Untuk dhamir "أَنَا", fiil mudhari berawalan huruf Hamzah / Alif: "أَتَعَلَّمُ" (Saya belajar).',
      },
      {
        id: 'q4-2',
        question: 'Apa arti dari "السَّاعَةُ السَّابِعَةُ صَبَاحًا" ?',
        options: ['Jam 6 pagi', 'Jam 7 pagi', 'Jam 8 malam', 'Jam 5 sore'],
        correctAnswer: 1,
        explanation: 'As-Sābi‘ah artinya ketujuh / jam 7, shabāhan artinya pagi hari.',
      },
    ],
  },
  {
    id: 'bab-5',
    number: 5,
    titleArabic: 'الهِوَايَةُ',
    titleIndonesian: 'Hobi dan Kegemaran',
    description: 'Menjelaskan berbagai macam hobi (membaca, olahraga, kaligrafi, fotografi) serta penggunaan Fi’il Madhi.',
    color: 'rose',
    badge: 'Semester 2 - Bab 5',
    estimatedMinutes: 45,
    vocabulary: [
      {
        id: 'v5-1',
        arabic: 'القِرَاءَةُ وَالمُطَالَعَةُ',
        transliteration: 'Al-Qirā’atu wal muthāla‘ah',
        indonesian: 'Membaca dan menelaah',
        category: 'isim',
      },
      {
        id: 'v5-2',
        arabic: 'كُرَةُ القَدَمِ',
        transliteration: 'Kuratul qadami',
        indonesian: 'Sepak bola',
        category: 'isim',
      },
      {
        id: 'v5-3',
        arabic: 'الخَطُّ العَرَبِيُّ',
        transliteration: 'Al-Khaththul ‘arabiyyu',
        indonesian: 'Kaligrafi Arab',
        category: 'isim',
      },
      {
        id: 'v5-4',
        arabic: 'التَّصْوِيرُ الفُوتُوغْرَافِيُّ',
        transliteration: 'At-Tashwīrul fūtūghrāfī',
        indonesian: 'Fotografi / Memotret',
        category: 'isim',
      },
      {
        id: 'v5-5',
        arabic: 'الرَّسْمُ وَالتَّلْوِينُ',
        transliteration: 'Ar-Rasmu wat talwīn',
        indonesian: 'Menggambar dan mewarnai',
        category: 'isim',
      },
      {
        id: 'v5-6',
        arabic: 'السِّبَاحَةُ',
        transliteration: 'As-Sibāhatu',
        indonesian: 'Berenang',
        category: 'isim',
      },
    ],
    dialogue: [
      {
        id: 'd5-1',
        speaker: 'حَمْزَة',
        speakerRole: 'Siswa',
        avatar: '🎨',
        arabic: 'مَا هِوَايَتُكَ المُفَضَّلَةُ يَا عَبْدَ اللهِ؟',
        indonesian: 'Apa hobi kesukaanmu wahai Abdullah?',
      },
      {
        id: 'd5-2',
        speaker: 'عَبْدُ الله',
        speakerRole: 'Siswa',
        avatar: '⚽',
        arabic: 'هِوَايَتِي كُرَةُ القَدَمِ وَالسِّبَاحَةُ، وَأَلْعَبُ كُلَّ يَوْمِ جُمُعَةٍ.',
        indonesian: 'Hobiku sepak bola dan berenang, dan aku bermain setiap hari Jumat.',
      },
    ],
    grammar: [
      {
        title: 'الفِعْلُ المَاضِي (Fi’il Madhi / Kata Kerja Lampau)',
        concept: 'Fi’il Madhi menunjukkan perbuatan yang telah selesai dikerjakan pada masa lampau.',
        explanation: 'Bentuk dasarnya biasanya terdiri dari tiga huruf (Tsulatsi Mujarrad) dengan harakat fathah.',
        rules: [
          'ذَهَبَ (Dia Lk telah pergi)',
          'ذَهَبَتْ (Dia Pr telah pergi - ditambah Ta Sukun)',
          'ذَهَبْتَ (Kamu Lk telah pergi - ditambah Ta Fathah)',
          'ذَهَبْتُ (Saya telah pergi - ditambah Ta Dhammah)',
        ],
        examples: [
          { arabic: 'قَرَأْتُ كِتَابًا نَافِعًا أَمْسِ', indonesian: 'Saya telah membaca buku yang bermanfaat kemarin.' },
          { arabic: 'لَعِبَ الطُّلَّابُ كُرَةَ السَّلَّةِ', indonesian: 'Para siswa telah bermain bola basket.' },
        ],
      },
    ],
    reading: {
      titleArabic: 'مَعْرِضُ الهِوَايَاتِ فِي المَدْرَسَةِ',
      titleIndonesian: 'Pameran Hobi di Sekolah',
      paragraphs: [
        {
          arabic: 'أَقَامَتِ المَدْرَسَةُ مَعْرِضًا سَنَوِيًّا لِلْهِوَايَاتِ. شَارَكَ فِيهِ طُلَّابُ الصَّفِّ العَاشِرِ بِأَعْمَالٍ رَائِعَةٍ، مِثْلُ لَوْحَاتِ الخَطِّ العَرَبِيِّ وَصُوَرِ الطَّبِيْعَةِ الخَلَّابَةِ.',
          indonesian: 'Sekolah menyelenggarakan pameran hobi tahunan. Siswa-siswi kelas sepuluh berpartisipasi dengan karya-karya luar biasa, seperti lukisan kaligrafi Arab dan foto-foto pemandangan alam yang memesona.',
        },
      ],
      comprehensionQuestions: [
        {
          questionArabic: 'مَاذَا أَقَامَتِ المَدْرَسَةُ؟',
          questionIndonesian: 'Apa yang diselenggarakan oleh sekolah?',
          answer: 'أَقَامَتِ المَدْرَسَةُ مَعْرِضًا سَنَوِيًّا لِلْهِوَايَاتِ.',
        },
      ],
    },
    quiz: [
      {
        id: 'q5-1',
        question: 'Kata "كُرَةُ القَدَمِ" memiliki arti:',
        options: ['Bola basket', 'Bulu tangkis', 'Sepak bola', 'Tenis meja'],
        correctAnswer: 2,
        explanation: 'Qadam artinya kaki, kuratul qadam artinya bola kaki / sepak bola.',
      },
      {
        id: 'q5-2',
        question: 'Bentuk fiil madhi untuk "Saya telah menulis" adalah:',
        options: ['كَتَبَ', 'كَتَبْتُ', 'يَكْتُبُ', 'كَتَبْتَ'],
        correctAnswer: 1,
        explanation: 'Tambahan huruf Ta Dhammah (تُ) di akhir fiil madhi menunjukkan subjek "Saya" (أَنَا kátab-tu).',
      },
    ],
  },
  {
    id: 'bab-6',
    number: 6,
    titleArabic: 'الطَّعَامُ وَالشَّرَابُ',
    titleIndonesian: 'Makanan dan Minuman',
    description: 'Kosa kata makanan halal, minuman sehat, ungkapan memesan di kantin, dan struktur Jumlah Ismiyyah.',
    color: 'indigo',
    badge: 'Semester 2 - Bab 6',
    estimatedMinutes: 45,
    vocabulary: [
      {
        id: 'v6-1',
        arabic: 'أَرُزٌّ مَقْلِيٌّ',
        transliteration: 'Aruzzun maqliyyun',
        indonesian: 'Nasi goreng',
        category: 'isim',
      },
      {
        id: 'v6-2',
        arabic: 'خُبْزٌ طَازَجٌ',
        transliteration: 'Khubzun thāzajun',
        indonesian: 'Roti segar',
        category: 'isim',
      },
      {
        id: 'v6-3',
        arabic: 'شَايٌ سَاخِنٌ',
        transliteration: 'Syāyun sākhinun',
        indonesian: 'Teh hangat / panas',
        category: 'isim',
      },
      {
        id: 'v6-4',
        arabic: 'مَاءٌ مَعْدِنِيٌّ',
        transliteration: 'Mā’un ma‘daniyyun',
        indonesian: 'Air mineral',
        category: 'isim',
      },
      {
        id: 'v6-5',
        arabic: 'لَحْمٌ / دَجَاجٌ',
        transliteration: 'Lahmun / Dajājun',
        indonesian: 'Daging sapi / Ayam',
        category: 'isim',
      },
      {
        id: 'v6-6',
        arabic: 'شَهِيٌّ وَلَذِيْذٌ',
        transliteration: 'Syahiyyun wa ladzīdzun',
        indonesian: 'Lezat dan nikmat',
        category: 'isim',
      },
    ],
    dialogue: [
      {
        id: 'd6-1',
        speaker: 'بَائِع',
        speakerRole: 'Penjual Kantin',
        avatar: '👨‍🍳',
        arabic: 'أَهْلًا وَسَهْلًا! أَيَّ خِدْمَةٍ يَا بُنَيَّ؟',
        indonesian: 'Selamat datang! Ada yang bisa saya bantu wahai anakku?',
      },
      {
        id: 'd6-2',
        speaker: 'مُصْطَفَى',
        speakerRole: 'Pembeli',
        avatar: '🧑',
        arabic: 'أُرِيْدُ صَحْنَ أَرُزٍّ مَعَ دَجَاجٍ مَشْوِيٍّ، وَكُوبَ شَايٍ مِنْ فَضْلِكَ.',
        indonesian: 'Saya ingin sepiring nasi dengan ayam panggang, dan secangkir teh tolong.',
      },
    ],
    grammar: [
      {
        title: 'الجُمْلَةُ الاِسْمِيَّةُ (Mubtada’ dan Khabar)',
        concept: 'Jumlah Ismiyyah adalah kalimat sempurna yang diawali dengan isim (kata benda).',
        explanation: 'Terdiri dari dua unsur pokok: Mubtada’ (subjek/pokok kalimat) dan Khabar (predikat/keterangan). Keduanya berhukum marfu’ (berharakat dhammah).',
        rules: [
          'Mubtada umumnya berupa isim ma’rifah (ada Alif Lam / nama orang).',
          'Khabar harus menyesuaikan jenis kelamin (mudzakkar/muannats) dari Mubtada.',
        ],
        examples: [
          { arabic: 'الطَّعَامُ لَذِيذٌ', indonesian: 'Makanan itu lezat (Keduanya mudzakkar marfu).' },
          { arabic: 'القَهْوَةُ سَاخِنَةٌ', indonesian: 'Kopi itu panas (Keduanya muannats marfu).' },
        ],
      },
    ],
    reading: {
      titleArabic: 'فِي مَقْصَفِ المَدْرَسَةِ النَّظِيْفِ',
      titleIndonesian: 'Di Kantin Sekolah yang Bersih',
      paragraphs: [
        {
          arabic: 'فِي وَقْتِ الاِسْتِرَاحَةِ، يَذْهَبُ الطُّلَّابُ إِلَى مَقْصَفِ المَدْرَسَةِ. يُقَدِّمُ المَقْصَفُ أَطْعِمَةً صِحِّيَّةً وَمَشْرُوْبَاتٍ طَازَجَةً بَأَسْعَارٍ مُنَاسِبَةٍ.',
          indonesian: 'Pada waktu istirahat, para siswa pergi ke kantin sekolah. Kantin menyediakan makanan sehat dan minuman segar dengan harga yang terjangkau.',
        },
      ],
      comprehensionQuestions: [
        {
          questionArabic: 'مَتَى يَذْهَبُ الطُّلَّابُ إِلَى المَقْصَفِ؟',
          questionIndonesian: 'Kapan para siswa pergi ke kantin?',
          answer: 'يَذْهَبُ الطُّلَّابُ فِي وَقْتِ الاِسْتِرَاحَةِ.',
        },
      ],
    },
    quiz: [
      {
        id: 'q6-1',
        question: 'Terjemahan bahasa Arab untuk "Air mineral" adalah:',
        options: ['شَايٌ سَاخِنٌ', 'مَاءٌ مَعْدِنِيٌّ', 'عَصِيرُ الفَوَاكِهِ', 'حَلِيبٌ بَارِدٌ'],
        correctAnswer: 1,
        explanation: 'Mā’un ma’daniyyun artinya air mineral.',
      },
      {
        id: 'q6-2',
        question: 'Dalam Jumlah Ismiyyah "الشَّايُ سَاخِنٌ", kata "الشَّايُ" berkedudukan sebagai:',
        options: ['Khabar', 'Fi’il', 'Mubtada’', 'Huruf Jar'],
        correctAnswer: 2,
        explanation: 'Asy-Syāyu terletak di awal kalimat sebagai subjek (Mubtada’), dan sākhinun adalah penjelasnya (Khabar).',
      },
    ],
  },
];
