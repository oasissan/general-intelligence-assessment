import type { LocaleBakedTranslations } from "@/i18n";
import { createContext, useCallback, useContext, type ReactNode } from "react";

const translationsContext = createContext<LocaleBakedTranslations>(
  undefined as unknown as LocaleBakedTranslations,
);

type TranslationFunction = <T extends keyof LocaleBakedTranslations>(
  namespace: T,
  key: keyof LocaleBakedTranslations[T],
) => string;
type NamespacedTranslationFunction<T extends keyof LocaleBakedTranslations> = (
  key: keyof LocaleBakedTranslations[T],
) => string;

export function useTranslations(): TranslationFunction;
export function useTranslations<T extends keyof LocaleBakedTranslations>(
  namespace: T,
): NamespacedTranslationFunction<T>;
export function useTranslations<T extends keyof LocaleBakedTranslations>(
  namespace?: T,
): NamespacedTranslationFunction<T> | TranslationFunction {
  const translations = useContext(translationsContext);
  if (!translations) throw new Error("Translations context is not provided");

  if (namespace === undefined) {
    return useCallback(
      <T extends keyof LocaleBakedTranslations>(
        namespace: T,
        key: keyof LocaleBakedTranslations[T],
      ) => translations[namespace][key],
      [translations],
    );
  }

  return useCallback(
    (key: keyof LocaleBakedTranslations[T]) => translations[namespace][key],
    [translations, namespace],
  );
}

export const TranslationsProvider = (props: {
  translations: LocaleBakedTranslations;
  children: ReactNode;
}) => {
  return (
    <translationsContext.Provider value={props.translations}>
      {props.children}
    </translationsContext.Provider>
  );
};
