import React, { FC,useState, useEffect, useRef } from "react";
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";
import { formatDateTime } from '../../utils/utils';
import io from 'socket.io-client';
// import classNames from "classnames";

export interface ImTableProps {
    className?: string;
}
interface Iobject {
    [key: string]: any;
}
interface ImageItem {
    id: string;
    fileName: string; // 假设每行数据中有一个fileName字段
  }
const serverIp='192.168.10.213'
const serverPort = '4555'
const socket = io(`http://${serverIp}:${serverPort}`,{
    
 // path: '/socket.io', // Ensure the path matches the server configuration
  //transports: ['websocket'], // Use WebSocket as the transport protocol
}); 
const MTable: FC<ImTableProps> = (props) => {
    const { className } = props;
    const { result } = useDBload();
    console.log("result",result)
    const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
    const [imageURLs_thumb, setImageURLs_thumb] = useState<{ [key: string]: string }>({});
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const [popupPosition, setPopupPosition] = useState<{ top: number, left: number }>({ top: 0, left: 0 });
    const popupRef = useRef<HTMLDivElement>(null);
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
        if (result && result.length > 0) {
            const fetchImageURLs = async () => {
                const urls: { [key: string]: string } = {};
                const urls_thumb: { [key: string]: string } = {};
                for (const item of result as Iobject[]) {
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
    }, [result]);
    if(result===undefined || result.length===0) return null
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
        return <td key={index} style={style}>{td_item}</td>
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
    const headers = Object.keys(result[0])
    function handleEdit(id: any): void {
        //throw new Error("Function not implemented.");
        console.log("id",id)
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
                    {result?.map((item:Iobject, index) => (
                        <tr key={index}>
                            {headers.map((key, subIndex) => (
                                setTd(subIndex,key,item)
                            ))}
                            <th key={"action_btns_"+index}><button onClick={() => handleEdit(item["编号"])}>编辑</button></th>
                        </tr>
                    ))}
                </tbody>
                
            </table>
            {hoveredImage && (
                <div ref={popupRef} className="popup" style={{ top: popupPosition.top, left: popupPosition.left }}>
                    <img src={hoveredImage} alt="Large preview" />
                </div>
            )}
        </div>
        
    );
}

export default MTable;