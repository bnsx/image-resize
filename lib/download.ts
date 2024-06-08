import { FileAtomDataType } from "@/states/file";
import JSZip from "jszip";

export const downloadAll = async (files: FileAtomDataType[]) => {
  const zip = new JSZip();
  const completedFiles = files.filter((file) => file.status === "done");

  for (const file of completedFiles) {
    if (file.newFile) {
      const blob = file.newFile;
      // Ensure the filename includes the extension
      const filename = file.newFile.name;
      zip.file(`${filename}.jpg`, blob);
    }
  }

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${Date.now()}.zip`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

export const singleDownload = (blobUrl: string, fileName: string) => {
  // Create a temporary link element
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;

  // Append the link to the body and click it
  document.body.appendChild(link);
  link.click();

  // Clean up by removing the link from the DOM
  document.body.removeChild(link);
};
