import React, { useEffect, useRef } from "react";

import { updateTextareaAction } from "../../context/actions";
import { useAppContext } from "../../context/state";

import "./style.css";

export interface TextareaDocumentProps {
  documentId: number;
  content: string;
}

export const TextareaDocument = ({
  documentId,
  content,
}: TextareaDocumentProps) => {
  const { dispatch } = useAppContext();

  const textareaRef = useRef<HTMLTextAreaElement>();
  const lineCounterRef = useRef<HTMLTextAreaElement>();

  useEffect(() => {
    const lineCounter = lineCounterRef.current;
    const codeEditor = textareaRef.current;

    codeEditor.addEventListener("scroll", () => {
      lineCounter.scrollTop = codeEditor.scrollTop;
      lineCounter.scrollLeft = codeEditor.scrollLeft;
    });

    computeLineCounter();
  }, []);

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

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <textarea
        className="lineCounter"
        wrap="off"
        ref={lineCounterRef}
        readOnly={true}
        defaultValue={1}
        style={{ height: "100%" }}
      ></textarea>
      <textarea
        spellCheck={false}
        ref={textareaRef}
        className="codeEditor"
        id={`textarea-${documentId}`}
        cols={80}
        rows={5}
        value={content}
        onInput={handleOnInput}
        onKeyDown={handleKeyDown}
        style={{ height: "100%" }}
      ></textarea>
    </div>
  );
};
