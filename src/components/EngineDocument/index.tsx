import CodeMirror, { EditorView } from "@uiw/react-codemirror";
import React from "react";
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

  const handleChange = (value: string, viewUpdate: any) => {
    updateTextareaAction(dispatch)(documentId, value);
  };

  const myTheme = EditorView.theme(
    {
      "&": {
        color: "white",
        backgroundColor: "#272822",
      },
      ".cm-content": {
        caretColor: "#928869",
      },
      ".cm-activeLine": {
        backgroundColor: "#e5e5e512",
      },
      ".cm-scroller": {
        color: "#bebebe",
        lineHeight: 1.2,
      },
      ".ͼb": {
        color: "#c09a0d",
      },
      ".ͼc": {
        color: "#7ab3f8",
      },
      ".ͼd": {
        color: "#c8c59b",
      },
      ".ͼe": {
        color: "#ad7205",
      },
      ".ͼg": {
        color: "#2b89fc",
      },
      ".ͼl": {
        color: "#2b89fc",
      },
      ".ͼm": {
        color: "#085",
      },
      "&.cm-focused .cm-cursor": {
        borderLeftColor: "#0e9",
      },
      "&.cm-focused .cm-selectionBackground, ::selection": {
        backgroundColor: "#2b89fc7a",
      },
      ".cm-gutters": {
        backgroundColor: "#3e3d32",
        color: "#928869",
        border: "none",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        padding: "0 3px 0 5.5px",
      },
    },
    { dark: true }
  );

  const handleDropPrevent = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <CodeMirror
      value={content}
      className={styles.codeEditor}
      theme={myTheme}
      id={`textarea-${documentId}`}
      extensions={[javascript({ jsx: true })]}
      onChange={handleChange}
      height={"100%"}
      onDrop={handleDropPrevent}
      onDropCapture={handleDropPrevent}
    />
  );
};
