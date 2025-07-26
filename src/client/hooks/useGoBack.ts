import { useCallback } from "react";
import { useNavigate } from "react-router";

interface HistoryState {
  idx?: number;
}

// returns a function that navigates back to the previous page, or home if no history is available
export const useGoBack = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    // do we have a previous history entry to go back to?
    const { idx = 0 } = (window.history.state ?? {}) as HistoryState;
    if (idx > 0) {
      // navigate(-1) doesn't support view transitions
      document.startViewTransition(() => navigate(-1));
    } else {
      navigate("/", { replace: true, viewTransition: true });
    }
  }, [navigate]);

  return goBack;
};
