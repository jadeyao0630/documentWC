import React, { FC,useState, useEffect, useRef } from "react";
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";
import { Iobject } from "../MTable/MTable";
import Input from "../Input/input";
import InputWrapper from "../Input/InputWrapper";

export interface ISearchBarProps {
    className?: string;
}
const SearchBar: FC<ISearchBarProps> = (props) => {
    const { className } = props;
    const { result,setSearch } = useDBload();
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

    return <InputWrapper icon={'search'} isShowClear={true} onClear={()=>{ setSearch([]); }}>
            <Input type="text" onChange={searchChange} autoComplete="off"/>
            </InputWrapper>;
}
export default SearchBar;