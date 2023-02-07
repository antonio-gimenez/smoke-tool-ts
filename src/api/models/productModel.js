const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 25,
      index: { unique: true },
      upsert: false,
    },
  },
  { versionKey: false }
);

// ensre that the name is unique
productSchema.index({ name: 1 }, { unique: true });

const Product = mongoose.model("products", productSchema);

module.exports = Product;
