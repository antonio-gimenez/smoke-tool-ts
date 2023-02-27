import { getBase64 } from "./utils";

export const createFileList = (files: File[]) => {
  const fileList = new DataTransfer();
  files.forEach((file) => fileList.items.add(file));
  return fileList.files;
};

export function getAttachments(files: FileList) {
  const attachments = [];
  for (let i = 0; i < files.length; i++) {
    attachments.push(files[i]);
  }
  return attachments;
}

export function downloadFile(file: any) {
  const base64 = getBase64(file) as string;
  const type = file.contentType;
  const isImage = type.includes("image");
  const isSvg = type.includes("svg");

  if (isSvg) {
    const svg = document.createElement("img") as HTMLImageElement;
    svg.src = base64 as string;

    return svg;
  }

  if (type.includes("image")) {
    return window.open(base64, "_blank");
  }

  const link = document.createElement("a");
  link.href = base64;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  return document.body.removeChild(link);
}
