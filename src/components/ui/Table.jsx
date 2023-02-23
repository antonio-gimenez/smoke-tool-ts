import { useContext, useState } from "react";
import { ReactComponent as Paperclip } from "../../assets/icons/paperclip.svg";
import { AlertContext } from "../../contexts/AlertContext";
import { TestContext } from "../../contexts/TestContext";
import api from "../../services/use-axios";
import { getBase64, sendReport } from "../../utils/utils";
import Dropdown from "./Dropdown";
const Table = ({ items }) => {
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testFiles, setTestFiles] = useState(null);
  const { fetch } = useContext(TestContext);
  const { addAlert } = useContext(AlertContext);

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

  const removeTest = async (id) => {
    try {
      const response = await api.delete(`/tests/${id}`);
      addAlert({ type: "success", message: "Test deleted successfully" });
      fetch();
    } catch (error) {
      console.log(error);
    }
  };

  const sendReportMail = () => {
    const status = sendReport(items);
    if (status) {
      return addAlert({ type: "success", message: "Report generated successfully" });
    }

    return addAlert({ type: "error", message: "Report generation failed" });
  };

  return (
    <>
      <button className="button button-accent" onClick={() => sendReport(items)}>
        Convert to EML
      </button>
      <table className="table">
        <thead className="table-header">
          <tr>
            <th>Test Name</th>
            <th>Due Date</th>
            <th>Product</th>
            <th>Release</th>
            <th>Branch</th>
            <th>Attachments</th>
            <th>Priority</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items?.map((test, testIndex) => (
            <tr key={test._id + testIndex} className="table-row">
              <td className="table-cell">{test.name}</td>
              <td className="table-cell">{test.dueDate}</td>
              <td className="table-cell">{test.product}</td>
              <td className="table-cell">{test.release}</td>
              <td className="table-cell">{test.branch}</td>
              <td className="table-cell">
                {test.files?.length > 0 ? (
                  <button className="badge badge-info" onClick={() => handleFileClick(test._id)}>
                    <Paperclip style={{ width: "14px", height: "14px" }} />
                    {test.files?.length}
                  </button>
                ) : (
                  <></>
                )}
                {selectedTestId === test._id &&
                  testFiles &&
                  testFiles.map((file) => (
                    <div key={file._id} className="file">
                      <Dropdown isMenu={true} label={<span className="link">{file.name}</span>}>
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
                    </div>
                  ))}
              </td>
              <td className="table-cell">{test.priority}</td>

              <td className="table-cell">
                <button onClick={() => removeTest(test._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Table;
