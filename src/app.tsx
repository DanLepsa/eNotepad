import * as React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { createRoot } from "react-dom/client";
import { Main } from "./Main";

const container = document.getElementById("app");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <DndProvider backend={HTML5Backend}>
      <Main />
    </DndProvider>
  </React.StrictMode>
);
