import React, { useEffect, useRef, useState } from "react";
import { readFileFS, writeFileFS } from "../utils";
import { PageTabs } from "../components";

const { ipcRenderer } = window.require("electron");

const initialTabData = [
  {
    label: "Nigerian Jollof",
    content: "Perhaps the greatest dish ever invented.",
    path: undefined,
  },
  {
    label: "Pounded Yam & Egusi",
    content:
      "Perhaps the surest dish ever invented but fills the stomach more than rice.",
    path: "/Users/danwork/Downloads/Untitled",
  },
];

export const MainPage = () => {
  const emptyTab = {
    label: "untitled",
    content: "",
    path: undefined as any,
  };

  const [tabs, setTabs] = useState(initialTabData);
  const [activeTab, setActiveTab] = useState(1);

  const draggingItem = useRef<any>();
  const dragOverItem = useRef<any>();

  const handleDragStart = (
    e: React.DragEvent<HTMLElement>,
    position: number
  ) => {
    draggingItem.current = position;
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLButtonElement>,
    position: number
  ) => {
    dragOverItem.current = position;
    console.log((e.target as HTMLElement).innerHTML);
    const listCopy = [...tabs];
    console.log(draggingItem.current, dragOverItem.current);
    const draggingItemContent = listCopy[draggingItem.current];
    listCopy.splice(draggingItem.current, 1);
    listCopy.splice(dragOverItem.current, 0, draggingItemContent);

    draggingItem.current = dragOverItem.current;
    dragOverItem.current = null;
    setTabs(listCopy);
  };

  const handleRemoveTab = (index: number) => {
    // const oldTabs = [...tabs];
    const oldTabs = Object.assign([], tabs);
    console.log("old tabs", oldTabs);
    oldTabs.splice(index, 1);
    console.log("updated old tabs", oldTabs);
    if (!oldTabs.length) {
      setTabs([...oldTabs, emptyTab]); // if it's the last tab, create an empty one
    } else {
      setTabs(oldTabs);
    }
  };

  const handleAddTab = () => {
    setTabs([...tabs, emptyTab]);

    setActiveTab(tabs.length);
  };

  const handleTabsChange = (index: number) => {
    setActiveTab(index);
  };

  const onFileOpen = async (event: any, args: any) => {
    const newTabIndex = tabs.length;
    handleAddTab();

    readFileFS(args[0], newTabIndex);
  };

  const onFileSaveAs = async (event: any, path: any) => {
    console.log("path ", path);
    writeFileFS(path, tabs[activeTab].content);
  };

  const onFileSave = async (event: any) => {
    const currentTab = tabs[activeTab];

    if (currentTab.path) {
      console.log("save");
      writeFileFS(currentTab.path, tabs[activeTab].content);
    }
  };

  useEffect(() => {
    ipcRenderer.on("FILE_OPEN", onFileOpen);
    ipcRenderer.on("FILE_SAVE", onFileSave);
    ipcRenderer.on("FILE_SAVE_AS", onFileSaveAs);
    () => {
      ipcRenderer.off("FILE_OPEN", onFileOpen);
      ipcRenderer.off("FILE_SAVE", onFileSave);
      ipcRenderer.off("FILE_SAVE_AS", onFileSaveAs);
    };
  }, []);

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
