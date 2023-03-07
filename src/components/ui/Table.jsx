import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AlertContext } from "../../contexts/AlertContext";
import api from "../../services/use-axios";
const Table = ({ items, fetch }) => {
  const { addAlert } = useContext(AlertContext);

  const navigate = useNavigate();

  const removeTest = async (id) => {
    try {
      await api.delete(`/tests/${id}`);
      addAlert({ type: "success", message: "Test deleted successfully" });
      fetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
              <td className="table-cell" onClick={() => navigate(`/view/${test._id}`)}>
                {test.name}
              </td>
              <td className="table-cell">{test.dueDate}</td>
              <td className="table-cell">{test.product}</td>
              <td className="table-cell">{test.release}</td>
              <td className="table-cell">{test.branch}</td>
              <td className="table-cell">{test.files?.length > 0 ? test.files?.length : ""}</td>
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
