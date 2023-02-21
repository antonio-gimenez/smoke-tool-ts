export const createFileList = (files: File[]) => {
  const fileList = new DataTransfer();
  files.forEach((file) => fileList.items.add(file));
  return fileList.files;
};
