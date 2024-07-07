import React, { useState } from 'react';
import {serverIp,serverPort} from '../../utils/config'
import Button from '../Button/button';
import Input from '../Input/input';

interface IFileUploadProp{
    onCompleted?:(state:boolean)=>void
}
const FileUpload: React.FC<IFileUploadProp> = (prop) => {
    const {onCompleted} = prop
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string>('');

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('请选择一个文件！');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        
        setMessage('上传中。。。');
        onCompleted?.(false)
        try {
            const response = await fetch(`http://${serverIp}:${serverPort}/importExcel`, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setMessage('文件上传成功！');
            } else {
                setMessage('文件上传失败！');
            }
            onCompleted?.(true)
        } catch (error) {
            setMessage('文件上传错误！');
            console.error('Error:', error);
            onCompleted?.(true)
        }
    };

    return (
        <div>
            <Input type="file" accept=".xlsx" onChange={handleFileChange} />
            <Button style={{marginLeft:"10px"}} onClick={handleUpload}>导入</Button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;