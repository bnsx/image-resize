import { FileStatus } from "@/@types/file";
import { type ClassValue, clsx } from "clsx";
import { IBM_Plex_Sans_Thai } from "next/font/google";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const font = IBM_Plex_Sans_Thai({
  subsets: ["thai"],
  weight: ["100", "200", "400", "500", "600", "700"],
});

const statusTranslations: Record<FileStatus, string> = {
  wait: "เตรียมพร้อม",
  inprogress: "กำลังทำงาน",
  done: "เสร็จสิ้น",
  incomplete: "เกิดข้อผิดพลาด",
};

export const handleStatusUpdate = (status: FileStatus): string => {
  return statusTranslations[status];
};
