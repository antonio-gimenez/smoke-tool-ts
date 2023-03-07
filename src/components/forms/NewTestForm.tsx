import { useContext, useState } from "react";
import { AlertContext } from "../../contexts/AlertContext";
import { ModalContext } from "../../contexts/ModalContext";
import { TestContext } from "../../contexts/TestContext";
import api from "../../services/use-axios";
import useBranches from "../../services/use-branches";
import useProducts from "../../services/use-products";
import { formatSelectOptions } from "../../utils/utils";
import FileSelector from "../../components/FileSelector/FileSelector";

function NewTest({ modalId }: { modalId: string }) {
  const { addAlert } = useContext(AlertContext);
  const { closeModal } = useContext(ModalContext);
  const { fetch } = useContext(TestContext);
  const { products } = useProducts();
  const { branches } = useBranches();
  const [filesToUpload, setFilesToUpload] = useState<File | FileList | null>(null);
  const handleFileSelect = (files: File | FileList | null) => {
    if (files) {
      setFilesToUpload(files);
    } else {
      setFilesToUpload(null);
    }
  };

  const [form, setForm] = useState({
    name: "",
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

  function createTest(data: any, files?: FileList | null) {
    console.log({ data, files });
    const formData = new FormData();

    // Append each field of the form data
    for (const field in data) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        formData.append(field, data[field]);
      }
    }

    // Append each file to the form data
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
    }


    // Send the form data to the server
    api.post('/tests', formData).then(response => {
      console.log('Upload successful!', response.data);
    }).catch(error => {
      console.error('Upload failed!', error);
    });
  }


  const onSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    createTest(form, filesToUpload as FileList | null);
    addAlert({ message: "Test created successfully", type: "success" });
    closeModal(modalId);
    fetch()
  };

  const productsFormatted = formatSelectOptions({ options: products });
  const branchesFormatted = formatSelectOptions({ options: branches });

  return (
    <div className="form">
      <div className="form-group">
        <select className="select" name="products" id="product" onChange={onChange}>
          {products.length > 0 &&
            productsFormatted.map((product: any) => (
              <option key={product.value} value={product.value}>
                {product.label}
              </option>
            ))}
        </select>
        <input className="input" placeholder="Due date" type="date" id="dueDate" onChange={onChange} />
        <input className="input" placeholder="Test name" id="name" onChange={onChange} />
        <FileSelector files={filesToUpload} onSelectFiles={handleFileSelect} />

        <select className="select" id="branch" onChange={onChange}>
          <option value="">Select branch</option>
          {branches.length > 0 ? (
            branchesFormatted.map((branch: any) => (
              <option key={branch.value} value={branch.value} onChange={onChange}>
                {branch.label}
              </option>
            ))) : <option hidden={true} value="No branches">No branches</option>}
        </select>
        <select className="select" id="priority" onChange={onChange}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <input className="input" placeholder="Release" id="release" onChange={onChange} />
      </div>
      <button className="button button-accent button-block" onClick={onSubmit}>
        Create Test
      </button>
    </div>
  );
}

export default NewTest;
