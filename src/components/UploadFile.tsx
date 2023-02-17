import React, { useContext, useState } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import api from '../services/use-axios';
import Button from './ui/Button';

function UploadFile({ onChange }: { onChange: (file: File) => void }) {
    const [file, setFile] = useState<File | null>(null);
    const { addAlert } = useContext(AlertContext);
    const [uploadedFile, setUploadedFile] = useState<Boolean>(false);
    const [tmpFiles, setTmpFiles] = useState<File[]>([]);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const selectedFile = event.target.files?.[0] || null;
        setFile(selectedFile);
        if (selectedFile) {
            setTmpFiles((prevFiles) => [...prevFiles, selectedFile]);
        }
    };


    const handleFileSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        if (event.type === "submit") {
            api
                .post("/files/", formData)
                .then((res) => {
                    if (res.status === 201 || res.status === 200) {
                        addAlert({
                            type: "info", message: `${file.name}`, title: "File uploaded successfully",
                            duration: 3000
                        });
                        setUploadedFile(true);
                        setTmpFiles(tmpFiles.filter((tmpFile) => tmpFile !== file));
                        onChange(tmpFiles[0]);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    return (
        <form onSubmitCapture={handleFileSubmit} className="upload-file" method="post" encType="multipart/form-data">
            <label htmlFor="upload-file" aria-disabled={!!uploadedFile} className='input-file-container'>
                <input type="file" id="upload-file" onChange={handleFileChange} />
                {file ? file.name : "Choose a file"}
            </label>
            <div>
                {
                    tmpFiles.length > 0 && tmpFiles.map((tmpFile) => (
                        <div key={tmpFile.name} className="tmp-file">
                            <span>{tmpFile.name}</span>
                            <Button type="button" onClick={() => {
                                setTmpFiles(tmpFiles.filter((tmpFile) => tmpFile !== file));
                                setFile(null);
                            }
                            } color={"error"}>Remove</Button>
                        </div>
                    ))

                }
                {!uploadedFile &&
                    <Button type="submit" disabled={uploadedFile} aria-disabled={uploadedFile}
                        color={"primary"}>
                        Upload files
                    </Button>
                }
            </div>
        </form>
    );
}

export default UploadFile
