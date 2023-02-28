import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as FileIcon } from "../assets/icons/file.svg";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import Drawer from "../components/Drawer/Drawer";
import FileSelector from "../components/FileSelector/FileSelector";
import { TestContext } from "../contexts/TestContext";
import api from "../services/use-axios";
import { downloadFile, getAttachments, humanFileSize } from "../utils/file";
import { AlertContext } from "../contexts/AlertContext";

const MAX_FILE_SIZE = 16000000;

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const [testFiles, setTestFiles] = useState<{ _id: string, name: string, size: number }[]>([]);
  const { addAlert } = useContext(AlertContext);
  const history = useNavigate();
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

  const removeFile = async ({ testId, fileId }: { testId: string, fileId: string }) => {
    try {
      const response = await api.delete(`/tests/files/${testId}/${fileId}`);
      addAlert({ message: response.data.message, type: "success" });
      const newTestFiles = await getAttachments(testId);
      setTestFiles(newTestFiles);
    } catch (error) {
      console.log(error);
      addAlert({ message: error, type: "error" });
    }
  };

  const usedFileSize = testFiles?.length > 0 ? testFiles.reduce((acc, file) => acc + file.size, 0) : 0;

  const hasTestFiles = testFiles?.length > 0;

  return (
    <div>
      <p>{JSON.stringify(testFiles?.length)}</p>
      <h1>Test Number: {id}</h1>
      <button className="button button-primary" onClick={() => history(-1)}>       Go Back
      </button>
      <section className="view">
        {tests?.map((test) => (
          <div key={test._id}>
            <span className="title">{test.name}</span>
            <p>Release: {test.release}</p>
            <p>Product: {test.product}</p>
            <p>Priority: {test.priority}</p>
            <p>Branch: {test.branch}</p>
            {hasTestFiles && (
              <Drawer trigger={<span className="button button-primary">View Attachments</span>} title="Attachments">
                <>
                  <FileSelector usedSize={usedFileSize} maxSize={MAX_FILE_SIZE} />
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
