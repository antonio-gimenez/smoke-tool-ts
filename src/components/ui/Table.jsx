import { useState } from "react";
import { ReactComponent as Paperclip } from "../../assets/icons/paperclip.svg";
import api from "../../services/use-axios";
import { getBase64 } from "../../utils/utils";
import Dropdown from "./Dropdown";
const Table = ({ items }) => {
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testFiles, setTestFiles] = useState(null);
  const [open, setOpen] = useState(false);
  const handleFileClick = async (id) => {
    if (selectedTestId === id) {
      setSelectedTestId(null);
      setTestFiles(null);
      return;
    }
    try {
      const response = await api.get(`/tests/files/${id}`);
      console.log(response.data.data);
      setTestFiles(response.data.data);
      setSelectedTestId(id);
    } catch (error) {
      console.log(error);
    }
  };

  const downloadFile = (file) => {
    const base64 = getBase64(file);
    const type = file.contentType;
    console.log(type);
    if (type.includes("svg")) {
      const svg = document.createElement("img");
      svg.src = base64;
      return window.open().document.write(svg.outerHTML);
    }

    if (type.includes("image")) {
      return window.open(base64, "_blank");
    }

    if (type.includes("text") || type.includes("json")) {
      const text = document.createElement("p");
      const decoded = atob(base64.split(",")[1]);
      text.innerText = decoded;
      return window.open().document.write(text.outerHTML);
    }
    // This function is only provided for compatibility with legacy web platform APIs and should never be used in new code, because they use strings to represent binary data and predate the introduction of typed arrays in JavaScript. For code running using Node.js APIs, converting between base64-encoded strings and binary data should be performed using Buffer.from(str, 'base64') andbuf.toString('base64').
    const link = document.createElement("a");
    link.href = base64;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    return document.body.removeChild(link);
  };

  const removeFile = async ({ testId, fileId }) => {
    try {
      const response = await api.delete(`/tests/files/${testId}/${fileId}`);
      setTestFiles(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Due Date</th>
          <th>Product</th>
          <th>Branch</th>
          <th>
            Files <Paperclip width={"16"} height={"16"} />
          </th>
          <th>File Preview</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((test, testIndex) => (
          <tr key={test._id + testIndex}>
            <td>{test.name}</td>
            <td>{test.dueDate}</td>
            <td>{test.product}</td>
            <td>{test.branch}</td>
            <td>
              {test.files?.length > 0 ? (
                <button onClick={() => handleFileClick(test._id)}>
                  {" "}
                  <Paperclip style={{ width: "14px", height: "14px" }} />
                  {test.files?.length}
                </button>
              ) : (
                <></>
              )}
            </td>
            <td>
              {selectedTestId === test._id &&
                testFiles &&
                testFiles.map((file) => (
                  <div key={file._id} className="file">
                    <Dropdown isMenu={true} label={file.name}>
                      <li onClick={() => downloadFile(file)}>View/download file</li>
                      <li
                        onClick={() =>
                          removeFile({
                            testId: test._id,
                            fileId: file._id,
                          })
                        }
                      >
                        Delete file
                      </li>
                    </Dropdown>
                    {/* <figure>
                      {<img src={getBase64(file)} width={64} height={64} alt={file.name} />}
                      <figcaption style={{ fontStyle: "italic" }}>{file.name}</figcaption>
                    </figure> */}
                  </div>
                ))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
