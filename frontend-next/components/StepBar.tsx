import React from "react";

interface Step {
  id: number;
  label: string;
}

interface StepBarProps {
  steps: Step[];
  currentStep: number; // 1-indexed
}

export function StepBar({ steps, currentStep }: StepBarProps) {
  return (
    <div className="border-b border-mr-border bg-mr-bg-2 px-6 py-3 flex items-center gap-1 shrink-0 select-none">
      {steps.map((step, i) => {
        const isDone = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        return (
          <React.Fragment key={step.id}>
            {i > 0 && (
              <span className="mono text-[11px] text-mr-dim px-1 shrink-0">›</span>
            )}
            <div
              className={`flex items-center gap-[6px] px-2 py-1 rounded-[6px] transition-colors ${
                isCurrent ? "bg-mr-blue-soft" : "bg-transparent"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center mono text-[10px] font-medium shrink-0 ${
                  isDone
                    ? "bg-mr-blue text-white"
                    : isCurrent
                    ? "bg-mr-blue-hi text-white ring-2 ring-mr-blue-ring"
                    : "bg-mr-surface-3 text-mr-dim"
                }`}
              >
                {isDone ? "✓" : step.id}
              </span>
              <span
                className={`mono text-[11px] tracking-[0.4px] whitespace-nowrap ${
                  isDone
                    ? "text-mr-fg-2"
                    : isCurrent
                    ? "text-mr-fg font-medium"
                    : "text-mr-dim"
                }`}
              >
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
