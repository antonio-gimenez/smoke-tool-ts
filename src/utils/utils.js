import api from "../services/use-axios";
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

function encodeBase64(data) {
  if (typeof data === "string") {
    data = new TextEncoder().encode(data);
  }
  return btoa(String.fromCharCode(...new Uint8Array(data)));
}

function getAttachmentData(file) {
  return encodeBase64(file.file.data);
}

function getEmailContent(from, to, subject, body, attachments) {
  const boundary = "my-multipart-boundary";
  const attachmentHeaders = attachments
    .map(({ filename }) =>
      [
        `--${boundary}`,
        `Content-Type: application/octet-stream`,
        `Content-Disposition: attachment; filename="${filename}"`,
        `Content-Transfer-Encoding: base64`,
        "",
      ].join("\r\n")
    )
    .join("\r\n");

  const attachmentData = attachments.map(({ data }) => data).join("\r\n--" + boundary + "\r\n");

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/plain`,
    "",
    body,
    `--${boundary}`,
    attachmentHeaders,
    attachmentData,
    `--${boundary}--`,
    "",
  ].join("\r\n");
}

export async function generateReport(selectedItems) {
  if (!Array.isArray(selectedItems)) {
    throw new TypeError("selectedItems must be an array");
  }

  try {
    const files = await Promise.all(
      selectedItems
        .filter((item) => item.files.length > 0)
        .map(async (item) => {
          const response = await api.get(`/tests/files/${item._id}`);
          return response.data.data;
        })
    );

    const attachments = files
      .flat()
      .filter((file) => file)
      .map((file) => ({
        filename: file.name,
        data: getAttachmentData(file),
      }));

    const from = "sender@example.com";
    const to = "recipient@example.com";
    const subject = "Email with attachments";
    const body = "This is the body of the email.";

    const emailContent = getEmailContent(from, to, subject, body, attachments);
    const emlContent = `data:application/octet-stream;base64,${encodeBase64(emailContent)}`;

    const a = document.createElement("a");
    a.href = emlContent;
    a.download = "report.eml";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    console.log("Email sent successfully.");
    return true;
  } catch (error) {
    console.error("An error occurred while sending the email:", error);
  }
}

// Call this function to send the report
async function generateReportWithAttachments(selectedItems) {
  try {
    await generateReport(selectedItems);
  } catch (error) {
    console.error("An error occurred while sending the report:", error);
  }
}
