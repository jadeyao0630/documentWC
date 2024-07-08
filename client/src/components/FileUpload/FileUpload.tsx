import React, { useEffect, useRef, useState } from 'react';
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
    const [messages, setMessages] = useState<Array<string>>([]);
    const logs = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const ws = new WebSocket(`ws://${serverIp}:3002`);
    
        ws.onmessage = (event) => {
            
          const data = JSON.parse(event.data);
            
          if(data.type==="excel"){
            setMessages(prevMessages => [...prevMessages, JSON.stringify(data)]);
          }
          
        };
    
        return () => {
          ws.close();
        };
      }, []);
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setFile(event.target.files[0]);
        }
    };
    if(logs.current){
        logs.current.scrollTop = logs.current.scrollHeight;
    }
    const headers={
        'Content-Type': 'application/json'
      };
    const handleUpload = async () => {
        if (!file) {
            setMessage('请选择一个文件！');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setMessages([])
        onCompleted?.(false)
        try {
            fetch(`http://${serverIp}:${serverPort}/importExcel`, {
                method: 'POST',
                body: formData,
            }).then(r=>r.json()).then(res=>{
                console.log(res)
                setMessage(res.success?'文件上传成功！':'文件上传失败！');
                
                onCompleted?.(true)
            });
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
            {message && <p style={{margin:"5px 0"}}>{message}</p>}
            {messages.length>0 &&<div ref={logs} style={{maxHeight:"400px",overflowY:"auto",border:"1px solid #ccc",borderRadius:"5px",padding:"10px"}}>
                <table>
                    <tbody>
                        {messages.map((message, index) => {
                            const item=JSON.parse(message)
                            console.log(item)
                            return (<tr key={index}>
                                {Object.keys(item.data).map((itemKey:string,idx)=>(
                                    
                                    <td key={idx}>{item.data[itemKey]}</td>
                                ))}
                            </tr>)
                        })}
                        
                    </tbody>
                </table>
                
            </div>}
        </div>
    );
};

export default FileUpload;