import { useCallback, useContext, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { createFileList, humanFileSize } from "../utils/file";

type UseFileSelectProps = {
    multiple?: boolean;
    initialFiles?: File | FileList | null;
    onSelectFiles?: (files: File | FileList | null) => void;
    maxSize?: number;
    usedSize?: number;
    maxFiles?: number;
};

type FileHookReturnType = [
    File | FileList | null,
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    (index: number) => void,
    File[],
    (files: File | FileList | null) => void
];

const useFileSelect = ({
    multiple = false,
    initialFiles = null,
    onSelectFiles = () => { },
    maxSize = 10 * 1024 * 1024,
    usedSize = 0,
    maxFiles = Infinity
}: UseFileSelectProps = {}): FileHookReturnType => {
    const [selectedFiles, setSelectedFiles] = useState<File | FileList | null>(initialFiles);
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

    const updateSelectedFiles = useCallback(
        (newFiles: File | FileList | null) => {
            setSelectedFiles(newFiles);
            onSelectFiles(newFiles);
        },
        [onSelectFiles]
    );

    const handleFileSelect = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            if (files) {
                let totalSize = usedSize;
                let isSizeValid = true;
                const newInvalidFiles: File[] = [];
                if (files.length > maxFiles) {
                    isSizeValid = false;
                    newInvalidFiles.push(...Array.from(files).slice(maxFiles));
                }
                for (let i = 0; i < files.length; i++) {
                    if (files[i].size > maxSize) {
                        isSizeValid = false;
                        newInvalidFiles.push(files[i]);
                    } else {
                        totalSize += files[i].size;
                    }
                }
                if (isSizeValid) {
                    const newFiles = multiple
                        ? createFileList([
                            ...(selectedFiles instanceof FileList ? Array.from(selectedFiles) : []),
                            ...Array.from(files)
                        ])
                        : createFileList([files[0]]);
                    const newTotalSize = Array.from(newFiles).reduce((size, file) => size + file.size, usedSize);
                    if (newTotalSize > maxSize) {
                        setInvalidFiles(Array.from(files));
                    } else {
                        setSelectedFiles(newFiles);
                        onSelectFiles(newFiles);
                        setInvalidFiles([]);
                    }
                } else {
                    setSelectedFiles(initialFiles);
                    onSelectFiles(initialFiles);
                    setInvalidFiles(newInvalidFiles);
                }
            } else {
                setSelectedFiles(null);
                onSelectFiles(null);
                setInvalidFiles([]);
            }
        },
        [
            selectedFiles,
            usedSize,
            maxSize,
            multiple,
            maxFiles,
            addAlert,
            onSelectFiles,
            initialFiles,
            invalidFiles
        ]
    );

    return [selectedFiles, handleFileSelect, removeFile, invalidFiles, updateSelectedFiles];
};

export default useFileSelect;