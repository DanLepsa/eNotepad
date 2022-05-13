import React, { Dispatch } from "react";

import { Action } from "./actions";
import { DocumentTypes } from "../types";

export enum SaveState {
  SAVED = "SAVED",
  UNSAVED = "UNSAVED",
}

export interface TabData {
  label: string;
  content: string;
  filePath: string | null;
  saveState: SaveState;
  documentType: DocumentTypes;
  isDirty?: boolean;
}

export interface AppState {
  tabs: TabData[];
  activeTab: number;
  pending: boolean;
  error: boolean;
}

interface AppContextInterface {
  state: AppState;
  dispatch: Dispatch<Action>;
}

export const AppContext = React.createContext<AppContextInterface | undefined>(
  undefined
);

export const useAppContext = () => {
  const context = React.useContext(AppContext);

  if (context === undefined) {
    throw Error(
      "useAppContext must be used as a ancestor of AppContext.Provider in order to work."
    );
  }

  return context;
};
