import { useTranslations } from "@/contexts/TranslationsContext";
import type { TestName } from "@components/TestApp/types";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import React from "react";

const TestIntro = (props: {
  testName: TestName;
  children: React.ReactNode;
  onStartTest: () => void;
}) => {
  const { testName, children, onStartTest } = props;
  const t = useTranslations();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("test-names", testName)}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex justify-center">
        <Button onClick={onStartTest}>{t("test-intro", "cta")}</Button>
      </CardFooter>
    </Card>
  );
};

export default TestIntro;
