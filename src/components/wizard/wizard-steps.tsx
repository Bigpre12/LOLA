"use client";

import { cn } from "@/lib/utils";

interface Step {
  id: number;
  name: string;
}

interface WizardStepsProps {
  steps: Step[];
  currentStep: number;
}

export function WizardSteps({ steps, currentStep }: WizardStepsProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className={cn(
              "relative",
              index !== steps.length - 1 ? "pr-8 sm:pr-20 flex-1" : ""
            )}
          >
            <div className="flex items-center">
              <div
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full",
                  currentStep > step.id
                    ? "bg-violet-500"
                    : currentStep === step.id
                    ? "border-2 border-violet-500 bg-slate-900"
                    : "border-2 border-slate-700 bg-slate-900"
                )}
              >
                {currentStep > step.id ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      currentStep === step.id ? "text-violet-400" : "text-slate-500"
                    )}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "ml-4 text-sm font-medium hidden sm:block",
                  currentStep >= step.id ? "text-white" : "text-slate-500"
                )}
              >
                {step.name}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-5 left-10 -ml-px h-0.5 w-full",
                  currentStep > step.id ? "bg-violet-500" : "bg-slate-700"
                )}
                style={{ width: "calc(100% - 2.5rem)" }}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
