import React, {  useEffect, useRef, useState } from 'react';
import Icon from '../Icon/icon';
import { Tooltip } from 'react-tooltip';
interface IHeaderProp{
    title?:string,
    isMenuOpen?:boolean,
    children?:React.ReactNode,
    
}

const Header: React.FC<IHeaderProp> = (prop) => {
  const {title="",isMenuOpen,children} = prop
  const [isDropdownOpen, setIsDropdownOpen] = useState(isMenuOpen);
  useEffect(()=>{
    console.log("isMenuOpen",isMenuOpen)
    setIsDropdownOpen(isMenuOpen)
  },[isMenuOpen])
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  };
  const ref = useRef<HTMLButtonElement>(null);
  const ref_div = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    
    if (ref.current && !ref.current.contains(event.target as Node)) {
        console.log("clicked outside",isDropdownOpen)
        if(ref_div.current && !ref_div.current.contains(event.target as Node)){
            setIsDropdownOpen(false)
        }else{
            setTimeout(()=>setIsDropdownOpen(false),500)
        }
        
        
        //onMenuOpenChanged?.()
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="header">
      <div className="header-content">
        <h4 className="logo">{title}</h4>
        <button ref={ref} data-tooltip-id={'header-tooltips'} data-tooltip-content={"设置"} className="dropdown-button" onClick={toggleDropdown}>
          <Icon icon="gear"></Icon>
        </button>
        {isDropdownOpen && (
          <div ref={ref_div} className="dropdown-menu">
            {children}
          </div>
        )}
      </div>
      <Tooltip id='header-tooltips' style={{zIndex:1001}}></Tooltip>
    </header>
  );
};

export default Header;