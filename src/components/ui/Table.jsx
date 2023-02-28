import { useContext, useState } from "react";
import { AlertContext } from "../../contexts/AlertContext";
import { TestContext } from "../../contexts/TestContext";
import api from "../../services/use-axios";
import { getBase64 } from "../../utils/file";
import { generateReportWithAttachments } from "../../utils/mail";

const Table = ({ items }) => {
  const { fetch } = useContext(TestContext);
  const { addAlert } = useContext(AlertContext);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const navigate = (id) => {
    window.location.href = `/view/${id}`;
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

  const generateReportMail = async () => {
    setIsGeneratingReport(true);
    const status = await generateReportWithAttachments(items);
    if (status.type === "success") {
      addAlert(status);
      return setIsGeneratingReport(false);
    }
    setIsGeneratingReport(false);
    return addAlert(status);
  };

  return (
    <>
      {isGeneratingReport ? (
        <button className="button button-primary loading" disabled>
          Working on it...
        </button>
      ) : (
        <button className="button button-primary" onClick={generateReportMail}>
          Convert to EML
        </button>
      )}
      <table className="table glass-light">
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
              <td className="table-cell" onClick={() => navigate(test._id)}>
                {test.name}
              </td>
              <td className="table-cell">{test.dueDate}</td>
              <td className="table-cell">{test.product}</td>
              <td className="table-cell">{test.release}</td>
              <td className="table-cell">{test.branch}</td>
              <td className="table-cell">{test.files?.length > 0 ? test.files?.length : null}</td>
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
