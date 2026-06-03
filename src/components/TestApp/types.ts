export type TestProps = {
  testState: "intro" | "in-progress";
  onStartTest: () => void;
  onCorrectAnswer: () => void;
  onIncorrectAnswer: () => void;
};

export type TestResults = Partial<{
  [key in TestName]: {
    numCorrect: number;
    numIncorrect: number;
  };
}>;

export type StoredSession = {
  timestamp: number;
  results: TestResults;
};

export function normalizeSession(entry: unknown): StoredSession {
  if (entry && typeof entry === "object" && "results" in entry)
    return entry as StoredSession;
  return { timestamp: 0, results: entry as TestResults };
}

export enum TestName {
  REASONING = "Reasoning",
  PERCEPTUAL_SPEED = "Perceptual Speed",
  NUMBERS_SPEED_AND_ACCURACY = "Numbers Speed and Accuracy",
  WORDS_MEANING = "Words Meaning",
  SPATIAL_VISUALIZATION = "Spatial Visualization",
}

export type WordsMeaningData = string[][];
export type ReasoningData = {
  names: string[];
  comparisons: Array<{
    s: [[string, string], [string, string]];
    q: [[string, string], [string, string]];
  }>;
  question: string;
};
