const fs = window.require("fs");

export const loadTextInActiveTextarea = (
  allText: any,
  activePageId: number
) => {
  console.log("all text is ", allText);
  console.log("active page id ", activePageId);
  const textBox = document.getElementById(
    `textarea-${activePageId}`
  ) as HTMLInputElement;

  textBox.value = allText;
};

// export const readFileFS = (filePath: string, newTabIndex: number) => {
//   fs.readFile(filePath, "utf-8", (err: Error, data: string) => {
//     if (err) {
//       alert("An error ocurred reading the file :" + err.message);
//       return;
//     }

//     console.log("The file content is : " + data, typeof data);

//     // after data is read , add a new tab
//     loadTextInActiveTextarea(data, newTabIndex);
//   });
// };

export const openFileFS = async (filePath: string) => {
  try {
    const data: string = await fs.promises.readFile(filePath, "utf-8");
    return data;
  } catch (err) {
    throw "An error ocurred reading the file :" + err.message;
  }
};

export const writeFileFS = async (filePath: string, content: string) => {
  console.log("write file ", filePath);
  try {
    await fs.promises.writeFile(filePath, content, { flag: "w" });

    // fs.writeFileSync(filePath, content, { encoding: "utf8" });

    alert("The file has been succesfully saved");
  } catch (err) {
    throw "An error ocurred :" + err.message;
  }
};
