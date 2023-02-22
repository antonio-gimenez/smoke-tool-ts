import { useEffect, useState } from "react";
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
};

const useFileSelect = ({
    multiple = false,
    initialFiles = null,
    handler = () => { },
}: UseFileSelectProps = {}): FileHookReturnType => {
    const [selectedFiles, setSelectedFiles] = useState<File | FileList | null>(initialFiles);

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
            setSelectedFiles((prevFiles: FileList | File | null) => {
                if (multiple) {
                    const newFiles = prevFiles instanceof FileList ? Array.from(prevFiles) : [];
                    for (let i = 0; i < files.length; i++) {
                        newFiles.push(files[i]);
                    }
                    return createFileList(newFiles);
                } else {
                    return createFileList([files[0]]);
                }
            });
        } else {
            setSelectedFiles(null);
        }
    };

    return [selectedFiles, handleFileSelect, (index) => removeFile(index), clearAllFiles];
};


export default useFileSelect;
