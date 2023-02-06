const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 25,
      trim: true,
    },
  },
  { versionKey: false }
);

const Product = mongoose.model("products", productSchema);

module.exports = Product;
