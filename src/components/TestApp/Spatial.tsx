import { useTranslations } from "@/contexts/TranslationsContext";
import { chooseRandom, pickRandom, randomBool, randomInt } from "@/random";
import { logOnIncorrect } from "@components/TestApp/logOnIncorrect";
import TestButton from "@components/TestApp/TestButton";
import TestIntro from "@components/TestApp/TestIntro";
import { TestName, type TestProps } from "@components/TestApp/types";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@components/ui/card";
import { Checkbox } from "@components/ui/checkbox";
import { Label } from "@components/ui/label";
import React from "react";

const Spatial = (props: TestProps) => {
  const { onCorrectAnswer, onIncorrectAnswer, testState } = props;
  const t = useTranslations("spatial-visualization");
  const [selectedLetters, setSelectedLetters] = React.useState<string[]>(LETTERS);
  const [question, setQuestion] = React.useState(() => generateQuestion(LETTERS));

  React.useEffect(() => {
    if (testState === "intro" && selectedLetters.length > 0) {
      setQuestion(generateQuestion(selectedLetters));
    }
  }, [selectedLetters, testState]);

  const onAnswer = (answer: number) => {
    if (answer === question.answer) {
      onCorrectAnswer();
    } else {
      logOnIncorrect(question, answer);
      onIncorrectAnswer();
    }

    setQuestion(generateQuestion(selectedLetters));
  };

  if (testState === "intro")
    return (
      <TestIntro
        testName={TestName.SPATIAL_VISUALIZATION}
        onStartTest={() => {
          if (selectedLetters.length === 0) return;
          props.onStartTest();
        }}
      >
        <div className="flex flex-col gap-6">
          <p className="text-justify">{t("intro")}</p>
          <div>
            <Label className="text-base font-semibold">{t("select-characters")}</Label>
            <div className="mt-4 flex flex-wrap gap-4">
              {LETTERS.map((letter) => (
                <div key={letter} className="flex items-center space-x-2">
                  <Checkbox
                    id={`letter-${letter}`}
                    checked={selectedLetters.includes(letter)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedLetters((prev) => [...prev, letter]);
                      } else {
                        setSelectedLetters((prev) =>
                          prev.length > 1 ? prev.filter((l) => l !== letter) : prev
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`letter-${letter}`} className="text-lg cursor-pointer">{letter}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TestIntro>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("question")}</CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>
      <CardContent dir="ltr" className="flex justify-center gap-6 text-2xl">
        {question.columns.map((letters, i) => (
          <div key={i}>
            <Card className="rounded-sm p-0">
              <CardContent className="px-6 py-4">
                {letters.map(({ isMirrored, rotation }, j) => (
                  <div
                    key={j}
                    className="text-center"
                    style={{
                      transform: `rotate(${rotation * 90}deg) scaleX(${isMirrored ? -1 : 1})`,
                    }}
                  >
                    {question.letter}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        ))}
      </CardContent>
      <CardFooter dir="ltr" className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: question.columns.length + 1 }, (_, i) => (
          <TestButton key={i} onClick={() => onAnswer(i)}>
            {i}
          </TestButton>
        ))}
      </CardFooter>
    </Card>
  );
};

export default Spatial;

const LETTERS = ["R", "P", "G", "F"];

function generateQuestion(availableLetters: string[] = LETTERS) {
  const letter = pickRandom(availableLetters);
  const numColumns = randomInt(2, 4);
  const numOneMirrored = randomInt(0, numColumns);

  const columns = Array.from({ length: numColumns }, (_, i) => {
    const isOneMirrored = i < numOneMirrored;
    const isMirrored = randomBool();

    const upper = { isMirrored, rotation: randomInt(0, 3) };
    const lower = { isMirrored, rotation: randomInt(0, 3) };

    if (isOneMirrored) {
      lower.isMirrored = !upper.isMirrored;
    }

    return [upper, lower];
  });

  return {
    letter,
    columns: chooseRandom(columns, columns.length, true),
    answer: numColumns - numOneMirrored,
  };
}
