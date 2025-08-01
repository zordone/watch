import "core-js";
import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./components/App";
import "./index.css";
import "@fontsource/roboto/100.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/600.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
