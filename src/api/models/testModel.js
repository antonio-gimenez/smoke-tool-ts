const mongoose = require("mongoose");
const { File } = require("./fileModel");
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
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
    // files: [fileSchema],
  },
  {
    versionKey: false,
  }
);

const Test = mongoose.model("tests", testSchema);

module.exports = {
  Test,
};
