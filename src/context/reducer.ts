import { AppState, SaveState, TabData } from "./state";
import { ActionTypes, Action } from "./actions";

import { DocumentTypes } from "../types";
import { TabToBeCreated } from "../types/index";

const emptyTab: TabData = {
  label: "untitled",
  content: "",
  filePath: null,
  saveState: SaveState.UNSAVED,
  documentType: DocumentTypes.TEXTAREA,
};

export const initialState: AppState = {
  tabs: [emptyTab],
  activeTab: 0,
  pending: false,
  error: false,
};

export const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB: {
      return {
        ...state,
        activeTab: action.payload as number,
      };
    }

    case ActionTypes.ADD_NEW_TAB: {
      const updatedTabs = [...state.tabs, emptyTab];

      return {
        ...state,
        tabs: updatedTabs,
        activeTab: updatedTabs.length - 1,
      };
    }

    case ActionTypes.REMOVE_TAB: {
      let oldTabs = [...state.tabs];
      const currentIndex = action.payload;
      let newActiveTab = state.activeTab;

      oldTabs.splice(currentIndex, 1);

      if (!oldTabs.length) {
        oldTabs = [emptyTab];
        newActiveTab = 0;
      } else {
        if (!oldTabs[state.activeTab]) {
          newActiveTab = newActiveTab - 1;
        }
      }

      return {
        ...state,
        tabs: oldTabs,
        activeTab: newActiveTab,
      };
    }

    case ActionTypes.UPDATE_TEXTAREA: {
      const tabIndex: number = action.payload.tabIndex;
      const content: string = action.payload.content;
      return {
        ...state,
        tabs: state.tabs.map((tab, index) => {
          if (index === tabIndex) {
            return {
              ...tab,
              content: content,
              isDirty: true,
            };
          }

          return tab;
        }),
      };
    }

    case ActionTypes.SAVE_SET_FILE_PATH: {
      const tabIndex: number = action.payload.tabIndex;
      const filePath: string = action.payload.filePath;
      const fileName: string | undefined = action.payload.fileName;
      return {
        ...state,
        tabs: state.tabs.map((tab, index) => {
          if (index === tabIndex) {
            return {
              ...tab,
              filePath: filePath,
              isDirty: false,
              label: fileName || tab.label,
            };
          }

          return tab;
        }),
      };
    }

    case ActionTypes.OPEN_FILE: {
      const { fileName, filePath, fileContent } = action.payload;
      const newTab: TabData = {
        label: fileName,
        content: fileContent,
        filePath: filePath,
        saveState: SaveState.SAVED,
        documentType: DocumentTypes.TEXTAREA,
      };
      return {
        ...state,
        tabs: [...state.tabs, newTab],
        activeTab: state.tabs.length,
      };
    }

    case ActionTypes.WRITE_FILE: {
      return {
        ...state,
        tabs: state.tabs.map((tab, index) => {
          if (index === state.activeTab) {
            return {
              ...tab,
              isDirty: false,
            };
          }

          return tab;
        }),
      };
    }

    case ActionTypes.SET_TABS: {
      return {
        ...state,
        tabs: action.payload,
      };
    }

    case ActionTypes.TOGGLE_DOCUMENT_TYPE: {
      return {
        ...state,
        tabs: state.tabs.map((tab, index) => {
          if (index === action.payload) {
            return {
              ...tab,
              documentType:
                tab.documentType === DocumentTypes.ENGINE
                  ? DocumentTypes.TEXTAREA
                  : DocumentTypes.ENGINE,
            };
          }

          return tab;
        }),
      };
    }

    case ActionTypes.UPDATE_LOCAL_CONTENT_PENDING: {
      return {
        ...state,
        pending: true,
      };
    }

    case ActionTypes.UPDATE_LOCAL_CONTENT_SUCCESS: {
      return {
        ...state,
        pending: false,
        error: false,
        tabs: action.payload,
      };
    }

    case ActionTypes.UPDATE_LOCAL_CONTENT_ERROR: {
      return {
        ...state,
        pending: false,
        error: true,
      };
    }

    case ActionTypes.ADD_MULTIPLE_TABS: {
      const tabsToBeCreated: TabData[] = (
        action.payload as TabToBeCreated[]
      ).map((t) => {
        const pathsArray: string[] = t.filePath.split("/");
        const fileName = pathsArray[pathsArray.length - 1];

        return {
          ...emptyTab,
          content: t.content,
          filePath: t.filePath,
          label: fileName,
        };
      });
      const updatedTabs = [...state.tabs, ...tabsToBeCreated];

      return {
        ...state,
        tabs: updatedTabs,
      };
    }

    default:
      return state;
  }
};
