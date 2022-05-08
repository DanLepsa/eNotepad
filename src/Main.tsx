import React, { useEffect, useMemo, useReducer } from "react";
import { ThemeProvider } from "@chakra-ui/react";
import ChakraUiTheme from "@chakra-ui/theme";

import { AppContext, reducer, initialState, AppState } from "./context";
import { MainPage } from "./pages";

const localState: AppState = JSON.parse(localStorage.getItem("appState"));

export const Main = () => {
  const [appState, appDispatch] = useReducer(
    reducer,
    (localState?.tabs?.length && localState) || initialState
  );

  const contextValue = useMemo(() => {
    return { state: appState, dispatch: appDispatch };
  }, [appState]);

  useEffect(() => {
    localStorage.setItem("appState", JSON.stringify(appState));
  }, [appState]);

  return (
    <ThemeProvider theme={ChakraUiTheme}>
      <AppContext.Provider value={contextValue}>
        {/* <AppContext.Provider value={{ state: appState, dispatch: appDispatch }}> */}
        <div>
          <MainPage />
        </div>
      </AppContext.Provider>
    </ThemeProvider>
  );
};
