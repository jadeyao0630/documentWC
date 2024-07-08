import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import DBLoader from './utils/DBLoader/DBLoader';
import { DBLoaderContextType, DBLoaderProvider, useDBload } from './utils/DBLoader/DBLoaderContext';
import SearchBar from './components/SearchBar/SearchBar';
import Dropdown, { OptionType } from './components/Select/Dropdown';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import {serverIp,serverPort} from './utils/config'
import io from 'socket.io-client';
import MTable, { Iobject } from './components/MTable/MTable';
import FileUpload from './components/FileUpload/FileUpload';
import Header from './components/Header/header';
import Icon from './components/Icon/icon';
import { Popup } from './components/Popup/Popup';
import UserRegister from './components/Register/UserRegister';
import HeaderMenuItem from './components/Header/HeaderMenuItem';
import Button from './components/Button/button';
import Input from './components/Input/input';
import { isObject } from 'util';
import { Tooltip } from 'react-tooltip';

library.add(fas)

// const socket = io(`http://${serverIp}:${serverPort}`,{
//     //withCredentials:true,
//   // path: '/socket.io', // Ensure the path matches the server configuration
//   // transports: ['websocket'], // Use WebSocket as the transport protocol
// }); 

function App() {
  const [showPopup, setShowPopup] = useState<string|undefined>(undefined);
  const [optionData, setOptionData] = useState<Iobject>({projects:[],tags:[],locations:[],categories:[]});
  const [optionOriginalData, setOptionOriginalData] = useState<Iobject>({projects:[],tags:[],locations:[],categories:[]});
  const [_data, setData] = useState<DBLoaderContextType>();
  const [optionIndex,setOptionIndex] = useState<string>()
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tableMarginTop, setTableMarginTop] = useState(48);
  
  const scrollableContainerRef = useRef<HTMLUListElement>(null);
  
  const MenuItemClicked = (e:React.MouseEvent<HTMLAnchorElement>,data:DBLoaderContextType)=>{
    e.preventDefault(); 
    //setShowHeaderMenu(false)
    //console.log(e.currentTarget.dataset.name,projects)
    if(e.currentTarget.dataset.name==="import" || e.currentTarget.dataset.name==="register" || e.currentTarget.dataset.name==="options")
      setShowPopup(e.currentTarget.dataset.name)
      if(e.currentTarget.dataset.name==="options"){
        const optionList:Iobject={projects:[],tags:[],locations:[],categories:[]}
        const {projects,tags,locations,categories} = data
        setData(data)
        optionList.projects=projects
        optionList.tags=tags
        optionList.locations=locations
        optionList.categories=categories
        console.log("optionList",optionList)
        setOptionData(optionList)
        setOptionOriginalData(optionList)
      }
    else{

    }
  }
  var PopupContent = (
    <></>
  );
  if(showPopup==="import"){
    PopupContent = (
      <div style={{display:"inline-grid",gridTemplateRows:"auto auto 1fr"}} className={isProcessing?"disabled":""} >
        <h4 style={{marginBottom:"20px", marginTop:"10px"}}>导入数据</h4>
        <span className="close-button" onClick={()=>{setShowPopup(undefined)}}>&times;</span>
        <div style={{margin:"40px 0px"}}>
          <FileUpload onCompleted={(isCompleted)=>{

              setIsProcessing(!isCompleted)
            
          }}/>
        </div>
      </div>
    )
  }
  else if(showPopup==="register"){
    PopupContent = (
      <div style={{display:"inline-grid",gridTemplateRows:"auto auto 1fr",width:"100%"}} className={isProcessing?"disabled":""} >
        <h4 style={{marginBottom:"10px", marginTop:"10px"}}>注册用户</h4>
        <span className="close-button" onClick={()=>{setShowPopup(undefined)}}>&times;</span>
        <div style={{margin:"20px 20px"}}>
          <UserRegister></UserRegister>
        </div>
      </div>
    )
  }else if(showPopup==="options"){
    console.log("optionData",optionData)
    PopupContent = (
      <div style={{display:"inline-grid",gridTemplateRows:"auto auto 1fr",width:"100%"}} className={isProcessing?"disabled":""} >
        <h4 style={{marginBottom:"10px", marginTop:"10px"}}>编辑选项</h4>
        <span className="close-button" onClick={()=>{setOptionIndex(undefined);setShowPopup(undefined)}}>&times;</span>
        <div style={{margin:"20px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",alignItems:"center"}}>
            <Dropdown 
              style={{margin:"5px 0px 5px 5px",textAlign:'left'}}
              options={[
                {label: "项目",value: "projects"},
                {label: "分类",value: "categories"},
                {label: "位置",value: "locations"}
              ]}
              isMulti={false}
              isClearable={false}
              showDropIndicator={true}
              showInput={false} onChange={(e)=>{
                console.log(e)
                if(e!==null)
                  setOptionIndex((e as OptionType).value)
              }}></Dropdown>
              <Button data-tooltip-id='main-tooltips' data-tooltip-content={"添加选项"} style={optionIndex?{color:"#1362B7",height:"35px",width:"35px",marginLeft:"5px"}:{display:"none"}} onClick={(e)=>{
                  if(optionIndex!==undefined) handleAddItem(optionIndex)
                }}><Icon icon={"plus"}></Icon></Button>
              </div>
          {optionData && optionIndex && optionData[optionIndex] && <ul ref={scrollableContainerRef} style={{overflowY:"auto",maxHeight:"200px",marginTop:"20px"}}>
            {optionData[optionIndex].map((opt:Iobject,idx:number)=>{
              console.log(opt)
              return <li key={idx} style={
                {...{display:"grid",gridTemplateColumns:"1fr auto auto auto",marginTop:"5px",alignItems:"center",textAlign:"left",border:"1px solid #ddd",paddingLeft:"10px",borderRadius:"5px",marginLeft:"-28px"},
                ...(optionOriginalData[optionIndex].length-1===idx)?{marginBottom:"5px"}:{}}
                }>
                <Input type="text" style={{border:"none",boxShadow:"none"}} value={opt.name} onChange={(e)=>{
                  console.log((e.currentTarget as HTMLInputElement).value)
                  handleInputChange(optionIndex,idx,(e.currentTarget as HTMLInputElement).value)
                  //setOptionData({...optionData,[optionIndex]:{...opt,name:(e.currentTarget as HTMLInputElement).value}})
                  //opt.name=(e.currentTarget as HTMLInputElement).value
                  }}></Input>
                
                <Button data-tooltip-id='main-tooltips' data-tooltip-content={"保存修改"} style={optionOriginalData[optionIndex][idx] && optionOriginalData[optionIndex][idx].name===opt.name?{display:"none"}:{color:"green",border:"none",boxShadow:"none"}} 
                  onClick={(e)=>saveChanges(optionIndex,idx)}><Icon icon={opt.isDisabled?"sync":"check"}></Icon></Button>
                <Button data-tooltip-id='main-tooltips' data-tooltip-content={"禁用选项"} btnType='red' style={{border:"none",boxShadow:"none"}}><Icon icon={"times"}></Icon></Button>
              </li>
            })}
          </ul>}
        </div>
        <Tooltip id='main-tooltips' style={{zIndex:1001}}/>
      </div>
    )
  }
  const getMaxIdItem = (items: Iobject[]): Iobject | undefined => {
    return items.reduce((max, item) => (item.id > max.id ? item : max), items[0]);
  };
  const handleAddItem = (key:string) => {
    const lastItem=getMaxIdItem(optionData[key]);
    if(lastItem!==undefined){
      optionData[key].push({ ...lastItem, name: "",id: lastItem.id+1,isNew:true})
      console.log("newOptionData",optionData[key])
      setOptionData((opt)=>({...opt,[key]:optionData[key]}));
      setTimeout(() => {
        
      const scrollableContainer = scrollableContainerRef.current;
      if (scrollableContainer) {
        scrollableContainer.scrollTop = scrollableContainer.scrollHeight;
      }
      }, 500);
    }
  };
  const handleInputChange = (key:string,index: number, value: string) => {

    const newOptionData = optionData[key].map(((opt:Iobject,idx:number)=>(
      idx === index 
        ? { ...opt, name: value }
        : opt
          
    )))
    console.log("newOptionData",newOptionData)
    setOptionData((opt)=>({...opt,[key]:newOptionData}));
  };
  const saveChanges = (key:string,index: number) => {
    if(_data!==undefined && optionData!==undefined){
      if(key==="projects"){
        const {projects,setProjects} =_data
        if(projects!==undefined){
          if(index>projects.length-1){
            projects?.push(optionData[key][index])
            setProjects(projects)
          }else{

            setProjects(projects?.map((p:Iobject,idx:number)=>
              {return idx === index? optionData[key][index]:p}
            ))
          }

        }
      }else if(key==="categories"){
        const {categories,setCategories} =_data
        if(categories!==undefined){
          const editItem=optionData[key][index]
          console.log("saveChanges",editItem,(index>categories.length-1),optionData[key],categories)
          const matched = categories.find(d=>{
            return d.id===editItem.id
          })
          var keys:string[]=[]
          var values:string[]=[]
          var keys_values:string[]=[]
          Object.keys(editItem).forEach(key=>{
            if(key!=="id" && key!=="isNew"){

              keys.push(key)
              const val=key==="id" || key==="isDisabled"?editItem[key]:`N'${editItem[key]}'`;
              values.push(val)
              keys_values.push(`${key}=${val}`)
            }
          })
          var query=""
          if(editItem.isNew){
            query=`INSERT INTO categories (${keys.join(", ")}) VALUES (${values.join(",")});`
          }else{
            if(matched!==undefined){
              query=`UPDATE categories SET ${keys_values.join(",")} WHERE id=${matched.id};
                    UPDATE documents_list SET category = N'${editItem.name}' WHERE category=N'${matched.name}';`
            }else{
              query=`INSERT INTO categories (${keys.join(", ")}) VALUES (${values.join(",")});`
            }
           
            
          }
          console.log(query)
          if(index>categories.length-1){
            categories?.push(editItem)
            setCategories(categories)
          }else{
            setCategories(categories?.map((p:Iobject,idx:number)=>
              {
                console.log(p,editItem)
                return {...p,...editItem}
              }
          
            ))
          }
        }
      }else if(key==="locations"){
        const {locations,setLocations} =_data
        if(locations!==undefined){
          if(index>locations.length-1){
            locations?.push(optionData[key][index])
            setLocations(locations)
          }else{

            setLocations(locations?.map((p:Iobject,idx:number)=>
              {return idx === index? optionData[key][index]:p}
          
            ))
          }
        }
      }
      setOptionOriginalData((opt)=>({...opt,[key]:opt[key].map((op:Iobject,id:number)=>(
        id === index 
          ? optionData[key][index]
          : op
      ))}));
      
    }
  }
  console.log("showHeaderMenu",showHeaderMenu)
  return (
    <div className="App">
      <div style={{ paddingTop: '50px' }}>
        <DBLoaderProvider>
            <Header title="档案归档" isMenuOpen={showHeaderMenu}>
              <HeaderMenuItem items={[
                {icon:"user-plus",label:"注册账户",color:"#1362B7",id:"register",onClicked:MenuItemClicked},
                {icon:"upload",label:"导入数据",color:"#348a09",id:"import",onClicked:MenuItemClicked},
                {icon:"list-alt",label:"编辑选项",color:"#d63384",id:"options",onClicked:MenuItemClicked},
                {icon:"sign-out",label:"退出",color:"red",id:"exit",onClicked:MenuItemClicked}
              ]}></HeaderMenuItem>
              
            </Header>
            <DBLoader databaseType={'mssql'} />
            <SearchBar onSizeChanged={setTableMarginTop}/>
            <MTable style={{marginTop:tableMarginTop}}/>
        </DBLoaderProvider>
      </div>
      {showPopup && 
      <div className="popup-background">
        <div className='popup-panel'>
          {PopupContent}
        </div>
      </div>}
    </div>
  );
}

export default App;
