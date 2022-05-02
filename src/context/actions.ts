import { Dispatch } from "react";
import { openFileFS, writeFileFS } from "../utils/index";

export enum ActionTypes {
  SET_ACTIVE_TAB = "SET_ACTIVE_TAB",
  ADD_NEW_TAB = "ADD_NEW_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  UPDATE_TEXTAREA = "UPDATE_TEXTAREA",
  SAVE_SET_FILE_PATH = "SAVE_SET_FILE_PATH",
  OPEN_FILE = "OPEN_FILE",
  WRITE_FILE = "WRITE_FILE",
}

export interface Action {
  type: ActionTypes;
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
    console.log("reaches here ", tabIndex);
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
      const fileContent = await openFileFS(filePath);

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
