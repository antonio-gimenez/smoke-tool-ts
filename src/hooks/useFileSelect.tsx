import { useCallback, useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { createFileList, humanFileSize } from "../utils/file";

type FileHookReturnType = [
    File | FileList | null,
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    (index: number) => void,
    (files: File | FileList | null) => void,
    (() => void)
];

type UseFileSelectProps = {
    multiple?: boolean;
    initialFiles?: File | FileList | null;
    onSelectFiles?: (files: File | FileList | null) => void;
    maxSize?: number;
    usedSize?: number;
    maxSelectedFiles?: number;
};

const useFileSelect = ({
    multiple = false,
    initialFiles = null,
    onSelectFiles = () => { },
    maxSize = 10 * 1024 * 1024,
    usedSize = 0,
    maxSelectedFiles = 10, // This prevents the user selection of more than 10 files at once. Will reject all files if the user tries to select more than 10 files.
}: UseFileSelectProps = {}): FileHookReturnType => {
    const [selectedFiles, setSelectedFiles] = useState<File | FileList | null>(initialFiles);
    const { addAlert } = useContext(AlertContext);

    const removeFile = useCallback(
        (index: number) => {
            setSelectedFiles((prevFiles) => {
                if (prevFiles instanceof FileList) {
                    const newFiles = Array.from(prevFiles).filter((_, i) => i !== index);
                    return newFiles.length > 0 ? createFileList(newFiles) : null;
                }
                return null;
            });
            if (!selectedFiles) {
                onSelectFiles(null);
            }
        },
        [onSelectFiles, selectedFiles]
    );

    const updateSelectedFiles = useCallback(
        (newFiles: File | FileList | null) => {
            setSelectedFiles(newFiles);
            onSelectFiles(newFiles);
        },
        [onSelectFiles]
    );


    const clearSelectedFiles = useCallback(() => {
        setSelectedFiles(null);
        onSelectFiles(null);
    }, [onSelectFiles]);

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files) {
                const numSelectedFiles = selectedFiles && selectedFiles instanceof FileList ? selectedFiles.length : 0;
                const filesToSelect = Array.from(files).slice(0, maxSelectedFiles - numSelectedFiles);
                if (filesToSelect.length > 0) {
                    let totalSize = usedSize;
                    let isSizeValid = true;
                    for (let i = 0; i < filesToSelect.length; i++) {
                        if (filesToSelect[i].size > maxSize) {
                            addAlert({
                                type: "error",
                                position: "top-center",
                                message: <span>
                                    File <strong>{filesToSelect[i].name}</strong> is too large. Max file size is {humanFileSize(maxSize)}
                                </span>
                            });
                            isSizeValid = false;
                        } else {
                            totalSize += filesToSelect[i].size;
                        }
                    }
                    if (isSizeValid) {
                        const newFiles = multiple
                            ? createFileList([
                                ...(selectedFiles instanceof FileList ? Array.from(selectedFiles) : []),
                                ...filesToSelect,
                            ])
                            : createFileList([filesToSelect[0]]);
                        const newTotalSize = Array.from(newFiles).reduce((size, file) => size + file.size, usedSize);
                        if (newTotalSize > maxSize) {
                            addAlert({
                                type: "error",
                                title: "Total file size exceeds maximum size allowed",
                                position: "top-center",
                                message: `Due to the size of the files you selected, the total file size exceeds the maximum size of ${humanFileSize(maxSize)}.`,
                            });
                        } else {
                            setSelectedFiles(newFiles);
                            onSelectFiles(newFiles);
                        }
                    } else {
                        setSelectedFiles(initialFiles);
                        onSelectFiles(initialFiles);
                    }
                } else {
                    addAlert({
                        type: "warning",
                        title: "Too many files selected",
                        position: "top-center",
                        message: `Cannot select more than ${maxSelectedFiles} files at once.\nIf you want to select more, please do so in batches of ${maxSelectedFiles} or less.`,
                    });
                }
            } else {
                setSelectedFiles(null);
                onSelectFiles(null);
            }
        },
        [selectedFiles, usedSize, maxSize, multiple, addAlert, onSelectFiles, initialFiles, maxSelectedFiles]
    );

    return [selectedFiles, handleFileSelect, removeFile, updateSelectedFiles, clearSelectedFiles];
};


export default useFileSelect;