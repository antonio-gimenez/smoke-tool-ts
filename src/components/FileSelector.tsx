import React, { useState } from 'react';
import { ReactComponent as FileIcon } from '../assets/icons/file.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { generateUUID, humanFileSize } from '../utils/utils';

interface FileSelectorProps {
    id?: string;
    multiple: boolean;
    onSelectFile: (files: FileList) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ id = `file-selector-${generateUUID()}`, multiple = false, onSelectFile = () => { } }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList>();
    const [dragOver, setDragOver] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files, event.target);
        if (event.target.files) {
            // setSelectedFiles(event.target.files);
            // add files to the list without replacing the existing files
            const newFiles = Array.from(event.target.files);
            const fileList = new FileList();
            for (let i = 0; i < newFiles.length; i++) {
                fileList[i] = newFiles[i];
            }
            setSelectedFiles(fileList);

            onSelectFile(selectedFiles!);
            console.log(selectedFiles);
        }
    };

    const handleRemoveFile = (index: number) => {
        if (!selectedFiles) return;
        const newFiles = Array.from(selectedFiles);
        newFiles.splice(index, 1);
        const fileList = new FileList();
        for (let i = 0; i < newFiles.length; i++) {
            fileList[i] = newFiles[i];
        }
        setSelectedFiles(fileList);
    };

    const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
        setSelectedFiles(event.dataTransfer.files);
        onSelectFile(selectedFiles!);
    };

    const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleFileSelect = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    return (
        <div className='file-selector'>
            <input
                type="file"
                id={id}
                key={id}
                multiple={multiple}
                onChange={handleFileChange}
                ref={inputRef}
                style={{ display: 'none' }}
            />
            <div
                className={`dropzone ${dragOver ? 'drag-over' : ''}`}
                onDrop={handleDrop}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
            >
                {selectedFiles && selectedFiles.length > 0 ? (
                    <ul className='file-display-container'>
                        {Array.from({ length: selectedFiles.length }, (_, index) => (
                            <li key={index} className='file'>
                                <FileIcon className='file-icon' />
                                <span className='file-name'>
                                    {selectedFiles[index].name}
                                </span>
                                <span className='file-size'>
                                    {humanFileSize(selectedFiles[index].size)}
                                </span>
                                <span className='file-action'>
                                    <CloseIcon className='file-close-icon' onClick={() => handleRemoveFile(index)} />
                                </span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className='dropzone-message'>
                        Drag and drop your files here or <a href='#' onClick={handleFileSelect}>select files from your computer</a>
                    </p>
                )}
            </div>
        </div>
    );
};

export default FileSelector;
