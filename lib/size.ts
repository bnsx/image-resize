export const toKB = (unit: "kb" | "mb", value: number): number => {
  if (unit === "mb") {
    return value * 1024;
  }
  return value;
};
export const toMB = (unit: "kb" | "mb" | "byte", value: number): number => {
  if (unit === "kb") {
    return value / 1024;
  }
  if (unit === "byte") {
    return value / (1024 * 1024);
  }
  return value;
};
export const toByte = (unit: "kb" | "mb", value: number): number => {
  if (unit === "kb") {
    return value * 1024;
  }
  return value * 1024 * 1024;
};
export function formatFileSize(size: number): string {
  if (size < 1024) {
    return `${size} Byte`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(2)} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}
