import { useTranslations } from "@/contexts/TranslationsContext";
import type { TestName, TestResults } from "@components/TestApp/types";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@components/ui/chart";
import { Area, AreaChart } from "recharts";

export type ScoredResult = TestResults[TestName] & {
  score: number;
};

const ResultsChart = (props: { results: ScoredResult[] }) => {
  const { results } = props;
  const t = useTranslations("charts");

  const chartConfig = {
    numCorrect: {
      label: t("correct"),
    },
    numIncorrect: {
      label: t("incorrect"),
    },
    score: {
      label: t("score"),
    },
  };

  return (
    <ChartContainer config={chartConfig} className="h-32 w-full">
      <AreaChart data={results}>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="numCorrect"
          type="linear"
          fill="hsl(var(--chart-2))"
          fillOpacity={0.4}
          stroke="hsl(var(--chart-2))"
          stackId="a"
        />
        <Area
          dataKey="numIncorrect"
          type="linear"
          fill="hsl(var(--chart-1))"
          fillOpacity={0.4}
          stroke="hsl(var(--chart-1))"
          stackId="a"
        />
        <Area
          dataKey="score"
          type="linear"
          stroke="hsl(var(--chart-3))"
          strokeWidth={2}
          stackId="b"
          fill="none"
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default ResultsChart;
