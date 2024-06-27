import React, { useState, useEffect, useRef, useContext, InputHTMLAttributes, AnchorHTMLAttributes, Attributes } from 'react';
import classNames from "classnames";
import Icon from '../Icon/icon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
interface InputWrapperProps{
    children?:React.ReactNode,
    icon?:IconProp,
    isShowClear?:boolean,
    inputValue?:string | number | readonly string[],
    onClear?:() => void
}
type AnchorInputProps = InputWrapperProps & AnchorHTMLAttributes<HTMLDivElement>
const InputWrapper: React.FC<AnchorInputProps> = ({children,className,icon,isShowClear,inputValue,onClear,...restProps }) => {
    const classes = classNames("gr-input-wrapper",className)
    const hanlerClear=()=>{
        
        onClear?.();
    }
    return(
        <div className={classes} {...restProps}>
            <div className='gr-input-icon'>{icon!==undefined ? <Icon style={{transform:'translateY(40%)',color:'gray'}} icon={icon}></Icon>:''}</div>
            {children}
            {isShowClear && inputValue && <div className='gr-input-clear' onClick={hanlerClear}>{<Icon icon={'times'}></Icon>}</div>}
        </div>
    )
}
export default InputWrapper