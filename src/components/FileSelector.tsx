import React, { useState } from 'react';
import { ReactComponent as FileIcon } from '../assets/icons/file.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { generateUUID, humanFileSize } from '../utils/utils';

interface FileSelectorProps {
    id?: string;
    multiple: boolean;
    onSelectFile: any;
    // onSelectFile: (files: FileList) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ id = `file-selector-${generateUUID()}`, multiple = false, onSelectFile = () => { } }) => {
    const [selectedFiles, setSelectedFiles] = useState<any | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files) as File[];
            setSelectedFiles(newFiles);
            onSelectFile(newFiles);
        }
    };

    const handleRemoveFile = (index: number, event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        if (!selectedFiles) return;
        const newFiles = Array.from(selectedFiles);
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);
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
            <label htmlFor={id}>
                <div className="dropzone">
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
                                        <a className='file-name' href={URL.createObjectURL(selectedFiles[index])} target='_blank' rel='noopener noreferrer'>
                                            {selectedFiles[index].name}
                                        </a>
                                        <span className='file-size'>
                                            {humanFileSize(selectedFiles[index].size)}
                                        </span>
                                        <span className='file-action' onClick={(event) => handleRemoveFile(index, event)}>
                                            <CloseIcon className='file-close-icon' />
                                        </span>

                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className='dropzone-message'>
                                Drag and drop your files here or <a href='#' className='file-name' onClick={handleFileSelect}>select files from your computer</a>
                            </p>
                        )}
                    </div>
                </div>
            </label>
            <input
                type="file"
                id={id}
                key={id}
                multiple={multiple}
                onChange={handleFileChange}
                ref={inputRef}
                style={{ display: "none" }}
            />
        </div>
    );


};

export default FileSelector;
