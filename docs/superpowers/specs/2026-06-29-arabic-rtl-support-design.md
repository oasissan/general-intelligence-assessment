# Design: Add Arabic (RTL) Language Support

**Date:** 2026-06-29
**Status:** Approved

## Goal

Add Arabic as a sixth supported locale to the General Intelligence Assessment app,
with full right-to-left (RTL) layout support and genuine Arabic test content.

## Background

The app currently supports 5 locales (`en`, `pl`, `es`, `it`, `fr`), all left-to-right.
Locale wiring lives in:

- `astro.config.mjs` — `i18n.locales` array
- `src/i18n.ts` — `LOCALES`, `DEFAULT_LOCALE`, `SWITCH_LOCALE_LABELS`, and the `ui`
  translation table (~25 namespaces, every key has one value per locale)
- `src/testData.ts` — `getTestData(locale)` switch returning Words + Reasoning data
- `src/components/TestApp/Words/data-{locale}.ts` and
  `src/components/TestApp/Reasoning/data-{locale}.ts` — per-locale question pools
- `public/flags/{locale}.svg` — flag icon shown in the locale switcher
- `src/layouts/Layout.astro` — sets `<html lang>` and renders the switcher/footer

Arabic adds two things the existing locales never needed: **RTL layout** and
**non-Latin test content with gendered comparative grammar**.

## Decisions (confirmed with user)

1. **Full RTL** layout support (not translation-only).
2. **Author genuine Arabic** test content — a solid, grammatically correct subset
   rather than a 1:1 machine translation of every English row.
3. **Saudi Arabia flag** for the locale switcher.

## Design

### 1. Locale registration

- Add `"ar"` to `LOCALES` in `src/i18n.ts` and to `i18n.locales` in `astro.config.mjs`.
- Add an `ar` entry to `SWITCH_LOCALE_LABELS`: `"التبديل إلى العربية"`.
- Add `public/flags/ar.svg` (Saudi Arabia flag, sized/styled like the existing flags).
- The `Locale` union derives from `LOCALES`, so adding `"ar"` makes the compiler flag
  the missing `ar` case in `getTestData`'s `switch` via its `assertNever(locale)` default.
  This is the built-in safety net guaranteeing we wire up the data.

### 2. RTL layout

- Add an `isRtl(locale: Locale): boolean` helper (and a `RTL_LOCALES` set containing
  only `"ar"` for now) to `src/i18n.ts`, so future RTL locales are a one-line addition.
- In `Layout.astro`, render `<html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>`.
- Audit physical-direction styles and switch to direction-agnostic equivalents where
  mirroring is required:
  - Locale-switcher header (`justify-end`), footer alignment, and any `text-justify`
    / left/right margins or paddings.
  - Prefer logical utilities (`ms-`/`me-`, `ps-`/`pe-`, `text-start`/`text-end`).
    Centered and symmetric layouts need no change.
- **Keep LTR islands for character-comparison content.** The Perceptual (letter pairs),
  Numbers (digit strings), and Spatial (shape characters: R, P, N, G, F) tests display
  Latin/numeric strings that must not be reversed by the RTL context. Their display
  containers get an explicit `dir="ltr"`. Their surrounding UI (intro, question prompt,
  buttons) stays RTL via the translated strings.

### 3. Arabic translations

Add an `ar` value to **every** entry in the `ui` table in `src/i18n.ts`, across all
namespaces: `home`, `main-test-screen`, `test-selector`, `test-names`, `test-intro`,
`reasoning`, `perceptual`, `numbers`, `words-meaning`, `spatial-visualization`,
`results-history`, `charts`, `layout`. No key may be left without an `ar` value
(per the project's "update all locales together" rule).

### 4. Test content (`data-ar.ts`)

- **Words** — `src/components/TestApp/Words/data-ar.ts`: native Arabic synonym/category
  groups (`WordsMeaningData = string[][]`). Author a solid subset (~30–40 groups) of
  genuine Arabic word families (nouns/adjectives/verbs sharing meaning), not transliterations.
- **Reasoning** — `src/components/TestApp/Reasoning/data-ar.ts`: a `ReasoningData` object with:
  - `names`: common Arabic given names.
  - `comparisons`: comparative pairs that stay grammatically valid in Arabic, following
    the same `{ s: [[pos, pos],[neg, neg]], q: [[pos, pos],[neg, neg]] }` shape, e.g.
    statement forms like `أقوى من` / `ليس بنفس قوة` and question forms like `الأقوى`.
    Author a correct subset rather than force-translating all 60+ English rows.
  - `question`: the stem, `"من هو"`.
- Wire both into the new `case "ar":` branch of `getTestData` in `src/testData.ts`.

The Reasoning sentence is assembled in `Reasoning.tsx` as
`` `${name1} ${phrase} ${name2}.` `` and `` `${questionStart} ${qphrase}?` ``.
The Arabic phrases are authored so this concatenation reads correctly; no change to the
generation logic is required.

### 5. Verification

1. `npm run build` — runs `astro check`; the type system guarantees no missing locale
   case and no untyped translation keys.
2. `npm run dev` — switch to Arabic and confirm:
   - The page flips to RTL (`dir="rtl"`), header switcher and footer mirror correctly.
   - All 5 tests start and run.
   - Perceptual letter-pairs, Numbers digit strings, and Spatial characters render
     left-to-right and unreversed.
   - No console errors.

## Out of Scope

- Translating Perceptual/Numbers/Spatial **content** (they are character-based; only
  their UI strings are translated).
- Full 1:1 parity of every English Words/Reasoning row.
- Adding RTL locales other than Arabic.
