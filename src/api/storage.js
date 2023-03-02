const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const uploadFiles = upload.array("files", 10, function (err, req, res, next) {
//   if (err instanceof multer.MulterError) {
//     res.status(400).send("Too many files uploaded");
//   } else {
//     next(err);
//   }
// });

const uploadFiles = upload.array("files", 10);

module.exports = uploadFiles;
