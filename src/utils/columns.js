import { formatDate, isObject } from "./utils";

const columnOrder = [
  "_id",
  "selection",
  "dateScheduled",
  "creationDate",
  "completedDate",
  "product",
  "release",
  "branch",
  "testName",
  "progress",
  "requestor",
  "test",
  "machine",
  "testExecutor",
  "notes",
  "comments",
  "priority",
  "status",
  "actions",
];

// with the columnOrder and the columns, create a list of columns with the correct order
export function getColumnsWithOrder(columns, columnOrder) {
  const columnsWithOrder = [];
  columnOrder.forEach((column) => {
    if (columns.includes(column)) {
      columnsWithOrder.push(column);
    }
  });
  return columnsWithOrder;
}

// check if data is a table

// export function to get columns from table data and filtercolumns
export function getColumns(data, filterColumns = [], isTable = false, actions = false) {
  let columns = [];
  if (!Array.isArray(data)) {
    data = [data];
  }
  const haveTest = data.some((row) => isObject(row.test));
  if (haveTest) {
    data.forEach((row) => {
      row.actions = actions ?? null;
    });
  }

  if (data.length) {
    // get columns from data and exclude columns from filterColumns
    columns = Object.keys(data[0]).filter((column) => !filterColumns.includes(column));
    // if  a column is an object skip it
    // columns = columns.filter((column) => !isObject(data[0][column]));
  }

  // check if  every data column is empty
  // if so, remove it from the columns
  // if not, add it to the columns
  if (data.length > 0) {
    var columnsToRemove = [];
    for (let i = 0; i < columns.length; i++) {
      let column = columns[i];
      let columnData = data.map((item) => item[column]);
      if (columnData.every((item) => item === "" || item === " " || item === null || !item)) {
        columnsToRemove.push(column);
      }
    }
    columnsToRemove.forEach((column) => {
      columns = columns.filter((item) => item !== column);
    });
    if (isTable) {
      columns = getColumnsWithOrder(columns, columnOrder);
    }
  }
  return columns;
}
