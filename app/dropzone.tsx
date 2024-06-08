"use client";

import { FileAtomStatus, filesAtom } from "@/states/file";
import { UploadIcon } from "@radix-ui/react-icons";
import { useAtom } from "jotai";
import { useCallback } from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";

const minSize = 100 * 1024; // 100kb
const acceptMimeTypes = {
  "image/jpeg": [".jpeg", ".jpg"],
  "image/png": [".png"],
};
export function MyDropzone() {
  const [files, setFiles] = useAtom(filesAtom);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFiles((prevFiles) => [
        ...prevFiles,
        ...acceptedFiles.map((file) => ({
          status: "wait" as FileAtomStatus,
          file,
          blobURL: URL.createObjectURL(file),
          savedPercent: 0,
          progress: 0,
        })),
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onDropRejected = useCallback(
    (fileRejection: FileRejection[], event: DropEvent) => {},
    []
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    minSize,
    multiple: true,
    accept: acceptMimeTypes,
  });
  return (
    <div
      {...getRootProps()}
      className="w-full border rounded-[--radius] border-dashed p-5 cursor-pointer"
    >
      <input {...getInputProps()} />
      <div className="text-muted-foreground flex justify-center gap-1">
        {isDragActive ? (
          <p className="text-sm">วางไฟล์ที่นี่ ...</p>
        ) : (
          <>
            <UploadIcon />
            <p className="text-sm">คลิ๊กหรือลากไฟล์มายังที่นี่</p>
          </>
        )}
      </div>
    </div>
  );
}
