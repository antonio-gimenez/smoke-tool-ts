// Description: This file contains all the utility functions used in the application

// This function generates a UUID
export function generateUUID() {
  let d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Exports a function that formats the options for a select element
export function formatSelectOptions({ options }) {
  if (!options.length) return [];
  const formattedOptions = options.map((option) => {
    if (!option.hasOwnProperty("_id") || !option.hasOwnProperty("value") || !option.hasOwnProperty("label")) {
      return { _id: option._id, value: option.value ?? option.name, label: option.label ?? option.name };
    }
    return option;
  });

  return formattedOptions;
}

export function humanFileSize(bytes, dp = 1) {
  if (!bytes) return "0 B";
  const threshold = 1024;

  if (Math.abs(bytes) < threshold) {
    return bytes + " B";
  }
  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let u = -1;
  const r = 10 ** dp;
  do {
    bytes /= threshold;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= threshold && u < units.length - 1);
  return bytes.toFixed(dp) + " " + units[u];
}
