export type FileStatus = "wait" | "inprogress" | "done" | "incomplete";
export type FileState = {
  status: FileStatus;
  file: File;
  newFile?: File;
  blobURL: string;
  newBlobURL?: string;
  savedPercent: number;
  signal?: AbortSignal;
  progress: number;
};
