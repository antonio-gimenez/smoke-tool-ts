const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const testSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    dueDate: {
      type: Date,
      default: Date.now(),
    },

    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
        required: false,
      },
    ],
    branch: {
      type: String,
      ref: "Branch",
      required: true,
    },
    product: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      required: true,
      default: "low",
    },
  },
  {
    versionKey: false,
  }
);

const Test = mongoose.model("Test", testSchema);

module.exports = {
  Test,
};
