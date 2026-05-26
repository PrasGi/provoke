import type { CategoryId } from '../types/category';

export interface CategoryDef {
  id: CategoryId;
  label_id: string;
  label_en: string;
  description_id: string;
  description_en: string;
}

export const CATEGORIES: readonly CategoryDef[] = [
  { id: 'ethics', label_id: 'Etika', label_en: 'Ethics', description_id: 'Benar vs salah, niat vs dampak, dilema moral', description_en: 'Right vs wrong, intent vs impact, moral dilemmas' },
  { id: 'philosophy', label_id: 'Filsafat', label_en: 'Philosophy', description_id: 'Pertanyaan mendasar tentang eksistensi, pengetahuan, dan realitas', description_en: 'Fundamental questions about existence, knowledge, and reality' },
  { id: 'politics', label_id: 'Politik', label_en: 'Politics', description_id: 'Kekuasaan, pemerintahan, kebijakan, dan demokrasi', description_en: 'Power, governance, policy, and democracy' },
  { id: 'technology', label_id: 'Teknologi', label_en: 'Technology', description_id: 'Inovasi, dampak digital, AI, dan masa depan manusia', description_en: 'Innovation, digital impact, AI, and the human future' },
  { id: 'law', label_id: 'Hukum', label_en: 'Law', description_id: 'Keadilan, sistem hukum, hak, dan kewajiban', description_en: 'Justice, legal systems, rights, and obligations' },
  { id: 'social', label_id: 'Sosial', label_en: 'Social', description_id: 'Norma, komunitas, interaksi, dan perubahan sosial', description_en: 'Norms, community, interaction, and social change' },
  { id: 'economy', label_id: 'Ekonomi', label_en: 'Economy', description_id: 'Uang, pasar, ketimpangan, dan sistem ekonomi', description_en: 'Money, markets, inequality, and economic systems' },
  { id: 'life', label_id: 'Kehidupan', label_en: 'Life', description_id: 'Makna hidup, pilihan, kebahagiaan, dan tujuan', description_en: 'Meaning of life, choices, happiness, and purpose' },
  { id: 'identity', label_id: 'Identitas', label_en: 'Identity', description_id: 'Siapa kita, budaya, gender, dan jati diri', description_en: 'Who we are, culture, gender, and selfhood' },
  { id: 'relationship', label_id: 'Hubungan', label_en: 'Relationship', description_id: 'Cinta, persahabatan, keluarga, dan koneksi manusia', description_en: 'Love, friendship, family, and human connection' },
  { id: 'education', label_id: 'Pendidikan', label_en: 'Education', description_id: 'Belajar, sistem pendidikan, dan pengembangan diri', description_en: 'Learning, educational systems, and self-development' },
  { id: 'career', label_id: 'Karier', label_en: 'Career', description_id: 'Pekerjaan, ambisi, keseimbangan hidup, dan kesuksesan', description_en: 'Work, ambition, work-life balance, and success' },
  { id: 'environment', label_id: 'Lingkungan', label_en: 'Environment', description_id: 'Alam, perubahan iklim, keberlanjutan, dan tanggung jawab', description_en: 'Nature, climate change, sustainability, and responsibility' },
  { id: 'religion', label_id: 'Agama', label_en: 'Religion', description_id: 'Kepercayaan, spiritualitas, dan peran agama dalam masyarakat', description_en: 'Belief, spirituality, and the role of religion in society' },
  { id: 'psychology', label_id: 'Psikologi', label_en: 'Psychology', description_id: 'Pikiran, perilaku, trauma, dan kesehatan mental', description_en: 'Mind, behavior, trauma, and mental health' },
  { id: 'science', label_id: 'Sains', label_en: 'Science', description_id: 'Metode ilmiah, penemuan, dan batas pengetahuan', description_en: 'Scientific method, discovery, and the limits of knowledge' },
  { id: 'power', label_id: 'Kekuasaan', label_en: 'Power', description_id: 'Otoritas, kontrol, pengaruh, dan penyalahgunaan kekuasaan', description_en: 'Authority, control, influence, and abuse of power' },
  { id: 'future', label_id: 'Masa Depan', label_en: 'Future', description_id: 'Prediksi, harapan, ketakutan, dan skenario masa depan', description_en: 'Predictions, hopes, fears, and future scenarios' },
  { id: 'paradox', label_id: 'Paradoks', label_en: 'Paradox', description_id: 'Kontradiksi, dilema tak terpecahkan, dan ironi kehidupan', description_en: "Contradictions, unsolvable dilemmas, and life's ironies" },
  { id: 'local', label_id: 'Lokal', label_en: 'Local', description_id: 'Isu Indonesia, budaya lokal, dan konteks nusantara', description_en: 'Indonesian issues, local culture, and archipelago context' },
  { id: 'popculture', label_id: 'Budaya Pop', label_en: 'Pop Culture', description_id: 'Media, hiburan, tren, dan pengaruh budaya populer', description_en: 'Media, entertainment, trends, and popular culture influence' },
] as const;

if (CATEGORIES.length !== 21) {
  throw new Error(`Expected 21 categories, got ${CATEGORIES.length}`);
}

const CATEGORY_BY_ID = new Map<CategoryId, CategoryDef>(CATEGORIES.map((category) => [category.id, category]));

export function getCategoryById(id: CategoryId): CategoryDef {
  const category = CATEGORY_BY_ID.get(id);
  if (!category) {
    throw new Error(`Unknown category id: ${id}`);
  }
  return category;
}
