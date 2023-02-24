const crypto = require("crypto");
const createPaginationOptions = ({ req, totalCount }) => {
  let options = {};
  let limit = parseInt(req.query.limit || 25);

  if (isNaN(limit)) {
    throw new Error("Invalid 'limit', it should be a number");
  }

  if (req.query.page) {
    let page = parseInt(req.query.page);
    if (isNaN(page)) {
      throw new Error("Invalid 'page', it should be a number");
    }
    options.page = page;
    options.skip = options.page * limit;
    options.currentItems = `${options.limit + options.skip} / ${totalCount}`;
  }
  options.limit = limit;

  if (req.query.sort) {
    options.sort = req.query.sort;
  }

  return options;
};
const createQuery = (req) => {
  let query = {};

  const {
    status = undefined,
    days = undefined,
    product = undefined,
    date = undefined,
    deleted = false,
    testId = undefined,
  } = req.query;
  const validateParameter = ({ paramName, paramValue, paramType, isArray, minValue }) => {
    // Helper function to validate query parameters

    // Check if paramValue is not undefined
    if (paramValue === undefined) return false;

    if (paramValue && typeof paramValue !== paramType) {
      // return res.status(400).send({ message: `Invalid ${paramName}, it should be a ${paramType}` });
      throw new Error(`Invalid ${paramName}, it should be a ${paramType}`);
    }
    if (paramValue && isArray && !Array.isArray(paramValue)) {
      // return res.status(400).send({ message: `Invalid ${paramName}, it should be a array of ${paramType}` });
      throw new Error(`Invalid ${paramName}, it should be a array of ${paramType}`);
    }
    if (paramValue && minValue && paramValue < minValue) {
      // return res
      //   .status(400)
      //   .send({ message: `Invalid ${paramName}, it should be greater than or equal to ${minValue}` });
      throw new Error(`Invalid ${paramName}, it should be greater than or equal to ${minValue}`);
    }
  };

  validateParameter({ paramName: "testId", paramValue: testId, paramType: "string" });
  validateParameter({ paramName: "product", paramValue: product, paramType: "object" });
  validateParameter({ paramName: "status", paramValue: status, paramType: "object" });
  validateParameter({ paramName: "days", paramValue: days, paramType: "number", minValue: 0 });
  validateParameter({ paramName: "date", paramValue: date, paramType: "string" });
  validateParameter({ paramName: "deleted", paramValue: deleted, paramType: "boolean" });

  if (status) {
    query.status = { $in: status };
  }
  if (product) {
    query.product = { $in: product };
  }
  if (days) {
    const dateRange = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    query.dateScheduled = { $gte: dateRange };
  }
  if (date) {
    const day = new Date(date);
    const fromDate = day.setHours(0, 0, 0, 0);
    const toDate = day.setHours(23, 59, 59, 999);
    query.dateScheduled = { $gte: fromDate, $lte: toDate };
  }
  query.deleted = deleted || false;
  if (testId) query.testId = testId;

  return query;
};

const stripNonNumeric = (str) => {
  return str.replace(/\D/g, "");
};

const stripNumeric = (str) => {
  return str.replace(/[0-9]/g, "");
};

function calculateChecksum(buffer) {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

module.exports = {
  createQuery,
  stripNonNumeric,
  createPaginationOptions,
  stripNumeric,
  calculateChecksum,
};
