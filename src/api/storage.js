const multer = require("multer");

const fs = require("fs-extra");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let path = `/uploads`;
    fs.mkdirsSync(path);
    cb(null, __dirname + path);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// multer with max size of 5mb
const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 },
});

let uploadSingeFile = upload.single("file");

let multerHelper = {
  uploadSingeFile,
};

module.exports = multerHelper;
