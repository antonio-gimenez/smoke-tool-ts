const testController = require("./controllers/testController");
const productController = require("./controllers/productController");
const branchController = require("./controllers/branchController");
const fileController = require("./controllers/fileController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/tests/", testController.getTests);
router.post("/tests/", testController.createTest);
router.delete("/tests/", testController.deleteTest);

router.get("/products/", productController.getProducts);
router.post("/products/:name", productController.createProduct);
router.delete("/products/:id", productController.deleteProduct);

router.get("/branches/", branchController.getBranches);
router.post("/branches/:name", branchController.createBranch);
router.delete("/branches/:id", branchController.deleteBranch);

router.post("/files/", upload.single("file"), fileController.uploadFile);
router.get("/files/", fileController.getFile);
router.delete("/files/", fileController.removeFile);
module.exports = router;
