import { useEffect, useState } from "react";
import { ReactComponent as Paperclip } from "../../assets/icons/paperclip.svg";
import api from "../../services/use-axios";
import { getBase64 } from "../../utils/utils";
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

  // download file.data (object buffer) as a file
  const downloadFile = async (file) => {
    const base64 = await getBase64(file);
    const link = document.createElement("a");
    link.href = base64;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const removeFile = async ({ testId, fileId }) => {
    try {
      const response = await api.delete(`/tests/files/${testId}/${fileId}`);
      setTestFiles(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // how to update the table
  useEffect(() => {
    console.log("testFiles", testFiles);
  }, [JSON.stringify(testFiles)]);

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
        {items?.map((test, testIndex) => (
          <tr key={test._id + testIndex}>
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
                    <button className="link" onClick={() => downloadFile(file)}>
                      Download - {file.name}
                    </button>
                    <button
                      className="link"
                      onClick={() =>
                        removeFile({
                          testId: test._id,
                          fileId: file._id,
                        })
                      }
                    >
                      Delete file: {file.name}
                    </button>
                    <figure>
                      {<img src={getBase64(file)} width={64} height={64} alt={file.name} />}
                      <figcaption style={{ fontStyle: "italic" }}>{file.name}</figcaption>
                    </figure>
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
