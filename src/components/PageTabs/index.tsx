import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/tabs";
import { LogIcon, PlusIcon } from "@primer/octicons-react";
import React, { useRef } from "react";
import { useDrop } from "react-dnd";

import { TabData, useAppContext, changeTabOrderAction } from "../../context";
import { TextareaDocument } from "../TextareaDocument";
import { DocumentTypes, ItemTypes, TabToBeCreated } from "../../types";

import styles from "./styles.module.scss";
import { EngineDocument } from "../EngineDocument";
import { readMultipleFiles } from "../../utils";
import { CustomTab } from "./CustomTab";

const { ipcRenderer } = window.require("electron");

export interface PageTabsProps {
  data: TabData[];
  activeTab: number;
  handleAddTab: () => void;
  handleRemoveTab: (index: number) => void;
  handleTabsChange: (index: number) => void;
  handleToggleDocumentType: (index: number) => void;
  handleAddMultipleTabs: (tabs: TabToBeCreated[]) => void;
}

export const PageTabs = ({
  data,
  activeTab,
  handleAddTab,
  handleRemoveTab,
  handleTabsChange,
  handleToggleDocumentType,
  handleAddMultipleTabs,
}: PageTabsProps) => {
  const { dispatch } = useAppContext();

  const tabListRef = useRef<HTMLElement>();

  const removeTab = (index: number, isDirty: boolean) => async () => {
    if (isDirty) {
      ipcRenderer.send("DIRTY_TAB_DIALOG_QUESTION", { tabIndex: index });
    } else {
      handleRemoveTab(index);
    }
  };

  const handleOnWheel = (e: React.WheelEvent<HTMLElement>) => {
    tabListRef.current.scrollLeft += e.deltaY;
  };

  const toggleDocumentType = (index: number) => () => {
    handleToggleDocumentType(index);
  };

  const handleOnDropFile = async (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer.files.length) {
      try {
        const tabsToBeCreated = await readMultipleFiles(
          e.dataTransfer.files,
          data
        );
        handleAddMultipleTabs(tabsToBeCreated);
      } catch {
        console.log("error reading multiple tabs");
      }
    }
  };

  const changeTabOrder = (id: number, to: number) => {
    changeTabOrderAction(dispatch)(id, to);
  };

  const findTab = React.useCallback(
    (id: number) => {
      const tab = data.filter((t) => t.tabId === id)[0];
      return {
        tab,
        tabId: data.indexOf(tab),
      };
    },
    [data]
  );

  const moveTab = React.useCallback(
    (id: number, atIndex: number) => {
      const { tab, tabId } = findTab(id);

      changeTabOrder(tabId, atIndex);
    },
    [changeTabOrder, data, findTab]
  );

  const [, drop] = useDrop(() => ({ accept: ItemTypes.TAB }));

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
        marginLeft={"60px"}
        paddingTop={"6px"}
        overflowY={"hidden"}
        overflowX={"auto"}
        sx={{
          "::-webkit-scrollbar": {
            display: "none",
          },
        }}
      >
        <div ref={drop} style={{ display: "flex" }}>
          {data.map((tab, index) => (
            <CustomTab
              key={index}
              id={tab.tabId}
              tab={tab}
              activeTab={activeTab}
              findTab={findTab}
              changeTabOrder={moveTab}
              removeTab={removeTab}
            />
          ))}

          <div className={styles.addTabContainer}>
            <div onClick={handleAddTab} className={styles.addTabButton}>
              <PlusIcon size={16} />
            </div>
          </div>
        </div>
      </TabList>
      <TabPanels>
        {data.map((tab) => (
          <TabPanel key={tab.tabId} padding={0} className={styles.tabPanel}>
            <div className={styles.tabContent} onDrop={handleOnDropFile}>
              {tab.documentType === DocumentTypes.ENGINE ? (
                <EngineDocument documentId={tab.tabId} content={tab.content} />
              ) : (
                <TextareaDocument
                  documentId={tab.tabId}
                  content={tab.content}
                />
              )}
            </div>
            <div className={styles.tabFooter}>
              <div
                onClick={toggleDocumentType(tab.tabId)}
                className={styles.toggleDocumentType}
                style={{
                  color:
                    tab.documentType === DocumentTypes.ENGINE
                      ? "#0092ff"
                      : "#fff",
                }}
              >
                <LogIcon size={14} />
              </div>
            </div>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
