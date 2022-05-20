import React, { useEffect } from "react";
import { IpcRendererEvent } from "electron";

import { writeFileFS } from "../utils";
import { PageTabs } from "../components";
import { SaveState, useAppContext } from "../context";
import { TabToBeCreated } from "../types";
import {
  setActiveTabAction,
  addNewTabAction,
  removeTabAction,
  setFilePathOnSaveAction,
  writeFileAction,
  openFileAction,
  toggleDocumentTypeAction,
  addMultipleTabsAction,
} from "../context/actions";

const { ipcRenderer } = window.require("electron");

export const MainPage = () => {
  const {
    state: { tabs, activeTab },
    dispatch,
  } = useAppContext();

  const handleRemoveTab = (index: number) => {
    removeTabAction(dispatch)(index);
  };

  const handleAddTab = () => {
    addNewTabAction(dispatch)();
  };

  const handleTabsChange = (index: number) => {
    setActiveTabAction(dispatch)(index);
  };

  const onFileOpen = async (event: IpcRendererEvent, path: string) => {
    if (tabs.find((tab) => tab.filePath === path)) {
      alert("Selected file is already opened");
    } else {
      const pathsArray: string[] = path.split("/");
      const fileName = pathsArray[pathsArray.length - 1];
      openFileAction(dispatch)(path, fileName);
    }
  };

  const onFileSaveAs = async (event: IpcRendererEvent, path: string) => {
    await writeFileAction(dispatch)(path, tabs[activeTab].content);

    const pathsArray: string[] = path.split("/");
    const fileName = pathsArray[pathsArray.length - 1];
    setFilePathOnSaveAction(dispatch)(activeTab, path, fileName);
  };

  const onFileSave = async (event: IpcRendererEvent) => {
    const currentTab = tabs[activeTab];

    if (currentTab.filePath) {
      writeFileAction(dispatch)(currentTab.filePath, tabs[activeTab].content);
    } else {
      ipcRenderer.send("OPEN_SAVE_AS_DIALOG");
    }
  };

  const handleDirtyTabDialogAnswer = async (
    event: IpcRendererEvent,
    { response, tabIndex }: { response: number; tabIndex: number }
  ) => {
    if (response === 1) {
      const savedState = tabs[tabIndex].saveState;

      if (savedState === SaveState.UNSAVED) {
        ipcRenderer.send("OPEN_SAVE_AS_DIALOG");
      } else {
        await writeFileFS(tabs[tabIndex].filePath, tabs[tabIndex].content);
        removeTabAction(dispatch)(tabIndex);
      }
    } else if (response === 2) {
      removeTabAction(dispatch)(tabIndex);
    }
  };

  const handleToggleDocumentType = (index: number) => {
    toggleDocumentTypeAction(dispatch)(index);
  };

  const handleAddMultipleTabs = (tabs: TabToBeCreated[]) => {
    addMultipleTabsAction(dispatch)(tabs);
  };

  useEffect(() => {
    ipcRenderer.on("NEW_FILE", handleAddTab);
    ipcRenderer.on("DIRTY_TAB_DIALOG_ANSWER", handleDirtyTabDialogAnswer);
    ipcRenderer.on("FILE_OPEN", onFileOpen);
    ipcRenderer.on("FILE_SAVE", onFileSave);
    ipcRenderer.on("FILE_SAVE_AS", onFileSaveAs);
    return () => {
      ipcRenderer.off("NEW_FILE", handleAddTab);
      ipcRenderer.off("DIRTY_TAB_DIALOG_ANSWER", handleDirtyTabDialogAnswer);
      ipcRenderer.off("FILE_OPEN", onFileOpen);
      ipcRenderer.off("FILE_SAVE", onFileSave);
      ipcRenderer.off("FILE_SAVE_AS", onFileSaveAs);
    };
  }, [tabs, activeTab]);

  return (
    <>
      <PageTabs
        data={tabs}
        activeTab={activeTab}
        handleAddTab={handleAddTab}
        handleRemoveTab={handleRemoveTab}
        handleTabsChange={handleTabsChange}
        handleToggleDocumentType={handleToggleDocumentType}
        handleAddMultipleTabs={handleAddMultipleTabs}
      />
    </>
  );
};
