import { getColumns } from "./columns";
export function generateUUID() {
  let d = new Date().getTime();
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    d += performance.now(); //use high-precision timer if available
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export function formatSelectOptions({ options }) {
  if (!options.length) return [];
  const formattedOptions = options.map((option) => {
    if (!option.hasOwnProperty("_id") || !option.hasOwnProperty("value") || !option.hasOwnProperty("label")) {
      return { _id: option._id, value: option.value ?? option.name, label: option.label ?? option.name };
    }
    return option;
  });

  return formattedOptions;
}

export function checkTime(time) {
  if (time > 1000) {
    return Math.round(time / 1000);
  }
  return time;
}

export function goToLocationHash(locationHash) {
  if (!locationHash) {
    return;
  }
  window.location.hash = locationHash;
}

export const searchResults = (data, search) => {
  const filteredData = data.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === "object") {
        let objValue = value?.props?.children;
        if (objValue === undefined) {
          return false;
        }
        return String(objValue).toLowerCase().includes(search.toLowerCase());
      }
      return String(value).toLowerCase().includes(search.toLowerCase());
    });
  });
  return filteredData;
};

export function removeHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

export function uniqueId(length = 16) {
  return parseInt(
    Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace(".", "")
  );
}

export function assignId(array) {
  array.forEach((item) => {
    item._id = uniqueId();
  });
}

export function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelcase(str) {
  return str.replace(/-([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export function generateCSV(data, filename = "data.csv") {
  const csv = [];
  const headers = getColumns(data, ["test", "selection", "action"]);
  csv.push(headers.join(","));
  data.forEach((row) => {
    csv.push(
      headers
        .map((header) => {
          const escaped = ("" + row[header]).replace(/"/g, '\\"');
          return `"${escaped}"`;
        })
        .join(",")
    );
  });

  const csvFile = new Blob([csv.join("\n")], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export function isHTML(str) {
  var a = document.createElement("div");
  a.innerHTML = str;

  for (var c = a.childNodes, i = c.length; i--; ) {
    if (c[i].nodeType === 1) return true;
  }
  return false;
}

export function optimizeTemplateHTML(html) {
  return html.replace(/>\s+/g, ">").replace(/\s+</, "<");
}

export const getColorList = () => {
  return ["bg-green-500", "bg-rose-500", "bg-blue-300", "bg-amber-400", "bg-cyan-500", "bg-purple-400", "bg-slate-200"];
};

// remove #
export function removeHash(str) {
  return str.replace("#", "");
}

export const getColor = (status) => {
  switch (status) {
    case "Success":
    case "Closed":
      return "bg-green-500";
    case "Fail":
    case "HW Error":
      return "bg-rose-500";
    case "Warning":
    case "Waiting Feedback":
      return "bg-amber-400";
    case "Skipped":
    case "Repair":
      return "bg-blue-300";
    case "Running":
      return "bg-cyan-500";
    case "Pending":
      return "bg-slate-200";
    case "Neutral":
      return "bg-neutral-50";
    case "Duplicated":
      return "bg-purple-400";
    default:
      return "bg-slate-200";
  }
};

export const getColorFromStatus = (status) => {
  switch (status) {
    case "Success":
      return "text-emerald-700 bg-emerald-200";
    case "Fail":
    case "HW Error":
      return "text-rose-700 bg-rose-200 ";
    case "Warning":
      return "text-amber-700 bg-amber-200 ";
    case "Skipped":
      return "text-sky-700 bg-sky-200 ";
    case "Running":
      return "text-cyan-700 bg-cyan-200 ";
    case "Pending":
      return "text-slate-700 bg-gray-200";
    default:
      return "text-slate-700 bg-gray-200";
  }
};
export const getColorText = (status) => {
  switch (status) {
    case "Success":
      return "text-emerald-700";
    case "Fail":
    case "HW Error":
      return "text-rose-700";
    case "Warning":
      return "text-amber-700";
    case "Skipped":
      return "text-sky-700";
    case "Running":
      return "text-cyan-700";
    case "Pending":
      return "text-slate-700";
    default:
      return "text-slate-700";
  }
};

export function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

export function pushUnique(arr, ...items) {
  items.forEach((item) => {
    if (arr.includes(item)) {
      return;
    }
    arr.push(item);
  });
  return arr;
}

export function isObject(obj) {
  return obj === Object(obj);
}

export function removeItemById(arr, startIndex) {
  const result = arr;
  result.splice(startIndex, 1);
  return result;
}

export function moveItem(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length || newIndex < 0) {
    return arr;
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

export function removeItemByValue(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export function stringToArray(str, separator) {
  return str ? str.split(separator) : [];
}

export function moveItemFromTo(arr, from, to) {
  const item = arr[from];
  arr.splice(from, 1);
  arr.splice(to, 0, item);
  return arr;
}

export function groupBy(array, key) {
  return array.reduce((result, currentValue) => {
    (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
    return result;
  }, {});
}

export function contains(arr, item) {
  return arr.indexOf(item) > -1;
}

export function isArray(arr) {
  return Array.isArray(arr);
}

export function toArray(arr) {
  return Array.from(arr);
}

export function moveItemTo(arr, item, index) {
  const itemIndex = arr.indexOf(item);
  if (itemIndex === -1) {
    return arr;
  }
  arr.splice(itemIndex, 1);
  arr.splice(index, 0, item);
  return arr;
}

export function isIndexOutOfRange(arr, index) {
  return index < 0 || index >= arr.length;
}

export function isArrayProperty(obj, prop) {
  return isArray(obj[prop]);
}

export function getNonFlatArray(arr) {
  return arr.filter((item) => !isArray(item));
}

export function formatStatus(status) {
  if (status === undefined || !status) return;

  switch (status) {
    case "Success":
    case "Closed":
      return (
        <span className="text-emerald-700 font-semibold bg-emerald-200 py-0.5  text-sm  px-1 rounded">{status}</span>
      );
    case "Fail":
      return <span className="text-rose-700 font-semibold bg-rose-200 py-0.5 px-1  text-sm rounded">{status}</span>;
    case "HW Error":
      return <span className="text-rose-700 font-semibold bg-rose-200 py-0.5 px-1  text-sm rounded">{status}</span>;
    case "Warning":
    case "Waiting Feedback":
      return <span className="text-amber-700 font-semibold bg-amber-200 py-0.5 px-1  text-sm rounded">{status}</span>;
    case "Skipped":
    case "Repair":
      return <span className="text-sky-700 font-semibold bg-sky-200 py-0.5 px-1 text-sm  rounded">{status}</span>;
    case "Running":
    case "Assigned":
      return <span className="text-cyan-700 font-semibold bg-cyan-200 py-0.5 px-1  text-sm rounded">{status}</span>;
    case "Pending":
      return <span className="text-gray-700 font-semibold bg-gray-200 py-0.5 px-1  text-sm rounded">{status}</span>;
    case "Duplicated":
      return <span className="text-purple-700 font-semibold bg-purple-200 py-0.5 px-1  text-sm rounded">{status}</span>;
    default:
      return status;
  }
}

const dateOptions = {
  year: "2-digit",
  month: "short",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
};

const dateOptionsAccuracy = {
  year: "2-digit",
  month: "short",
  day: "2-digit",
  hour: "numeric",
  minute: "numeric",
  second: "2-digit",
};

export function isDate(date) {
  return date instanceof Date;
}

export function formatDate(date, accuracy = false) {
  if (isDate(date) || isISOString(date) || isDateString(date) || isUTCString(date)) {
    return new Date(date).toLocaleDateString("en-GB", accuracy ? dateOptionsAccuracy : dateOptions);
  }
  return date;
}

export function isUTCString(str) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(str);
}

export function isDateString(date) {
  return /\d{4}-\d{2}-\d{2}/.test(date);
}

export function isISOString(str) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(str);
}

export function dateToEpoch(timeValue) {
  return formatDate(new Date(timeValue).setHours(0, 0, 0, 0));
}

export function stripTimeString(date) {
  return new Date(date).toDateString();
}

export function daysBetween(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const difference = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24));
  return difference;
}

export function getDate(date) {
  return new Date(date).toDateString();
}

export function today() {
  return new Date().toDateString();
}

export function isPast(date) {
  return new Date(date) < new Date();
}

export function isFuture(date) {
  return new Date(date) > new Date();
}

export function isFutureOrToday(date) {
  return isToday(date) || isFuture(date);
}

export function isToday(date) {
  return dateToEpoch(date) === dateToEpoch(today());
}

export function addTimeOffset(date) {
  const newDate = new Date(date);
  const offset = new Date().getTimezoneOffset();
  const offsetTime = offset * 60000;
  const offsetDate = new Date(newDate.getTime() - offsetTime);
  return offsetDate;
}

export function getDateTime(date) {
  return new Date(date).toISOString().slice(0, 16);
}
