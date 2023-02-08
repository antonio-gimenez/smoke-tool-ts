import React, { useContext, useState } from 'react';
import { AlertContext } from '../contexts/AlertContext';
import api from '../services/use-axios';
import Button from './ui/Button';

function UploadFile() {
    const [file, setFile] = useState<File | null>(null);
    const { addAlert } = useContext(AlertContext);
    const [uploadedFile, setUploadedFile] = useState<Boolean>(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        setFile(event.target.files?.[0] || null);

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
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };
    return (
        <>
            <form className="form-group" onSubmitCapture={handleFileSubmit}>
                <label htmlFor="upload-file" aria-disabled={!!uploadedFile} className='input-file-container'>
                    <input type="file" id="upload-file" onChange={handleFileChange} />
                    {file ? file.name : "Choose a file"}
                </label>
                {!uploadedFile &&
                    <Button type="submit" disabled={uploadedFile} aria-disabled={uploadedFile} color={"primary"}>
                        Upload file
                    </Button>
                }
                <span className="text-muted">Max single file size: 15mb</span>

            </form>
        </>
    );
}

export default UploadFile
