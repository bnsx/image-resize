import { atom } from "jotai";

export type FileAtomStatus = "wait" | "inprogress" | "done" | "incomplete";
export type FileAtomDataType = {
  status: FileAtomStatus;
  file: File;
  newFile?: File;
  blobURL: string;
  newBlobURL?: string;
  savedPercent: number;
  signal?: AbortSignal;
  progress: number;
};
export const filesAtom = atom<FileAtomDataType[]>([]);

const statusTranslations: Record<FileAtomStatus, string> = {
  wait: "เตรียมพร้อม",
  inprogress: "กำลังทำงาน",
  done: "เสร็จสิ้น",
  incomplete: "เกิดข้อผิดพลาด",
};

export const handleStatusUpdate = (status: FileAtomStatus): string => {
  return statusTranslations[status];
};
