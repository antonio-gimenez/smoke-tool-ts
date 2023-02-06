export const isIpAddress = (value) => {
  const ipRegex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipRegex.test(value);
};

export const isNumber = (value) => {
  const numberRegex = /^[0-9]+$/;
  return numberRegex.test(value);
};

export const isEmail = (value) => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(value);
};

export const isAlphaNumeric = (value) => {
  const alphaNumericRegex = /^[a-zA-Z0-9 -]+$/;
  return alphaNumericRegex.test(value);
};

export const containsMultipleEmails = (value) => {
  const separator = ";";
  if (value.includes(separator)) {
    return true;
  }
  return false;
};

export const isRelease = (value) => {
  // aplha numeric with dashes, underscores and one dot
  const releaseRegex = /^[a-zA-Z0-9.-_]+$/;
  return releaseRegex.test(value);
};

export const isMultipleEmails = (value) => {
  const separator = ";";
  if (isEmail(value)) {
    return true;
  } else if (containsMultipleEmails(value)) {
    const emails = value.split(separator);
    console.log({ emails });
    for (let i = 0; i < emails.length; i++) {
      if (!isEmail(emails[i].trim())) {
        return false;
      }
    }
    return true;
  }
};

export const replaceSymbols = (value) => {
  if (!value) return;
  const symbolsRegex = /[^a-zA-Z0-9]/g;
  return value.replace(symbolsRegex, "");
};

export const maxLength = (value, max, min) => {
  if (!value) return;
  console.log({ value, max, min });
  if (value.length > max || value.length < min) {
    return true;
  }
  return false;
};
