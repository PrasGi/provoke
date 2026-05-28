import { readFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { z } from 'zod';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CATEGORY_IDS = [
  'ethics',
  'philosophy',
  'politics',
  'technology',
  'law',
  'social',
  'economy',
  'life',
  'identity',
  'relationship',
  'education',
  'career',
  'environment',
  'religion',
  'psychology',
  'science',
  'power',
  'future',
  'paradox',
  'local',
  'popculture',
];

const QuestionRowSchema = z.object({
  qid: z.string().min(1),
  category_id: z.enum(CATEGORY_IDS),
  level: z.enum(['easy', 'medium', 'hard']),
  q_en: z.string().min(1),
  hint_en: z.string().optional().default(''),
  persp_en: z.string().min(1),
  q_id: z.string().min(1),
  hint_id: z.string().optional().default(''),
  persp_id: z.string().min(1),
});

const csvPath = resolve(ROOT, 'src/data/questions.csv');
const raw = readFileSync(csvPath, 'utf-8');
const { data, errors } = Papa.parse(raw, {
  header: true,
  skipEmptyLines: true,
});

if (errors.length > 0) {
  console.error('CSV parse errors:', errors);
  process.exit(1);
}

const qids = new Set();

for (let i = 0; i < data.length; i += 1) {
  const row = data[i];
  const result = QuestionRowSchema.safeParse(row);

  if (!result.success) {
    console.error(`Row ${i + 2}: validation failed:`);
    console.error(result.error.issues);
    process.exit(1);
  }

  const { qid } = result.data;
  if (qids.has(qid)) {
    console.error(`Duplicate qid: "${qid}" at row ${i + 2}`);
    process.exit(1);
  }

  qids.add(qid);
}

process.stdout.write(`CSV validation passed: ${qids.size} questions\n`);
