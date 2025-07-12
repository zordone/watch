import "core-js";
import React from "react";
import { createRoot } from "react-dom/client";
import whyDidYouUpdate from "why-did-you-update";
import App from "./components/App";
import "./index.css";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/600.css";

const WHY_UPDATE_ON = false;

if (WHY_UPDATE_ON && process.env.NODE_ENV !== "production") {
  whyDidYouUpdate(React, {
    exclude: [
      // React Router components
      /^Route$/,
      /^Switch$/,
    ],
  });
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
