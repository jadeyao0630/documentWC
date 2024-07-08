import React, { FC,useState, useEffect, useRef } from "react";
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";
import { findColumnByLabel, formatDateTime } from '../../utils/utils';
import {ColumnData,tableColumns,serverIp,serverPort} from '../../utils/config'

import Input from "../Input/input";
import Select, { SelectOption } from "../Select/Select";
import Button from "../Button/button";
import Dropdown, { OptionType } from "../Select/Dropdown";
import { MultiValue, SingleValue } from "react-select";
import ReactTooltip ,{ Tooltip, TooltipRefProps } from "react-tooltip";
import MessageBox from "../MessageBox/MessageBox";
import Dialog from "../Dialog/Dialog";
import Icon from "../Icon/icon";

// import classNames from "classnames";

export interface ImTableProps {
    className?: string;
    style?: React.CSSProperties;
}
export interface Iobject {
    [key: string]: any;
}
interface ImageItem {
    id: string;
    fileName: string; // 假设每行数据中有一个fileName字段
  }
  
//const projects=["大兴","北七家","西铁营"]
//const categories=["运营类","投资结算","营销类","物业中标通知书","审计文件","上市公司文件","股票债券文件","图纸类","招商文件"]
const docTags=["请款","请示","大兴","北七家","西铁营"]
//const locations=["销售类合同模板","苏州营销","北七家商品房精装修","北七家营销","物业公司运营文件"]



//const serverIp='192.168.10.213'
//const serverPort = '4555'
const MTable: FC<ImTableProps> = (props) => {
    const { className,style } = props;
    const { 
        setReload,
        result,search,setResult,setSearch,
        categories,setCategories,
        projects,setProjects,
        tags,setTags,
        tagsToAdd,setTagsToAdd,
        locations,setLocations } = useDBload();
    const [imageURLs, setImageURLs] = useState<{ [key: string]: string }>({});
    const [imageURLs_thumb, setImageURLs_thumb] = useState<{ [key: string]: string }>({});
    const [hoveredImage, setHoveredImage] = useState<string | null>(null);
    const popupRef = useRef<HTMLImageElement>(null);
    const tooltipRef1 = useRef<TooltipRefProps>(null)
    const [currentItem, setCurrentItem] = useState<Iobject>();
    
    const [message, setMessage] = useState<string | null>(null);
    const [dialogMessage, setDialogMessage] = useState<string | null>(null);

    const [tooltipVisible, setTooltipVisible] = useState(false);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogPromise, setDialogPromise] = useState<{ resolve: (value: boolean) => void, reject: () => void } | null>(null);
    const [position, setPosition] = useState({left:0,top:0});

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(15);
    const [goToPage, setGoToPage] = useState(1);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    setGoToPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const handleFristPage = () => {
    setCurrentPage(1);
    setGoToPage(1);
  };
  const handleLastPage= () => {
    if(search!==undefined){
        setCurrentPage(Math.ceil(search.length / itemsPerPage));
        
        setGoToPage(Math.ceil(search.length / itemsPerPage));
    }
  };
  const handleNextPage = () => {
    if(search!==undefined){
        setCurrentPage((prevPage) => Math.min(prevPage + 1, Math.ceil(search.length / itemsPerPage)));
        
        setGoToPage((prevPage) => Math.min(prevPage + 1, Math.ceil(search.length / itemsPerPage)));
    }
  };
  const handleGoToPageSubmit = (e: React.KeyboardEvent) => {
    //e.preventDefault();
    if(search!==undefined && e.code.toUpperCase()==="ENTER"){
        const pageNumber = goToPage;
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= Math.ceil(search.length / itemsPerPage)) {
        setCurrentPage(pageNumber);
        }
        setGoToPage(pageNumber);
    }
  };
  const handleGoToPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGoToPage(Number(e.target.value));
  };
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1); // Reset to the first page
    }
  };
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = search?.slice(startIndex, startIndex + itemsPerPage);
  //setSearch(paginatedData?paginatedData:[])

  useEffect(() => {
    const handleScroll = () => {
        setPosition((p)=>{
            p.left=window.scrollX
            p.top=window.scrollY
            return p
        }
        );
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

    const showDialog = (mesg:string|null) => {
        //setDialogVisible(true);
        setDialogMessage(mesg)
        return new Promise<boolean>((resolve, reject) => {
        setDialogPromise({ resolve, reject });
        });
    };

    console.log("result",paginatedData,tooltipVisible)
    const openModal = (id: any) => {
        const filteredResult = result?.filter((res: Iobject) => res['docId'] === id);
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
      const closePopup = () => {
        setHoveredImage(null);
        //setIsModalOpen(false);
      };
      useEffect(() => {

        tableColumns.category.data=categories?.map((data) => ({
            label: data.name,
            value: data.id.toString()
          }))
          //tableColumns.project.value=["0"]
          tableColumns.project.data=projects?.map((data) => ({
            label: data.name,
            value: data.id.toString()
          }))
          //tableColumns.project.value=["0"]
          tableColumns.location.data=locations?.map((data) => ({
            label: data.name,
            value: data.id.toString()
          }))
          
          //tableColumns.project.value=["0"]
          tableColumns.description.data=tags?.map((data) => ({
            label: data.name,
            value: data.id.toString()
          }))
      },[categories,projects,locations,tags]);
    //   useEffect(() => {

    
    //     const handleMouseOver = (event: MouseEvent) => {
    //         if(event.target instanceof  HTMLTableCellElement){
    //             const td=event.target as HTMLTableCellElement
    //             const isOverflowing = td.scrollWidth > td.clientWidth ;
    //             if(isOverflowing) td.classList.add('tool-tip')
    //             else td.classList.remove('tool-tip')
    //             console.log(td.textContent,isOverflowing)
    //             //setTooltipVisible(isOverflowing);
    //             //ReactTooltip.Tooltip();
                
    //         }
    //     };
    //     //window.addEventListener('resize', checkOverflow);
    //     document.addEventListener('mouseover', handleMouseOver);
    //     return () => {
    //       //window.removeEventListener('resize', checkOverflow);
    //       document.removeEventListener('mouseover', handleMouseOver);
    //     };
    //   },[]);
    useEffect(() => {
        // socket.on('serverMessage', (message) => {
        //     console.log("message",message)
        // });
        // socket.on('connect', () => {
        //     console.log('Connected to socket server');
        //   });
        // socket.on('connect_error', (error) => {
        //     //console.error('Connection error:', error);
        //   });
        // return () => {
        //     socket.off('message');
        // };
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
    }, [popupRef]);

    useEffect(() => {
        if (search && search.length > 0) {
            const fetchImageURLs = async () => {
                const urls: { [key: string]: string } = {};
                const urls_thumb: { [key: string]: string } = {};
                for (const item of search as Iobject[]) {
                    if(item["coverPage"]!==undefined && item["coverPage"]!==null && item["coverPage"].length>0){
                        const url = await fetch(`http://${serverIp}:${serverPort}/preview?folder=${item["docId"]}&fileName=thumb_${item["coverPage"]}`, {
                            method: 'get',
                            headers: {
                                'Content-Type': 'application/json',
                            }
                        }).then(response => response.url);
                        urls[item["docId"]] = url.replace("thumb_","");
                        urls_thumb[item["docId"]] = url;
                    }
                }
                setImageURLs(urls);
                setImageURLs_thumb(urls_thumb);
            };
            fetchImageURLs();
        }
    }, [search]);
    if(search===undefined || search.length===0) return <div>没有记录</div>

    const showMessage = (mesg:string | null) => {
      setMessage(mesg);
    };

    const handleMouseEnter = (url: string,event:React.MouseEvent) => {
        setHoveredImage(url);
        console.log(url)
        //console.log(window.innerWidth,event.clientX + 10,popupRef.current,popupRef.current?.getBoundingClientRect());
        //setPopupPosition({ top: window.scrollY, left: 0});
    };

    const setTd = (index:number, key:string,item:Iobject) => {
        if(tableColumns.hasOwnProperty(key)){
            const type=tableColumns[key].type
            var style:React.CSSProperties={...tableColumns[key]['style'],textAlign:"left"}
            if(tableColumns[key].isHide) style={...style, display:'none' }
            var td_item = item[key];
            if (type === "img") {
                style = { padding: 0,textAlign:"center" };
                td_item = imageURLs_thumb[item["docId"]] ? <img className="thumbnail" src={imageURLs_thumb[item["docId"]]} alt="coverPage" onClick={(e) => handleMouseEnter(imageURLs[item["docId"]],e)} /> : 
                (imageURLs_thumb[item["docId"]]?'Loading...':'');
            }else if (type === "date") {
                td_item = formatDateTime(item[key],tableColumns[key].format);
            }else if (type === "combobox" || type === "multiCombobox") {
                if(tableColumns[key].data!==undefined && tableColumns[key].data.length>0){
                    //console.log(tableColumns[key].data)
                    if((tableColumns[key].data as Iobject[]).find((d)=>{return d.label===item[key]})!==undefined){

                    }else{
                        
                        if(tableColumns[key].backupKey!==undefined){

                            const match=(tableColumns[key].data as Array<OptionType>).find((d)=>{return d.value.toString()===item[tableColumns[key].backupKey].toString()})
                            //console.log("value is not match",tableColumns[key].data,item[tableColumns[key].backupKey])
                            if(match!==undefined){
                                td_item=match.label
                            }
                            
                        }
                    }
                }
                //td_item = tableColumns[key].data?tableColumns[key].data.find(()=>{})item[key];
            }
            
            return <td key={index} 
                        data-index={index} 
                        //data-tooltip-id={"table-tooltips"} 
                        //data-tooltip-content={td_item} 
                        style={style} 
                        
                        //title={tooltipVisible[index] ? td_item : ''}
                        onDoubleClick={() => handleDoubleClick(item["docId"],key)}>
                            <div 
                        style={style} onMouseEnter={(e) => {
                            if(e.target instanceof HTMLDivElement){
                                const td = e.target as HTMLDivElement
                                const isOverflowing = td.scrollWidth > td.clientWidth ;
                                if(isOverflowing) {
                                    td.classList.add('has_tool_tip')
                                    tooltipRef1.current?.open({
                                        anchorSelect: '.has_tool_tip',
                                        content:td_item
                                    })
                                }
                                //console.log(tooltipRef1.current,isOverflowing)
                            }
                            
                        }}
                        onMouseLeave={(e) => {
                            if(e.target instanceof HTMLDivElement){
                                const td = e.target as HTMLDivElement
                                td.classList.remove('has_tool_tip')
                                tooltipRef1.current?.close()
                                //console.log(tooltipRef1.current)
                            }
                        }}>

                                {td_item}
                            </div>
                        </td>
        }return null
    }
    const setTh = (index:number, key:string) => {
        if(tableColumns.hasOwnProperty(key)){
            const columnData:ColumnData=tableColumns[key]
            var style:React.CSSProperties={...tableColumns[key]['style'],textAlign:"left"}
            if(columnData.isHide) style={...style, display:'none' }
            if(columnData.width) style={...style, width: columnData.width }
            if(columnData.style) style={...style, ...columnData.style }
            var th_item=columnData.label;

            return <th key={index} data-index={index} style={style}>{th_item}</th>
        }return null
    }
    const headers = Object.keys(tableColumns)
    const handleDoubleClick = (id: number, key:string) => {
        const filteredResult = result?.filter((res: Iobject) => res['docId'] === id);
        
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
                                {tableColumns[key].label}:
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
    const onTagAdded = (added:OptionType,key:string,item:Iobject)=>{
        console.log("added tags",added);
        const newAdded={id:added.value,name:added.label,freq:1,isDisabled:0}
        const itemValues=item[key]!==undefined && item[key].length>0?item[key].split(","):[]
        itemValues.push(added.label)
        const updatedItem = { ...currentItem, [key]: itemValues.join(', ')};
        console.log(updatedItem);
        setCurrentItem(updatedItem);

        setTags(tags?tags.concat(newAdded):[newAdded])
        setTagsToAdd(tagsToAdd?tagsToAdd.concat(newAdded):[newAdded])


    }
    const onTextChanged = (e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>,key:string,item:Iobject)=>{
        const updatedItem = { ...item, [key]: e.target.value };
        setCurrentItem(updatedItem);
    }
    const onDeleted = async() => {
        try {
            const userResponse = await showDialog("确定删除操作吗？")
            if (userResponse) {
                console.log('User confirmed');
                if(currentItem){
                    fetch("http://"+serverIp+":"+serverPort+"/saveData",{
                        headers:{
                          'Content-Type': 'application/json'
                        },
                        method: 'POST',
                        body: JSON.stringify({ type: 'mssql',query:`
                          UPDATE documents_list 
                          SET isDisabled = 1
                          WHERE docId = ${currentItem.docId}
                          `})
                      })
                      .then(response => response.json())
                      .then(data => {
                          console.log("saveData",data)
                          setReload?.(new Date().getTime()/1000)
                          showMessage(data.data.rowsAffected.length>0?"删除完成":"删除失败")
                      })
                }
            } else {
                console.log('User canceled');
            }
        } catch (error) {
            console.error('Dialog was dismissed', error);
        }
        setCurrentItem(undefined)
        
    }
    const onSubmited = () => {
        const updatedItem:Iobject = { ...currentItem, ['modifiedTime']: new Date().toISOString() };
        var values:string[]=[];
        var keys:string[]=[];
        var values_keys:string[]=[]
        var source_key:string[]=[];
        Object.keys(updatedItem).forEach(k=>{
            if(k!=="id"){
                values.push(k==="docId"||k==="categoryId"||k==="projectId"||k==="locationId"||k==="isDisabled"?(k==="isDisabled"?0:updatedItem[k]):"N'"+updatedItem[k]+"'")
                keys.push(k)
                values_keys.push(`${k} = source.${k}`)
                source_key.push(`source.${k}`)
            }
        })
        console.log('query',`
        MERGE INTO documents_list AS target
        USING (VALUES (${values.join(", ")})) AS source (${keys.join(", ")})
        ON target.docId = source.docId
        WHEN MATCHED THEN
            UPDATE SET ${values_keys.join(", ")}
        WHEN NOT MATCHED THEN
            INSERT (${values.join(", ")})
            VALUES (${source_key.join(", ")});
        `)
        fetch("http://"+serverIp+":"+serverPort+"/saveData",{
          headers:{
            'Content-Type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify({ type: 'mssql',query:`
            MERGE INTO documents_list AS target
            USING (VALUES (${values.join(", ")})) AS source (${keys.join(", ")})
            ON target.docId = source.docId
            WHEN MATCHED THEN
                UPDATE SET ${values_keys.join(", ")}
            WHEN NOT MATCHED THEN
                INSERT (${keys.join(", ")})
                VALUES (${source_key.join(", ")});
            `})
        })
        .then(response => response.json())
        .then(data => {
            console.log("saveData",data)
            showMessage(data.data.rowsAffected.length>0?"执行完成":"执行失败")
        })
        if(tagsToAdd!==undefined && tagsToAdd.length>0){
            var queries:string[]=[]
            tagsToAdd?.forEach(tag=>{
                values=[];
                keys=[];
                values_keys=[]
                source_key=[];
                Object.keys(tag).forEach(k=>{
                    
                        values.push(k==="id"||k==="freq"||k==="isDisabled"?tag[k]:"N'"+tag[k]+"'")
                        keys.push(k)
                        if(k!=='id') values_keys.push(`${k} = source.${k}`)
                        source_key.push(`source.${k}`)
                    
                })
                queries.push(`
                MERGE INTO tags AS target
                USING (VALUES (${values.join(", ")})) AS source (${keys.join(", ")})
                ON target.id = source.id
                WHEN MATCHED THEN
                    UPDATE SET ${values_keys.join(", ")}
                WHEN NOT MATCHED THEN
                    INSERT (${keys.join(", ")})
                    VALUES (${source_key.join(", ")});
                `)
            })
            console.log(queries.join(" "))
            fetch("http://"+serverIp+":"+serverPort+"/saveData",{
              headers:{
                'Content-Type': 'application/json'
              },
              method: 'POST',
              body: JSON.stringify({ type: 'mssql',query:queries.join(" ")})
            })
            .then(response => response.json())
            .then(data => {
                
                setTagsToAdd([])
                console.log("saveData tags",data)
                
                
            })
        }
        
        if(result!==undefined){
            setResult(result.map((item) => (item['docId'] === updatedItem['docId'] ? updatedItem : item)))
            setSearch(search.map((item) => (item['docId'] === updatedItem['docId'] ? updatedItem : item)))
        }else{
            setResult([updatedItem])
            setSearch([updatedItem])
        }

        console.log(currentItem,updatedItem)
    }
    const getValuesFromLabels = (item:Iobject,key:string,columnData:ColumnData)=>{
        const labels=item[key]
        var result=labels.split(",").map((ik:String)=>{
            const matched = columnData.data.find(d=>d.label===ik.trim());
            if(matched!==undefined) return matched.value
        }).filter((itm:String) => itm !== undefined)
        if(result.length===0){
            if(tableColumns[key].backupKey!==undefined){
                const backupKey=tableColumns[key].backupKey
                
                result = item[backupKey].toString().split(",").map((ik:String)=>{
                    const matched = columnData.data.find(d=>d.value.toString()===ik.trim().toString());
                    console.log("getValuesFromLabels",matched)
                    if(matched!==undefined) return matched.value
                }).filter((itm:String) => itm !== undefined)
            }
        }
        return result
    }
    const getValues = (item:Iobject,key:string,columnData:ColumnData) => {
        const values=item[key]
        return values?(values.constructor===String?getValuesFromLabels(item,key,columnData):[values]):(columnData.value?columnData.value:[])
    }
    const getItem = (columnData:ColumnData,key:string,item:Iobject) => {
        const width=300
        if(columnData.type==="text"){
            return <Input style={{width:width,margin:"5px 0px 5px 10px"}} type='text' name={key} value={item[key]} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{onTextChanged(e,key,item)}}/>
        }else if(columnData.type==="textarea"){
            return <textarea className="gr-textarea"  style={{width:width,margin:"5px 0px 5px 10px"}} name={key} value={item[key]} onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>{onTextChanged(e,key,item)}}/>
        }else if (columnData.type==="combobox" || columnData.type==='multiCombobox'){
            console.log(item[key],item[key].constructor,item[key].constructor===String?getValuesFromLabels(item,key,columnData):item[key])
            return <Dropdown 
            defaultValues={getValues(item,key,columnData)}
            style={{width:width,display:"inline-block",margin:"5px 0px 5px 10px",textAlign:'left'}}
            options={columnData.data?columnData.data:[]}
            isMulti={columnData.type==='multiCombobox'}
            showDropIndicator={columnData.type==='multiCombobox'}
            showInput={columnData.type==='multiCombobox'}
            onChange={(val)=>onSelectValueChanged(val,key,item)}
            onAdd={(added)=>onTagAdded(added,key,item)}
            ></Dropdown>
        }
        return <Input style={{width:width,margin:"5px 0px 5px 10px"}} type='text' name={key} value={item[key]} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>{onTextChanged(e,key,item)}}/>
    }
    const onSelectValueChanged=(selectedOptions: SingleValue<OptionType> | MultiValue<OptionType>,key:string,item:Iobject) => {
        console.log(selectedOptions)
        var updatedItem = { ...item, [key]: Array.isArray(selectedOptions)?selectedOptions.map(option => option.label).join(', '):
            (selectedOptions?(selectedOptions as OptionType).label:"" )};
        if(tableColumns[key].backupKey!==undefined){
            updatedItem = { ...updatedItem, [tableColumns[key].backupKey]: Array.isArray(selectedOptions)?selectedOptions.map(option => option.value).join(', '):
            (selectedOptions?(selectedOptions as OptionType).value:"" )};
        }
        console.log(updatedItem);
        setCurrentItem(updatedItem);
    }

    const openDialog = (mesg:string|null) => {
        //setIsDialogOpen(true);
        setDialogMessage(mesg)
    };

    const closeDialog = () => {
        setDialogMessage(null)
    };
    const handleConfirm = () => {
        if (dialogPromise) {
            dialogPromise.resolve(true);
        }
        //setDialogVisible(false);
        setDialogMessage(null)
    };

    const handleCancel = () => {
        if (dialogPromise) {
            dialogPromise.resolve(false);
        }
        //setDialogVisible(false);
        setDialogMessage(null)
    };
    return (
        <div style={style}>
            <table>
                <thead>
                    <tr key="header_tr">
                        {headers.map((item, index) => (
                            setTh(index,item)
                        ))}
                        <th key="action_btns" style={{ width: 50,textAlign:"left"}}>功能</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedData?.map((item:Iobject, index) => (
                        <tr key={index}>
                            {headers.map((key, subIndex) => (
                                setTd(subIndex,key,item)
                            ))}
                            <td key={"action_btns_"+index} 
                                style={{padding:0}}>
                                <Button 
                                style={{margin:5}}
                                data-tooltip-id={"table-tooltips"} 
                                data-tooltip-content={'编辑档案'} 
                                onClick={() => openModal(item["docId"])} >编辑</Button></td>
                        </tr>
                    ))}
                </tbody>
                
            </table>
            <Tooltip id='table-tooltips' ref={tooltipRef1} style={{zIndex:1001}}
            //id="table-tooltips"
            ></Tooltip>
            {dialogMessage && <Dialog title="消息" onConfirm={handleConfirm}
                message={dialogMessage}
                onCancel={handleCancel} />}
            {message && (
                <MessageBox
                message={message}
                type="success"
                duration={3000}
                onClose={() => setMessage(null)}
                />
            )}
            {hoveredImage && (
                <div className="popupImg" style={{ top: `${position.top}px`,left: `${position.left}px`}}>
                    <span className="close-button" onClick={closePopup}>&times;</span>
                    <img ref={popupRef} src={hoveredImage} alt="Large preview" />
                </div>
            )}
            {currentItem && (
                <div className="modal">
                <div className="modal-content">
                    <span className="close-button" onClick={closeModal}>&times;</span>
                    <div style={{textAlign:"left",fontWeight:700}}>{currentItem['docId']}</div>
                    <div className="modal-form">
                        {createForm()}
                    </div>
                    <div>
                        <Button style={{marginTop:"20px",width:100,marginRight:"10px"}} btnType="blue" hasShadow={true} onClick={onSubmited}>提交</Button>
                        <Button style={{marginTop:"20px",width:100}} btnType="red" hasShadow={true} onClick={onDeleted}>删除</Button>
                    </div>
                </div>
                </div>
            )}
            <div className="pagination">
                <Button onClick={handleFristPage} style={{width:30}} disabled={currentPage === 1}>
                <Icon icon="angle-double-left"/>
                </Button>
                <Button onClick={handlePreviousPage} disabled={currentPage === 1}>
                <Icon icon="angle-left"/>
                </Button>
                <span>
                第 <Input style={{width:"60px"}} type="number" value={goToPage}
            onChange={handleGoToPageChange} onKeyDown={handleGoToPageSubmit} min="1" max={Math.ceil(search.length / itemsPerPage)} /> 页/ {Math.ceil(search.length / itemsPerPage)}
                </span>
                <Button onClick={handleNextPage} disabled={currentPage === Math.ceil(search?.length / itemsPerPage)}>
                <Icon icon="angle-right"/>
                </Button>
                <Button onClick={handleLastPage} style={{width:30}} disabled={currentPage === Math.ceil(search?.length / itemsPerPage)}>
                <Icon icon="angle-double-right"/>
                </Button>
                <div style={{display:"inline-block",marginLeft:"10px"}}>
                    <label>
                        每页
                        <Input
                        type="number"
                        value={itemsPerPage}
                        style={{margin:"0px 5px",width:"80px"}}
                        onChange={handleItemsPerPageChange}
                        // onKeyDown={(e) => {
                        //     if (e.key === 'Enter') {
                        //     e.preventDefault();
                        //     handleItemsPerPageChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
                        //     }
                        // }}
                        />
                        项
                    </label>
                </div>
            </div>
        </div>
        
    );
}

export default MTable;