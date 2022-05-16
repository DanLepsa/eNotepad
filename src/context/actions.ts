import { Dispatch } from "react";

import { readFileFS, writeFileFS, updateLocalContent } from "../utils";
import { TabData } from "./state";
import { TabToBeCreated } from "../types";

export enum ActionTypes {
  SET_ACTIVE_TAB = "SET_ACTIVE_TAB",
  ADD_NEW_TAB = "ADD_NEW_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  UPDATE_TEXTAREA = "UPDATE_TEXTAREA",
  SAVE_SET_FILE_PATH = "SAVE_SET_FILE_PATH",
  OPEN_FILE = "OPEN_FILE",
  WRITE_FILE = "WRITE_FILE",
  SET_TABS = "SET_TABS",
  TOGGLE_DOCUMENT_TYPE = "TOGGLE_DOCUMENT_TYPE",
  UPDATE_LOCAL_CONTENT_PENDING = "UPDATE_LOCAL_CONTENT_PENDING",
  UPDATE_LOCAL_CONTENT_SUCCESS = "UPDATE_LOCAL_CONTENT_SUCCESS",
  UPDATE_LOCAL_CONTENT_ERROR = "UPDATE_LOCAL_CONTENT_ERROR",
  ADD_MULTIPLE_TABS = "ADD_MULTIPLE_TABS",
}

export interface Action {
  type: ActionTypes;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any;
}

export const setActiveTabAction =
  (dispatch: Dispatch<Action>) => (tabIndex: number) => {
    dispatch({ type: ActionTypes.SET_ACTIVE_TAB, payload: tabIndex });
  };

export const addNewTabAction = (dispatch: Dispatch<Action>) => () => {
  dispatch({ type: ActionTypes.ADD_NEW_TAB });
};

export const removeTabAction =
  (dispatch: Dispatch<Action>) => (tabIndex: number) => {
    dispatch({ type: ActionTypes.REMOVE_TAB, payload: tabIndex });
  };

export const updateTextareaAction =
  (dispatch: Dispatch<Action>) => (tabIndex: number, content: string) => {
    dispatch({
      type: ActionTypes.UPDATE_TEXTAREA,
      payload: { tabIndex: tabIndex, content: content },
    });
  };

export const setFilePathOnSaveAction =
  (dispatch: Dispatch<Action>) =>
  (tabIndex: number, filePath: string, fileName?: string) => {
    dispatch({
      type: ActionTypes.SAVE_SET_FILE_PATH,
      payload: { tabIndex: tabIndex, filePath: filePath, fileName: fileName },
    });
  };

export const openFileAction =
  (dispatch: Dispatch<Action>) =>
  async (filePath: string, fileName: string) => {
    try {
      const fileContent = await readFileFS(filePath);

      dispatch({
        type: ActionTypes.OPEN_FILE,
        payload: {
          filePath: filePath,
          fileName: fileName,
          fileContent: fileContent,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

export const writeFileAction =
  (dispatch: Dispatch<Action>) =>
  async (filePath: string, fileContent: string) => {
    try {
      await writeFileFS(filePath, fileContent);

      dispatch({
        type: ActionTypes.WRITE_FILE,
      });
    } catch (err) {
      console.log(err);
    }
  };

export const setTabsAction =
  (dispatch: Dispatch<Action>) => (tabs: TabData[]) => {
    dispatch({
      type: ActionTypes.SET_TABS,
      payload: tabs,
    });
  };

export const toggleDocumentTypeAction =
  (dispatch: Dispatch<Action>) => (tabIndex: number) => {
    dispatch({
      type: ActionTypes.TOGGLE_DOCUMENT_TYPE,
      payload: tabIndex,
    });
  };

export const updateLocalContentAction =
  (dispatch: Dispatch<Action>) => async (tabs: TabData[]) => {
    dispatch({ type: ActionTypes.UPDATE_LOCAL_CONTENT_PENDING });

    try {
      const updatedTabs = await updateLocalContent(tabs);
      dispatch({
        type: ActionTypes.UPDATE_LOCAL_CONTENT_SUCCESS,
        payload: updatedTabs,
      });
    } catch {
      dispatch({ type: ActionTypes.UPDATE_LOCAL_CONTENT_ERROR });
    }
  };

export const addMultipleTabsAction =
  (dispatch: Dispatch<Action>) => (tabsToBeCreated: TabToBeCreated[]) => {
    dispatch({ type: ActionTypes.ADD_MULTIPLE_TABS, payload: tabsToBeCreated });
  };
