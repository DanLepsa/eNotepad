import * as React from "react";
import { createRoot } from "react-dom/client";
import { Main } from "./Main";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
