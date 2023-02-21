import api from "./use-axios";
import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";

function useBranches() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  const { addAlert } = useContext(AlertContext);

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const response = await api.get("/branches");
        if (response.status === 204) {
          addAlert({
            message: "No branches found",
            type: "warning",
            position: "top-center",
            duration: 3000,
          });
          setEmpty(true);
          setLoading(false);
          return;
        }
        const branches = response.data.data;
        setBranches(branches);
      } catch (error) {
        console.table(error);
        // throw new Error(error);
      }
      return setLoading(false);
    };
    fetchProducts();

    return () => {
      setBranches([]);
      setLoading(false);
      setEmpty(false);
    };
  }, []);

  const createBranch = async (name) => {
    try {
      const response = await api.post(`/branches/${name}`);
      const { message, title, type } = response.data;
      if (response.status === 200) {
        // addAlert({
        //   message,
        //   type,
        //   title,
        // });
        setBranches((prevBranches) => [...prevBranches, response.data.data]);
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

  return { branches, createBranch, branchesAreEmpty: empty, branchesAreLoading: loading };
}

export default useBranches;
