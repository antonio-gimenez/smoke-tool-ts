import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ReactComponent as CloseIcon } from "../assets/icons/close.svg";
import { ReactComponent as FileIcon } from "../assets/icons/file.svg";
import Drawer from "../components/Drawer/Drawer";
import FileSelector from "../components/FileSelector/FileSelector";
import { AlertContext } from "../contexts/AlertContext";
import { TestContext } from "../contexts/TestContext";
import api from "../services/use-axios";
import { downloadFile, getAttachments, humanFileSize } from "../utils/file";
import { ReactComponent as LoaderIcon } from '../assets/icons/loader.svg';
const MAX_FILE_SIZE = 16000000;

function ViewTest() {
  const { id } = useParams();
  const { tests, fetch } = useContext(TestContext);
  const [testFiles, setTestFiles] = useState<{ _id: string, name: string, size: number }[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File | FileList | null>(null);
  const [isLoadingAttachments, setIsLoadingAttachments] = useState(true); // New state variable
  const [isRemovingFile, setIsRemovingFile] = useState(false);
  const { addAlert } = useContext(AlertContext);
  const history = useNavigate();
  useEffect(() => {
    fetch({ id });
  }, [id]);

  useEffect(() => {
    async function loadAttachments() {
      if (tests?.length > 0 && tests[0]?.files?.length > 0) {
        setIsLoadingAttachments(true);
        // setIsLoadingAttachments(true); // Set isLoadingAttachments to true before loading attachments
        const attachments = await getAttachments(id);
        setTestFiles(attachments);
        // setIsLoadingAttachments(false); // Set isLoadingAttachments to false once attachments have been loaded
        setIsLoadingAttachments(false);
      }
    }
    loadAttachments();

    return () => {
      setTestFiles([]);
      setIsLoadingAttachments(false);
    }

  }, [tests?.length, id]);

  const removeFile = async ({ testId, fileId }: { testId: string, fileId: string }) => {
    try {
      setIsRemovingFile(true);
      const response = await api.delete(`/tests/files/${testId}/${fileId}`);
      // addAlert({ message: response.data.message, type: "success" });
      const newTestFiles = await getAttachments(testId);
      setIsRemovingFile(false);
      setTestFiles(newTestFiles);
    } catch (error) {
      console.log(error);
      setIsRemovingFile(false);
      addAlert({ message: error, type: "error" });
    }
  };

  const usedFileSize = testFiles?.length > 0 ? testFiles.reduce((acc, file) => acc + file.size, 0) : 0;
  const totalFileSize = usedFileSize + (filesToUpload instanceof FileList ? Array.from(filesToUpload).reduce((acc, file) => acc + file.size, 0) : 0);



  const uploadFilesToTest = async (files: File | FileList | null) => {
    if (!files) return;
    try {
      const formData = new FormData();
      if (files instanceof FileList) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      } else {
        formData.append("files", files);
      }
      const response = await api.put(`/tests/files/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      addAlert({ message: response.data.message, type: "success" });
      setFilesToUpload(null);
      const newTestFiles = await getAttachments(id);
      setTestFiles(newTestFiles);

    } catch (error) {
      console.log(error);
      addAlert({ message: error, type: "error" });
    }
  };

  return (
    <div>
      <h1>{JSON.stringify(`filesToBeUploaded: ${filesToUpload}`)}</h1>
      <button className="button button-primary" onClick={() => history(-1)}>Go Back</button>
      <section className="view">
        {tests?.map((test) => (
          <div key={test._id}>
            <span className="title">{test.name}</span>
            <p>Release: {test.release}</p>
            <p>Product: {test.product}</p>
            <p>Priority: {test.priority}</p>
            <p>Branch: {test.branch}</p>

            <Drawer trigger={
              <button className={`button button-primary ${isLoadingAttachments ? 'loading disabled ' : ''
                }`}>{isLoadingAttachments ? 'Loading' : 'View'} Attachments</button>
            } title="Attachments">
              <>
                <FileSelector
                  disabled={isLoadingAttachments}
                  files={filesToUpload}
                  onSelectFiles={(files) => {
                    setFilesToUpload(files);
                  }}
                  usedSize={usedFileSize}
                  maxSize={MAX_FILE_SIZE}
                />
                <button
                  className={`button button-primary block ${!filesToUpload ? 'hidden' : ''}`}

                  onClick={() => uploadFilesToTest(filesToUpload)}
                  disabled={!filesToUpload || totalFileSize > MAX_FILE_SIZE}
                >
                  Upload
                </button>
                <ul className="file-list">
                  {testFiles?.length > 0 &&
                    testFiles?.map((file) => (
                      <li key={file._id} className="file">
                        <FileIcon />
                        <span className="file-name" title={file.name} onClick={() => downloadFile(file)}>
                          {file.name}
                        </span>
                        <span className="file-size">{humanFileSize(file.size)}</span>
                        {isRemovingFile ? <span className="loading" /> :
                          <CloseIcon
                            className="file-close-icon"
                            aria-disabled={isRemovingFile}
                            onClick={() => removeFile({ testId: test._id, fileId: file._id })}
                          />}
                      </li>
                    ))}
                </ul>
              </>
            </Drawer>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ViewTest;
