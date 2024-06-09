export const computeSize = (unit: "kb" | "mb", value: number): number => {
  // Define conversion factors
  const KB_TO_MB = 1 / 1024; // 1 KB is 1/1024 MB

  if (unit === "kb") {
    return value * KB_TO_MB;
  }
  return value;
};
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} Byte`;
  } else if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  } else {
    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  }
}
