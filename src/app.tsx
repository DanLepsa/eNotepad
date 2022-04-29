import { ThemeProvider } from "@chakra-ui/react";
import ChakraUiTheme from "@chakra-ui/theme";

import * as React from "react";
import { createRoot } from "react-dom/client";
import { MainPage } from "./pages";

const container = document.getElementById("app");
const root = createRoot(container); // createRoot(container!) if you use TypeScript

root.render(
  <React.StrictMode>
    <ThemeProvider theme={ChakraUiTheme}>
      <div>
        <MainPage />
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
