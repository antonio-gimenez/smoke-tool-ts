import { useEffect, useMemo } from 'react';
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
    maxFiles?: number;
}

function FileSelector({
    files,
    onSelectFiles,
    maxSize = 10 * 1024 * 1024,
    usedSize = 0,
    maxFiles = 10,
    disabled = false,
}: FileSelectorProps) {
    const [selectedFiles, handleFileSelect, removeFile, invalidFiles, updateSelectedFiles] = useFileSelect({
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

    const ShowFileList = ({ length, item }: FileListProps) => {
        if (length === 0) {
            return null;
        }
        return (
            <>
                <ul className='file-list to-be-uploaded'>
                    {item &&
                        Array.from({ length }, (_, index) => item(index)).map((file, index) => {
                            const url = file ? URL.createObjectURL(file) : '';
                            return (
                                <li key={`file-${index}`} className='file'>
                                    <UploadIcon />
                                    <a
                                        title={file.name}
                                        href={url}
                                        target='_blank'
                                        rel='noreferrer'
                                        className='file-name'
                                    >
                                        {file.name}
                                    </a>
                                    <span className='file-size'>{humanFileSize(file.size)}</span>
                                    <CloseIcon className='file-close-icon' key={`file-close-${index}`} onClick={() => removeFile(index)} />
                                </li>
                            );
                        })}
                </ul>
                {invalidFiles.length > 0 && (
                    <ul className='file-list to-be-fixed'>
                        {invalidFiles.map((file, index) => (
                            <li key={`invalid-file-${index}`} className='file'>
                                <CloseIcon className='file-close-icon' key={`file-close-${index}`} onClick={() => removeFile(index)} />
                                <span className='file-name'>{file.name}</span>
                                <span className='file-size'>{humanFileSize(file.size)}</span>
                                <span className='file-error'>File is too large</span>
                            </li>
                        ))}
                    </ul>
                )}
            </>
        );
    };

    const usedSizePlusCurrentSize = usedSize + currentSize;
    const percentage = (usedSizePlusCurrentSize / maxSize) * 100;
    const label = `${humanFileSize(usedSizePlusCurrentSize)}/${humanFileSize(maxSize)}`;

    return (
        <div className='file-selector'>
            <label htmlFor='fileInput' aria-disabled={!!disabled} className='button button-primary block'>
                Add attachment
            </label>
            <input id='fileInput' className='form-control-hidden' type='file' multiple={true} onChange={handleFileSelect} />
            <Progress percentage={percentage} label={label} />
            <ShowFileList {...fileListProps} />
        </div>
    );
}

export default FileSelector;
