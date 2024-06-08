export const computeSize = (unit: "kb" | "mb", maxSize: number): number => {
  // Define conversion factors
  const KB_TO_MB = 1 / 1024; // 1 KB is 1/1024 MB

  // Convert maxSize to MB based on the unit
  switch (unit) {
    case "kb":
      return maxSize * KB_TO_MB;
    case "mb":
      return maxSize;
    default:
      throw new Error("Invalid unit provided. Must be 'kb' or 'mb'.");
  }
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
