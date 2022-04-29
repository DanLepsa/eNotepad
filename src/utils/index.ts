const fs = window.require("fs");

// export const saveTextAsFile = (activePageId: number) => {
//   const textToSave = document.getElementById(
//     `textarea-${activePageId}`
//   ) as HTMLInputElement;
//   console.log("saving ", textToSave.value);

//   const textToSaveAsBlob = new Blob([textToSave.value], { type: "text/plain" });
//   const textToSaveAsURL = window.URL.createObjectURL(textToSaveAsBlob);
//   // const fileNameToSaveAs = (
//   //   document.getElementById("inputFileNameToSaveAs") as HTMLInputElement
//   // ).value;
//   const fileNameToSaveAs = "new"; //todo

//   const downloadLink = document.createElement("a");
//   downloadLink.download = fileNameToSaveAs;
//   downloadLink.innerHTML = "Download File";
//   downloadLink.href = textToSaveAsURL;
//   downloadLink.onclick = destroyClickedElement;
//   downloadLink.style.display = "none";
//   document.body.appendChild(downloadLink);

//   downloadLink.click();
// };

// function destroyClickedElement(event: any) {
//   document.body.removeChild(event.target);
// }

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

// export const loadFileAsText = (fileToLoad: File, activePageId: number) => {
//   const fileReader = new FileReader();
//   fileReader.onload = function (fileLoadedEvent) {
//     const textFromFileLoaded = fileLoadedEvent.target.result;

//     loadTextInActiveTextarea(textFromFileLoaded, activePageId);
//   };
//   console.log("file", fileToLoad);
//   // fileReader.readAsText(fileToLoad, "UTF-8");
//   fileReader.readAsDataURL(fileToLoad);
// };

export const readFileFS = (filePath: string, newTabIndex: number) => {
  fs.readFile(filePath, "utf-8", (err: Error, data: string) => {
    if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
    }

    console.log("The file content is : " + data, typeof data);

    // after data is read , add a new tab
    loadTextInActiveTextarea(data, newTabIndex);
  });
};

export const writeFileFS = (filePath: string, content: string) => {
  fs.writeFile(filePath, content, (err: any) => {
    if (err) {
      alert("An error ocurred creating the file " + err.message);
    }

    alert("The file has been succesfully saved");
  });
};
