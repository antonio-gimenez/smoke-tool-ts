import axios from "axios";

const returnMessageFromStatusCodes = (status) => {
  console.log(status);
  switch (status) {
    case 400:
      return "Bad request.";
    case 401:
      return "Unauthorized.";
    case 403:
      return "Forbidden.";
    case 404:
      return "Not found.";
    case 500:
      return "Internal server error.";
    default:
      return "Something went wrong.";
  }
};

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  // Add a token to the header of every request
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// console.log(`Request succeeded with status code ${response.status}.`);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status } = error.response;
    console.log(`Request failed with status code ${status}.`);
    return Promise.reject({ message: returnMessageFromStatusCodes(status) });
  }
);

export default api;
