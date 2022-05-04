import React, { useEffect, useRef } from "react";
import { writeFileFS } from "../utils";
import { PageTabs } from "../components";
import { SaveState, useAppContext } from "../context";
import {
  setActiveTabAction,
  addNewTabAction,
  removeTabAction,
  setFilePathOnSaveAction,
  writeFileAction,
  openFileAction,
} from "../context/actions";
import { IpcRendererEvent } from "electron";

const { ipcRenderer } = window.require("electron");

export const MainPage = () => {
  const {
    state: { pending, error, tabs, activeTab },
    dispatch,
  } = useAppContext();

  const draggingItem = useRef<any>();
  const dragOverItem = useRef<any>();

  const handleDragStart = (
    e: React.DragEvent<HTMLElement>,
    position: number
  ) => {
    //   draggingItem.current = position;
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLButtonElement>,
    position: number
  ) => {
    //   dragOverItem.current = position;
    //   console.log((e.target as HTMLElement).innerHTML);
    //   const listCopy = [...tabs];
    //   console.log(draggingItem.current, dragOverItem.current);
    //   const draggingItemContent = listCopy[draggingItem.current];
    //   listCopy.splice(draggingItem.current, 1);
    //   listCopy.splice(dragOverItem.current, 0, draggingItemContent);
    //   draggingItem.current = dragOverItem.current;
    //   dragOverItem.current = null;
    //   setTabs(listCopy);
  };

  const handleRemoveTab = (index: number) => {
    removeTabAction(dispatch)(index);
  };

  const handleAddTab = () => {
    addNewTabAction(dispatch)();
  };

  const handleTabsChange = (index: number) => {
    setActiveTabAction(dispatch)(index);
  };

  const onFileOpen = async (event: IpcRendererEvent, args: string[]) => {
    const path = args[0];
    const pathsArray: string[] = path.split("/");
    const fileName = pathsArray[pathsArray.length - 1];
    openFileAction(dispatch)(path, fileName);
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

  useEffect(() => {
    ipcRenderer.on("DIRTY_TAB_DIALOG_ANSWER", handleDirtyTabDialogAnswer);
    ipcRenderer.on("FILE_OPEN", onFileOpen);
    ipcRenderer.on("FILE_SAVE", onFileSave);
    ipcRenderer.on("FILE_SAVE_AS", onFileSaveAs);
    return () => {
      ipcRenderer.off("DIRTY_TAB_DIALOG_ANSWER", handleDirtyTabDialogAnswer);
      ipcRenderer.off("FILE_OPEN", onFileOpen);
      ipcRenderer.off("FILE_SAVE", onFileSave);
      ipcRenderer.off("FILE_SAVE_AS", onFileSaveAs);
    };
  }, [tabs, activeTab]);

  console.log("active tab", activeTab);

  return (
    <>
      <PageTabs
        data={tabs}
        activeTab={activeTab}
        handleAddTab={handleAddTab}
        handleRemoveTab={handleRemoveTab}
        handleTabsChange={handleTabsChange}
        handleDragStart={handleDragStart}
        handleDragEnter={handleDragEnter}
      />
    </>
  );
};
