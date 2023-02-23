const { File } = require("../models/fileModel");
const { Test } = require("../models/testModel");
const { createQuery, createPaginationOptions } = require("../utils");

const getTests = async (req, res) => {
  console.log(req.query);
  try {
    // const query = createQuery(req);
    const query = {};
    const totalCount = await Test.countDocuments(query);
    // const options = createPaginationOptions({ req, totalCount });
    const options = {};
    console.log({ query, options });
    let tests;
    try {
      tests = await Test.find(query, null, options).sort({ dateScheduled: -1 });
      if (!tests) {
        return res.status(204).send({ message: "No tests found" });
      }
    } catch (error) {
      console.log(error);
    }
    return res.status(200).send({ data: tests });
    // if (req.query.page) {
    //   return res.status(200).send({
    //     data: tests,
    //     totalCount: totalCount,
    //     currentItems: `${options.limit + options.skip} / ${totalCount}`,
    //     hasMore: options.skip + options.limit < totalCount,
    //   });
    // } else {
    //   return res.status(200).send({ data: tests });
    // }
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

const createTest = async (req, res) => {
  const data = req.body;
  const filesToSave = [];

  if (!req.files) {
    console.log(`No files were uploaded.`);
  } else if (req.files && Array.isArray(req.files)) {
    console.log(`Files uploaded: ${req.files.length}`);
    req.files.forEach((file) => {
      const newFile = new File({
        name: file.originalname,
        file: file.buffer,
        contentType: file.mimetype,
      });
      filesToSave.push(newFile);
    });
    try {
      await File.insertMany(filesToSave);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error saving files" });
    }
  } else {
    console.log(`File uploaded: ${req.files.originalname}`);
    const newFile = new File({
      name: req.files.originalname,
      file: req.files.buffer,
      contentType: req.files.mimetype,
    });
    filesToSave.push(newFile);
    try {
      await newFile.save();
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error saving file" });
    }
  }

  if (!data) return res.status(400).send({ message: `Test not created, no data provided` });

  const newTest = new Test({
    ...data,
    files: filesToSave,
  });
  try {
    await newTest.save();
    if (!newTest) return res.status(400).send({ message: `Test not created` });

    res.status(200).send({ message: `Test created successfully!`, data: newTest });
  } catch (error) {
    res.status(500).send(error);
  }
};

const getFiles = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id) {
      return res.status(400).send({ message: "Test `id` not provided" });
    }
    const test = await Test.findById(id).populate("files");

    if (!test) return res.status(404).send({ message: `Test not found` });

    const files = test.files;
    if (files.length === 0) {
      return res.status(204).send({ message: "No files found" });
    }

    res.status(200).send({ data: files });
  } catch (error) {
    console.log(error);
  }
};

const removeFile = async (req, res) => {
  const { testId, fileId } = req.params;
  try {
    const deletedFile = await File.findById(fileId);

    if (!deletedFile) {
      throw new Error("File not found in collection");
    }

    await deletedFile.remove();

    // remove the file on the test

    const test = await Test.findById(testId);

    if (!test) {
      throw new Error("Test not found in collection");
    }

    const files = test.files;

    const fileIndex = files.findIndex((file) => file._id.toString() === fileId);

    if (fileIndex === -1) {
      throw new Error("File not found in test");
    }

    files.splice(fileIndex, 1);

    await test.save();

    return "File successfully removed";
  } catch (error) {
    console.log(error);
    return error.message;
  }
};

const deleteTest = async (req, res) => {
  const { id } = req.params;

  try {
    if (!id) {
      return res.status(400).send({ message: "Test `id` not provided" });
    }
    const scheduledTest = await Test.findOneAndDelete({ _id: id });
    if (!scheduledTest) return res.status(404).send({ message: `Test not found` });
    res.status(200).send(scheduledTest);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  deleteTest,
  createTest,
  getTests,
  getFiles,
  removeFile,
};
