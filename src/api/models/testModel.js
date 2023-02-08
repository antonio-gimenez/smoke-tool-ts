const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { File } = require("./fileModel");

const testSchema = new Schema(
  {
    testId: {
      type: String,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    requestor: {
      type: String,
      maxlength: 50,
      trim: true,
    },
    product: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    release: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 50,
      trim: true,
    },
    machine: {
      type: String,
      maxlength: 50,
      trim: true,
      uppercase: true,
    },
    assignedTo: {
      type: String,
      maxlength: 50,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    comments: {
      type: String,
      trim: true,
      maxlength: 50000,
    },
    status: {
      type: String,
      trim: true,
      default: "Pending",
      enum: ["Pending", "Success", "Fail", "Skipped", "HW Error", "Warning", "Running"],
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    dateDeleted: {
      type: Date,
      default: null,
    },
    priority: {
      type: String,
      required: true,
      default: "Medium",
      enum: ["Low", "Medium", "High"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    scheduledAt: {
      type: Date,
      default: Date.now(),
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  },
  {
    versionKey: false,
  }
);

const Test = mongoose.model("scheduledTest", testSchema);

module.exports = {
  Test,
};
