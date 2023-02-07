import axios from "./http";

export const getProducts = async () => {
  const response = await axios
    .get("/products")
    .then((response) => response.data)
    .then((data) => data.data);
  return response;
};

export const getProduct = (id) => {
  return axios.get(`/products/${id}`);
};

export const createProduct = (productData) => {
  return axios.post("/products", productData);
};

export const updateProduct = (id, productData) => {
  return axios.put(`/products/${id}`, productData);
};

export const deleteProduct = (id) => {
  return axios.delete(`/products/${id}`);
};
