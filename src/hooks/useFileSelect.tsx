import { useState, useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

type FileHookReturnType = [
    File | FileList | null,
    (event: React.ChangeEvent<HTMLInputElement>) => void,
    () => void
];

type UseFileSelectProps = {
    multiple?: boolean;
    localStorageKey?: string;
    expirationTime?: number;
};

const useFileSelect = ({
    multiple = false,
    localStorageKey,
    expirationTime = 60, // Default time is 60 minutes
}: UseFileSelectProps = {}): FileHookReturnType => {
    const [selectedFiles, setSelectedFiles] = useState<File | FileList | null>(null);
    const [storedFiles, setStoredFiles, removeStoredFiles, storedFilesExist] = useLocalStorage({
        key: localStorageKey ?? "",
        initialValue: null,
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            setSelectedFiles(multiple ? files : files[0]);
            if (localStorageKey) {
                const expiration = Date.now() + expirationTime * 60 * 1000;
                setStoredFiles({ files: Array.from(files), expiration });
            }
        } else {
            setSelectedFiles(null);
            if (localStorageKey) {
                removeStoredFiles();
            }
        }
    };

    const clearSelectedFiles = () => {
        setSelectedFiles(null);
        if (localStorageKey) {
            removeStoredFiles();
        }
    };

    useEffect(() => {
        if (storedFilesExist()) {
            const files = (storedFiles?.files || []) as File[];
            const { expiration } = storedFiles || { expiration: 0 };

            const now = Date.now();
            if (now < expiration) {
                const fileArray = Array.from(files).map((file) => new File([file], file.name));
                const fileList = {
                    length: fileArray.length,
                    item: (index: number) => fileArray[index],
                } as FileList;
                setSelectedFiles(fileList);
            } else {
                removeStoredFiles();
            }
        }
    }, [storedFiles, storedFilesExist, removeStoredFiles]);

    return [selectedFiles, handleFileSelect, clearSelectedFiles];
};

export default useFileSelect;
