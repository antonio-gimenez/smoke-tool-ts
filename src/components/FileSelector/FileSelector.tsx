import { useState } from 'react';
import { ReactComponent as CloseIcon } from '../../assets/icons/close.svg';
import useFileSelect from '../../hooks/useFileSelect';
import { humanFileSize } from '../../utils/utils';

interface FileListProps {
    length: number;
    item?: (index: number) => File;
}


interface FileSelectorProps {
    files?: File | FileList | null;
    handler?: (files: File | FileList | null) => void;
}

function FileSelector({ files, handler }: FileSelectorProps) {
    // const [multiple, setMultiple] = useState(false);
    const [selectedFiles, handleFileSelect, removeFile, clearAllFiles] = useFileSelect({ multiple: true, initialFiles: files, handler });

    const fileListProps = {
        length: selectedFiles ? (selectedFiles instanceof FileList ? selectedFiles.length : 1) : 0,
        item: selectedFiles ? (i: number) => (selectedFiles instanceof FileList ? selectedFiles[i] : selectedFiles) : undefined,
    };

    const ShowFileList = ({ length, item }: FileListProps) => {

        return (
            <ul className='file-list'>
                {item && (
                    Array.from({ length }, (_, index) => item(index)).map((file, index) => {
                        const url = file ? URL.createObjectURL(file) : '';
                        return (
                            <li key={`file - ${index}`} className='file'>
                                <a title={file.name} href={url} target="_blank"
                                    rel="noreferrer"
                                    className='file-name'>{file.name} ({humanFileSize(file.size)})</a>
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
            {/* <label htmlFor="multiple" >
                <input
                    id="multiple"
                    type="checkbox"
                    checked={multiple}
                    onChange={() => setMultiple(!multiple)}
                />
                <span>Allow upload multiple files</span>
            </label> */}
            {/* {selectedFiles && selectedFiles instanceof FileList && selectedFiles.length > 0 && <a href='#' onClick={clearAllFiles}>Clear all files</a>} */}

            <label htmlFor="fileInput" className='input-file-container'>
                <span className="button button-primary">Add attachment</span>
                <input id="fileInput" className="form-control-hidden" type="file" multiple={true} onChange={handleFileSelect} />
            </label>

            <ShowFileList {...fileListProps} />
        </div >
    )
}

export default FileSelector;
