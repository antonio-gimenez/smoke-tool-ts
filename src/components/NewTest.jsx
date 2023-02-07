import React, { useContext, useEffect, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { ModalContext } from "../contexts/ModalContext";
import useProducts from "../hooks/use-products";
import Button from "./ui/Button";
import ComboBox from "./ui/ComboBox";
import Input from "./ui/Input";

import { getProducts } from "../services/products";
const PRIORITIES = [
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

function NewTest() {
  const { addAlert } = useContext(AlertContext);
  const { closeModal } = useContext(ModalContext);
  // const [products] = useState(getProducts() || []);
  const { products } = useProducts();
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

  console.log("products", products);
  // return;

  return (
    <>
      {JSON.stringify(form)}
      <section className="grid-with-gap">
        <ComboBox
          options={products}
          disabled={false}
          id="product"
          multiple
          placeholder="Select a product"
          onChange={onChange}
        />
        <ComboBox
          options={PRIORITIES}
          id="priority"
          disabled={false}
          multiple={false}
          placeholder="Select a priority"
          onChange={onChange}
        />
        <Input type="date" id="date" value={form.date || ""} onChange={onChange} />
      </section>
      <div>
        <Button onClick={createTest}>Create</Button>
      </div>
    </>
  );
}

export default NewTest;
