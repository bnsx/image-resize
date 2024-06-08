"use client";

import { singleDownload } from "@/lib/download";
import { Button } from "./ui/button";
import { DownloadIcon } from "@radix-ui/react-icons";

interface DownloadButtonProps {
  blobUrl: string;
  fileName: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  blobUrl,
  fileName,
}) => {
  return (
    <Button
      type="button"
      size={"icon"}
      onClick={() => singleDownload(blobUrl, fileName)}
    >
      <DownloadIcon />
    </Button>
  );
};

export default DownloadButton;
