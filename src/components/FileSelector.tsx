import React, { useState } from 'react';
import { ReactComponent as FileIcon } from '../assets/icons/file.svg';
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg';
import { humanFileSize } from '../utils/utils';

interface FileSelectorProps {
    multiple: boolean;
    onSelectFile: (files: FileList) => void;
}

const FileSelector: React.FC<FileSelectorProps> = ({ multiple = false, onSelectFile = () => { } }) => {
    const [selectedFiles, setSelectedFiles] = useState<FileList>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.files, event.target);
        if (event.target.files) {
            setSelectedFiles(event.target.files);
            onSelectFile(selectedFiles!);
            console.log(selectedFiles);
        }
    };



    const handleRemoveFile = (index: number) => {
        if (!selectedFiles) return;
        var newFiles = new DataTransfer();

        for (var i = 0; i < selectedFiles.length; i++) {
            if (i !== index) {
                newFiles.items.add(selectedFiles[i]);
            }
        }

        setSelectedFiles(newFiles.files); // convert newFiles to FileList type



        // convert newFiles to FileList type


    };




    return (
        <div className='file-selector'>
            <input
                type="file"
                multiple={multiple}
                onChange={handleFileChange}
                accept="*/*"
            />
            {selectedFiles && selectedFiles.length > 0 && (
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
            )}

        </div>
    );
};

export default FileSelector;
