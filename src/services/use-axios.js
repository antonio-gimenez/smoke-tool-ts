import axios from "axios";

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

api.interceptors.response.use(
  (response) => {
    console.log(`Request succeeded with status code ${response.status}.`);
    return response;
  },
  (error) => {
    console.error(`Request failed with status code ${error.response.status}.`);
    return Promise.reject(error);
  }
);

export default api;
