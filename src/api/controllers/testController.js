const { Test } = require("../models/testModel");
const { createQuery, stripNonNumeric, stripNumeric, createPaginationOptions } = require("../utils");

const getTests = async (req, res) => {
  console.log(req.query);
  try {
    const query = createQuery(req);
    const totalCount = await Test.countDocuments(query);
    const options = createPaginationOptions({ req, totalCount });
    let tests;
    if (req.query.testId) {
      tests = await Test.findOne(query);
      if (!tests) {
        return res.status(404).send({ message: "Test not found" });
      }
    } else {
      tests = await Test.find(query, null, options).sort({ dateScheduled: -1 });
    }

    if (!tests) {
      return res.status(204).send(); // return 204 when no test(s) were found
    }

    console.log({ totalCount });
    if (req.query.page) {
      return res.status(200).send({
        data: tests,
        totalCount: totalCount,
        currentItems: `${options.limit + options.skip} / ${totalCount}`,
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
  function zeroPad(num, places) {
    var zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
  }

  function countPlusOne(count) {
    let nonCount = stripNumeric(count);
    let countStr = stripNonNumeric(count);
    let countInt = parseInt(countStr);
    let countPlusOne = countInt + 1;
    let countStrPlusOne = zeroPad(countPlusOne, countStr.length);
    return nonCount + "-" + countStrPlusOne;
  }

  let defaultTestData = {
    product: req.body.product,
    testName: req.body.testName,
    workflows: req.body.workflows,
  };

  try {
    let lastTestId = await Test.findOne({ product: req.body.product }, { testId: 1 }).sort({
      testId: -1,
    });
    if (!lastTestId) {
      lastTestId = { testId: req.body.product + "-" + zeroPad(0, 4) };
    }
    lastTestId = countPlusOne(lastTestId.testId);
    // deadlock prevention

    console.log(req.params);

    let testId = await Test.findOne({ testId: lastTestId });
    while (testId) {
      lastTestId = countPlusOne(lastTestId);
      testId = await Test.findOne({ testId: lastTestId });
    }
    let scheduledTest = new Test({
      testId: lastTestId,
      testName: req.body.testName,
      product: req.body.product,
      branch: req.body.branch,
      requestor: req.body.requestor,
      release: req.body.release,
      test: defaultTestData,
      machine: req.body.machine,
      testExecutor: req.body.testExecutor,
      notes: req.body.notes,
      comments: "",
      status: "Pending",
      priority: req.body.priority,
      dateScheduled: req.body.dateScheduled,
    });

    scheduledTest.save((err) => {
      if (err) return res.status(409).send({ message: `Error saving scheduled test: ${err}` });
      return res.status(200).send({ message: `Test scheduled succesfully` });
    });
  } catch (error) {
    res.status(409).send({ message: `${error}` });
  }
};

const bulkRemove = async (req, res) => {
  const ids = req.body.ids;

  console.log(ids);

  try {
    const scheduledTests = await Test.deleteMany({ _id: { $in: ids } });
    if (!scheduledTests) return res.status(404).send({ message: `Test not found` });
    res.status(200).send({ message: `Tests deleted succesfully` });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

// toggle delete status and set deletedDate to null if deleted is true
const markTestAsDeleted = async (req, res) => {
  const id = req.params.id;
  try {
    const scheduledTest = await Test.findOne({ _id: id });
    if (!scheduledTest) return res.status(404).send({ message: `Test not found` });
    scheduledTest.deleted = !scheduledTest.deleted;
    scheduledTest.dateDeleted = new Date();
    await scheduledTest.save();
    res.status(200).send(scheduledTest);
  } catch (error) {
    res.status(400).send(error);
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

const updateFields = (req, res) => {
  let workflowId = req.body.id;
  let field = req.body.field;
  let value = req.body.value;
  try {
    Test.findOneAndUpdate(
      { "test.workflows._id": workflowId },
      { $set: { [`test.workflows.$.${field}`]: value } },
      { upsert: true },
      (err, workflow) => {
        if (!workflow) return res.status(404).send({ message: `Workflow name not found` });
        res.status(200).send({ message: `Workflow updated ${workflow.test.workflows.field || field}` });
      }
    );
  } catch (error) {
    return res.status(404).send({ message: `Error loading workflow data:${error}` });
  }
};

const updateTest = (req, res) => {
  let testId = req.body.id;
  let field = req.body.field;
  let value = req.body.value;

  if (field === "status") {
    if (value !== "Pending" && value !== "Running") {
      const date = new Date();
      try {
        Test.findOneAndUpdate({ _id: testId }, { $set: { completedDate: date } }, { new: true }).then((test) => {
          if (!test) console.log("test not found");
          else console.log(test);
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  try {
    Test.findOneAndUpdate(
      { _id: testId },
      { $set: { [`${field}`]: value } },
      { new: true, upsert: true },
      (err, test) => {
        // if (!test) return res.status(404).send({ message: `Test name not found` });
        res.status(200).send({ message: `Test updated ${test}` });
      }
    );
  } catch (error) {
    return res.status(404).send({ message: `Error loading test data:${error}` });
  }
};

module.exports = {
  deleteTest,
  markTestAsDeleted,
  updateFields,
  updateTest,
  createTest,
  getTests,
  bulkRemove,
};
