import React, { useState } from 'react';
import {serverIp,serverPort} from '../../utils/config'

const FileUpload: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`http://${serverIp}:${serverPort}/importExcel`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('File uploaded successfully');
            } else {
                setMessage('File upload failed');
            }
        } catch (error) {
            setMessage('Error uploading file');
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Upload Excel File</h1>
            <input type="file" accept=".xlsx" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;