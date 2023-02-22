import { useState } from "react";
import api from "../../services/use-axios";
import { getImageSrc } from "../../utils/utils";
import { ReactComponent as Paperclip } from "../../assets/icons/paperclip.svg";
const Table = ({ items }) => {
  const [selectedTestId, setSelectedTestId] = useState(null);
  const [testFiles, setTestFiles] = useState(null);

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

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Test Name</th>
          <th>
            Files <Paperclip width={"16"} height={"16"} />
          </th>
          <th>File Preview</th>
        </tr>
      </thead>
      <tbody>
        {items?.map((test, index) => (
          <tr key={test._id + index}>
            <td>{test.name}</td>
            <td>
              {test.files?.length > 0 ? (
                <button onClick={() => handleFileClick(test._id)}>{test.files?.length}</button>
              ) : (
                <div>0</div>
              )}
            </td>
            <td>
              {selectedTestId === test._id &&
                testFiles &&
                testFiles.map((file) => (
                  <div key={file._id}>
                    <p>
                      {file.name} - {file.contentType}
                    </p>
                    {<img src={getImageSrc(file)} alt={file.name} />}
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
