export function playArabicSpeech(text: string, onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean text from extraneous characters while retaining Arabic letters and vowels
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ar-SA';
  utterance.rate = 0.85; // slightly slower for language learners
  utterance.pitch = 1.0;

  // Try to find an Arabic voice if available
  const voices = window.speechSynthesis.getVoices();
  const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
  if (arabicVoice) {
    utterance.voice = arabicVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}
