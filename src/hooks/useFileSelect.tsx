import { useCallback, useContext, useEffect, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { createFileList, humanFileSize } from "../utils/file";
type FileHookReturnType = [
    File | FileList | null,
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    (index: number) => void,
    File[]
];

type UseFileSelectProps = {
    multiple?: boolean;
    initialFiles?: File | FileList | null;
    onSelectFiles?: (files: File | FileList | null) => void;
    maxSize?: number;
    usedSize?: number;
};

const useFileSelect = ({
    multiple = false,
    initialFiles = null,
    onSelectFiles = () => { },
    maxSize = 10 * 1024 * 1024,
    usedSize = 0,
}: UseFileSelectProps = {}): FileHookReturnType => {
    const [selectedFiles, setSelectedFiles] = useState<File | FileList | null>(
        initialFiles
    );
    const [invalidFiles, setInvalidFiles] = useState<File[]>([]);
    const { addAlert } = useContext(AlertContext);

    const removeFile = useCallback((index: number) => {
        setSelectedFiles((prevFiles) => {
            if (prevFiles instanceof FileList) {
                const newFiles = Array.from(prevFiles).filter((_, i) => i !== index);
                return newFiles.length > 0 ? createFileList(newFiles) : null;
            }
            return null;
        });
    }, []);

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files) {
                let totalSize = usedSize;
                let isSizeValid = true;
                const newInvalidFiles: File[] = [];
                for (let i = 0; i < files.length; i++) {
                    if (files[i].size > maxSize) {
                        addAlert({
                            type: "error",
                            message: `File ${files[i].name} is too large. Max file size is ${humanFileSize(
                                maxSize
                            )}.`,
                        });
                        isSizeValid = false;
                        newInvalidFiles.push(files[i]);
                    } else {
                        totalSize += files[i].size;
                    }
                }
                try {
                    if (isSizeValid) {
                        const newFiles = multiple
                            ? createFileList([
                                ...(selectedFiles instanceof FileList
                                    ? Array.from(selectedFiles)
                                    : []),
                                ...Array.from(files),
                            ])
                            : createFileList([files[0]]);
                        const newTotalSize = Array.from(newFiles).reduce(
                            (size, file) => size + file.size,
                            usedSize
                        );
                        if (newTotalSize > maxSize) {
                            throw new Error(
                                `Total file size exceeds the maximum size of ${humanFileSize(
                                    maxSize
                                )}.`
                            );
                        }
                        setSelectedFiles(newFiles);
                        onSelectFiles(newFiles);
                    }
                } catch (error: any) {
                    addAlert({ type: "error", message: error });
                }
                setInvalidFiles(newInvalidFiles);
            } else {
                setSelectedFiles(null);
                onSelectFiles(null);
                setInvalidFiles([]);
            }
        },
        [selectedFiles, usedSize, maxSize, multiple, addAlert, onSelectFiles]
    );

    return [selectedFiles, handleFileSelect, removeFile, invalidFiles];
};

export default useFileSelect;