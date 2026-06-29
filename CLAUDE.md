# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**General Intelligence Assessment (GIA)** — A practice test web app for the Thomas GIA cognitive ability assessment. Unofficial, personal project with 5 test types (Reasoning, Perceptual Speed, Numbers, Words, Spatial Visualization). Each test is 2 minutes max, scored with a penalty formula, and results are saved to localStorage with timestamps.

**Live:** https://oasissan.github.io/general-intelligence-assessment/

## Tech Stack

- **Framework:** Astro 5.6.1 (SSG + client-side React)
- **Interactivity:** React 18.3.1 (islands architecture)
- **Styling:** Tailwind CSS 3.4.10 + Radix UI components
- **Charts:** Recharts 2.12.7
- **i18n:** 6 locales (en, pl, es, it, fr, ar) — baked at build time. Arabic (ar) is right-to-left: `<html dir>` is set via `isRtl()` in `src/i18n.ts`, and the Perceptual/Numbers/Spatial tests wrap their character displays in `dir="ltr"`.
- **Type Safety:** TypeScript

## Common Commands

```bash
npm run dev              # Start dev server (localhost:3000)
npm run build           # Build + type check (astro check && astro build)
npm run preview         # Preview production build locally
```

## Architecture

### Data Flow

1. **Test Selection** → **Test Execution** → **Results Display** → **History**
   - User selects which tests to take (TestSelector)
   - Tests run sequentially in TestPerformer with 120-second timer per test
   - Results accumulate into a TestResults object
   - On completion, saved to localStorage as StoredSession { timestamp, results }
   - Results page computes statistics and displays trend chart

### localStorage Schema

**Key:** `"testResults"`  
**Format:** `StoredSession[]` (backward compatible with old plain `TestResults[]` format)

```typescript
type StoredSession = {
  timestamp: number;        // Date.now() when test completed
  results: TestResults;     // Per-test { numCorrect, numIncorrect }
};
```

### Scoring System

Each test has a penalty formula based on number of answer choices:

```typescript
score = numCorrect - numIncorrect * (1 / (numPossibleAnswers - 1))
```

- **Reasoning:** `score = correct - incorrect * 1` (2 choices)
- **Perceptual Speed:** `score = correct - incorrect * 0.25` (5 choices)
- **Numbers/Words/Spatial:** `score = correct - incorrect * 0.5` (3 choices)

### Internationalization

All UI text lives in `src/i18n.ts` as nested objects by namespace:
```typescript
ui = {
  "test-names": { [testName]: { en, pl, es, it, fr } },
  "results-history": { key: { en, pl, es, it, fr } },
  ...
};
```

Baked at build time: `bakeLocaleTranslations(locale)` creates a per-locale string map passed to React components. Use `useTranslations(namespace)` hook to access strings. **Always add new translation keys to all 5 locales simultaneously.**

### Key File Patterns

**Component Files:** `src/components/TestApp/`
- `TestApp.tsx` — Main orchestrator, phase state (select/test/results), localStorage integration
- `TestPerformer.tsx` — Sequences tests, aggregates results
- `TestContainer.tsx` — Wraps individual test with 120s timer, answer feedback
- `TestResults/TestsResults.tsx` — Renders stats & history chart, computes per-test stats
- `types.ts` — TestName enum, TestResults type, StoredSession type

**Data & Localization:**
- `src/i18n.ts` — All UI translations (5 locales)
- `src/testData.ts` — Loads test question pools by locale
- `src/components/TestApp/*/data-{locale}.ts` — Locale-specific data (words, names, etc.)

**Utilities:**
- `src/random.ts` — pickRandom, chooseRandom helpers for question generation
- `src/hooks/useLocalStorage.ts` — Generic localStorage persistence hook
- `src/contexts/TestDataContext.tsx` — Test data provider
- `src/contexts/TranslationsContext.tsx` — useTranslations() hook provider

## Key Patterns

### Question Generation

Each test dynamically generates questions from data pools. See test components for implementation:
- Questions are **randomly generated per session** from fixed question types
- Example: Reasoning uses template statements with random names and logical queries
- Example: Spatial Visualization uses random column rotations/mirrors

### Answer Tracking

Tests call `onCorrectAnswer()` / `onIncorrectAnswer()` callbacks during the test. TestPerformer accumulates these into `{ numCorrect, numIncorrect }` per test type, which becomes TestResults.

### localStorage Normalization

Old entries saved as plain `TestResults` objects (no timestamp field) are normalized by `normalizeSession()` helper when read. They get `timestamp: 0`, which displays as `—` in the UI. No data loss, backward compatible.

### Chart Configuration

Recharts chart is configured with:
- **Stacked areas** for numCorrect + numIncorrect (shows trends)
- **Line overlay** for score (not stacked, separate visual axis)
- Up to 50 historical attempts per test type shown

## GitHub Pages Deployment

Build process uses environment variable to detect GitHub Pages mode:

```bash
GITHUB_PAGES=true npm run build
```

This sets `site` and `base` paths for GitHub Pages subdirectory (`/general-intelligence-assessment`).

## Testing Changes

After modifying features:
1. `npm run build` — Verify no TypeScript errors
2. `npm run dev` — Test locally, complete a full test cycle
3. Check browser DevTools console for errors
4. For localStorage changes, test clearing history and old data migration

## Notes for Contributors

- **i18n:** Always update all 6 locales together (the `LocaleValues` type enforces this at build time). Use descriptive translation keys in kebab-case.
- **Types:** Keep TestResults, StoredSession, and TestName enum definitions in `src/components/TestApp/types.ts`.
- **Scoring:** Don't change penalty formulas without domain knowledge of Thomas GIA scoring.
- **Timer:** 120 seconds per test is hardcoded in TestContainer. Adjust if requirements change.
- **Stats Computation:** Computed in TestsResults.tsx useMemo. Best, average, accuracy, and attempt count are recalculated on every render from historical data — designed for small dataset sizes (<50 entries).
