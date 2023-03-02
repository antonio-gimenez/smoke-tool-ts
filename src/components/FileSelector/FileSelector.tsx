import { useState, useMemo, useEffect } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { ReactComponent as UploadIcon } from '../../assets/icons/upload.svg';
import useFileSelect from '../../hooks/useFileSelect';
import { humanFileSize } from '../../utils/file';
import Progress from '../Progress';

interface FileListProps {
    length: number;
    item?: (index: number) => File;
}

interface FileSelectorProps {
    files?: File | FileList | null;
    onSelectFiles?: (files: File | FileList | null) => void;
    maxSize?: number;
    usedSize?: number;
    disabled?: boolean;
    uploadFiles?: (files: File | FileList | null) => void;
    loading?: boolean;
}

function FileSelector({
    files,
    onSelectFiles,
    maxSize = 10 * 1024 * 1024,
    usedSize = 0,
    disabled = false,
    loading = false,
    uploadFiles,
}: FileSelectorProps) {
    const [selectedFiles, handleFileSelect, removeFile, updateSelectedFiles, clearSelectedFiles] = useFileSelect({
        multiple: true,
        initialFiles: files,
        onSelectFiles,
        maxSize,
        usedSize,
    });

    const fileListProps = useMemo(() => {
        return {
            length: selectedFiles ? (selectedFiles instanceof FileList ? selectedFiles.length : 1) : 0,
            item: selectedFiles ? (i: number) => (selectedFiles instanceof FileList ? selectedFiles[i] : selectedFiles) : undefined,
        };
    }, [selectedFiles]);

    const currentSize = selectedFiles ? (selectedFiles instanceof FileList ? Array.from(selectedFiles).reduce((acc, file) => acc + file.size, 0) : selectedFiles.size) : 0;

    useEffect(() => {
        updateSelectedFiles(files || null)
    }, [files]);


    const usedSizePlusCurrentSize = usedSize + currentSize;
    const remainingSize = maxSize - usedSizePlusCurrentSize;
    const percentage = (usedSizePlusCurrentSize / maxSize) * 100;
    const label = `${humanFileSize(usedSizePlusCurrentSize)}/${humanFileSize(maxSize)}`;


    const ShowFileList = ({ length, item }: FileListProps) => {
        if (length === 0) {
            return null;
        }
        return (
            <>
                <span className='file-list-title'>Files to be uploaded</span>
                <div className='file-advert'>
                    <span className='muted'>Files must be smaller and not exceed {humanFileSize(maxSize)}</span>
                    <span className='muted'>
                        Remaining size: {humanFileSize(remainingSize)}
                    </span>
                </div>
                <ul className='file-list to-be-uploaded'>
                    {item &&
                        Array.from({ length }, (_, index) => item(index)).map((file, index) => {
                            const url = file ? URL.createObjectURL(file) : '';
                            return (
                                <li key={`file-${index}`} className='file'>
                                    <UploadIcon className='file-icon' />
                                    <a
                                        title={file.name}
                                        href={url}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='file-name to-upload'
                                    >
                                        {file.name}
                                    </a>
                                    <span className='file-size'>{humanFileSize(file.size)}</span>
                                    <CloseIcon className='file-close-icon' key={`file-close-${index}`} onClick={() => removeFile(index)} />
                                </li>
                            );
                        })}
                </ul>
            </>
        );
    };

    return (
        <div className='file-selector'>
            {uploadFiles && selectedFiles && (selectedFiles instanceof FileList ? selectedFiles.length : 1) > 0 ? <div className='file-actions'>
                <button className={`button button-primary block ${loading && 'loading'}`} aria-disabled={disabled} onClick={() => uploadFiles(selectedFiles)}>Upload selected</button>
                <label htmlFor='fileInput'>

                    <span className='button button-secondary block'>Browse More Files</span></label>
                <button className='button button-secondary block' onClick={clearSelectedFiles}>
                    Clear selected files
                </button></div> : <label htmlFor='fileInput'>

                <span className='button button-secondary block'>Browse Files</span></label>}


            <input id='fileInput' className='form-control-hidden' type='file' multiple={true} onChange={handleFileSelect} />

            {/* <Progress isLoadingData={true} percentage={50} label={label} /> */}
            <ShowFileList {...fileListProps} />
        </div >
    );
}

export default FileSelector;
