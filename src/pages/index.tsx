import React, { useCallback, useEffect, useRef, useState } from "react";
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
  console.log("IN main page ", activeTab);
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
    // const oldTabs = [...tabs];
    // const oldTabs = Object.assign([], tabs);
    // console.log("old tabs", oldTabs);
    // oldTabs.splice(index, 1);
    // console.log("updated old tabs", oldTabs);
    // if (!oldTabs.length) {
    //   setTabs([...oldTabs, emptyTab]); // if it's the last tab, create an empty one
    // } else {
    //   setTabs(oldTabs);
    // }
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
    const fileName = pathsArray[pathsArray.length - 1].split(".")[0];
    openFileAction(dispatch)(path, fileName);
  };

  const onFileSaveAs = async (event: IpcRendererEvent, path: string) => {
    console.log("path ", path);
    await writeFileAction(dispatch)(path, tabs[activeTab].content);

    const pathsArray: string[] = path.split("/");
    const fileName = pathsArray[pathsArray.length - 1].split(".")[0];
    setFilePathOnSaveAction(dispatch)(activeTab, path, fileName);
  };

  const onFileSave = async (event: IpcRendererEvent) => {
    const currentTab = tabs[activeTab];

    if (currentTab.filePath) {
      writeFileAction(dispatch)(currentTab.filePath, tabs[activeTab].content);
    } else {
      console.log(
        "current file doesnt have a path, so open the save as ",
        activeTab
      );
      ipcRenderer.send("OPEN_SAVE_AS_DIALOG");
    }
  };

  const handleDirtyTabDialogAnswer = (
    event: IpcRendererEvent,
    { response, tabIndex }: { response: number; tabIndex: number }
  ) => {
    if (response === 1) {
      const savedState = tabs[tabIndex].saveState;
      savedState === SaveState.UNSAVED
        ? ipcRenderer.send("OPEN_SAVE_AS_DIALOG")
        : writeFileFS(tabs[tabIndex].filePath, tabs[tabIndex].content);
      removeTabAction(dispatch)(tabIndex);
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
