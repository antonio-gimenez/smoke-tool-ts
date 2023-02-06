export function arrayBufferToBase64(buffer) {
  var binary = "";
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64toArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

// export a function image src
export function docSrc(file) {
  const base64Flag = `data:${file.contentType || file.type};base64,`;
  // convert to base64
  const imageBase64 = arrayBufferToBase64(file.file.data.data);
  // return the image
  let docSrc = base64Flag + imageBase64;
  return docSrc;
}

// download document as blob
export function downloadDocument(filename, file) {
  const base64Flag = `data:${file.contentType || file.type};base64,`;
  // convert to base64
  const documentBase64 = arrayBufferToBase64(file.file.data.data);
  // return the image
  let documentSrc = base64Flag + documentBase64;
  // create a link to download the file with file name
  let downloadLink = document.createElement("a");
  downloadLink.href = documentSrc;
  downloadLink.download = filename;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0) byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

// compress image with a new promise if is solved return the image
export function compressImage(image) {
  const a = new Promise((resolve, reject) => {
    const img = new Image();
    img.src = image;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/jpeg"));
    };
    img.onerror = (error) => reject(error);
  });
  return image;
}
