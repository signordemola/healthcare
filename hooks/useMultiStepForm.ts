import { ReactElement, useState } from "react";

export const useMultiStepForm = (
  steps: ReactElement[],
  validateStep: () => Promise<boolean>
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = async () => {
    const isStepValid = await validateStep();
    if (!isStepValid) {
      console.log("Validation failed. Cannot proceed to the next step."); // Debugging
      return; // 🚨 Prevent advancing if validation fails
    }
    setCurrentStepIndex((index) => (index >= steps.length - 1 ? index : index + 1));
  };

  const back = () => {
    setCurrentStepIndex((index) => (index <= 0 ? index : index - 1));
  };

  const goTo = (index: number) => {
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    steps,
    step: steps[currentStepIndex],
    back,
    next,
    goTo,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
};