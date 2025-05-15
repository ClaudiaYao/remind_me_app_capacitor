import { useBlocker, Location } from "react-router-dom";
import { useState, useCallback, useEffect } from "react";

export function useNavigationGuard(shouldBlock: boolean) {
  //   const [showPrompt, setShowPrompt] = useState(false);
  //   const [nextLocation, setNextLocation] = useState<Location | null>(null);

  //   const blocker = useBlocker(shouldBlock);

  //   if (blocker.state === "blocked" && !showPrompt) {
  //     setShowPrompt(true);
  //     setNextLocation(() => blocker.location);
  //   }

  //   const confirmNavigation = () => {
  //     setShowPrompt(false);
  //     blocker.proceed?.();
  //   };

  //   const cancelNavigation = () => {
  //     setShowPrompt(false);
  //     blocker.reset?.();
  //   };
  const [showPrompt, setShowPrompt] = useState(false);
  const [nextLocation, setNextLocation] = useState<Location | null>(null);
  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowPrompt(true);
      setNextLocation(blocker.location); // Save where the user wanted to go
    }
  }, [blocker]);

  const confirmLeave = useCallback(() => {
    setShowPrompt(false);
    if (blocker?.proceed) blocker?.proceed(); // Allow navigation
  }, [blocker]);

  const cancelLeave = useCallback(() => {
    setShowPrompt(false);
    if (blocker?.reset) blocker?.reset(); // Cancel navigation
  }, [blocker]);

  return {
    showPrompt,
    confirmLeave,
    cancelLeave,
    nextLocation,
  };
}
