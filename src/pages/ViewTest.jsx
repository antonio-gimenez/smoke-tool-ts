import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ReactComponent as FileIcon } from "../assets/icons/file.svg";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import Drawer from "../components/Drawer/Drawer";
import FileSelector from "../components/FileSelector/FileSelector";
import { TestContext } from "../contexts/TestContext";
import api from "../services/use-axios";
import { downloadFile, getAttachments, humanFileSize } from "../utils/file";
import { AlertContext } from "../contexts/AlertContext";

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const [testFiles, setTestFiles] = useState([]);
  const { addAlert } = useContext(AlertContext);

  useEffect(() => {
    fetch({ id });
  }, [id]);

  useEffect(() => {
    async function loadAttachments() {
      if (tests?.length > 0 && tests[0]?.files?.length > 0) {
        const attachments = await getAttachments(id);
        setTestFiles(attachments);
      }
    }
    loadAttachments();
  }, [tests?.length, id]);

  const removeFile = async ({ testId, fileId }) => {
    try {
      const response = await api.delete(`/tests/files/${testId}/${fileId}`);
      addAlert({ message: response.data.message, type: "success" });
      const newTestFiles = await getAttachments(testId);
      setTestFiles(newTestFiles);
    } catch (error) {
      console.log(error);
      addAlert({ message: error.message, type: "error" });
    }
  };

  const usedFileSize = testFiles?.length > 0 ? testFiles.reduce((acc, file) => acc + file.size, 0) : 0;

  return (
    <div>
      <p>{JSON.stringify(testFiles?.length)}</p>
      <h1>Test Number: {id}</h1>
      <button className="button button-primary" onClick={() => window.history.back()}>
        Go Back
      </button>
      <section className="view">
        {tests?.map((test) => (
          <div key={test._id}>
            <span className="title">{test.name}</span>
            <p>Release: {test.release}</p>
            <p>Product: {test.product}</p>
            <p>Priority: {test.priority}</p>
            <p>Branch: {test.branch}</p>
            {test.files?.length > 0 && (
              <Drawer trigger={<span className="button button-primary">View Attachments</span>} header="Attachments">
                <>
                  <FileSelector usedSize={usedFileSize} maxSize={16000000} />
                  <ul className="file-list">
                    {testFiles?.length > 0 &&
                      testFiles?.map((file) => (
                        <li key={file._id} className="file">
                          <FileIcon />
                          <span className="file-name link " onClick={() => downloadFile(file)}>
                            {file.name}
                          </span>
                          <span className="file-size">{humanFileSize(file.size)}</span>
                          <CloseIcon
                            className="file-close-icon"
                            onClick={() => removeFile({ testId: test._id, fileId: file._id })}
                          />
                        </li>
                      ))}
                  </ul>
                </>
              </Drawer>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}

export default ViewTest;
