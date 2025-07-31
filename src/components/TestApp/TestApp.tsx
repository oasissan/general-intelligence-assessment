import TestPerformer from "@components/TestApp/TestPerformer";
import TestSelector, {
  type TestOption,
} from "@components/TestApp/TestSelector/TestSelector";
import TestsResults from "@components/TestApp/TestResults/TestsResults";
import { TestName, type TestResults } from "@components/TestApp/types";
import { Button } from "@components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { StrictMode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { type LocaleBakedTranslations } from "@/i18n";
import {
  TranslationsProvider,
  useTranslations,
} from "@/contexts/TranslationsContext";

const TestApp = () => {
  const t = useTranslations("main-test-screen");
  const [phase, setPhase] = React.useState<
    | { name: "select" }
    | { name: "test" }
    | {
        name: "results";
        currentResults: TestResults;
      }
  >({ name: "select" });
  const [testOptions, setTestOptions] = React.useState<TestOption[]>([
    { name: TestName.REASONING, selected: true },
    { name: TestName.PERCEPTUAL_SPEED, selected: true },
    { name: TestName.NUMBERS_SPEED_AND_ACCURACY, selected: true },
    { name: TestName.WORDS_MEANING, selected: true },
    { name: TestName.SPATIAL_VISUALIZATION, selected: true },
  ]);
  const [previousResults, setPreviousResults] = useLocalStorage<TestResults[]>(
    "testResults",
    [],
  );

  const onCompleted = (testResults: TestResults) => {
    const newResults = [...previousResults, testResults];

    setPreviousResults(newResults);
    setPhase({
      name: "results",
      currentResults: testResults,
    });
  };

  return (
    <section className="space-y-6">
      {phase.name !== "select" && (
        <Button
          onClick={() => setPhase({ name: "select" })}
          size="icon"
          variant="outline"
        >
          <ArrowLeft />
        </Button>
      )}
      {phase.name === "select" ? (
        <div className="space-y-6">
          <TestSelector
            testOptions={testOptions}
            setTestOptions={setTestOptions}
            onStartTest={() => setPhase({ name: "test" })}
          />
          <Button
            onClick={() =>
              setPhase({
                name: "results",
                currentResults: {},
              })
            }
            variant="outline"
            className="mx-auto flex"
          >
            {t("see-results-history")}
          </Button>
        </div>
      ) : phase.name === "test" ? (
        <TestPerformer
          tests={testOptions
            .filter((option) => option.selected)
            .map((option) => option.name)}
          onCompleted={onCompleted}
        />
      ) : phase.name === "results" ? (
        <TestsResults
          currentResults={phase.currentResults}
          restartTests={() => setPhase({ name: "test" })}
          goToTestSelection={() => setPhase({ name: "select" })}
        />
      ) : null}
    </section>
  );
};

const TestAppRoot = (props: { translations: LocaleBakedTranslations }) => {
  const { translations } = props;

  return (
    <StrictMode>
      <TranslationsProvider translations={translations}>
        <TestApp />
      </TranslationsProvider>
    </StrictMode>
  );
};

export default TestAppRoot;
