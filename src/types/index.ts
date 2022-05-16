export interface EngineDocumentProps {
  documentId: number;
  content: string;
}

export interface TextareaDocumentProps {
  documentId: number;
  content: string;
}

export enum DocumentTypes {
  TEXTAREA = "TEXTAREA",
  ENGINE = "ENGINE",
}

export interface TabToBeCreated {
  content: string;
  filePath: string;
}
