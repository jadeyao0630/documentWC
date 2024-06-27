import React, { FC,useState, useEffect, useRef } from "react";
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";

export interface ISearchBarProps {
    className?: string;
}
const SearchBar: FC<ISearchBarProps> = (props) => {
    const { className } = props;
    const { result,setSearch } = useDBload();
    const searchChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
        console.log(e.target.value)
        setSearch((ss: any)=>{
            return ss;
            return result?.filter((r)=>{

            })}
        )
    }

    return <input type="text" onChange={searchChange}/>;
}
export default SearchBar;