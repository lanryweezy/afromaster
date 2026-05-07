import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app_name": "Afromaster",
      "hero_title": "Mastering, Reimagined for the Culture.",
      "hero_subtitle": "From a flat mix to a global hit. The AI mastering engine trained specifically on Afrobeats, Amapiano, and Trap.",
      "start_mastering": "Start Mastering Now",
      "hear_difference": "Hear the Difference",
      "step_1_title": "Upload",
      "step_1_desc": "Drag & drop your mix. WAV, MP3, AIFF supported.",
      "step_2_title": "Customize",
      "step_2_desc": "Select genre & AI presets or tweak manually.",
      "step_3_title": "Process",
      "step_3_desc": "Our AI engine balances and boosts your track.",
      "step_4_title": "Download",
      "step_4_desc": "Preview, compare, and export your master.",
      "feature_album_title": "Album Consistency Engine",
      "feature_album_desc": "Master entire EPs or albums in one go. Our AI ensures unified loudness and sonic fingerprint matching.",
      "feature_abc_title": "A/B/C Multi-Testing",
      "feature_abc_desc": "Preview 3 AI-generated variations (Warm, Balanced, Punchy) in real-time to find the perfect vibe.",
      "feature_stem_title": "AI Stem Mastering",
      "feature_stem_desc": "Upload individual stems (Vocals, Drums, Bass) and let our AI balance your mix with precision.",
      "pro_console": "Pro Console",
      "ai_assistant": "AI Assistant",
      "upload_hit": "Upload Your Next Hit",
      "project_studio": "Project Studio",
      "lead_track": "Lead Track",
      "stems": "Stems",
      "finalize_download": "Finalize & Download",
      "back_to_preview": "Back to Preview",
      "finish": "Finish"
    }
  },
  fr: {
    translation: {
      "app_name": "Afromaster",
      "hero_title": "Le Mastering, Réimaginé pour la Culture.",
      "hero_subtitle": "D'un mixage plat à un succès mondial. Le moteur de mastering IA formé spécifiquement sur l'Afrobeats, l'Amapiano et le Trap.",
      "start_mastering": "Commencer le Mastering",
      "hear_difference": "Entendre la Différence",
      "step_1_title": "Téléverser",
      "step_1_desc": "Glissez-déposez votre mix. WAV, MP3, AIFF supportés.",
      "step_2_title": "Personnaliser",
      "step_2_desc": "Sélectionnez le genre & les préréglages IA ou ajustez manuellement.",
      "step_3_title": "Traiter",
      "step_3_desc": "Notre moteur IA équilibre et dynamise votre morceau.",
      "step_4_title": "Télécharger",
      "step_4_desc": "Prévisualisez, comparez et exportez votre master.",
      "feature_album_title": "Moteur de Cohérence d'Album",
      "feature_album_desc": "Masterisez des EPs ou albums entiers d'un coup. Notre IA assure une sonie unifiée.",
      "feature_abc_title": "Multi-Tests A/B/C",
      "feature_abc_desc": "Prévisualisez 3 variations IA (Chaud, Équilibré, Punchy) en temps réel.",
      "feature_stem_title": "Mastering Stem IA",
      "feature_stem_desc": "Téléversez des stems individuels (Voix, Batterie, Basse) pour un équilibrage précis.",
      "finalize_download": "Finaliser & Télécharger"
    }
  },
  sw: {
    translation: {
      "app_name": "Afromaster",
      "hero_title": "Mastering, Imeundwa Upya kwa Utamaduni.",
      "hero_subtitle": "Kutoka kwa mchanganyiko wa kawaida hadi wimbo wa kimataifa. Injini ya mastering ya AI iliyofunzwa mahususi kwa Afrobeats, Amapiano, na Trap.",
      "start_mastering": "Anza Mastering Sasa",
      "hear_difference": "Sikia Tofauti",
      "feature_album_title": "Injini ya Uthabiti wa Albamu",
      "feature_abc_title": "Majaribio ya A/B/C",
      "feature_stem_title": "Mastering ya Stem za AI",
      "finalize_download": "Kamilisha & Pakua"
    }
  },
  yo: {
    translation: {
      "app_name": "Afromaster",
      "hero_title": "Mastering, Àtúntò fún Àṣà wa.",
      "hero_subtitle": "Lati orin lásán sí orin àgbáyé. Ẹ̀rọ AI mastering tí a kọ́ fún Afrobeats, Amapiano, àti Trap.",
      "start_mastering": "Bẹ̀rẹ̀ Mastering Nísinsìnyí",
      "hear_difference": "Gbọ́ Ìyàtọ̀",
      "finalize_download": "Parí & Gba Orin Rẹ"
    }
  },
  ig: {
    translation: {
      "app_name": "Afromaster",
      "hero_title": "Mastering, Atụgharịrị maka Omenala.",
      "hero_subtitle": "Site na mix dị mfe gaa na egwu ụwa. Igwe AI mastering a zụrụ maka Afrobeats, Amapiano, na Trap.",
      "start_mastering": "Malite Mastering Ugbu a",
      "hear_difference": "Nụrụ Ihe Dị Iche",
      "finalize_download": "Mechaa & Budata"
    }
  },
  pt: {
    translation: {
      "app_name": "Afromaster",
      "hero_title": "Masterização, Reinventada para a Cultura.",
      "hero_subtitle": "De uma mistura simples a um sucesso global. O motor de masterização IA treinado especificamente para Afrobeats, Amapiano e Trap.",
      "start_mastering": "Começar Masterização",
      "hear_difference": "Ouva a Diferença",
      "finalize_download": "Finalizar e Descarregar"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;