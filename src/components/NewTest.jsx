import { useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { ModalContext } from "../contexts/ModalContext";
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

  const onChangeInput = async (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const submitProduct = async (e) => {
    e.preventDefault();
    createProduct(form.product);
  };

  const productsFormatted = formatSelectOptions({ options: products });
  console.log(productsFormatted);
  return (
    <>
      <section className="grid-with-gap">
        {/* <Input
          placeholder="Product"
          type="text"
          id="name"
          name="product"
          disabled={productsAreLoading}
          onChange={onChangeInput}
        />
        <Button color={"primary"} name={"product"} onClick={submitProduct}>
          Submit
        </Button> */}

        <select className="select" name="products" id="products">
          {products.length > 0 &&
            productsFormatted.map((product) => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
        </select>

        {/* <Input type="date" id="date" value={form.date || ""} onChange={onChange} /> */}
      </section>
      <div>
        <Button color={"primary"} block={true} onClick={createTest}>
          Create
        </Button>
      </div>
    </>
  );
}

export default NewTest;
