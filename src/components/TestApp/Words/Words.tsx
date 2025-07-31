import { chooseRandom, pickRandom } from "@/random";
import TestButton from "@components/TestApp/TestButton";
import TestIntro from "@components/TestApp/TestIntro";
import { TestName, type TestProps } from "@components/TestApp/types";
import { Card, CardHeader, CardTitle, CardFooter } from "@components/ui/card";
import { categories as categoriesEn } from "./data-en";
import { categories as categoriesPl } from "./data-pl";
import { categories as categoriesEs } from "./data-es";
import { categories as categoriesIt } from "./data-it";
import { categories as categoriesFr } from "./data-fr";
import React from "react";
import { type Locale } from "@/i18n";
import { logOnIncorrect } from "@components/TestApp/logOnIncorrect";
import { useTranslations } from "@/contexts/TranslationsContext";

const Words = (props: TestProps) => {
  const { onCorrectAnswer, onIncorrectAnswer, testState } = props;
  const t = useTranslations("words-meaning");
  const [question, setQuestion] = React.useState(() =>
    generateQuestion(locale),
  );

  const onAnswer = (answer: string) => {
    if (answer === question.answer) {
      onCorrectAnswer();
    } else {
      logOnIncorrect(question, answer);
      onIncorrectAnswer();
    }

    setQuestion(generateQuestion(locale));
  };

  if (testState === "intro")
    return (
      <TestIntro
        testName={TestName.WORDS_MEANING}
        onStartTest={props.onStartTest}
      >
        <p className="text-justify">{t("intro")}</p>
      </TestIntro>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("question")}</CardTitle>
      </CardHeader>
      <CardFooter className="flex flex-wrap justify-center gap-4">
        {question.words.map((word) => (
          <TestButton key={word} onClick={() => onAnswer(word)}>
            {word}
          </TestButton>
        ))}
      </CardFooter>
    </Card>
  );
};

export default Words;

function generateQuestion(locale: Locale) {
  let categories: string[][];
  switch (locale) {
    case "pl":
      categories = categoriesPl;
      break;
    case "es":
      categories = categoriesEs;
      break;
    case "it":
      categories = categoriesIt;
      break;
    case "fr":
      categories = categoriesFr;
      break;
    default:
      categories = categoriesEn;
  }

  const [matching, odd] = chooseRandom(categories, 2, true);
  const matchingWords = chooseRandom(matching, 2, true);
  const oddWord = pickRandom(odd);

  const words = [...matchingWords, oddWord];
  return {
    words: chooseRandom(words, words.length, true),
    answer: oddWord,
  };
}
