import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";
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
    }, [selectedFiles, handler]);

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
            setSelectedFiles(multiple ? files : files[0]);
        } else {
            setSelectedFiles(null);
        }
    };




    return [selectedFiles, handleFileSelect, (index) => removeFile(index), clearAllFiles];
};

export default useFileSelect;
