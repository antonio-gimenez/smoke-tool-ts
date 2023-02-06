const Product = require("../models/productModel");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (!products || products.length === 0) {
      return res.status(204).send(); // return 204 when no product(s) were found
    }
    return res.status(200).send({ data: products });
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

const createProduct = async (req, res) => {
  console.log(req.params.name);
  try {
    const product = await Product.create(req.body);
    return res.status(201).send({ data: product });
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;

  console.log({ id, params, body });
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
