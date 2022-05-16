const fs = window.require("fs");

import { TabData } from "../context";

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
    console.log("errorrr", err);
  }
};
