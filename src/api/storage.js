const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let uploadSingeFile = upload.single("file");

let uploadMultipleFiles = upload.array("files", 10);

let multerHelper = {
  uploadSingeFile,
  uploadMultipleFiles,
};

module.exports = multerHelper;
