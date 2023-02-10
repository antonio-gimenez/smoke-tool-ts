import { useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { ModalContext } from "../contexts/ModalContext";
import useBranches from "../services/use-branches";
import useProducts from "../services/use-products";
import { formatSelectOptions, selectRandomFromArray } from "../utils/utils";
import UploadFile from "./UploadFile";
import api from "../services/use-axios";
import FileSelector from "./FileSelector";
import Button from "./ui/Button";
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
    name: "",
    files: null,
  });

  const [fileToUpload, setFileToUpload] = useState(null);

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

  const createTest = async (name, files) => {
    try {
      const response = await api.post("/tests", { name, files });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const { name } = form;
    await createTest(name, fileToUpload);
    addAlert({ message: "Test created successfully", type: "success" });
  };

  // const onFileUpload = (files) => {
  //   if (!files) return;
  //   if (!Array.isArray(files)) {
  //     files = [files];
  //   }
  //   setForm((prevForm) => ({ ...prevForm, ["files"]: [fileToUpload] }));
  //   console.log(form);
  // };

  const productsFormatted = formatSelectOptions({ options: products });
  const branchesFormatted = formatSelectOptions({ options: branches });

  const addAlertOnPosition = (position = "top-left") => {
    return addAlert({
      message: "This is a test alert",
      type: selectRandomFromArray(["success", "error", "warning", "info", "base"]),
      position,
    });
  };

  return (
    <>
      <div className="form">
        {form.name}
        <div className="form-group">
          {`file` + fileToUpload}
          <select className="select" name="products" id="name" onChange={onChange}>
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
          {/* <UploadFile onChange={setFileToUpload} /> */}
          <FileSelector multiple={true} onSelectFile={setFileToUpload} />
        </div>
        <Button color={"primary"} onClick={() => addAlertOnPosition()}>
          top-left
        </Button>
        <Button color={"primary"} onClick={() => addAlertOnPosition("top-center")}>
          top-center
        </Button>
        <Button color={"primary"} onClick={() => addAlertOnPosition("top-right")}>
          top-right
        </Button>
        <Button color={"primary"} onClick={() => addAlertOnPosition("bottom-left")}>
          bottom-left
        </Button>
        <Button color={"primary"} onClick={() => addAlertOnPosition("bottom-center")}>
          bottom-center
        </Button>
        <Button color={"primary"} onClick={() => addAlertOnPosition("bottom-right")}>
          bottom-right
        </Button>

        {/* <button className="btn btn-primary" onClick={onSubmit}>
          Submit data
        </button> */}
      </div>
    </>
  );
}

export default NewTest;
