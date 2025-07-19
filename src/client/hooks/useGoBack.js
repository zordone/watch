import { useCallback } from "react";
import { useNavigate } from "react-router";

// returns a function that navigates back to the previous page, or home if no history is available
export const useGoBack = () => {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    // do we have a previous history entry to go back to?
    if (window.history.state?.idx > 0) {
      navigate(-1, { viewTransition: true });
    } else {
      navigate("/", { replace: true, viewTransition: true });
    }
  }, [navigate]);

  return goBack;
};
