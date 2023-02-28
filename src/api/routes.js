const productController = require("./controllers/productController");
const branchController = require("./controllers/branchController");
const testController = require("./controllers/testController");
const express = require("express");
const router = express.Router();
const uploadFiles = require("./storage");

router.get("/tests/", testController.getTests);
router.delete("/tests/:id", testController.deleteTest);
router.post("/tests/", uploadFiles, testController.createTest);
// Files
router.get("/tests/files/:id", testController.getFiles);
router.delete("/tests/files/:testId/:fileId", testController.removeFile);
router.put("/tests/files/:id", uploadFiles, testController.uploadFilesToTest);

router.get("/products/", productController.getProducts);
router.post("/products/:name", productController.createProduct);
router.delete("/products/:id", productController.deleteProduct);

router.get("/branches/", branchController.getBranches);
router.post("/branches/:name", branchController.createBranch);
router.delete("/branches/:id", branchController.deleteBranch);

module.exports = router;
