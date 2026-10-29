import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini client with server-side API key
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : new GoogleGenAI();

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Backend Pembelajaran Bahasa Arab Kelas X Berjalan',
    timestamp: new Date().toISOString(),
  });
});

// Admin Login endpoint requested by user:
// Username: mulmedjaya
// Password: mulmed123
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === 'mulmedjaya' && password === 'mulmed123') {
    return res.json({
      success: true,
      user: {
        uid: 'admin-mulmedjaya',
        username: 'mulmedjaya',
        displayName: 'Administrator (Mulmed Jaya)',
        email: 'mulmedjaya@sekolah.sch.id',
        role: 'admin',
        isAdmin: true,
      },
      token: 'admin-session-token-' + Date.now(),
    });
  }

  return res.status(401).json({
    success: false,
    message: 'Username atau password admin salah!',
  });
});

// AI Ustadz Tutor endpoint (Powered by Gemini)
app.post('/api/ai/tutor', async (req: Request, res: Response) => {
  try {
    const { message, mode, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Pesan tidak boleh kosong' });
    }

    const systemInstruction = `
Kamu adalah "Ustadz Zaki", asisten guru dan tutor pembelajaran Bahasa Arab interaktif untuk siswa Kelas X (sepuluh) SMA/MA di Indonesia.
Karaktermu:
- Ramah, mendidik, menyemangati, dan berakhlak mulia (memulai penjelasan dengan salam atau ungkapan Islami jika wajar).
- Menguasai materi kurikulum Bahasa Arab Kelas 10:
  1. التحيات والتعارف (Perkenalan & Salam, Dhamir munfashil: huwa, hiya, anta, anti, ana, nahnu)
  2. الأسرة والبيت (Keluarga & Rumah, Isim Isyarah: hadza/hadzihi, dhalika/tilka, Mufrad & Jamak)
  3. المدرسة ومرافقها (Sekolah & Fasilitasnya, Huruf Jar & Zharf Makan)
  4. الحياة اليومية (Kegiatan Sehari-hari, Fi'il Mudhari' & Waktu/Jam)
  5. الهواية (Hobi, Fi'il Madhi & Tasrif Lughawi)
  6. الطعام والشراب (Makanan & Minuman, Kaidah Mibtada' dan Khabar dasar)

Kemampuan respon:
- Selalu cantumkan teks Arab dengan HARAKAT LENGKAP agar siswa kelas X mudah membaca.
- Berikan cara baca (transliterasi latin sederhana jika membantu) dan terjemahan bahasa Indonesia yang jelas.
- Jelaskan kaidah tata bahasa (Nahwu / Sharaf / I'rab) secara ringkas, bertahap, dan mudah dipahami siswa pemula.
- Jika siswa meminta koreksi kalimat, perbaiki kesalahannya dengan ramah dan jelaskan alasannya.
- Mode yang diminta: ${mode || 'umum'}.
`;

    // Construct prompt
    let promptContent = message;
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const historyText = conversationHistory
        .slice(-6)
        .map((h: { sender: string; text: string }) => `${h.sender === 'user' ? 'Siswa' : 'Ustadz Zaki'}: ${h.text}`)
        .join('\n');
      promptContent = `Riwayat percakapan sebelumnya:\n${historyText}\n\nPertanyaan siswa sekarang: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: promptContent }],
        },
      ],
      config: {
        systemInstruction: {
          parts: [{ text: systemInstruction }],
        },
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Maaf, Ustadz Zaki sedang tidak dapat memproses jawaban saat ini. Silakan ulangi lagi.';

    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'Terjadi kendala pada layanan AI Ustadz: ' + (error?.message || 'Unknown error'),
    });
  }
});

// AI Sentence Analyzer & Grammar Breakdown
app.post('/api/ai/analyze-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;

    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Kalimat bahasa Arab harus diisi' });
    }

    const prompt = `
Analisis kalimat bahasa Arab berikut untuk siswa Kelas X:
"${sentence}"

Berikan output dalam format JSON murni tanpa markdown triple backticks dengan struktur:
{
  "original": "kalimat asli dengan harakat lengkap",
  "translation": "terjemahan bahasa Indonesia yang tepat",
  "vocabulary": [
    { "word": "kata dengan harakat", "meaning": "arti", "type": "Isim/Fiil/Huruf" }
  ],
  "grammarExplanation": "penjelasan struktur kalimat (misal: Jumlah Ismiyyah, Mubtada-Khabar, atau Jumlah Fi'liyyah, dll) yang mudah dimengerti siswa kelas X",
  "tips": "tips mengingat atau mengaplikasikannya dalam percakapan sehari-hari"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text;
    let parsedData;
    try {
      parsedData = JSON.parse(text || '{}');
    } catch {
      parsedData = {
        original: sentence,
        translation: 'Analisis kalimat',
        vocabulary: [],
        grammarExplanation: text,
        tips: 'Perhatikan harakat dan susunan kata.',
      };
    }

    res.json(parsedData);
  } catch (error: any) {
    console.error('Sentence analysis error:', error);
    res.status(500).json({
      error: 'Gagal menganalisis kalimat: ' + (error?.message || 'Unknown error'),
    });
  }
});

// AI Quiz Generator for Admin
app.post('/api/ai/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { chapterTitle, topic, questionCount = 5 } = req.body;

    const prompt = `
Buatkan ${questionCount} soal kuis pilihan ganda Bahasa Arab Kelas X SMA/MA.
Bab: ${chapterTitle || 'التحيات والتعارف'}
Topik spesifik: ${topic || 'Kaidah dasar dan kosa kata'}

Format JSON murni tanpa markdown dengan skema:
{
  "questions": [
    {
      "id": 1,
      "question": "Pertanyaan (sertakan teks Arab berharakat jika ada)",
      "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
      "correctAnswer": 0, // indeks jawaban benar (0-3)
      "explanation": "Penjelasan mengapa jawaban ini benar"
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{"questions":[]}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Quiz generator error:', error);
    res.status(500).json({ error: error?.message || 'Gagal menghasilkan soal' });
  }
});

// IMPORTANT: Export default app, no app.listen (required for Vercel Serverless Function)
export default app;
