import React, { FC,useState, useEffect, useRef } from "react";
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";
import { findColumnByLabel, formatDateTime } from '../../utils/utils';
import {serverIp,serverPort} from '../../utils/config'
import io from 'socket.io-client';
import Input from "../Input/input";
import Select, { SelectOption } from "../Select/Select";
// import classNames from "classnames";

export interface ImTableProps {
    className?: string;
}
export interface Iobject {
    [key: string]: any;
}
interface ImageItem {
    id: string;
    fileName: string; // 假设每行数据中有一个fileName字段
  }
  interface ColumnData {
    label: string;
    isEditble?: boolean; // 假设每行数据中有一个fileName字段
    width:string|number;
    type:string;
  }
const editbleColumns=[
    '所属项目',
    '分类',
    '请示名称',
    '经办人',
    '标签'
]
const tableColumns:Iobject={
    project:{
        label:'所属项目',
        isEditble:true,
        width:"auto",
        type:'combobox'
    },
    category:{
        label:'分类',
        isEditble:true,
        width:"auto",
        type:'combobox'
    },
    title:{
        label:'请示名称',
        isEditble:true,
        width:200,
        type:'text'
    },
    person:{
        label:'经办人',
        isEditble:true,
        width:"auto",
        type:'text'
    },
    location:{
        label:'标签',
        isEditble:true,
        width:"auto",
        type:'multiCombobox'
    },
}


//const serverIp='192.168.10.213'
//const serverPort = '4555'
const socket = io(`http://${serverIp}:${serverPort}`,{
    
 // path: '/socket.io', // Ensure the path matches the server configuration
  //transports: ['websocket'], // Use WebSocket as the transport protocol
}); 
const MTable: FC<ImTableProps> = (props) => {
    const { className } = props;
    const { result,search } = useDBload();
    console.log("result",search)
    const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
    const [imageURLs_thumb, setImageURLs_thumb] = useState<{ [key: string]: string }>({});
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const popupRef = useRef<HTMLDivElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Iobject>();
    const [docLabels,setDocLabels] = useState<SelectOption[]>([{label:'测试1',value:'1'},{label:'测试2',value:'2'},{label:'测试3',value:'3'},{label:'测试4',value:'4'}]);
    const openModal = (id: any) => {
        const filteredResult = result?.filter((res: Iobject) => res['编号'] === id);
        if(filteredResult!==undefined && filteredResult.length>0){
            setCurrentItem(filteredResult[0])
        }
        console.log("id",id,filteredResult)
        //setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setCurrentItem(undefined)
        //setIsModalOpen(false);
      };
    useEffect(() => {
        socket.on('serverMessage', (message) => {
            console.log("message",message)
        });
        socket.on('connect', () => {
            console.log('Connected to socket server');
          });
        socket.on('connect_error', (error) => {
            //console.error('Connection error:', error);
          });
        return () => {
            socket.off('message');
        };
    }, []);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                setHoveredImage(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (search && search.length > 0) {
            const fetchImageURLs = async () => {
                const urls: { [key: string]: string } = {};
                const urls_thumb: { [key: string]: string } = {};
                for (const item of search as Iobject[]) {
                    const url = await fetch(`http://${serverIp}:${serverPort}/preview?folder=${item["编号"]}&fileName=thumb_${item["封面页"]}`, {
                        method: 'get',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }).then(response => response.url);
                    urls[item["编号"]] = url.replace("thumb_","");
                    urls_thumb[item["编号"]] = url;
                }
                setImageURLs(urls);
                setImageURLs_thumb(urls_thumb);
            };
            fetchImageURLs();
        }
    }, [search]);
    if(search===undefined || search.length===0) return null
    const handleMouseEnter = (url: string,event:React.MouseEvent) => {
        setHoveredImage(url);
        setPopupPosition({ top: event.clientY + 10, left: event.clientX + 10 });
    };

    const setTd = (index:number, key:string,item:Iobject) => {
        var style:React.CSSProperties={textAlign:"left"}
        var td_item;
        if (key === "封面页") {
            style = { padding: 0,textAlign:"center" };
            td_item = imageURLs_thumb[item["编号"]] ? <img className="thumbnail" src={imageURLs_thumb[item["编号"]]} alt="封面页" onClick={(e) => handleMouseEnter(imageURLs[item["编号"]],e)} /> : 'Loading...';
        }else if (key === "创建日期" || key === "更新日期") {
            td_item = formatDateTime(item[key]);
        }else {
            td_item = item[key];
        }
        return <td key={index} style={style} onDoubleClick={() => handleDoubleClick(item["编号"],key)}>{td_item}</td>
    }
    const setTh = (index:number, key:string) => {
        var style:React.CSSProperties={textAlign:"left"}
        var th_item=key;
        if (key === "创建日期" || key === "更新日期") {
            style = {...style, width: 100 };
        }else if (key === "请示名称") {
            style = {...style,  minWidth: 200 };
        }else if (key === "编号") {
            style = {...style,  width: 80 };
        }else if (key === "封面页") {
            style = {...style, width: 50 };
        }
        return <th key={index} style={style}>{th_item}</th>
    }
    const headers = Object.keys(search[0])
    function handleEdit(id: any): void {
        //throw new Error("Function not implemented.");
       

    }
    const handleDoubleClick = (id: number, key:string) => {
        const filteredResult = result?.filter((res: Iobject) => res['编号'] === id);
        
        if(filteredResult!==undefined && filteredResult.length>0){
            const result_ = findColumnByLabel(tableColumns, key);
            if(result_!==undefined)
                console.log(`Row with id ${(filteredResult[0] as Iobject)[key]} was double-clicked`);
        }
        
        // 你可以在这里执行其他操作，例如显示编辑界面或弹出窗口
      };
    const createForm = () => {
        if(currentItem!==undefined){
            return Object.keys(currentItem).map(key=>{
                const result_ = findColumnByLabel(tableColumns, key);
                if(result_!==undefined){
                    return (
                        <>
                            <label>
                                {key}:
                                {getItem(result_,key,currentItem)}
                            </label>
                            <br />
                        </>
                        
                    )
                }
                return null;
            })
        }
        return null
        
    }
    const onTextChanged = (e:React.ChangeEvent<HTMLInputElement>,key:string,item:Iobject)=>{
        const updatedItem = { ...item, [key]: e.target.value };
        setCurrentItem(updatedItem);
    }
    const onSubmited = () => {
        const updatedItem = { ...currentItem, ['更新日期']: new Date().toISOString() };
        console.log(updatedItem)
    }
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
          console.log('Enter key pressed');
          const newItem=(event.target as HTMLInputElement).value;
          if(docLabels.filter(item => item.label === newItem).length===0){
            setDocLabels((v)=>{
                return [...v,{label:newItem,value:v.length.toString()}]
              })
          }
          
          // Add your logic here for when the Enter key is pressed
        }
      };
    const getItem = (columnData:ColumnData,key:string,item:Iobject) => {
        if(columnData.type==="text"){
            return <Input style={{marginLeft:"10px"}} type='text' name={key} value={item[key]} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{onTextChanged(e,key,item)}}/>
        }else if (columnData.type==="combobox"){
            return <Select isMultiple={false} 
            style={{marginLeft:'10px',maxWidth:'215px'}}
            //selectedItemColor='red'
            placeholder='请选择'
            isEditable={true}
            filterable={true} 
            onChange={(val,label)=>{console.log("onchanged",val,label)}} 
            options={[{label:'测试1',value:'1'},{label:'测试2',value:'2'},{label:'测试3',value:'3'},{label:'测试4',value:'4'}]}></Select>
        }else if(columnData.type==='multiCombobox'){
            return <Select isMultiple={true} 
            style={{marginLeft:'10px',marginRight:'0px',minWidth:'215px',maxWidth:'215px',height:40}}
            //selectedItemColor='red'
            value={"测试1"}
            onKeydown={handleKeyDown}
            placeholder='请选择'
            isEditable={true}
            filterable={true} 
            onChange={(val,label)=>{console.log("onchanged",val,label)}} 
            options={docLabels}></Select>
        }
        return <Input style={{marginLeft:"10px"}} type='text' name={key} value={item[key]}/>
    }
    return (
        <div>
            <table>
                <thead>
                    <tr key="header_tr">
                        {headers.map((item, index) => (
                            setTh(index,item)
                        ))}
                        <th key="action_btns" style={{ width: 50}}>功能</th>
                    </tr>
                </thead>
                <tbody>
                    {search?.map((item:Iobject, index) => (
                        <tr key={index}>
                            {headers.map((key, subIndex) => (
                                setTd(subIndex,key,item)
                            ))}
                            <th key={"action_btns_"+index}><button onClick={() => openModal(item["编号"])}>编辑</button></th>
                        </tr>
                    ))}
                </tbody>
                
            </table>
            {hoveredImage && (
                <div ref={popupRef} className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
                    <img src={hoveredImage} alt="Large preview" />
                </div>
            )}
            {currentItem && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={closeModal}>&times;</span>
                    <h2>{currentItem['编号']}</h2>
                    <div className="modal-form">
                        {createForm()}
                    </div>
                    <div>
                        <button onClick={onSubmited}>Submit</button>
                    </div>
                </div>
                </div>
            )}
        </div>
        
    );
}

export default MTable;