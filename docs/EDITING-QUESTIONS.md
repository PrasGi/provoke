# Editing Questions

`src/data/questions.csv` is the source of truth for all question, hint, and perspective content. Do not hardcode prompt text in TypeScript or React files.

## CSV Schema

Every row must include these columns in this order:

```csv
qid,category_id,level,q_en,hint_en,persp_en,q_id,hint_id,persp_id
```

| Column        | Description                                                      |
| ------------- | ---------------------------------------------------------------- |
| `qid`         | Stable unique question ID.                                       |
| `category_id` | One of the 21 locked category IDs from `src/data/categories.ts`. |
| `level`       | Difficulty level supported by the app.                           |
| `q_en`        | English question text.                                           |
| `hint_en`     | English hint text.                                               |
| `persp_en`    | English perspective/reframe text.                                |
| `q_id`        | Indonesian question text.                                        |
| `hint_id`     | Indonesian hint text.                                            |
| `persp_id`    | Indonesian perspective/reframe text.                             |

## Row Rules

- Use one row per question.
- Keep `qid` stable after publication so saved sessions and seen-card tracking remain valid.
- Make `qid` descriptive and deterministic, for example: `career_easy_001` or `relationships_hard_004`.
- Keep the English and Indonesian versions semantically equivalent, not necessarily word-for-word literal.
- Fill every language field; empty strings are rejected by validation.
- Keep the category and level aligned with the actual prompt difficulty.
- Do not add extra columns unless the parser and generated question type are updated together.

## Escaping Text

- Wrap fields in double quotes when the text contains commas, quotes, or line breaks.
- Escape a literal quote inside a quoted field by doubling it: `""`.
- Prefer concise prompt copy; long multi-paragraph fields make cards harder to read on mobile.

Example:

```csv
qid,category_id,level,q_en,hint_en,persp_en,q_id,hint_id,persp_id
identity_easy_001,identity,easy,"What label do you wear that no longer fits?","Think about roles, titles, or expectations.","A label can be useful without being permanent.","Label apa yang kamu pakai tapi sudah tidak cocok?","Pikirkan peran, gelar, atau ekspektasi.","Sebuah label bisa berguna tanpa harus permanen."
```

## Validation and Generation

Validate after editing:

```bash
bun run csv:validate
```

Regenerate typed content:

```bash
bun run prebuild
```

`prebuild` writes `src/data/questions.generated.ts`. Keep that generated file committed because the app is deployed as a static site with no runtime content API.

## Expansion Checklist

Before adding a large batch of prompts:

1. Confirm every category has at least one row for each supported level.
2. Confirm `qid` values are unique.
3. Run `bun run csv:validate`.
4. Run `bun run prebuild`.
5. Run the test suite with `bunx vitest run` or `bun test`.
