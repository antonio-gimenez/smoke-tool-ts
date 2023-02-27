import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Drawer from "../components/Drawer/Drawer";
import FileSelector from "../components/FileSelector/FileSelector";
import { TestContext } from "../contexts/TestContext";
import api from "../services/use-axios";
import { downloadFile } from "../utils/file";
import { getBase64, humanFileSize } from "../utils/utils";

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const [testFiles, setTestFiles] = useState(null);

  // useeffect fetch tests and when tests are fetched and more than 0, getAttachments function
  useEffect(() => {
    fetch({ id });
    if (tests?.length > 0) {
      getAttachments();
    }
  }, [tests.length]);

  async function getAttachments() {
    const files = tests?.map((test) => test.files);
    return files?.map(async (file) => {
      try {
        const response = await api.get(`/tests/files/${id}`);
        console.log(response.data.data);
        setTestFiles(response.data.data);
      } catch (error) {
        console.log(error);
      }
    });
  }

  const usedFileSize = testFiles?.reduce((acc, file) => acc + file.size, 0);

  return (
    <div>
      <h1>Test Number: {id}</h1>
      <section className="view">
        {tests?.map((test) => {
          return (
            <div key={test._id}>
              <span className="title">{test.name}</span>
              <p> Release: {test.release}</p>
              <p>Product: {test.product}</p>
              <p>Priority: {test.priority}</p>
              <p>Branch: {test.branch}</p>
              {test.files?.length > 0 && (
                <Drawer trigger={<span className="button button-primary">View Attachments</span>} header="Attachments">
                  {testFiles && (
                    <ul className="file-list">
                      {testFiles.map((file) => (
                        <li key={file._id} onClick={() => downloadFile(file)}>
                          <span className="file-name link ">{file.name}</span>
                          <span className="file-size">{humanFileSize(file.size)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <FileSelector usedSize={usedFileSize} maxSize={16000000} />
                </Drawer>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default ViewTest;
