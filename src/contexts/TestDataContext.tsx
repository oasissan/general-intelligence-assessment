import type {
  ReasoningData,
  TestName,
  WordsMeaningData,
} from "@components/TestApp/types";
import { createContext, useContext, type ReactNode } from "react";

export type TestData = {
  [TestName.WORDS_MEANING]: WordsMeaningData;
  [TestName.REASONING]: ReasoningData;
};

const testDataContext = createContext<TestData>(
  undefined as unknown as TestData,
);

export const TestDataProvider = (props: {
  testData: TestData;
  children: ReactNode;
}) => {
  return (
    <testDataContext.Provider value={props.testData}>
      {props.children}
    </testDataContext.Provider>
  );
};

export function useTestData<T extends keyof TestData>(
  testName: T,
): TestData[T] {
  const testData = useContext(testDataContext);
  if (!testData) throw new Error("Test data context is not provided");

  return testData[testName];
}
