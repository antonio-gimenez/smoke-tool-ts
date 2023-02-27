const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    file: {
      type: Buffer,
    },
    contentType: String,
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    name: {
      type: String,
      default: "Untitled",
    },
    size: {
      type: Number,
      required: true,
    },
    checksum: {
      type: String,
    },
  },
  { versionKey: false }
);

const File = mongoose.model("File", fileSchema);

module.exports = {
  File,
  fileSchema,
};
