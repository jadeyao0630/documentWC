import React, {  useEffect, useRef, useState } from 'react';
import Icon from '../Icon/icon';
import { Tooltip } from 'react-tooltip';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { DBLoaderContextType, useDBload } from '../../utils/DBLoader/DBLoaderContext';
export interface HeaderMenuItem{
    icon?:IconProp,
    label?:string,
    color?:string,
    id?:string,
    onClicked?:(e:React.MouseEvent<HTMLAnchorElement>,data:DBLoaderContextType)=>void
}
interface IHeaderMenuItemProp{
    items:HeaderMenuItem[]
}

const HeaderMenuItem: React.FC<IHeaderMenuItemProp> = (prop) => {
    const {items} = prop
    const data = useDBload();

    return <>{items.map(item=>{
        return <a key={item.id} style={{textAlign:"left"}} data-name={item.id} href="#" onClick={(e)=>item.onClicked?item.onClicked(e,data):undefined}>
            {item.icon && <Icon icon={item.icon} className='menu-icon' style={{color:item.color}}/>}{item.label}</a>
    })}</>
    
}
export default HeaderMenuItem;