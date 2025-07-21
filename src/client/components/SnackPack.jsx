import React, { useCallback, useLayoutEffect, useRef } from "react";
import { Snackbar, Alert } from "@mui/material";
import { actions, useStore } from "../store/store";
import "./SnackPack.css";

const AUTOHIDE_DURATION = 4000;
const TRANSITION_DURATION = 500;

const snackbarSlotProps = {
  clickAwayListener: () => ({
    onClickAway: (event) => {
      // prevent default onClickAway behavior
      event.defaultMuiPrevented = true;
    },
  }),
};

export const SnackPack = () => {
  const { snacks } = useStore();
  const containerRef = useRef(null);

  const onClose = useCallback((id) => {
    actions.closeSnack(id);
    setTimeout(actions.clearSnacks, TRANSITION_DURATION);
  }, []);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const bottomMargin = 16;
    const height = snacks.length
      ? containerRef.current.getBoundingClientRect().height + bottomMargin
      : 0;
    containerRef.current.style.transform = `translateY(${-height}px)`;
  }, [snacks.length]);

  return (
    <div className="SnackPack" ref={containerRef}>
      {snacks.map(({ id, text, severity, visible }) => (
        <Snackbar
          open={true}
          autoHideDuration={AUTOHIDE_DURATION}
          onClose={() => onClose(id)}
          key={id}
          className={`SnackPack-snackbar ${visible ? "" : "closed"}`}
          transitionDuration={TRANSITION_DURATION}
          slotProps={snackbarSlotProps}
        >
          <Alert severity={severity} variant="filled" sx={{ width: "100%" }}>
            {text}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};
