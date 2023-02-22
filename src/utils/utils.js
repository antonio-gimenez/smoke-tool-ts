// Description: This file contains all the utility functions used in the application

// Fallback function to generate UUIDs if the browser does not support the crypto.randomUUID() function
export function generateFallbackUUID() {
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

export function generateUUID() {
  // The following `if` checks crypto.randomUUI browser support
  // If the browser supports it, it will use the native function
  // Otherwise, it will use the fallback function that uses performance.now() and Math.random()
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return generateFallbackUUID();
}

//
export function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}

// This function is used to determine if the user is on a mobile device or not depending on the user agent or the window width
export function getDeviceType() {
  const isMobile = window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isDesktop = window.innerWidth > 768 || (!isMobile && /Mac|Windows|Linux/i.test(navigator.userAgent));

  return isMobile ? "mobile" : isDesktop ? "desktop" : "tablet";
}

export function selectRandomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
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

export function humanFileSize(bytes, decimalPlaces = 2) {
  if (!bytes) return "0 B";
  const threshold = 1024;

  if (Math.abs(bytes) < threshold) {
    return bytes + " B";
  }
  const units = ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  let u = -1;
  const r = 10 ** decimalPlaces;
  do {
    bytes /= threshold;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= threshold && u < units.length - 1);
  return bytes.toFixed(decimalPlaces) + " " + units[u];
}

export const upperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export function getBase64(file) {
  if (!file) return null;
  if (file.contentType) {
    const bytes = new Uint8Array(file.file.data);
    const binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    const base64Data = btoa(binary);
    return `data:${file.contentType};base64,${base64Data}`;
  }
}
