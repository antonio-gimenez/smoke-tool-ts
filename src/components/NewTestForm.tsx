import { useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import api from "../services/use-axios";
import useBranches from "../services/use-branches";
import useProducts from "../services/use-products";
import { formatSelectOptions } from "../utils/utils";
import FileSelector from "./FileSelector/FileSelector";

function NewTest() {
  const { addAlert } = useContext(AlertContext);
  const { products } = useProducts();
  const { branches } = useBranches();
  const [form, setForm] = useState({
    name: "",
    files: null,
  });

  const onChange = (e: any) => {
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

  const createTest = async (name: string, files: any) => {
    try {
      const response = await api.post("/tests", { name, files });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const { name, files } = form;
    await createTest(name, files);
    addAlert({ message: "Test created successfully", type: "success" });
  };

  const productsFormatted = formatSelectOptions({ options: products });
  const branchesFormatted = formatSelectOptions({ options: branches });

  return (
    <div className="form">
      {form.name}
      <div className="form-group">
        <select className="select" name="products" id="name" onChange={onChange}>
          {products.length > 0 &&
            productsFormatted.map((product: any) => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
        </select>
        <input className="input" name="dueDate" placeholder="Due date" type="date" id="dueDate" onChange={onChange} />
        <input className="input" name="testName" placeholder="Test name" id="name" onChange={onChange} />
        <FileSelector />
        <select className="select" name="branches" id="branches" onChange={onChange}>
          {branches.length > 0 &&
            branchesFormatted.map((branch: any) => (
              <option key={branch.value} value={branch.value}>
                {branch.label}
              </option>
            ))}
        </select>
        <button className="button" onClick={onSubmit}>
          Create Test
        </button>
      </div>
    </div>
  );
}

export default NewTest;
