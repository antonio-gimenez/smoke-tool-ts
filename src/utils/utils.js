// Description: This file contains all the utility functions used in the application

import api from "../services/use-axios";

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

export async function sendReport(selectedItems) {
  try {
    const files = await Promise.all(
      selectedItems?.map(async (item) => {
        if (item.files.length > 0) {
          const response = await api.get(`/tests/files/${item._id}`);
          return response.data.data;
        }
      })
    );

    console.log(`files length: ${files.length}`);

    const filteredFiles = files.flat().filter((file) => file);

    console.log(`filteredFiles length: ${filteredFiles.length}`);

    const attachments = await Promise.all(
      filteredFiles.map(async (file) => {
        console.log(file);
        const data = btoa(String.fromCharCode(...file.file.data));
        return {
          filename: file.name,
          data,
        };
      })
    );

    console.log(`attachments length: ${attachments.length}`);

    const subject = "Email with attachments";
    const body = "This is the body of the email.";
    const from = "sender@example.com";
    const to = "recipient@example.com";

    const boundary = "my-multipart-boundary";
    const multipartContent = [
      `Content-Type: text/plain\r\n\r\n${body}\r\n`,
      ...attachments.map((attachment) => {
        const { filename, data } = attachment;
        return (
          `--${boundary}\r\n` +
          `Content-Type: application/octet-stream\r\n` +
          `Content-Disposition: attachment; filename="${filename}"\r\n` +
          `Content-Transfer-Encoding: base64\r\n\r\n` +
          `${data}\r\n`
        );
      }),
      `--${boundary}--\r\n`,
    ].join("");

    const emailContent =
      `From: ${from}\r\nTo: ${to}\r\nSubject: ${subject}\r\n` +
      `Content-Type: multipart/mixed; boundary="${boundary}"\r\n\r\n${multipartContent}`;

    const emlContent = `data:application/octet-stream;base64,${btoa(emailContent)}`;

    var encodedUri = encodeURI(emlContent);
    var a = document.createElement("a");
    var linkText = document.createTextNode("fileLink");
    a.appendChild(linkText);
    a.href = encodedUri;
    a.id = "fileLink";
    a.download = "report.eml";
    a.style = "display:none;";
    document.body.appendChild(a);
    document.getElementById("fileLink").click();
    document.body.removeChild(a);

    return true; // indicate success
  } catch (error) {
    console.error("Error sending report:", error);
    return false; // indicate failure
  }
}
