# Arabic (RTL) Language Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Arabic as a sixth locale with full right-to-left layout and genuine Arabic test content.

**Architecture:** Arabic plugs into the existing baked-at-build-time i18n system. Because the `ui` translation table is typed `satisfies { [namespace]: { [key]: LocaleValues } }` where `LocaleValues` requires every locale, adding `"ar"` to `LOCALES` and adding every `ar` translation are type-coupled and must land in one commit. RTL is handled by a `dir` attribute on `<html>` driven by an `isRtl()` helper, plus targeted direction-agnostic class fixes; the three character-based tests (Perceptual/Numbers/Spatial) get `dir="ltr"` islands so Latin letters and digits don't render reversed.

**Tech Stack:** Astro 5.6, React 18, Tailwind CSS 3.4, TypeScript.

## Global Constraints

- **All locales together:** every key in the `ui` table in `src/i18n.ts` must have an `ar` value. The `satisfies LocaleValues` type guarantees the build fails if any is missing.
- **Verification is build + manual:** there is no unit-test runner. The gate is `npm run build` (runs `astro check` for type checking) plus manual `npm run dev` visual checks. There is no `npm test`.
- **Locale code:** `ar`. **RTL:** `dir="rtl"` for Arabic only.
- **Branch:** all work happens on `feat/arabic-rtl-support` (already checked out).
- **Commit trailer:** end every commit message with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
- **No new dependencies.**

---

### Task 1: Arabic test data files

Author standalone Arabic data modules for Words and Reasoning. They are not imported yet, so the build stays green.

**Files:**
- Create: `src/components/TestApp/Words/data-ar.ts`
- Create: `src/components/TestApp/Reasoning/data-ar.ts`

**Interfaces:**
- Consumes: `WordsMeaningData` (= `string[][]`) and `ReasoningData` from `src/components/TestApp/types.ts`. `ReasoningData = { names: string[]; comparisons: Array<{ s: [[string,string],[string,string]]; q: [[string,string],[string,string]] }>; question: string }`.
- Produces: default exports `wordsAr: WordsMeaningData` and `reasoningAr: ReasoningData`, consumed by Task 2's `testData.ts`.

**Notes on content:** Words groups must each have ≥4 entries (generation picks 2 from a "matching" group + 1 from an "odd" group). Reasoning uses masculine Arabic names + gender-invariant elative comparatives (`أفعل من`) so grammar stays correct; statement renders as `${name1} ${phrase} ${name2}.` and question as `من هو ${qphrase}؟`.

- [ ] **Step 1: Create `src/components/TestApp/Words/data-ar.ts`**

```ts
import type { WordsMeaningData } from "@components/TestApp/types";

export default [
  ["مفتاح ربط", "مفك", "مطرقة", "كمّاشة", "مثقاب"], // أدوات للأعمال الميكانيكية
  ["جميل", "فاتن", "رائع", "بديع", "ساحر"], // صفات تصف الجمال
  ["يطبخ", "يخبز", "يشوي", "يقلي", "يحمّر"], // طرق إعداد الطعام
  ["أسد", "نمر", "فهد", "وشق", "ليث"], // حيوانات مفترسة من فصيلة السنوريات
  ["لا يمكن التنبؤ به", "متقلّب", "متذبذب", "غير ثابت", "متغيّر"], // عدم الثبات
  ["بيانو", "كمان", "تشيلو", "قيثارة", "عود"], // آلات موسيقية وترية
  ["يقود", "يوجّه", "يرشد", "يدير", "يسيّر"], // التحكم في الحركة
  ["مهجور", "قاحل", "خالٍ", "موحش", "مقفر"], // الخلو من السكان
  ["طبيب", "ممرّض", "جرّاح", "مسعف", "معالج"], // مهن طبية
  ["ساطع", "لامع", "متوهّج", "مشعّ", "برّاق"], // الضوء القوي
  ["حاسوب لوحي", "حاسوب محمول", "هاتف ذكي", "حاسوب", "قارئ إلكتروني"], // أجهزة إلكترونية
  ["ينفّذ", "يؤدّي", "ينجز", "يحقّق", "يقدّم"], // تنفيذ المهام
  ["متحمّس", "شغوف", "متّقد", "متلهّف", "متوقّد"], // المشاعر القوية
  ["مهندس معماري", "بنّاء", "مهندس", "رسّام", "مصمّم"], // مهن البناء والتصميم
  ["عاصف", "هائج", "مضطرب", "متلاطم", "غير مستقر"], // الظروف المضطربة
  ["يناقش", "يحاور", "يجادل", "يتداول", "يفاوض"], // تبادل الأفكار
  ["هادئ", "ساكن", "وادع", "مطمئن", "رزين"], // الهدوء
  ["لوحة مفاتيح", "فأرة", "شاشة", "طابعة", "ماسح ضوئي"], // ملحقات الحاسوب
  ["يزعج", "يضايق", "يقلق", "يكدّر", "يهيّج"], // التسبب في الانزعاج
  ["عبقري", "ذكي", "نابغة", "بارع", "فطن"], // الذكاء العالي
  ["دراجة هوائية", "دراجة بخارية", "لوح تزلّج", "زلّاجات", "سكوتر"], // وسائل تنقّل شخصية
  ["يصمد", "يتحمّل", "ينجو", "يثابر", "يتغلّب"], // تحمّل التحديات
  ["غامض", "مبهم", "ملغز", "محيّر", "معمّى"], // صعوبة الفهم
  ["سترة", "معطف", "كنزة", "صدرية", "عباءة"], // ملابس خارجية
  ["يصرخ", "يصيح", "يزعق", "يهتف", "يعوي"], // التعبير الصوتي العالي
  ["قديم", "عتيق", "أثري", "موغل في القدم", "تليد"], // طول التاريخ
  ["نظام", "شبكة", "إطار", "هيكل", "بنية"], // مجموعات منظّمة
  ["فاخر", "فخم", "ثري", "باذخ", "مترف"], // الرفاهية والثراء
  ["يفكّر", "يتأمّل", "يتدبّر", "يمعن", "يتروّى"], // التفكير والتدبّر
  ["سعيد", "مبتهج", "مسرور", "فرِح", "منشرح"], // السعادة
] satisfies WordsMeaningData;
```

- [ ] **Step 2: Create `src/components/TestApp/Reasoning/data-ar.ts`**

```ts
import type { ReasoningData } from "@components/TestApp/types";

const names = [
  "أحمد",
  "محمد",
  "خالد",
  "عمر",
  "علي",
  "حسن",
  "يوسف",
  "إبراهيم",
  "سعيد",
  "طارق",
  "ماجد",
  "فهد",
  "سلطان",
  "ناصر",
  "بدر",
  "زياد",
  "رامي",
  "سامي",
  "كريم",
  "وليد",
  "هشام",
  "أنس",
  "باسم",
  "فادي",
  "جمال",
  "رشيد",
  "نبيل",
  "عماد",
  "غسان",
  "مازن",
];

const comparisons = [
  {
    s: [
      ["أقوى من", "ليس ضعيفًا مثل"],
      ["أضعف من", "ليس قويًا مثل"],
    ],
    q: [
      ["الأقوى", "الأقل ضعفًا"],
      ["الأضعف", "الأقل قوةً"],
    ],
  },
  {
    s: [
      ["أذكى من", "ليس غبيًا مثل"],
      ["أغبى من", "ليس ذكيًا مثل"],
    ],
    q: [
      ["الأذكى", "الأقل غباءً"],
      ["الأغبى", "الأقل ذكاءً"],
    ],
  },
  {
    s: [
      ["أطول من", "ليس قصيرًا مثل"],
      ["أقصر من", "ليس طويلًا مثل"],
    ],
    q: [
      ["الأطول", "الأقل قِصرًا"],
      ["الأقصر", "الأقل طولًا"],
    ],
  },
  {
    s: [
      ["أشجع من", "ليس جبانًا مثل"],
      ["أجبن من", "ليس شجاعًا مثل"],
    ],
    q: [
      ["الأشجع", "الأقل جبنًا"],
      ["الأجبن", "الأقل شجاعةً"],
    ],
  },
  {
    s: [
      ["ألطف من", "ليس قاسيًا مثل"],
      ["أقسى من", "ليس لطيفًا مثل"],
    ],
    q: [
      ["الألطف", "الأقل قسوةً"],
      ["الأقسى", "الأقل لطفًا"],
    ],
  },
  {
    s: [
      ["أسرع من", "ليس بطيئًا مثل"],
      ["أبطأ من", "ليس سريعًا مثل"],
    ],
    q: [
      ["الأسرع", "الأقل بطئًا"],
      ["الأبطأ", "الأقل سرعةً"],
    ],
  },
  {
    s: [
      ["أكرم من", "ليس بخيلًا مثل"],
      ["أبخل من", "ليس كريمًا مثل"],
    ],
    q: [
      ["الأكرم", "الأقل بخلًا"],
      ["الأبخل", "الأقل كرمًا"],
    ],
  },
  {
    s: [
      ["أغنى من", "ليس فقيرًا مثل"],
      ["أفقر من", "ليس غنيًا مثل"],
    ],
    q: [
      ["الأغنى", "الأقل فقرًا"],
      ["الأفقر", "الأقل غنىً"],
    ],
  },
  {
    s: [
      ["أوسم من", "ليس قبيحًا مثل"],
      ["أقبح من", "ليس وسيمًا مثل"],
    ],
    q: [
      ["الأوسم", "الأقل قبحًا"],
      ["الأقبح", "الأقل وسامةً"],
    ],
  },
  {
    s: [
      ["أهدأ من", "ليس متوترًا مثل"],
      ["أكثر توترًا من", "ليس هادئًا مثل"],
    ],
    q: [
      ["الأهدأ", "الأقل توترًا"],
      ["الأكثر توترًا", "الأقل هدوءًا"],
    ],
  },
  {
    s: [
      ["أكثر صبرًا من", "ليس عجولًا مثل"],
      ["أكثر عجلةً من", "ليس صبورًا مثل"],
    ],
    q: [
      ["الأكثر صبرًا", "الأقل عجلةً"],
      ["الأكثر عجلةً", "الأقل صبرًا"],
    ],
  },
  {
    s: [
      ["أكثر اجتهادًا من", "ليس كسولًا مثل"],
      ["أكسل من", "ليس مجتهدًا مثل"],
    ],
    q: [
      ["الأكثر اجتهادًا", "الأقل كسلًا"],
      ["الأكسل", "الأقل اجتهادًا"],
    ],
  },
  {
    s: [
      ["أصدق من", "ليس كاذبًا مثل"],
      ["أكذب من", "ليس صادقًا مثل"],
    ],
    q: [
      ["الأصدق", "الأقل كذبًا"],
      ["الأكذب", "الأقل صدقًا"],
    ],
  },
  {
    s: [
      ["أكثر تواضعًا من", "ليس متكبرًا مثل"],
      ["أكثر تكبرًا من", "ليس متواضعًا مثل"],
    ],
    q: [
      ["الأكثر تواضعًا", "الأقل تكبرًا"],
      ["الأكثر تكبرًا", "الأقل تواضعًا"],
    ],
  },
] satisfies ReasoningData["comparisons"];

export default {
  names,
  comparisons,
  question: "من هو",
} satisfies ReasoningData;
```

- [ ] **Step 3: Verify the build still passes**

Run: `npm run build`
Expected: build succeeds (the new files are valid TypeScript and not yet imported; `astro check` reports 0 errors).

- [ ] **Step 4: Commit**

```bash
git add src/components/TestApp/Words/data-ar.ts src/components/TestApp/Reasoning/data-ar.ts
git commit -m "feat: add Arabic test data for Words and Reasoning

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 2: Register the Arabic locale and translations

The type-coupled core change: add `"ar"` to `LOCALES`, add every `ar` UI translation, the switch label, the RTL helper, the `testData` case, and the flag — all in one commit so the build is green.

**Files:**
- Modify: `astro.config.mjs` (i18n.locales array)
- Modify: `src/i18n.ts` (LOCALES, SWITCH_LOCALE_LABELS, new RTL_LOCALES + isRtl, all `ui` ar values)
- Modify: `src/testData.ts` (import data-ar files, add `case "ar"`)
- Create: `public/flags/ar.svg`

**Interfaces:**
- Consumes: `wordsAr` / `reasoningAr` default exports from Task 1.
- Produces: `isRtl(locale: Locale): boolean` and `RTL_LOCALES` exported from `src/i18n.ts`, consumed by Task 3's `Layout.astro`. `Locale` union now includes `"ar"`.

- [ ] **Step 1: Add `"ar"` to the locale lists (this intentionally breaks the build first)**

In `astro.config.mjs`, change the locales array:

```js
  i18n: {
    defaultLocale: "en",
    locales: ["en", "pl", "es", "it", "fr", "ar"],
  },
```

In `src/i18n.ts`, change line 3:

```ts
export const LOCALES = ["en", "pl", "es", "it", "fr", "ar"] as const;
```

- [ ] **Step 2: Run the build to see it fail, listing every missing `ar`**

Run: `npm run build`
Expected: FAIL. `astro check` reports type errors — `SWITCH_LOCALE_LABELS` and every `ui` entry are missing the `ar` property (because `LocaleValues` now requires it), and `getTestData` is missing a `case "ar"` (the `assertNever(locale)` default no longer type-checks). These errors are the checklist for the remaining steps.

- [ ] **Step 3: Add the switch label and RTL helper in `src/i18n.ts`**

Add `ar` to `SWITCH_LOCALE_LABELS` (after the `fr` line, ~line 16):

```ts
export const SWITCH_LOCALE_LABELS = {
  en: "Switch to English",
  pl: "Zmień na polski",
  es: "Cambiar a español",
  it: "Passa all'italiano",
  fr: "Passer en français",
  ar: "التبديل إلى العربية",
} as const satisfies LocaleValues;
```

Add the RTL helper right after the `getLocale` function (after ~line 26):

```ts
export const RTL_LOCALES = new Set<Locale>(["ar"]);

export function isRtl(locale: Locale): boolean {
  return RTL_LOCALES.has(locale);
}
```

- [ ] **Step 4: Add every `ar` translation in the `ui` table of `src/i18n.ts`**

Add an `ar` line to each entry. The complete set, by namespace/key:

```
home.title:            "تقييم الذكاء العام"
home.intro-1:          "كجزء من عملية التقدّم لوظيفة، طُلب مني إكمال "
home.intro-2:          "اختبار Thomas GIA"
home.intro-3:          ". وبما أنني لم أجد أي مواد تدريبية مناسبة، قررت إنشاء تطبيق ويب بسيط لاختبار نفسي قبل الاختبار الحقيقي."
home.disclaimer-1:     "لست مرتبطًا بأي شكل من الأشكال بشركة Thomas International. هذا مشروع شخصي. لا أملك صلاحية الوصول إلى أسئلة الاختبار الحقيقية. ولا أقدّم أي ضمان بأن الأسئلة في هذا التطبيق مشابهة للاختبار الحقيقي."
home.disclaimer-2:     "لا يزال التطبيق قيد التطوير. وقد يتغيّر أي جزء منه في أي وقت. وقد تفقد سجل نتائجك."
home.cta:              "لنبدأ"
main-test-screen.see-results-history: "عرض سجل النتائج"
test-selector.title:        "اختر الاختبارات التي تريد إجراءها"
test-selector.select-all:   "تحديد الكل"
test-selector.show-feedback:"إظهار تقييم الإجابة (بالألوان)"
test-selector.start:        "ابدأ الاختبارات"
test-names.[REASONING]:           "الاستدلال المنطقي"
test-names.[PERCEPTUAL_SPEED]:    "السرعة الإدراكية"
test-names.[NUMBERS_SPEED_AND_ACCURACY]: "السرعة والدقة العددية"
test-names.[WORDS_MEANING]:       "معاني الكلمات"
test-names.[SPATIAL_VISUALIZATION]: "التصوّر المكاني"
test-intro.cta:        "أنا مستعد"
reasoning.intro:       "في هذا الاختبار، ستُعرض عليك عبارة وسؤال. تقارن العبارة بين اسمين، ويطلب منك السؤال تحديد الاسم الذي ينطبق عليه الوصف."
reasoning.cta:         "أظهر السؤال"
perceptual.intro:      "في هذا الاختبار، ستُعرض عليك أربعة أعمدة من الحروف. مهمتك هي تحديد عدد الأعمدة التي تحتوي على الحرف نفسه."
perceptual.question:   "كم عددًا من الأعمدة يحتوي على الحرف نفسه؟"
numbers.intro:         "في هذا الاختبار، ستُعرض عليك ثلاثة أرقام. مهمتك هي تحديد الرقم الأبعد عن الوسيط."
numbers.question:      "أي رقم هو الأبعد عن الوسيط؟"
words-meaning.intro:   "في هذا الاختبار، ستُعرض عليك ثلاث كلمات. مهمتك هي تحديد الكلمة التي لا تنتمي إلى المجموعة."
words-meaning.question:"أي كلمة لا تنتمي إلى المجموعة؟"
spatial-visualization.intro:        "في هذا الاختبار، ستُعرض عليك شبكة من الحروف. مهمتك هي تحديد عدد المربعات التي تحتوي على الحرف نفسه. تُعتبر الحروف المُدوّرة متماثلة، أما الحروف المعكوسة (المرآة) فلا."
spatial-visualization.question:     "كم مربعًا يحتوي على الحرف نفسه؟"
spatial-visualization.description:  "تُعتبر الحروف المُدوّرة متماثلة، أما الحروف المعكوسة (المرآة) فلا."
spatial-visualization.select-characters: "اختر الحروف التي تريد عرضها:"
results-history.no-results:   "لا توجد نتائج بعد"
results-history.retake:       "إعادة الاختبارات"
results-history.clear-history:"مسح سجل النتائج"
results-history.best:         "الأفضل"
results-history.average:      "المتوسط"
results-history.attempts:     "المحاولات"
results-history.accuracy:     "الدقة"
results-history.last-attempt: "الأخيرة"
results-history.avg-time:     "متوسط الزمن/سؤال"
charts.correct:        "صحيحة"
charts.incorrect:      "خاطئة"
charts.score:          "النتيجة"
layout.made-by:        "صُنع بواسطة"
```

For each entry, insert the `ar` line after the existing `fr` line, e.g. the `home.title` entry becomes:

```ts
    title: {
      en: "General Intelligence Assessment",
      pl: "Ocena Inteligencji Ogólnej",
      es: "Prueba General de Inteligencia",
      it: "Valutazione dell'intelligenza generale",
      fr: "Évaluation de l'intelligence générale",
      ar: "تقييم الذكاء العام",
    },
```

- [ ] **Step 5: Wire the Arabic data into `src/testData.ts`**

Add imports after the existing `reasoningFr` import (~line 14):

```ts
import wordsAr from "@components/TestApp/Words/data-ar";
import reasoningAr from "@components/TestApp/Reasoning/data-ar";
```

Add the case before the `default:` branch in the `switch`:

```ts
    case "ar":
      return {
        [TestName.WORDS_MEANING]: wordsAr,
        [TestName.REASONING]: reasoningAr,
      };
```

- [ ] **Step 6: Add the Saudi Arabia flag at `public/flags/ar.svg`**

Download the flagpack Saudi Arabia flag (same source/style as the other flags) into `public/flags/ar.svg`:

```bash
curl -sL "https://api.iconify.design/flagpack/sa.svg" -o public/flags/ar.svg
head -c 60 public/flags/ar.svg
```

Expected: the file begins with `<svg`. If the Iconify request fails or returns non-SVG, source any public-domain Saudi Arabia flag SVG and save it to the same path (the `Flag.astro` component renders it as a `background-image`, so any valid SVG works).

- [ ] **Step 7: Run the build to verify it now passes**

Run: `npm run build`
Expected: PASS. `astro check` reports 0 errors — all `ar` values present, the switch is exhaustive, and the routes for `/ar/` are generated.

- [ ] **Step 8: Commit**

```bash
git add astro.config.mjs src/i18n.ts src/testData.ts public/flags/ar.svg
git commit -m "feat: register Arabic locale with translations and flag

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 3: RTL layout

Drive `dir` from the locale and fix the one physical-direction position class so the layout mirrors correctly for Arabic without changing the LTR locales.

**Files:**
- Modify: `src/layouts/Layout.astro`

**Interfaces:**
- Consumes: `isRtl` from `src/i18n.ts` (Task 2).

- [ ] **Step 1: Import `isRtl` and set `dir` on `<html>`**

In `src/layouts/Layout.astro`, add `isRtl` to the existing import from `@/i18n` (the block at lines 2–8):

```ts
import {
  delocalizePath,
  getLocale,
  isRtl,
  LOCALES,
  SWITCH_LOCALE_LABELS,
  i18n,
} from "@/i18n";
```

Change the `<html>` tag (line 33):

```astro
<html lang={locale} dir={isRtl(locale) ? "rtl" : "ltr"}>
```

- [ ] **Step 2: Make the locale-switcher header position direction-agnostic**

In `src/layouts/Layout.astro` line 58, change `right-0` to the logical `end-0` so the switcher sits top-right in LTR and top-left in RTL:

```astro
    <header class="end-0 top-0 p-4 md:absolute">
```

Leave `justify-end` (line 59) unchanged — `justify-content: flex-end` already follows the writing direction. `text-justify` paragraphs (Home, test intros) are also already direction-aware and need no change.

- [ ] **Step 3: Verify the build passes**

Run: `npm run build`
Expected: PASS, 0 errors.

- [ ] **Step 4: Manual RTL check**

Run: `npm run dev`, then open `http://localhost:3000/ar/`.
Expected:
- The page renders right-to-left: heading and paragraphs align to the right, text is Arabic.
- The flag switcher sits at the top-**left** of the viewport (mirrored from the LTR top-right) and switching to another locale flips the layout back to LTR.
- No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat: enable RTL layout for Arabic locale

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 4: LTR islands for character-based tests

Perceptual (Latin letters), Numbers (digits) and Spatial (R/P/N/G/F letters) display sequences that must read left-to-right even inside the RTL page. Add `dir="ltr"` to their display and answer-button containers. Their Arabic question titles stay RTL.

**Files:**
- Modify: `src/components/TestApp/Perceptual.tsx`
- Modify: `src/components/TestApp/Numbers.tsx`
- Modify: `src/components/TestApp/Spatial.tsx`

- [ ] **Step 1: Perceptual — letters and count buttons LTR**

In `src/components/TestApp/Perceptual.tsx`, add `dir="ltr"` to the letter `CardContent` and the answer `CardFooter`:

```tsx
      <CardContent dir="ltr" className="flex justify-center gap-4 text-2xl md:gap-6">
```

```tsx
      <CardFooter dir="ltr" className="flex flex-wrap justify-center gap-2">
```

- [ ] **Step 2: Numbers — answer buttons LTR**

In `src/components/TestApp/Numbers.tsx`, add `dir="ltr"` to the number `CardFooter`:

```tsx
      <CardFooter dir="ltr" className="flex flex-wrap justify-center gap-4">
```

- [ ] **Step 3: Spatial — letter grid and count buttons LTR**

In `src/components/TestApp/Spatial.tsx`, add `dir="ltr"` to the letter-grid `CardContent` and the answer `CardFooter`:

```tsx
      <CardContent dir="ltr" className="flex justify-center gap-6 text-2xl">
```

```tsx
      <CardFooter dir="ltr" className="flex flex-wrap justify-center gap-4">
```

- [ ] **Step 4: Verify the build passes**

Run: `npm run build`
Expected: PASS, 0 errors.

- [ ] **Step 5: Manual check of the three tests in Arabic**

Run: `npm run dev`, open `http://localhost:3000/ar/test`, select all tests, start, and step through:
Expected:
- Perceptual: the four letter columns read left-to-right; count buttons 0–4 ascend left-to-right; the question title above is Arabic and right-aligned.
- Numbers: the three number buttons ascend/read left-to-right; question title Arabic.
- Spatial: the letter boxes read left-to-right; count buttons ascend left-to-right; rotation/mirror transforms still render; question title Arabic.
- Reasoning and Words: statements, questions and answer buttons are Arabic and read right-to-left.
- No console errors through a full 2-minute cycle into the results screen.

- [ ] **Step 6: Commit**

```bash
git add src/components/TestApp/Perceptual.tsx src/components/TestApp/Numbers.tsx src/components/TestApp/Spatial.tsx
git commit -m "feat: keep character-based test content LTR within RTL layout

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

### Task 5: Final verification and docs

Confirm nothing regressed for the existing locales and update the project docs to reflect six locales + RTL.

**Files:**
- Modify: `CLAUDE.md`

- [ ] **Step 1: Full production build (GitHub Pages mode, as deployed)**

Run: `GITHUB_PAGES=true npm run build`
Expected: PASS, 0 errors; output includes generated `/ar/` and `/ar/test/` pages alongside the other locales.

- [ ] **Step 2: Regression check of an existing locale**

Run: `npm run dev`, open `http://localhost:3000/` (English) and `http://localhost:3000/fr/`.
Expected: both still render left-to-right, switcher at top-right, all tests work — i.e. the RTL changes did not affect LTR locales.

- [ ] **Step 3: Update `CLAUDE.md` locale references**

In `CLAUDE.md`, update the i18n description to include Arabic and RTL. Change the Project Overview/i18n lines that say `5 locales (en, pl, es, it, fr)` to:

```
- **i18n:** 6 locales (en, pl, es, it, fr, ar) — baked at build time. Arabic (ar) is right-to-left: `<html dir>` is set via `isRtl()` in `src/i18n.ts`, and the Perceptual/Numbers/Spatial tests wrap their character displays in `dir="ltr"`.
```

Also update the "Notes for Contributors" i18n bullet from "Always update all 5 locales together" to "Always update all 6 locales together (the `LocaleValues` type enforces this at build time)."

- [ ] **Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: note Arabic locale and RTL support in CLAUDE.md

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Self-Review

**Spec coverage:**
- Locale registration (LOCALES, config, switch label, flag) → Task 2. ✅
- RTL helper + `dir` + class audit → Tasks 2 (helper) + 3 (layout). ✅
- Arabic UI translations (all namespaces) → Task 2, Step 4 (every key enumerated). ✅
- Arabic Words + Reasoning content → Task 1. ✅
- LTR islands for Perceptual/Numbers/Spatial → Task 4. ✅
- Verification (build + manual + GitHub Pages mode) → Tasks 3–5. ✅
- Out-of-scope items (no Perceptual/Numbers/Spatial content translation, no full English parity, Arabic only) respected. ✅

**Placeholder scan:** No TBD/TODO; all Arabic strings, the flag command, and every file path/line are concrete. ✅

**Type consistency:** `isRtl(locale: Locale): boolean` and `RTL_LOCALES` defined in Task 2, consumed in Task 3 with matching names. `wordsAr`/`reasoningAr` default exports (Task 1) match the imports in Task 2's `testData.ts`. Data shapes match `WordsMeaningData` and `ReasoningData` from `types.ts`. ✅
