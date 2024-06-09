import { FileState } from "@/@types/file";
import bic, { Options } from "browser-image-compression";
import { toMB } from "./size";

interface ReducerProps {
  data: FileState;
  maxSizeMB: number;
  signal?: AbortSignal;
  fileType?: string;
  setCompressingPercent: (blobURL: string, percent: number) => void;
}
interface BoosterProps {
  data: FileState;
  maxSizeMB: number;
  fileType?: string;
  setCompressingPercent: (blobURL: string, percent: number) => void;
}
export type ReturnProps = {
  blobURL: string;
  status: FileState["status"];
  savedPercent: FileState["savedPercent"];
  file: File;
  newFile?: FileState["newFile"];
};

export async function Reducer({
  data: file,
  maxSizeMB,
  signal,
  fileType = "image/jpeg",
  setCompressingPercent,
}: ReducerProps): Promise<ReturnProps> {
  const options: Options = {
    initialQuality: 0.85,
    alwaysKeepResolution: false,
    maxSizeMB,
    useWebWorker: true,
    preserveExif: false,
    fileType,
    signal,
    onProgress(progress) {
      setCompressingPercent(file.blobURL, progress);
    },
  };
  try {
    const compressedFileData = await bic(file.file, options);
    const timestamp = Date.now();
    const newFilename = `reduced_${timestamp}`;
    // Create a new File object with the compressed data and filename
    const completelyFile = new File([compressedFileData], newFilename, {
      type: fileType,
      lastModified: timestamp,
    });

    const originalSize = file.file.size;
    const compressedSize = compressedFileData.size;

    const savedPercent = parseFloat(
      (((originalSize - compressedSize) / originalSize) * 100).toFixed(2)
    );

    return {
      blobURL: file.blobURL,
      status: "done",
      savedPercent,
      newFile: completelyFile,
      file: file.file,
    };
  } catch (error) {
    return {
      blobURL: file.blobURL,
      status: "incomplete",
      savedPercent: 0,
      file: file.file,
    };
  }
}

export async function ReducerMany(
  imageFiles: FileState[],
  type: "reduce" | "boost",
  maxSizeMB: number,
  setCompressingPercent: (blobURL: string, percent: number) => void
) {
  return await Promise.all(
    imageFiles.map((imageFile) => {
      if (type === "reduce") {
        return Reducer({
          data: imageFile,
          maxSizeMB,
          setCompressingPercent,
        });
      }
      return Booster({
        data: imageFile,
        maxSizeMB,
        setCompressingPercent,
      });
    })
  );
}
export function Booster({
  data,
  maxSizeMB,
  fileType = "image/jpeg",
  setCompressingPercent,
}: BoosterProps): ReturnProps {
  const currentSizeMB = toMB("byte", data.file.size);
  const sizeDifferenceMB = maxSizeMB - currentSizeMB;

  if (sizeDifferenceMB <= 0) {
    // No need to increase size if the new size is smaller than or equal to the original size
    return { ...data, savedPercent: 0 }; // Return data with savedPercent as 0
  }

  // Create a Uint8Array buffer with the desired size difference
  const buffer = new Uint8Array(sizeDifferenceMB * 1024 * 1024);

  // Create a new File object with the original file's data and the additional buffer
  const newFile = new File([data.file, buffer], data.file.name, {
    type: fileType,
    lastModified: Date.now(),
  });

  // Set the saved percent to 100 since we're effectively adding the entire difference
  setCompressingPercent(data.blobURL, 100);

  return { ...data, status: "done", savedPercent: 100, newFile };
}
