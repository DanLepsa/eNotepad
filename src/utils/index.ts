const fs = window.require("fs");

import { TabData } from "../context";
import { TabToBeCreated } from "../types";

export const readFileFS = async (filePath: string) => {
  try {
    const data: string = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (err) {
    throw "An error ocurred reading the file :" + err.message;
  }
};

export const writeFileFS = async (filePath: string, content: string) => {
  try {
    await fs.promises.writeFile(filePath, content);

    // alert("The file has been succesfully saved");
  } catch (err) {
    throw "An error ocurred :" + err.message;
  }
};

export const updateLocalContent = async (tabs: TabData[]) => {
  const readFilePromiseList = tabs.map(async (tab) => {
    if (tab.filePath) {
      const updatedContent = await readFileFS(tab.filePath);
      return {
        ...tab,
        content: updatedContent,
      };
    } else {
      return tab;
    }
  });

  try {
    const settledPromises = await Promise.allSettled(readFilePromiseList);
    const updatedTabs: TabData[] = settledPromises.map((p, index) => {
      if (p.status === "rejected") {
        alert(
          `Error reading ${tabs[index].label}, file might have been deleted from the system.`
        );

        return {
          ...tabs[index],
          isDirty: true,
        };
      } else {
        return p.value;
      }
    });

    return updatedTabs;
  } catch (err) {
    console.log("error", err);
  }
};

export const readMultipleFiles = async (
  fileList: FileList,
  tabs: TabData[]
) => {
  const readFilesPromiseList = Array.from(fileList).map(
    async (file) => await readFileFS(file.path)
  );

  try {
    const settledPromises = await Promise.allSettled(readFilesPromiseList);
    const tabsToBeCreated: TabToBeCreated[] = [];
    settledPromises.forEach((p, index) => {
      if (p.status !== "rejected") {
        tabsToBeCreated.push({
          content: p.value,
          filePath: fileList[index].path,
        });
      }
    });

    const tabsToBeCreatedFiltered = tabsToBeCreated.filter(
      // filter out any files that are already opened
      (t) => !tabs.find((tab) => tab.filePath === t.filePath)
    );

    return tabsToBeCreatedFiltered;
  } catch (err) {
    console.log("error", err);
  }
};
