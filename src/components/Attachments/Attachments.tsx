import React from "react";
import { ReactComponent as FileIcon } from "../../assets/icons/file.svg";
import Drawer from "../../components/Drawer/Drawer";
import FileSelector from "../../components/FileSelector/FileSelector";
import { downloadFile, getAttachments, humanFileSize } from "../../utils/file";
import { ReactComponent as CloseIcon } from "../../assets/icons/close.svg";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

interface Props {
    isLoadingAttachments: boolean;
    testFiles: { _id: string; name: string; size: number }[];
    filesToUpload: File | FileList | null;
    usedFileSize: number;
    onUploadFiles: (files: File | FileList | null) => void;
    onRemoveFile: ({ testId, fileId }: { testId: string; fileId: string }) => void;
}

const Attachments: React.FC<Props> = ({
    isLoadingAttachments,
    testFiles,
    filesToUpload,
    usedFileSize,
    onUploadFiles,
    onRemoveFile,
}) => {
    const totalFileSize =
        usedFileSize +
        (filesToUpload instanceof FileList
            ? Array.from(filesToUpload).reduce((acc, file) => acc + file.size, 0)
            : 0);

    return (
        <>
            <FileSelector
                disabled={isLoadingAttachments}
                files={filesToUpload}
                onSelectFiles={(files) => {
                    onUploadFiles(files);
                }}
                usedSize={usedFileSize}
                maxSize={MAX_FILE_SIZE}
            />
            <button
                className={`button button-primary block ${!filesToUpload ? "hidden" : ""}`}
                onClick={() => onUploadFiles(filesToUpload)}
                disabled={!filesToUpload || totalFileSize > MAX_FILE_SIZE}
            >
                Upload
            </button>
            <ul className="file-list">
                {testFiles?.length > 0 &&
                    testFiles?.map((file) => (
                        <li key={file._id} className="file">
                            <FileIcon />
                            <span
                                className="file-name"
                                title={file.name}
                                onClick={() => downloadFile(file)}
                            >
                                {file.name}
                            </span>
                            <span className="file-size">{humanFileSize(file.size)}</span>
                            <CloseIcon
                                className="file-close-icon"
                                aria-disabled={false}
                                onClick={() => onRemoveFile({ testId: testFiles[0]._id, fileId: file._id })}
                            />
                        </li>
                    ))}
            </ul>
        </>
    );
};

export default Attachments;
