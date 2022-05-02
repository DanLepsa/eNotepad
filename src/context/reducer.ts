import { AppState, SaveState, TabData } from "./state";
import { ActionTypes, Action } from "./actions";

const initialTabData: TabData[] = [
  {
    label: "Nigerian Jollof",
    content: "Perhaps the greatest dish ever invented.",
    filePath: null,
    saveState: SaveState.UNSAVED,
  },
  {
    label: "Pounded Yam & Egusi",
    content:
      "Perhaps the surest dish ever invented but fills the stomach more than rice.",
    filePath: "/Users/danwork/Downloads/Untitled",
    saveState: SaveState.UNSAVED,
  },
];

const emptyTab: TabData = {
  label: "untitled",
  content: "",
  filePath: null,
  saveState: SaveState.UNSAVED,
};

export const initialState: AppState = {
  tabs: initialTabData,
  activeTab: 0,
  pending: false,
  error: false,
};

export const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SET_ACTIVE_TAB: {
      console.log("set active tab", action.payload);
      return {
        ...state,
        activeTab: action.payload,
      };
    }

    case ActionTypes.ADD_NEW_TAB: {
      return {
        ...state,
        tabs: [...state.tabs, emptyTab],
        activeTab: state.activeTab + 1,
      };
    }

    case ActionTypes.REMOVE_TAB: {
      // NEEDS WORK
      let oldTabs = [...state.tabs];
      let currentIndex = action.payload;

      oldTabs.splice(currentIndex, 1);

      if (!oldTabs.length) {
        oldTabs = Object.assign([], [emptyTab]);
        currentIndex = 0;
      } else {
        console.log("what ??? ", state.tabs[currentIndex], " ", currentIndex);
        if (state.tabs[currentIndex]) {
          currentIndex = currentIndex - 1;
        }
      }

      return {
        ...state,
        tabs: oldTabs,
        activeTab: currentIndex,
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
      };
      return {
        ...state,
        tabs: [...state.tabs, newTab],
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

    default:
      return state;
  }
};
