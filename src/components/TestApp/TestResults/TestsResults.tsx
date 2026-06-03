import React from "react";
import {
  TestName,
  type TestResults,
  type StoredSession,
  normalizeSession,
} from "@components/TestApp/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import ResultsChart, {
  type ScoredResult,
} from "@components/TestApp/TestResults/ResultsChart";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Button } from "@components/ui/button";
import { useTranslations } from "@/contexts/TranslationsContext";

function createScoringFunction(numPossibleAnswers: number) {
  return (numCorrect: number, numIncorrect: number) => {
    const score = numCorrect - numIncorrect * (1 / (numPossibleAnswers - 1));
    return Math.max(score, 0);
  };
}

const SCORING_FUNCTIONS = {
  [TestName.REASONING]: createScoringFunction(2),
  [TestName.PERCEPTUAL_SPEED]: createScoringFunction(5),
  [TestName.NUMBERS_SPEED_AND_ACCURACY]: createScoringFunction(3),
  [TestName.WORDS_MEANING]: createScoringFunction(3),
  [TestName.SPATIAL_VISUALIZATION]: createScoringFunction(3),
} as const satisfies {
  [key in TestName]: (numCorrect: number, numIncorrect: number) => number;
};

// const THRESHOLDS = {
//   [TestName.REASONING]: { average: 28, high: 35 },
//   [TestName.PERCEPTUAL_SPEED]: { average: 47, high: 52 },
//   [TestName.NUMBERS_SPEED_AND_ACCURACY]: { average: 17, high: 24 },
//   [TestName.WORDS_MEANING]: { average: 28, high: 37 },
//   [TestName.SPATIAL_VISUALIZATION]: { average: 12, high: 20 },
// } as const satisfies { [key in TestName]: { average: number; high: number } };

// const Thresholds = () => {
//   return (
//     <ol>
//       {Object.entries(THRESHOLDS).map(([testName, { average, high }]) => (
//         <li key={testName}>
//           <h2>{testName}</h2>
//           <p>Average: {average}</p>
//           <p>High: {high}</p>
//         </li>
//       ))}
//     </ol>
//   );
// };

const MAX_TEST_HISTORY = 50;

const TESTS = Object.values(TestName);

type TestStats = {
  best: number;
  avg: number;
  attempts: number;
  accuracy: number;
  lastTimestamp: number;
  avgTimePerQuestion: number;
};

const TestsResults = (props: {
  currentResults: TestResults;
  restartTests: () => void;
  goToTestSelection: () => void;
}) => {
  const t = useTranslations();
  const { currentResults, restartTests, goToTestSelection } = props;
  const [previousSessions, setPreviousSessions] = useLocalStorage<
    StoredSession[]
  >("testResults", []);

  const normalizedSessions = React.useMemo(
    () => previousSessions.map(normalizeSession),
    [previousSessions],
  );

  const results = React.useMemo(() => {
    const lastMaxSessions = normalizedSessions.slice(-MAX_TEST_HISTORY);
    const resultsMap = new Map<TestName, ScoredResult[]>();

    TESTS.forEach((testName) => {
      const scored: ScoredResult[] = [];

      for (const session of lastMaxSessions) {
        const testResult = session.results[testName];

        if (testResult) {
          scored.push({
            numCorrect: testResult.numCorrect,
            numIncorrect: testResult.numIncorrect,
            score: SCORING_FUNCTIONS[testName](
              testResult.numCorrect,
              testResult.numIncorrect,
            ),
          });
        }
      }

      resultsMap.set(testName, scored);
    });

    return resultsMap;
  }, [currentResults, normalizedSessions]);

  const stats = React.useMemo(() => {
    const statsMap = new Map<TestName, TestStats>();

    TESTS.forEach((testName) => {
      const scored = results.get(testName) ?? [];
      if (scored.length === 0) return;

      const scores = scored.map((r) => r.score);
      const best = Math.max(...scores);
      const avg =
        Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) /
        10;
      const accuracy = Math.round(
        (scored.reduce(
          (a, r) => a + r.numCorrect / (r.numCorrect + r.numIncorrect),
          0,
        ) /
          scored.length) *
          100,
      );

      const lastTimestamp = Math.max(
        ...normalizedSessions
          .slice(-MAX_TEST_HISTORY)
          .filter((s) => s.results[testName])
          .map((s) => s.timestamp),
      );

      const sessionsWithTime = normalizedSessions
        .slice(-MAX_TEST_HISTORY)
        .filter((s) => (s.results[testName]?.timeSpent ?? 0) > 0);

      const avgTimePerQuestion =
        sessionsWithTime.length === 0
          ? 0
          : Math.round(
              sessionsWithTime.reduce((sum, s) => {
                const result = s.results[testName]!;
                const total = result.numCorrect + result.numIncorrect;
                return sum + (total > 0 ? result.timeSpent! / total : 0);
              }, 0) / sessionsWithTime.length,
            );

      statsMap.set(testName, {
        best,
        avg,
        attempts: scored.length,
        accuracy,
        lastTimestamp,
        avgTimePerQuestion,
      });
    });

    return statsMap;
  }, [results, normalizedSessions]);

  return (
    <>
      <ul className="space-y-4">
        {TESTS.map((testName) => {
          const currentResult = currentResults[testName];
          const allResults = results.get(testName);
          const testStats = stats.get(testName);

          return (
            <Card key={testName}>
              <CardHeader>
                <CardTitle>{t("test-names", testName)}</CardTitle>
              </CardHeader>
              {currentResult && (
                <CardContent className="flex items-center justify-between text-xl">
                  <div className="flex flex-wrap overflow-hidden rounded-sm text-center">
                    <div className="min-w-12 bg-chart-2 p-2 text-destructive-foreground">
                      {currentResult.numCorrect}
                    </div>
                    <div className="min-w-12 bg-destructive p-2 text-destructive-foreground">
                      {currentResult.numIncorrect}
                    </div>
                  </div>
                  <div className="font-bold">
                    {SCORING_FUNCTIONS[testName](
                      currentResult.numCorrect,
                      currentResult.numIncorrect,
                    )}
                  </div>
                </CardContent>
              )}
              {testStats && (
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <span className="rounded-sm bg-muted px-2 py-1">
                      <span className="text-muted-foreground">
                        {t("results-history", "best")}:{" "}
                      </span>
                      <span className="font-semibold">{testStats.best}</span>
                    </span>
                    <span className="rounded-sm bg-muted px-2 py-1">
                      <span className="text-muted-foreground">
                        {t("results-history", "average")}:{" "}
                      </span>
                      <span className="font-semibold">{testStats.avg}</span>
                    </span>
                    <span className="rounded-sm bg-muted px-2 py-1">
                      <span className="text-muted-foreground">
                        {t("results-history", "attempts")}:{" "}
                      </span>
                      <span className="font-semibold">{testStats.attempts}</span>
                    </span>
                    <span className="rounded-sm bg-muted px-2 py-1">
                      <span className="text-muted-foreground">
                        {t("results-history", "accuracy")}:{" "}
                      </span>
                      <span className="font-semibold">{testStats.accuracy}%</span>
                    </span>
                    {testStats.avgTimePerQuestion > 0 && (
                      <span className="rounded-sm bg-muted px-2 py-1">
                        <span className="text-muted-foreground">
                          {t("results-history", "avg-time")}:{" "}
                        </span>
                        <span className="font-semibold">{testStats.avgTimePerQuestion}s</span>
                      </span>
                    )}
                    {testStats.lastTimestamp > 0 && (
                      <span className="rounded-sm bg-muted px-2 py-1">
                        <span className="text-muted-foreground">
                          {t("results-history", "last-attempt")}:{" "}
                        </span>
                        <span className="font-semibold">
                          {new Date(testStats.lastTimestamp).toLocaleDateString()}
                        </span>
                      </span>
                    )}
                  </div>
                </CardContent>
              )}
              <CardFooter>
                {allResults && allResults.length > 0 ? (
                  <ResultsChart results={allResults} />
                ) : (
                  <p className="w-full text-center font-thin">
                    {t("results-history", "no-results")}
                  </p>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </ul>
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row-reverse">
        {Object.keys(currentResults).length > 0 && (
          <Button onClick={restartTests}>
            {t("results-history", "retake")}
          </Button>
        )}
        {/* TODO: add some confirmation */}
        <Button
          variant="destructive"
          onClick={() => {
            setPreviousSessions([]);
            goToTestSelection();
          }}
          disabled={previousSessions.length === 0}
        >
          {t("results-history", "clear-history")}
        </Button>
      </div>
    </>
  );
};

export default TestsResults;
