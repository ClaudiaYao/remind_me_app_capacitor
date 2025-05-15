import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const WARNING_TIME_MS = 4 * 60 * 1000; // 4 minutes
const TIMEOUT_AFTER_WARNING_MS = 60 * 1000; // 1 minute after warning

export default function useSessionTimeout() {
  const [showWarningDialog, setShowWarningDialog] = useState(false);
  const navigate = useNavigate();

  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getLastActiveTime = () => {
    const value = localStorage.getItem("lastActiveTime");
    return value ? parseInt(value, 10) : null;
  };

  const updateLastActiveTime = () => {
    localStorage.setItem("lastActiveTime", Date.now().toString());
  };

  const clearTimers = () => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
  };

  const startTimers = () => {
    clearTimers();

    const lastActive = getLastActiveTime();
    const now = Date.now();
    const inactiveTime = now - (lastActive || now);

    if (inactiveTime >= WARNING_TIME_MS) {
      // Show warning immediately if over threshold
      setShowWarningDialog(true);
      startLogoutTimer();
    } else {
      // Start warning timer with remaining time
      warningTimerRef.current = setTimeout(() => {
        setShowWarningDialog(true);
        startLogoutTimer();
      }, WARNING_TIME_MS - inactiveTime);
    }
  };

  const startLogoutTimer = () => {
    logoutTimerRef.current = setTimeout(() => {
      localStorage.clear();
      navigate("/login");
    }, TIMEOUT_AFTER_WARNING_MS);
  };

  const handleUserActivity = () => {
    updateLastActiveTime();
    if (showWarningDialog) setShowWarningDialog(false);
    startTimers();
  };

  useEffect(() => {
    const events = ["click", "mousemove", "keydown", "scroll"];

    for (const event of events) {
      window.addEventListener(event, handleUserActivity);
    }

    startTimers(); // initialize

    return () => {
      clearTimers();
      for (const event of events) {
        window.removeEventListener(event, handleUserActivity);
      }
    };
  }, []);

  const stayLoggedIn = () => {
    updateLastActiveTime();
    setShowWarningDialog(false);
    startTimers();
  };

  return { showWarningDialog, stayLoggedIn };
}
