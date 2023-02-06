const testController = require("./controllers/testController");
const productController = require("./controllers/productController");
const express = require("express");
const router = express.Router();

// // HELP
//req.params: for URL parameters, such as an id in a RESTful API endpoint, for example, /api/resources/:id.

//req.query: for URL query parameters, such as pagination or filtering, for example, /api/resources?page=2&limit=10.

//req.body: for JSON payload data in a POST or PUT request, for example, {name: "new resource", description: "a resource created by user"}.

router.get("/tests/", testController.getTests);
router.post("/tests/", testController.createTest);
router.delete("/tests/", testController.deleteTest);
// router.delete("/tests/bulk-remove/", testController.bulkRemove);

router.get("/products/", productController.getProducts);
router.post("/products/:name", productController.createProduct);
router.delete("/products/:id", productController.deleteProduct);

module.exports = router;
