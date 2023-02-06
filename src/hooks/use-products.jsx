import { useContext, useEffect, useState } from "react";
import axios from "axios";
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
        const response = await axios
          .get(`${process.env.REACT_APP_API_URL}/products`)
          .then((res) => res.data)
          .then((data) => {
            if (data.data.length === 0) {
              setEmpty(true);
              addAlert({
                message: "No products found",
                type: "warning",
              });
            }
            setProducts(data.data);
          });
      } catch (error) {
        const { message, code } = error;
        addAlert({
          message: "Error retrieving products: " + message,
          type: "error",
          title: code,
        });
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return { products, loading, empty };
}

export default useProducts;
