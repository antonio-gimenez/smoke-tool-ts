import { useContext, useEffect, useState } from "react";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";
import { ReactComponent as FileIcon } from "../../assets/icons/file.svg";
import Drawer from "../Drawer/Drawer";
import FileSelector from "../FileSelector/FileSelector";
import { downloadFile, getAttachments, humanFileSize } from "../../utils/file";
import { AlertContext } from "../../contexts/AlertContext";
import api from "../../services/use-axios";

type TestAttachmentsProps = {
    test: {
        _id: string;
        files: { _id: string; name: string; size: number }[];
    };
};


const MAX_FILE_SIZE = 15 * 1024 * 1024;

function TestAttachments({ test }: TestAttachmentsProps) {
    const [testFiles, setTestFiles] = useState<{ _id: string; name: string; size: number }[]>([]);
    const [filesToUpload, setFilesToUpload] = useState<File | FileList | null>(null);
    const [isLoadingAttachments, setIsLoadingAttachments] = useState(true);
    const [deletingFileIds, setDeletingFileIds] = useState<string[]>([]);
    const isRemovingFile = (fileId: string) => deletingFileIds.includes(fileId);
    const { addAlert } = useContext(AlertContext)
    useEffect(() => {
        async function loadAttachments() {
            if (test.files?.length > 0) {
                setIsLoadingAttachments(true);
                const attachments = await getAttachments(test._id);
                setTestFiles(attachments);
                setIsLoadingAttachments(false);
            }
        }
        loadAttachments();

        return () => {
            setTestFiles([]);
            setIsLoadingAttachments(false);
        };
    }, [test._id, test.files]);

    const removeFile = async ({ testId, fileId }: { testId: string; fileId: string }) => {
        try {
            setDeletingFileIds([...deletingFileIds, fileId]);
            await api.delete(`/tests/files/${testId}/${fileId}`);
            const newTestFiles = await getAttachments(testId);
            setTestFiles(newTestFiles);
            setDeletingFileIds(deletingFileIds.filter((id) => id !== fileId));
        } catch (error) {
            console.log(error);
            setDeletingFileIds(deletingFileIds.filter((id) => id !== fileId));
            addAlert({ message: error, type: "error" });
        }
    };


    const usedFileSize = testFiles?.length > 0 ? testFiles.reduce((acc, file) => acc + file.size, 0) : 0;
    const totalFileSize =
        usedFileSize + (filesToUpload instanceof FileList ? Array.from(filesToUpload).reduce((acc, file) => acc + file.size, 0) : 0);

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
            const response = await api.put(`/tests/files/${test._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            addAlert({ message: response.data.message, type: "success" });
            setFilesToUpload(null);
            const newTestFiles = await getAttachments(test._id);
            setTestFiles(newTestFiles);
        } catch (error) {
            console.log(error);
            addAlert({ message: error, type: "error" });
        }
    };

    return (
        <Drawer
            trigger={
                <button className={`button button-primary ${isLoadingAttachments ? "loading" : ''} `}> {isLoadingAttachments ? "Loading" : "View"} Attachments</button>
            }
            title="Attachments"
        >
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
                    className={`button button-primary block ${!filesToUpload ? "hidden" : ""}`}
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
                                {isRemovingFile(file._id) ? (
                                    <span className="loading" />
                                ) : (
                                    <CloseIcon
                                        className="file-close-icon"
                                        aria-disabled={isRemovingFile(file._id)} onClick={() => removeFile({ testId: test._id, fileId: file._id })}
                                    />
                                )}
                            </li>
                        ))}
                </ul>
            </>
        </Drawer>
    );
}

export default TestAttachments;
