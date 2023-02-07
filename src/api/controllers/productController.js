const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(204).send({
        message: "No products found",
        type: "warning",
      }); // return 204 when no product(s) were found
    }
    return res.status(200).send({ data: products });
  } catch (error) {
    return res.status(400).send({ title: "Invalid request", message: "Please, check your parameters" });
  }
};

const createProduct = async (req, res) => {
  const { name } = req.params;
  try {
    const newProduct = new Product({ name });
    const product = await newProduct.save();
    return res.status(200).send({
      data: product,
      message: `Added ${product.name} to the database`,
      type: "success",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).send({ title: "Duplicated Item", type: "warning", message: "Product already exists" });
    }

    return res.status(500).send({ title: error.code, message: "An error occurred" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send({ message: "`id` not found or invalid, please check your parameters" });
    }
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }
    return res.status(200).send({ message: "Product deleted successfully", data: product });
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

module.exports = {
  getProducts,
  createProduct,
  deleteProduct,
};
