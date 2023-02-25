import { useContext, useEffect, useState } from "react";
import { AlertContext } from "../contexts/AlertContext";
import { createFileList } from "../utils/file";
type FileHookReturnType = [
    File | FileList | null,
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    (index: number) => void,
    () => void
];

type UseFileSelectProps = {
    multiple?: boolean
    initialFiles?: File | FileList | null
    handler?: (files: File | FileList | null) => void
    maxFileSize?: number
};

const useFileSelect = ({
    multiple = false,
    initialFiles = null,
    handler = () => { },
    maxFileSize = 10 * 1024 * 1024,
}: UseFileSelectProps = {}): FileHookReturnType => {
    const [selectedFiles, setSelectedFiles] = useState<File | FileList | null>(initialFiles);
    const { addAlert } = useContext(AlertContext);
    useEffect(() => {
        handler(selectedFiles);
    }, [selectedFiles]);

    const removeFile = (index: number) => {
        setSelectedFiles((prevFiles: any) => {
            if (prevFiles instanceof FileList) {
                const newFiles = Array.from(prevFiles).filter((_, i) => i !== index);
                return newFiles.length > 0 ? createFileList(newFiles) : null;
            }
            return null;
        });
    };

    const clearAllFiles = () => {
        setSelectedFiles(null);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            let totalSize = 0;
            let isSizeValid = true;
            for (let i = 0; i < files.length; i++) {
                if (files[i].size > maxFileSize) {
                    addAlert({
                        type: 'error',
                        message: `File ${files[i].name} is too large. Max file size is 10mb.`
                    });
                    isSizeValid = false;
                    break;
                }
                totalSize += files[i].size;
            }
            if (isSizeValid) {
                setSelectedFiles((prevFiles: FileList | File | null) => {
                    if (multiple) {
                        const newFiles = prevFiles instanceof FileList ? Array.from(prevFiles) : [];
                        for (let i = 0; i < files.length; i++) {
                            newFiles.push(files[i]);
                        }
                        totalSize += (prevFiles instanceof FileList ? Array.from(prevFiles) : []).reduce((size, file) => size + file.size, 0);
                        if (totalSize > maxFileSize) {
                            addAlert({
                                type: 'error',
                                message: 'Total file size exceeds the maximum file size of 10mb.'
                            });
                            return prevFiles;
                        }
                        return createFileList(newFiles);
                    } else {
                        const file = files[0];
                        if (file.size > maxFileSize) {
                            addAlert({
                                type: 'error',
                                message: `File ${file.name} is too large. Max file size is 10mb.`
                            });
                            return prevFiles;
                        }
                        return createFileList([file]);
                    }
                });
            }
        } else {
            setSelectedFiles(null);
        }
    };

    return [selectedFiles, handleFileSelect, (index) => removeFile(index), clearAllFiles];
};



export default useFileSelect;
