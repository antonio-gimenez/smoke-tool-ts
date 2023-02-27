import { useState } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import { ReactComponent as ImageIcon } from '../../assets/icons/image.svg';
import { ReactComponent as FileIcon } from '../../assets/icons/file.svg';
import useFileSelect from '../../hooks/useFileSelect';
import { humanFileSize } from '../../utils/utils';

interface FileListProps {
    length: number;
    item?: (index: number) => File;
}


interface FileSelectorProps {
    files?: File | FileList | null;
    handler?: (files: File | FileList | null) => void;
    maxSize?: number;
}

function FileSelector({ files, handler, maxSize = 10 * 1024 * 1024 // 10mb
}: FileSelectorProps) {
    // const [multiple, setMultiple] = useState(false);
    const [selectedFiles, handleFileSelect, removeFile, clearAllFiles] = useFileSelect({ multiple: true, initialFiles: files, handler, maxSize });

    const fileListProps = {
        length: selectedFiles ? (selectedFiles instanceof FileList ? selectedFiles.length : 1) : 0,
        item: selectedFiles ? (i: number) => (selectedFiles instanceof FileList ? selectedFiles[i] : selectedFiles) : undefined,
    };

    const currentSize = selectedFiles ? (selectedFiles instanceof FileList ? Array.from(selectedFiles).reduce((acc, file) => acc + file.size, 0) : selectedFiles.size) : 0;

    const ShowFileList = ({ length, item }: FileListProps) => {

        return (
            <ul className='file-list'>
                {item && (
                    Array.from({ length }, (_, index) => item(index)).map((file, index) => {
                        const url = file ? URL.createObjectURL(file) : '';
                        return (
                            <li key={`file - ${index}`} className='file'>
                                {file.type.startsWith('image') ? (
                                    <ImageIcon className="file-image-icon" />
                                ) : (
                                    <FileIcon style={{ height: '18' }} />
                                )}
                                <a title={file.name} href={url} target="_blank"
                                    rel="noreferrer"
                                    className='file-name'>{file.name}</a>
                                <span className='file-size'>{humanFileSize(file.size)}</span>
                                <CloseIcon className="file-close-icon" key={`file - close - ${index}`} onClick={() => removeFile(index)} />
                            </li>
                        );
                    })
                )}
            </ul>
        );
    };


    return (
        <div className="file-selector">
            <p className="file-selector-title">Attachments</p>
            <label htmlFor="fileInput" className='input-file-container'>
                <span className="">Add attachment</span>
                <input id="fileInput" className="form-control-hidden" type="file" multiple={true} onChange={handleFileSelect} />
            </label>
            {currentSize > 0 && (
                <span className="file-size-limit">
                    <span className={`file-size-limit-${currentSize > 0 && 'success'}`}>
                        {humanFileSize(currentSize)}
                    </span>
                    / {humanFileSize(maxSize)}</span>)
            }            <ShowFileList {...fileListProps} />
        </div >
    )
}

export default FileSelector;
