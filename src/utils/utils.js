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

export const upperCaseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const fileTypes = {
  image: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  svg: ["image/svg+xml"],
  video: ["video/mp4", "video/avi", "video/mov", "video/wmv", "video/3gp", "video/mkv"],
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg"],
  pdf: ["application/pdf"],
  doc: ["application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
  xls: ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
  ppt: ["application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"],
  zip: ["application/zip", "application/x-7z-compressed"],
  text: ["text/plain", "application/json", "application/xml", "application/log", "text/x-log", "text/log"],
};

export function typeIncludes(fileType, typeString) {
  return fileType.includes(fileTypes[typeString]);
}
