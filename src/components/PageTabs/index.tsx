import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/tabs";
import { PlusIcon, XIcon } from "@primer/octicons-react";
import React from "react";
import { TextareaDocument } from "../TextareaDocument";

import "./styles.css";

export interface TabData {
  label: string;
  content: string;
}

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
}

export const PageTabs = ({
  data,
  activeTab,
  handleAddTab,
  handleRemoveTab,
  handleTabsChange,
  handleDragStart,
  handleDragEnter,
}: PageTabsProps) => {
  const removeTab = (index: number) => (e: any) => {
    handleRemoveTab(index);
  };

  return (
    <Tabs
      index={activeTab}
      onChange={handleTabsChange}
      variant="enclosed-colored"
      colorScheme={"orange"}
    >
      <TabList background={"#8a8a8a"} paddingLeft={"2.5rem"} paddingTop={"2px"}>
        {data.map((tab, index) => (
          <div
            key={index}
            style={{
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              overflow: activeTab === index ? "visible" : "hidden",
            }}
          >
            <Tab
              key={index}
              draggable={true}
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => handleDragEnter(e, index)}
              background={"#9d9d9d"}
              _selected={{
                color: "white",
                bg: "#272822",
              }}
              style={{
                borderRadius: "4px 4px 0px 0px",
                marginRight: "2px",
                borderColor: "#272822",
                boxShadow: "none",
              }}
            >
              {tab.label}
              <div onClick={removeTab(index)} className={"removeTabButton"}>
                <XIcon size={16} />
              </div>
            </Tab>
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
