export type FileStatus =
  | "wait"
  | "inprogress"
  | "done"
  | "incomplete"
  | "nochange";
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
