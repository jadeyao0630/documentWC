import React, { useEffect, useRef, useState } from 'react';
import {serverIp,serverPort} from '../../utils/config'
import Button from '../Button/button';
import Input from '../Input/input';
import Icon from '../Icon/icon';

interface IFileUploadProp{
    onCompleted?:(state:boolean)=>void
}
const FileUpload: React.FC<IFileUploadProp> = (prop) => {
    const {onCompleted} = prop
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState<string|undefined>();
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
        
        setMessage('loading...')
        onCompleted?.(false)
        try {
            fetch(`http://${serverIp}:${serverPort}/importExcel`, {
                method: 'POST',
                body: formData,
            }).then(r=>r.json()).then(res=>{
                setMessage(undefined);
                //console.log(res)
                onCompleted?.(true)
                
                
            });
        } catch (error) {
            setMessage(undefined);
            console.error('Error:', error);
            onCompleted?.(true)
        }
        
    };

    return (
        <div>
            <Input type="file" accept=".xlsx" onChange={handleFileChange} />
            <Button style={{marginLeft:"10px"}} onClick={handleUpload}>导入</Button>
            {message && <p><Icon icon="spinner" spin style={{color:"#0d6efd", fontSize:"20px",marginTop:"10px",marginRight:"5px"}}></Icon>导入中。。。</p>}
            {messages.length>0 &&<div ref={logs} style={{maxHeight:"400px",overflowY:"auto",border:"1px solid #ccc",borderRadius:"5px",padding:"10px"}}>
                <table>
                    <tbody>
                        {messages.map((message, index) => {
                            const item=JSON.parse(message)
                            //console.log(item)
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