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
  const { name } = req.body;
  const files = new File(req.files);

  console.log(req.body);

  if (!req.files) {
    console.log(`No files were uploaded.`);
  } else {
    console.log(req.files);
  }

  console.log(new File(req.files[0]));

  if (!name) {
    return res.status(400).send({ message: "Test `name` not provided" });
  }

  const newTest = new Test({
    name,
    files,
  });
  try {
    await newTest.save();
    if (!newTest) return res.status(400).send({ message: `Test not created` });

    res.status(200).send({ message: `Test created successfully!`, data: newTest });
  } catch (error) {
    res.status(500).send(error);
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
};
