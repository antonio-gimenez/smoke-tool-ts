const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    file: {
      type: Buffer,
    },
    contentType: String,
  },
  { versionKey: false }
);

const File = mongoose.model("Files", fileSchema);

module.exports = {
  File,
};
