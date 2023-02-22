const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const prioritySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 12,
      enum: ["low", "medium", "high", "critical"],
    },
  },
  { versionKey: false }
);

const Priority = mongoose.model("Priority", prioritySchema);

module.exports = {
  Priority,
};
