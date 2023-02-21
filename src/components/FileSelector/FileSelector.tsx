import React, { useContext, useState } from 'react';
import { humanFileSize } from '../../utils/utils';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { AlertContext } from '../../contexts/AlertContext';
interface FileListProps {
    length: number;
    item?: (index: number) => File;
}


const createFileList = (files: File[]) => {
    const fileList = new DataTransfer();
    files.forEach((file) => fileList.items.add(file));
    return fileList.files;
};


function FileSelector() {
    const [selectedFiles, setSelectedFiles] = useState<FileList | File | null>(null);
    const [multiple, setMultiple] = useState(false);
    const { addAlert } = useContext(AlertContext)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            if (multiple && selectedFiles instanceof FileList) {
                // append new files to the existing list
                const newFiles = Array.from(selectedFiles).concat(Array.from(files));
                console.log(`appending:`, newFiles);
                setSelectedFiles(createFileList(newFiles));
                addAlert({ type: "success", message: "Files added" });
            } else {
                console.log(`setting:`, files);
                setSelectedFiles(createFileList(Array.from(files)));
                addAlert({ type: "success", message: "File added" });
            }
        } else {
            setSelectedFiles(null);
        }
    };



    const removeFile = (index: number) => {
        setSelectedFiles((prevFiles) => {
            if (prevFiles instanceof FileList) {
                const newFiles = Array.from(prevFiles).filter((_, i) => i !== index);
                return newFiles.length > 0 ? createFileList(newFiles) : null;
            }
            return null;
        });
    };

    const fileListProps = {
        length: selectedFiles ? (selectedFiles instanceof FileList ? selectedFiles.length : 1) : 0,
        item: selectedFiles ? (i: number) => (selectedFiles instanceof FileList ? selectedFiles[i] : selectedFiles) : undefined,
    };

    const ShowFileList = ({ length, item }: FileListProps) => {
        if (length === 0) {
            return <span>No files uploaded</span>
        }
        return (
            <ul className='file-list'>
                {item && (
                    Array.from({ length }, (_, index) => item(index)).map((file, index) => (
                        <li key={`file - ${index}`} className='file'>
                            <a title={file.name} href={URL.createObjectURL(file)} target="_blank" className='link'>{file.name} ({humanFileSize(file.size)})</a>
                            <CloseIcon className="file-close-icon" key={`file - close - ${index}`} onClick={() => removeFile(index)} />
                        </li>
                    ))
                )}
            </ul>
        )
    }

    return (
        <div>
            <label htmlFor="multiple" >
                <input
                    id="multiple"
                    type="checkbox"
                    checked={multiple}
                    onChange={() => setMultiple(!multiple)}
                />
                <span>Allow upload multiple files</span>
            </label>
            <label htmlFor="fileInput">
                <span className="button button-primary">Add file</span>
                <input id="fileInput" className="hidden" type="file" multiple={multiple} onChange={handleFileSelect} />
            </label>
            <ShowFileList {...fileListProps} />

        </div >
    )
}




export default FileSelector;
