import { TestName } from "@components/TestApp/types";

export const LOCALES = ["en", "pl", "es", "fr"] as const;
export const DEFAULT_LOCALE = "en" as const;
export type Locale = (typeof LOCALES)[number];

export const SWITCH_LOCALE_LABELS = {
  en: "Switch to English",
  pl: "Zmień na polski",
  es: "Cambiar a español",
  fr: "Passer en français",
} as const satisfies {
  [locale in Locale]: string;
};

export function getLocale(url: URL): Locale {
  const path = url.pathname;
  const [_, locale] = path.split("/");

  return LOCALES.includes(locale as Locale)
    ? (locale as Locale)
    : DEFAULT_LOCALE;
}

export function delocalizePath(url: URL): string {
  const locale = getLocale(url);
  if (locale === DEFAULT_LOCALE) {
    return url.pathname;
  }

  return url.pathname.replace(`/${locale}`, "");
}

type TranslationFunction = <N extends keyof typeof ui>(
  namespace: N,
  key: keyof (typeof ui)[N],
) => string;
type TranslationFunctionWithBakedInNamespace<N extends keyof typeof ui> = (
  key: keyof (typeof ui)[N],
) => string;

export function i18n(locale: Locale): TranslationFunction;
export function i18n<N extends keyof typeof ui>(
  locale: Locale,
  namespace: N,
): TranslationFunctionWithBakedInNamespace<N>;
export function i18n<N extends keyof typeof ui>(
  locale: Locale,
  namespace?: N,
): TranslationFunction | TranslationFunctionWithBakedInNamespace<N> {
  if (namespace === undefined) {
    return <N extends keyof typeof ui>(
      namespace: N,
      key: keyof (typeof ui)[N],
      // TODO: Why is this type assertion needed?
    ) => (ui[namespace][key] as { [locale in Locale]: string })[locale];
  }

  return (key: keyof (typeof ui)[N]) =>
    // TODO: Why is this type assertion needed?
    (ui[namespace][key] as { [locale in Locale]: string })[locale];
}

const ui = {
  home: {
    title: {
      en: "General Intelligence Assessment",
      pl: "Ocena Inteligencji Ogólnej",
      es: "Prueba General de Inteligencia",
      fr: "Évaluation de l'intelligence générale",
    },
    "intro-1": {
      en: "As a part of a job application process, I was asked to complete a ",
      pl: "W ramach procesu rekrutacyjnego, zostałem poproszony o wykonanie ",
      es: "Como parte de un proceso de selección, se me pedía completar el ",
      fr: "Dans le cadre d'un processus de recrutement, on m'a demandé de passer un ",
    },
    "intro-2": {
      en: "Thomas GIA test",
      pl: "testu Thomas GIA",
      es: "test de Thomas GIA",
      fr: "test Thomas GIA",
    },
    "intro-3": {
      en: ". As I haven't found any proper practice materials, I decided to create a simple web app to test myself before the real thing.",
      pl: ". Ponieważ nie znalazłem żadnych odpowiednich materiałów do ćwiczeń, postanowiłem stworzyć prostą aplikację webową, aby przetestować się przed prawdziwym testem.",
      es: ". Dado que no encontré materiales adequados para practicar, decidí crear una aplicación web simple para entrenarme antes del test real.",
      fr: ". Comme je n'ai pas trouvé de matériel d'entraînement adapté, j'ai décidé de créer une application web simple pour m'entraîner avant le vrai test.",
    },
    "disclaimer-1": {
      en: "I am not affiliated with Thomas International in any way. This is a personal project. I do not have access to the real test questions. I do not provide any guarantees that the questions in this app are similar to the real test.",
      pl: "Nie mam żadnych powiązań z Thomas International. To jest projekt osobisty. Nie mam dostępu do prawdziwych pytań testu. Nie gwarantuję, że pytania w tej aplikacji są podobne do prawdziwego testu.",
      es: "No estoy relacionado de ninguna manera con Thomas International. Éste es un proyecto personal. No tengo acceso a las preguntas del test real. No puedo dar ninguna garantía de que las preguntas en este test se parezcan a las del test real.",
      fr: "Je ne suis en aucun cas affilié à Thomas International. Il s'agit d'un projet personnel. Je n'ai pas accès aux questions du test réel. Je ne garantis pas que les questions de cette application ressemblent à celles du test officiel.",
    },
    "disclaimer-2": {
      en: "The app is still in development. Any parts of the app may change at any time. You may loose your results history.",
      pl: "Aplikacja jest wciąż w fazie rozwoju. Dowolna część aplikacji może ulec zmianie w dowolnym momencie. Możesz stracić historię swoich wyników.",
      es: "Esta aplicación está en desarrollo. Cualquier parte puede cambiar en cualquier momento. Se puede perder el histórico de resultados.",
      fr: "L'application est encore en développement. N'importe quelle partie peut changer à tout moment. Vous pouvez perdre l'historique de vos résultats.",
    },
    cta: {
      en: "Let's go",
      pl: "Zaczynamy",
      es: "Vamos allá",
      fr: "C'est parti",
    },
  },
  "main-test-screen": {
    "see-results-history": {
      en: "See results history",
      pl: "Zobacz historię wyników",
      es: "Ver histórico de resultados",
      fr: "Voir l'historique des résultats",
    },
  },
  "test-selector": {
    title: {
      en: "Select the tests you want to take",
      pl: "Wybierz testy, które chcesz wykonać",
      es: "Selecciona que pruebas quieres hacer",
      fr: "Sélectionnez les tests que vous souhaitez passer",
    },
    "select-all": {
      en: "Select all",
      pl: "Zaznacz wszystkie",
      es: "Seleccionar todas",
      fr: "Tout sélectionner",
    },
    start: {
      en: "Start the tests",
      pl: "Rozpocznij testy",
      es: "Empezar la prueba",
      fr: "Commencer les tests",
    },
  },
  "test-names": {
    [TestName.REASONING]: {
      en: "Reasoning",
      pl: "Wywodzenie logiczne",
      es: "Razonamiento",
      fr: "Raisonnement",
    },
    [TestName.PERCEPTUAL_SPEED]: {
      en: "Perceptual speed",
      pl: "Szybkość percepcyjna",
      es: "Velocidad perceptiva",
      fr: "Vitesse perceptuelle",
    },
    [TestName.NUMBERS_SPEED_AND_ACCURACY]: {
      en: "Numbers speed and accuracy",
      pl: "Szybkość i dokładność liczbowa",
      es: "Velocidad y precisión numérica",
      fr: "Vitesse et précision numérique",
    },
    [TestName.WORDS_MEANING]: {
      en: "Words meaning",
      pl: "Znaczenie słów",
      es: "Significado de palabras",
      fr: "Signification des mots",
    },
    [TestName.SPATIAL_VISUALIZATION]: {
      en: "Spatial visualization",
      pl: "Wizualizacja przestrzenna",
      es: "Visualización espacial",
      fr: "Visualisation spatiale",
    },
  } satisfies { [key in TestName]: { [locale in Locale]: string } },
  "test-intro": {
    cta: {
      en: "I'm ready",
      pl: "Jestem gotowy",
      es: "Estoy a punto",
      fr: "Je suis prêt",
    },
  },
  reasoning: {
    intro: {
      en: "In this test, you will be presented with a statement and a question. The statement will compare two names, and the question will ask you to identify which name fits the comparison.",
      pl: "W tym teście zobaczysz stwierdzenie opisujące relację między cechą dwóch osób. Następnie zobaczysz pytanie dotyczące tej relacji. Twoim zadaniem jest zidentyfikowanie pasującej osoby.",
      es: "En esta prueba, se va a presentar una sentencia y una pregunta. La sentencia compara dos nombres, y la pregunta pide identificar que nombre cumple la comparación.",
      fr: "Dans ce test, une affirmation et une question vous seront présentées. L'affirmation compare deux noms, et la question vous demande d'identifier lequel correspond à la comparaison.",
    },
    cta: {
      en: "Show the question",
      pl: "Pokaż pytanie",
      es: "Muestra la pregunta",
      fr: "Afficher la question",
    },
  },
  perceptual: {
    intro: {
      en: "In this test, you will be presented with four columns of letters. Your task is to identify how many columns have the same letter.",
      pl: "W tym teście zobaczysz cztery kolumny liter. Twoim zadaniem jest zidentyfikowanie, w ilu kolumnach znajduje się ta sama litera.",
      es: "En esta prueba, se presentan cuatro columnas de letras. Debes identificar cuántas columnas tienen la misma letra.",
      fr: "Dans ce test, vous verrez quatre colonnes de lettres. Votre tâche est d'identifier combien de colonnes contiennent la même lettre.",
    },
    question: {
      en: "How many columns have the same letter?",
      pl: "W ilu kolumnach znajduje się ta sama litera?",
      es: "Cuántas columnas tienen la misma letra?",
      fr: "Combien de colonnes ont la même lettre ?",
    },
  },
  numbers: {
    intro: {
      en: "In this test, you will be presented with three numbers. Your task is to identify which number is furthest from the median.",
      pl: "W tym teście zobaczysz trzy liczby. Twoim zadaniem jest zidentyfikowanie, która liczba jest najbardziej oddalona od ich mediany.",
      es: "En esta prueba se presentan tres números. Debes identificar que número está más alejado de el numero que define la mediana.",
      fr: "Dans ce test, trois nombres vous seront présentés. Votre tâche est d'identifier lequel est le plus éloigné de la médiane.",
    },
    question: {
      en: "Which number is furthest from the median?",
      pl: "Która liczba jest najbardziej oddalona od ich mediany?",
      es: "Qué número está más alejado de la mediana?",
      fr: "Quel nombre est le plus éloigné de la médiane ?",
    },
  },
  "words-meaning": {
    intro: {
      en: "In this test, you will be presented with three words. Your task is to identify which word doesn't belong.",
      pl: "W tym teście zobaczysz trzy słowa. Twoim zadaniem jest zidentyfikowanie, które słowo nie pasuje do reszty.",
      es: "En esta prueba se presentan tres palabras. Debes identificar qué palabra no es la adecuada.",
      fr: "Dans ce test, trois mots vous seront présentés. Votre tâche est d'identifier lequel ne correspond pas aux autres.",
    },
    question: {
      en: "Which word doesn't belong?",
      pl: "Które słowo nie pasuje?",
      es: "Qué palabra no es adecuada?",
      fr: "Quel mot ne correspond pas ?",
    },
  },
  "spatial-visualization": {
    intro: {
      en: "In this test, you will be presented with a grid of letters. Your task is to identify how many boxes have the same letter. Rotated letters are considered the same, while mirrored letters are not.",
      pl: "W tym teście zobaczysz siatkę liter. Twoim zadaniem jest zidentyfikowanie, w ilu kolumnach znajduje się ta sama litera. Obrócone litery są uważane za takie same, podczas gdy lustrzanie odbite litery nie są.",
      es: "En esta prueba se presentan dos cuadrados con dos letras. Debes identificar cuántos cuadrados tienen la misma letra. Las letras se consideran iguales si sólo difieren en la rotación pero no si una es el reflejo de la otra.",
      fr: "Dans ce test, une grille de lettres vous sera présentée. Votre tâche est d'identifier combien de cases contiennent la même lettre. Les lettres tournées sont considérées comme identiques, mais pas les lettres miroir.",
    },
    question: {
      en: "How many boxes have the same letter?",
      pl: "W ilu polach znajduje się ta sama litera?",
      es: "Cuántos cuadrados tienen la misma letra?",
      fr: "Combien de cases ont la même lettre ?",
    },
    description: {
      en: "Rotated letters are considered the same, while mirrored letters are not.",
      pl: "Obrócone litery są uważane za takie same, podczas gdy lustrzanie odbite litery nie są.",
      es: "Las letras rotadas se consideran iguales, pero las reflejadas no.",
      fr: "Les lettres tournées sont considérées comme identiques, mais pas les lettres miroir.",
    },
  },
  "results-history": {
    "no-results": {
      en: "No results yet",
      pl: "Brak wyników",
      es: "No hay resultados todavía.",
      fr: "Aucun résultat pour l'instant",
    },
    retake: {
      en: "Retake the tests",
      pl: "Powtórz testy",
      es: "Repetir la prueba",
      fr: "Repasser les tests",
    },
    "clear-history": {
      en: "Clear results history",
      pl: "Wyczyść historię wyników",
      es: "Eliminar el histórico",
      fr: "Effacer l'historique des résultats",
    },
  },
  charts: {
    correct: {
      en: "Correct",
      pl: "Poprawne",
      es: "Correcto",
      fr: "Correct",
    },
    incorrect: {
      en: "Incorrect",
      pl: "Niepoprawne",
      es: "Erróneo",
      fr: "Incorrect",
    },
    score: {
      en: "Score",
      pl: "Wynik",
      es: "Puntuación",
      fr: "Score",
    },
  },
  layout: {
    "made-by": {
      en: "Made by",
      pl: "Wykonane przez",
      es: "Hecho por",
      fr: "Réalisé par",
    },
  },
} as const satisfies {
  [namespace: string]: { [key: string]: { [locale in Locale]: string } };
};

// TODO: Pass to React only baked-in translations in order not to send to the client all the translations for every locale
// export type TranslationsWithBakedInLocale = { [namespace in keyof typeof ui]: { [key in keyof typeof ui[namespace]]: string } };

// export function bakeTranslations(locale: Locale) {
//   return Object.fromEntries(
//     Object.entries(ui).map(([namespace, translations]) => [
//       namespace,
//       Object.fromEntries(
//         Object.entries(translations).map(([key, value]) => [
//           key,
//           value[locale],
//         ]),
//       ),
//     ]),
//   ) as TranslationsWithBakedInLocale;
// }
