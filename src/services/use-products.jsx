import api from "./use-axios";
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
        const response = await api.get("/praoducts");
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
        console.table(error);
        // throw new Error(error);
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
      const response = await api.post(`/products/${name}`);
      const { message, title, type } = response.data;
      if (response.status === 200) {
        // addAlert({
        //   message,
        //   type,
        //   title,
        // });
        setProducts((prevProducts) => [...prevProducts, response.data.data]);
      }
    } catch (error) {
      // const { message, title } = error.response.data;
      // addAlert({
      //   message: message,
      //   type: "error",
      //   title: title,
      // });
      console.log(error);
    }
  };

  return { products, createProduct: addProduct, productsAreEmpty: empty, productsAreLoading: loading };
}

export default useProducts;
