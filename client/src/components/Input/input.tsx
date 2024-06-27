import classNames from 'classnames';
import React, { useState, useEffect, useRef, useContext, InputHTMLAttributes, AnchorHTMLAttributes } from 'react';
import InputWrapper from './InputWrapper';
//import { PaginationContext } from '../Table/table';

export interface InputProps{
    inline?:boolean,
    //value?:string,
    style ?: React.CSSProperties;
    type?:React.HTMLInputTypeAttribute;
}
//export type InputTypes = "primary" | "default" | 'danger' | 'link' | "green" | 'blue' | 'red'
type NativeButtonProps = InputProps & InputHTMLAttributes<HTMLElement>
type AnchorButtonProps = InputProps & AnchorHTMLAttributes<HTMLElement>
export type _InputProps = Partial<NativeButtonProps & AnchorButtonProps>
const Input:React.FC<_InputProps> = (props) => {
    const {
        inline=false,value,type,style,disabled,...restProps} = props
    
    //const context = useContext(PaginationContext)
    //const [inputValue, setInputValue] = useState(value)
    
    const inputRef = useRef<HTMLInputElement>(null)
    const adjustWidth = () => {
        if (inputRef.current && inline){
            inputRef.current.style.width = `${inputRef.current.value.length + 1 + 3}ch`
        }
    }

    useEffect(()=>{
        adjustWidth()
    },[value])


    const classes = classNames('gr-input',{
        [`input-${type}`]: type,
        'disabled': disabled,
        'noOutline':type==='search'
    })
    if(type==='checkbox'){
        return (
            <label className="checkbox-container" tabIndex={1}>
                <input 
                    type={type} className={classes}
                    ref={inputRef}
                    value={value} 
                    disabled={disabled}
                    style={{...{minWidth: '20px'},...style}}
                    {...restProps}
                />
                <span className="checkbox-background" tabIndex={1}></span>
            </label>
        )
    }else if(type==='radio'){
        return(
            <>
                <input type="radio" className={classes} id="__gr-radio" hidden />
                <label htmlFor="__gr-radio" className="radio-label" tabIndex={1}></label>
            </>
        )
    }else if(type==='search'){
        return(
            <div style={{...{display:'inline-block',verticalAlign: 'middle'},...style}}>

            <InputWrapper icon={'search'} isShowClear={true} inputValue={value} onClear={()=>{ }}>
                <input
                    type="text"
                    ref={inputRef}
                    className={'noOutline'}
                    style={{minWidth:'none'}}
                    value={value}
                    placeholder='过滤选项'
                    {...restProps}
                    autoComplete="off" />
            </InputWrapper>
            </div>
        )
    }else{

        return (
            
            <input 
                type={type} className={classes}
                ref={inputRef}
                value={value} 
                disabled={disabled}
                style={{...{minWidth: '20px'},...style}}
                {...restProps}
            />
                
            
        )
    }
}

export default Input