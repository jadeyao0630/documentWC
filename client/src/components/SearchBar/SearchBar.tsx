import React, { FC,useState, useEffect, useRef } from "react";
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";
import { Iobject } from "../MTable/MTable";
import Input from "../Input/input";
import InputWrapper from "../Input/InputWrapper";
import Dropdown, { OptionType } from "../Select/Dropdown";
import { MultiValue, SingleValue } from "react-select";
import Button from "../Button/button";

export interface ISearchBarProps {
    className?: string;
}
const SearchBar: FC<ISearchBarProps> = (props) => {
    const { className } = props;
    const { result,setSearch,tags,setTags } = useDBload();
    const [_tags,_setTags] = useState<OptionType[]>([]);
    const [selected,setSelected] = useState<SingleValue<OptionType> | MultiValue<OptionType>>([]);
    const searchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        const searchStr = e.target.value.toLowerCase(); // Convert search string to lowercase for case-insensitive search
        const filteredResult = result?.filter((res: Iobject) => {
          return Object.keys(res).some((key) => {
            const value = res[key];
            if (typeof value === 'string') {
              return value.toLowerCase().includes(searchStr); // Convert value to lowercase for case-insensitive search
            }
            return false;
          });
        });
    
        if (filteredResult === undefined) {
          setSearch([]);
        } else {
          setSearch(filteredResult);
        }
    }
    const isOptionType = (option: any): option is OptionType => {
      return option && typeof option.label === "string" && typeof option.value === "string";
    };
    const _searchChange = (selectedOptions: SingleValue<OptionType> | MultiValue<OptionType>)=>{
        console.log("_searchChange",selectedOptions)
        setSelected(selectedOptions)
        
    }
    
    const onTagAdded = (added: OptionType)=>{
      //_searchChange([added])
      const newAdded:Iobject={id:added.value,name:added.label,freq:1,isDisabled:0}
      if(tags!==undefined && tags.length>0){
        setTags([...tags, newAdded])
      }else{
        setTags([newAdded])
      }
    }
    const onSearchClicked =()=>{
      var _selected:string[]|string;
      if(selected===null || (Array.isArray(selected) && selected.length===0) || (isOptionType(selected) && (selected as OptionType).label.length===0)) {
        setSearch(result?result:[])
        return;
      }
      if(Array.isArray(selected)){
        _selected = selected.map(opt=>opt.label.toLowerCase())
        //const searchStr = element.value.toLowerCase(); // Convert search string to lowercase for case-insensitive search
          
      }else{
        _selected=(selected as OptionType).label.toLowerCase()
      }

      const filteredResult = result?.filter((res: Iobject) => {
        return Object.keys(res).some((key) => {
          const value = res[key];
          console.log("filteredResult",key,value)
          if (typeof value === 'string') {
            if(Array.isArray(_selected))
              return _selected.find((sel)=>value.toLowerCase().includes(sel))!==undefined; // Convert value to lowercase for case-insensitive search
            else{
              return value.toLowerCase().includes(_selected); // Convert value to lowercase for case-insensitive search
            }
          }
          return false;
        });
      });
      if (filteredResult === undefined) {
        setSearch([]);
      } else {
        setSearch(filteredResult);
      }
    }
    
    useEffect(() => {
      console.log("tags1",tags)
      _setTags(tags?tags.map((data) => ({
        label: data.name,
        value: data.id.toString()
      })):[])
    },[tags])
    console.log("tags",tags,_tags)
    return <div style={{display:"grid",gridTemplateColumns:"1fr auto"}}>
      <Dropdown 
        style={{margin:"5px 0px 5px 5px",textAlign:'left'}}
        options={_tags}
        isMulti={true}
        showDropIndicator={false}
        showInput={true}
        onChange={_searchChange}
        onAdd={onTagAdded}
        placeholder="请输入关键字"
        ></Dropdown>
    <Button style={{margin:5}} onClick={onSearchClicked}>搜索</Button>
    </div>
      //<Input type="search" style={{display:'block',margin:'10px'}} onChange={searchChange} autoComplete="off"/>;
            
}
export default SearchBar;