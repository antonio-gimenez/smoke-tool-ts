const { File } = require("../models/fileModel");
const { Test } = require("../models/testModel");
const { createQuery, createPaginationOptions, calculateChecksum } = require("../utils");

const getTests = async (req, res) => {
  try {
    const query = createQuery(req);
    const totalCount = await Test.countDocuments(query);
    const options = createPaginationOptions({ req, totalCount });
    let tests;
    try {
      tests = await Test.find(query, null, options);
      if (!tests) {
        return res.status(204).send({ message: "No tests found" });
      }
    } catch (error) {
      console.log(error);
    }
    if (req.query.page) {
      return res.status(200).send({
        data: tests,
        totalCount: totalCount,
        currentItems: `${
          options.limit + options.skip > totalCount ? totalCount : options.limit + options.skip
        } / ${totalCount}`,
        hasMore: options.skip + options.limit < totalCount,
      });
    } else {
      return res.status(200).send({ data: tests });
    }
  } catch (error) {
    return res.status(400).send({ message: "Invalid request, please check your parameters" });
  }
};

const createTest = async (req, res) => {
  const data = req.body;
  const filesToSave = [];
  console.log(req.files);
  if (!req.files) {
    console.log(`No files were uploaded.`);
  } else if (req.files && Array.isArray(req.files)) {
    console.log(`Files uploaded: ${req.files.length}`);
    req.files.forEach((file) => {
      const newFile = new File({
        name: file.originalname,
        file: file.buffer,
        size: file.size,
        checksum: calculateChecksum(file.buffer),
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
      checksum: calculateChecksum(req.files.buffer),
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

const uploadFilesToTest = async (req, res) => {
  const { id } = req.params;
  const filesToSave = [];

  if (!req.files) {
    console.log(`No files were uploaded.`);
  } else if (req.files && Array.isArray(req.files)) {
    console.log(`Files uploaded: ${req.files.length}`);
    req.files.forEach((file) => {
      const newFile = new File({
        name: file.originalname,
        file: file.buffer,
        size: file.size,
        checksum: calculateChecksum(file.buffer),
        contentType: file.mimetype,
      });
      filesToSave.push(newFile);
    });
    try {
      await File.insertMany(filesToSave);
      if (!filesToSave) {
        return res.status(400).send({ message: "Error saving files" });
      }
      await Test.findByIdAndUpdate(id, { $push: { files: filesToSave } });
      res.status(200).send({ message: "Files uploaded successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error saving files" });
    }
  } else {
    console.log(`File uploaded: ${req.files.originalname}`);
    const newFile = new File({
      name: req.files.originalname,
      checksum: calculateChecksum(req.files.buffer),
      file: req.files.buffer,
      contentType: req.files.mimetype,
    });
    filesToSave.push(newFile);
    try {
      await newFile.save();
      if (!newFile) {
        return res.status(400).send({ message: "Error saving file" });
      }
      await Test.findByIdAndUpdate(id, { $push: { files: newFile } });
      res.status(200).send({ message: "File uploaded successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error saving file" });
    }
  }
};

const removeFile = async (req, res) => {
  const { testId, fileId } = req.params;
  try {
    const deletedFile = await File.findById(fileId);

    if (!deletedFile) {
      return res.status(404).send({ message: "File not found in collection" });
      // throw new Error("File not found in collection");
    }

    await deletedFile.remove();
    if (deletedFile) {
      console.log("File deleted from collection");
    }
    // remove the file on the test

    const test = await Test.findById(testId);

    if (!test) {
      return res.status(404).send({ message: "Test not found in collection" });
      // throw new Error("Test not found in collection");
    }

    const files = test.files;

    const fileIndex = files.findIndex((file) => file._id.toString() === fileId);

    console.log({ fileIndex });

    if (fileIndex === -1) {
      return res.status(404).send({ message: "File not found in test" });
      // throw new Error("File not found in test");
    }

    files.splice(fileIndex, 1);

    await test.save();

    return res.status(200).send({ message: "File deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ message: error.message });
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
  uploadFilesToTest,
};
