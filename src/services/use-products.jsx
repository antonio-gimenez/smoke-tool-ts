import axios from "./http";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";

function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const { addAlert } = useContext(AlertContext);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/products");
        if (response.status === 204) {
          addAlert({
            message: "No products found",
            type: "warning",
            title: "No products",
          });
          setEmpty(true);
          setLoading(false);
          return;
        }
        const products = response.data.data;
        setProducts(products);
      } catch (error) {
        const { message, code } = error;
        addAlert({
          message: "Error retrieving products: " + message,
          type: "error",
          title: code,
        });
        throw new Error(error);
      }
      return setLoading(false);
    };
    fetchProducts();

    return () => {
      setProducts([]);
      setLoading(false);
      setEmpty(false);
    };
  }, []);

  const addProduct = async (name) => {
    try {
      const response = await axios.post(`/products/${name}`);
      if (response.status === 200) {
        addAlert({
          message: `Product ${name} created`,
          type: "success",
          title: "Added product successfully!",
          duration: 2000,
        });
        setProducts((prevProducts) => [...prevProducts, response.data.data]);
      }
    } catch (error) {
      const { message, code } = error;
      addAlert({
        message: "Error creating product: " + message,
        type: "error",
        title: code,
      });
      throw new Error(error);
    }
  };

  return { products, createProduct: addProduct, productsAreEmpty: empty, productsAreLoading: loading };
}

export default useProducts;
