import { useRef, useCallback } from "react";
import { useHistory } from "react-router-dom";

export const useGoBackOrHome = () => {
  const history = useHistory();

  const historyRef = useRef(history);
  historyRef.current = history;

  const goBackOrHome = useCallback(() => {
    if (window.history.length > 2) {
      historyRef.current.goBack();
    } else {
      historyRef.current.push("/");
    }
  }, []);

  return goBackOrHome;
};
