import CodeMirror from "@uiw/react-codemirror";
import React, { useEffect, useRef } from "react";
import { javascript } from "@codemirror/lang-javascript";

import { updateTextareaAction } from "../../context/actions";
import { useAppContext } from "../../context/state";
import { EngineDocumentProps } from "../../types";

import styles from "./style.module.scss";

export const EngineDocument = ({
  documentId,
  content,
}: EngineDocumentProps) => {
  const { dispatch } = useAppContext();

  const textareaRef = useRef<any>();
  const lineCounterRef = useRef<HTMLTextAreaElement>();

  // const { setContainer } = useCodeMirror({
  //   container: textareaRef.current as any,
  //   extensions: [javascript()],
  //   value: content,
  // });

  // useEffect(() => {
  //   if (textareaRef.current) {
  //     setContainer(textareaRef.current as any);
  //   }
  // }, [textareaRef.current]);

  // useEffect(() => {
  //   const lineCounter = lineCounterRef.current;
  //   const codeEditor = textareaRef.current;

  //   codeEditor.addEventListener("scroll", () => {
  //     lineCounter.scrollTop = codeEditor.scrollTop;
  //     lineCounter.scrollLeft = codeEditor.scrollLeft;
  //   });

  //   // computeLineCounter();
  // }, []);

  const computeLineCounter = () => {
    const lineCounter = lineCounterRef.current;
    const codeEditor = textareaRef.current;
    let lineCountCache = 0;

    const lineCount = codeEditor.value.split("\n").length;
    const outarr = [];
    if (lineCountCache != lineCount) {
      for (let x = 0; x < lineCount; x++) {
        outarr[x] = x + 1 + ".";
      }
      lineCounter.value = outarr.join("\n");
    }
    lineCountCache = lineCount;
  };

  const handleDivOnInput = () => {
    console.log(textareaRef.current);
    // updateTextareaAction(dispatch)(documentId, textareaRef.current.innerHTML);
  };
  const handleOnInput = () => {
    const lineCounter = lineCounterRef.current;
    const codeEditor = textareaRef.current;
    let lineCountCache = 0;

    const lineCount = codeEditor.value.split("\n").length;
    const outarr = [];
    if (lineCountCache != lineCount) {
      for (let x = 0; x < lineCount; x++) {
        outarr[x] = x + 1 + ".";
      }
      lineCounter.value = outarr.join("\n");
    }
    lineCountCache = lineCount;

    // update app state after on input
    updateTextareaAction(dispatch)(documentId, textareaRef.current.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!textareaRef) {
      return;
    }

    if (e.shiftKey && e.key === "Tab") {
      e.preventDefault();
      const value = textareaRef.current.value;
      const selectionStart = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;

      const beforeStart = value
        .substring(0, selectionStart)
        .split("")
        .reverse()
        .join("");
      const indexOfTab = beforeStart.indexOf("  ");

      if (indexOfTab != -1) {
        textareaRef.current.value =
          beforeStart
            .substring(indexOfTab + 2)
            .split("")
            .reverse()
            .join("") +
          beforeStart.substring(0, indexOfTab).split("").reverse().join("") +
          value.substring(selectionEnd);

        textareaRef.current.selectionStart = selectionStart - 2;
        textareaRef.current.selectionEnd = selectionEnd - 2;
      }
    } else {
      if (e.key === "Tab") {
        e.preventDefault();
        const value = textareaRef.current.value;
        const selectionStart = textareaRef.current.selectionStart;
        const selectionEnd = textareaRef.current.selectionEnd;
        textareaRef.current.value =
          value.substring(0, selectionStart) +
          "  " +
          value.substring(selectionEnd);
        textareaRef.current.selectionStart =
          selectionEnd + 2 - (selectionEnd - selectionStart);
        textareaRef.current.selectionEnd =
          selectionEnd + 2 - (selectionEnd - selectionStart);
      }
    }
  };

  const handleChange = (value: any, viewUpdate: any) => {
    console.log("value:", value);
    updateTextareaAction(dispatch)(documentId, value);
  };

  return (
    <CodeMirror
      value={content}
      className={styles.codeEditor}
      theme={"dark"}
      id={`textarea-${documentId}`}
      extensions={[javascript({ jsx: true })]}
      onChange={handleChange}
      height={"100%"}
    />
  );
};
