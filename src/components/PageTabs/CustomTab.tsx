import { Tab } from "@chakra-ui/tabs";
import React from "react";

import styles from "./styles.module.scss";
import { TabData } from "../../context";
import { DotFillIcon, XIcon } from "@primer/octicons-react";
import { useDrop, useDrag, DragPreviewImage } from "react-dnd";
import { ItemTypes } from "../../types";

export interface CustomTabProps {
  id: number;
  tab: TabData;
  activeTab: number;
  changeTabOrder: (id: number, to: number) => void;
  findTab: (id: number) => { tabId: number };
  removeTab: (index: number, isDirty: boolean) => () => void;
}

export const boxImage =
  "data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export const CustomTab = ({
  id,
  tab,
  activeTab,
  findTab,
  changeTabOrder,
  removeTab,
}: CustomTabProps) => {
  const originalIndex = findTab(id).tabId;

  const handleOnClickTab = (e: React.MouseEvent<HTMLElement>) => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center",
    });
  };

  const handleOnMouseDown =
    (index: number, isTabDirty: boolean) => (e: React.MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault();
        e.stopPropagation();
        removeTab(index, isTabDirty)();
      }
    };

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ItemTypes.TAB,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          changeTabOrder(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, changeTabOrder]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.TAB,
      hover({ id: draggedId }: { id: number }) {
        if (draggedId !== id) {
          const { tabId: overIndex } = findTab(id);
          changeTabOrder(draggedId, overIndex);
        }
      },
    }),
    [findTab, changeTabOrder]
  );

  return (
    <>
      <DragPreviewImage connect={preview} src={boxImage} />
      <div
        key={id}
        className={styles.tabWrapper}
        ref={(node) => drag(drop(node))}
      >
        <Tab
          flexShrink={0}
          key={id}
          draggable={false}
          onClick={handleOnClickTab}
          onMouseDown={handleOnMouseDown(id, tab.isDirty)}
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
          onClick={removeTab(id, tab.isDirty)}
          className={styles.removeTabButton}
          style={{ color: activeTab === id ? "#fff" : "#d9d9d9" }}
        >
          {tab.isDirty ? <DotFillIcon size={16} /> : <XIcon size={16} />}
        </div>
      </div>
    </>
  );
};
