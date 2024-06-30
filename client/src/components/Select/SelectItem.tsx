import React, { useState, useEffect, useRef } from 'react';
import Icon from '../Icon/icon';

interface SelectItemProps {
    label:string,
    value:string,
    onDelete?: (value:string) => void;
    selectedItemColor?:string;

}
const SelectItem: React.FC<SelectItemProps> = ({ label,value,onDelete,selectedItemColor }) => {
    const [isHovered, setIsHovered] = useState(false);
    const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };
    return <div className="input-content" style={{background:selectedItemColor?selectedItemColor:'gray'}} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                {label}{isHovered && <Icon className='input-content-close' icon="times" onClick={()=>onDelete?.(label)}></Icon>}
        </div>
}
export default SelectItem;