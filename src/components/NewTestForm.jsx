import { useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { ModalContext } from "../contexts/ModalContext";
import useBranches from "../services/use-branches";
import useProducts from "../services/use-products";
import { formatSelectOptions } from "../utils/utils";
import Button from "./ui/Button";
import ComboBox from "./ui/ComboBox";
import Input from "./ui/Input";

const PRIORITIES = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

function NewTest() {
  const { addAlert } = useContext(AlertContext);
  const { closeModal } = useContext(ModalContext);
  const { products, productsAreEmpty, productsAreLoading, createProduct } = useProducts();
  const { branches, branchesAreEmpty, branchesAreLoading, createBranch } = useBranches();
  const [form, setForm] = useState({
    priority: "medium",
  });

  const createTest = async () => {
    addAlert({
      message: "Test created",
      type: "error",
    });
    closeModal("create-test");
  };

  const onChange = (e) => {
    const { id, value } = e.target ?? e;
    // check if id exists on form
    const exists = Object.keys(form).some((key) => key === id);

    if (exists) {
      // update it
      setForm((prevForm) => ({ ...prevForm, [id]: value }));
    } else {
      // add it
      setForm((prevForm) => ({ ...prevForm, [id]: value }));
    }
  };

  const productsFormatted = formatSelectOptions({ options: products });
  const branchesFormatted = formatSelectOptions({ options: branches });
  return (
    <>
      <form className="form">
        <div className="form-group">
          <select className="select" name="products" id="products">
            {products.length > 0 &&
              productsFormatted.map((product) => (
                <option key={product.value} value={product.value}>
                  {product.label}
                </option>
              ))}
          </select>
          <input className="input" placeholder="Due date" type="date" />
          <input className="input" placeholder="Test name" />
          <select className="select" name="branches" id="branches">
            {branches.length > 0 &&
              branchesFormatted.map((branch) => (
                <option key={branch.value} value={branch.value}>
                  {branch.label}
                </option>
              ))}
          </select>
        </div>
        <Button type="submit" color={"primary"} block={true} onClick={createTest}>
          Create
        </Button>
      </form>
    </>
  );
}

export default NewTest;
