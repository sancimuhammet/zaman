import { cn } from "@/lib/utils";

interface ProgressStepsProps {
  currentStep: number;
  steps: Array<{
    id: number;
    label: string;
  }>;
  className?: string;
}

export default function ProgressSteps({ currentStep, steps, className }: ProgressStepsProps) {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center justify-center space-x-4 mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep >= step.id
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {step.id}
              </div>
              <span
                className={cn(
                  "ml-2 text-sm font-medium",
                  currentStep >= step.id ? "text-primary" : "text-gray-600"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-12 h-0.5 bg-gray-300 ml-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
