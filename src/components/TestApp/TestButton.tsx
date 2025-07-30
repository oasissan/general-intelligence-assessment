import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@components/ui/button";

const TestButton = (props: ButtonProps) => {
  const { className, ...restProps } = props;

  return <Button variant="outline" className={cn(className)} {...restProps} />;
};

export default TestButton;
