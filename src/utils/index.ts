const fs = window.require("fs");

export const openFileFS = async (filePath: string) => {
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
