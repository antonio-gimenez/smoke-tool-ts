const productController = require("./controllers/productController");
const branchController = require("./controllers/branchController");
const testController = require("./controllers/testController");
const express = require("express");
const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/tests/", testController.getTests);
router.delete("/tests/", testController.deleteTest);
router.post("/tests/", upload.array("files"), testController.createTest);
// Files
router.get("/tests/files/:id", testController.getFiles);

router.get("/products/", productController.getProducts);
router.post("/products/:name", productController.createProduct);
router.delete("/products/:id", productController.deleteProduct);

router.get("/branches/", branchController.getBranches);
router.post("/branches/:name", branchController.createBranch);
router.delete("/branches/:id", branchController.deleteBranch);

module.exports = router;
