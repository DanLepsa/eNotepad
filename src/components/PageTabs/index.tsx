import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/tabs";
import { DotFillIcon, PlusIcon, XIcon } from "@primer/octicons-react";
import React, { useRef } from "react";

import { TabData } from "../../context/state";
import { TextareaDocument } from "../TextareaDocument";

import "./styles.css";

const { ipcRenderer } = window.require("electron");

export interface PageTabsProps {
  data: TabData[];
  activeTab: number;
  handleAddTab: () => void;
  handleRemoveTab: (index: number) => void;
  handleTabsChange: (index: number) => void;
  handleDragStart: (
    e: React.DragEvent<HTMLButtonElement>,
    index: number
  ) => void;
  handleDragEnter: (
    e: React.DragEvent<HTMLButtonElement>,
    index: number
  ) => void;
  handleDragEnd: (e: React.DragEvent<HTMLButtonElement>, index: number) => void;
}

export const PageTabs = ({
  data,
  activeTab,
  handleAddTab,
  handleRemoveTab,
  handleTabsChange,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}: PageTabsProps) => {
  const tabListRef = useRef<HTMLElement>();

  const removeTab = (index: number, isDirty: boolean) => async () => {
    if (isDirty) {
      ipcRenderer.send("DIRTY_TAB_DIALOG_QUESTION", { tabIndex: index });
    } else {
      handleRemoveTab(index);
    }
  };

  const handleOnClickTab = (e: React.MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center",
    });
  };

  const handleOnWheel = (e: React.WheelEvent<HTMLElement>) => {
    tabListRef.current.scrollLeft += e.deltaY;
  };

  return (
    <Tabs
      index={activeTab}
      onChange={handleTabsChange}
      variant="enclosed-colored"
      background={"#3e3d32"}
    >
      <TabList
        ref={tabListRef}
        onWheel={handleOnWheel}
        background={"#3e3d32"}
        marginLeft={"2.5rem"}
        paddingTop={"6px"}
        overflowY={"hidden"}
        overflowX={"auto"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        {data.map((tab, index) => (
          <div key={index} className={"tabWrapper"}>
            <Tab
              flexShrink={0}
              key={index}
              draggable={true}
              onClick={handleOnClickTab}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={(e) => handleDragEnd(e, index)}
              className="tab"
              color={"#d9d9d9"}
              background={"#787575"}
              _selected={{
                color: "#fff",
                bg: "#272822",
              }}
              style={{
                borderRadius: "4px 4px 0px 0px",
                marginRight: "2px",
                borderColor: "#272822",
                boxShadow: "none",
                paddingRight: "40px",
                width: "100%",
              }}
            >
              <span>{tab.label}</span>
            </Tab>
            <div
              onClick={removeTab(index, tab.isDirty)}
              className={"removeTabButton"}
              style={{ color: activeTab === index ? "#fff" : "#d9d9d9" }}
            >
              {tab.isDirty ? <DotFillIcon size={16} /> : <XIcon size={16} />}
            </div>
          </div>
        ))}

        <div className="addTabContainer">
          <div onClick={handleAddTab} className={"addTabButton"}>
            <PlusIcon size={16} />
          </div>
        </div>
      </TabList>
      <TabPanels>
        {data.map((tab, index) => (
          <TabPanel key={index} padding={0} className="tabPanel">
            <TextareaDocument documentId={index} content={tab.content} />
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
