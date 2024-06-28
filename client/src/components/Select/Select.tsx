import React, { useState, useEffect, useRef, InputHTMLAttributes } from 'react';
import Input from '../Input/input';
import Icon from '../Icon/icon';import { fas } from '@fortawesome/free-solid-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core';
import SelectItem from './SelectItem';
import InputWrapper from '../Input/InputWrapper';
library.add(fas)

export interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
  /** 选取菜单数据 */
  options: SelectOption[];
  /** 输入框是否可编辑 */
  isEditable?: boolean;
  /** 输入框占位符 */
  placeholder?: string;
  /** 是否多选 */
  isMultiple?: boolean;
  /** 是否过滤 */
  filterable?:boolean;
  /** 下拉菜单标题 */
  menuTitle?:string;
  /** 选取菜单选取值 */
  value?: string | string[];
  /** 多选选取菜单选取项背景色 */
  selectedItemColor?:string;
  /** 选取菜单选取改变事件 */
  onChange?: (values: string| string[]|undefined,labels?:string| string[]|undefined) => void;
  onKeydown?:(e:React.KeyboardEvent<HTMLInputElement>)=>void;
  /** 选取菜单样式 */
  style?:React.CSSProperties;
}
export type ButtonProps = Partial<InputHTMLAttributes<HTMLInputElement> & SelectProps>
const Select: React.FC<SelectProps> = ({ 
  
  isMultiple=true,
  placeholder='test',
  isEditable=true,
  filterable=true ,
  options=[{label:'测试1',value:'1'},{label:'测试2',value:'2'},{label:'测试3',value:'3'},{label:'测试4',value:'4'}],
  value,menuTitle,selectedItemColor, onChange,onKeydown,style }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    
    const [searchInputValue, setSearchInputValue] = useState('');
    const selectMenuRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setDropdownVisible(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      
      
      if(!isMultiple) {
        setInputValue(event.target.value);
        //onChange?.(value,label);
        var label=options.find((option)=>option.value===event.target.value)?.label;
        onChange?.(label||event.target.value,event.target.value);
      }
    };
    const handlSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInputValue(event.target.value);
      
    };
    const handleDropdownSelect = (e: React.MouseEvent<HTMLElement>,value: string,label: string) => {
      
      if(!isMultiple) {
        setInputValue(label);
        setDropdownVisible(false);
        onChange?.(value,label);
      }
      else{
        if((e.target as HTMLElement).tagName.toLowerCase()!=='input' && (e.target as HTMLElement).tagName.toLowerCase()!=='label') {
          var selectBox=(e.target as HTMLElement).querySelector('input') as HTMLInputElement;
          if(selectBox) selectBox.checked = !selectBox.checked;
          
        }
        var values:any[] = [];
        var labels:any[] = [];
          selectMenuRef.current?.querySelectorAll('input')?.forEach((item)=>{
            
            if((item as HTMLInputElement).checked) {
              //console.log()
              labels.push((item as HTMLInputElement).dataset.label);
              values.push((item as HTMLInputElement).dataset.value);
            }
          })
          setInputValue(values);
          console.log(e.target)
          onChange?.(values,labels);
      }
      
    };
    const getInputValue = () => {
      
      if(inputValue===undefined) return '';
      else{
        if(isMultiple){
          var array_value= inputValue
          if(inputValue?.constructor===String){
            array_value=inputValue.split(',')
          }
          return options.filter(option=>array_value.includes(option.value)).map(option=>`${option.label}`).join(',')
        }else{
          return inputValue as string
        }
        
      }
      //return inputValue===undefined?'':(inputValue?.constructor===String?inputValue as string:(inputValue as string[]).join(','))
    }
    const handleOnItemDelete = (value: string) => {
      console.log(value);
      setInputValue(values=>{
        var newValues: string | string[] | undefined=undefined;
        if(values!==undefined){
          if(values.constructor===String){
            values=values.split(',')
          }
          newValues = (values as string[]).filter((item)=>item!=value)
        }
        var labels=options?.filter(data=>newValues?.includes(data.value)).map(data => {
            return data.label;
        });
        onChange?.(labels,newValues);
        return newValues;
      });
      //
    }
    const generateMultipleSelectedItems = () => {
      var items:SelectOption[] = [];
      if(inputValue!==undefined) {
        if(inputValue?.constructor===String){
          items = options.filter((option) => inputValue.split(',').includes(option.value));
        }
        else{
          items = options.filter((option) => inputValue.includes(option.value));
        }
      }
      return items.map(item=>{
        return (
          <SelectItem selectedItemColor={selectedItemColor} label={item.label} value={item.value} key={item.value} onDelete={handleOnItemDelete}></SelectItem>
        );
      })
    }
    
    const hasValueContains=(option:SelectOption)=>{
      if(inputValue!==undefined){
        
      console.log('inputValue',inputValue instanceof String)
        var values:string[]=[];
        try{
          values=(inputValue as string).split(',')
        }catch{
          values=inputValue as string[];
        }
        
        
        var match=values.find(value=>option.label.toLowerCase().includes(value.toLowerCase())||option.value.toLowerCase().includes(value.toLowerCase()));
        console.log('values',values,values.constructor,match);
        return match!==undefined
        
      }
      return false;
    }
    const handlSearchClear = () => {
      setSearchInputValue('');
    }
    const handlInputClear = () => {
      setInputValue('');
    }
    const handleCheckboxChange = (value:string, isChecked:boolean) => {
      // Update your state based on value and isChecked
      if (isChecked) {
        // Add to selected values
      } else {
        // Remove from selected values
      }
    };
    return (
      <div className="gr-select" ref={ref} style={{...{ position: 'relative',display:'inline-block',verticalAlign:'middle',maxWidth:'200px',minWidth:'100px' },...style}} onFocus={() => {console.log('blur')}}>

        <InputWrapper isShowClear={!isMultiple} inputValue={getInputValue()} onClear={handlInputClear} tabIndex={0}>
            {isMultiple && <><div className='input-content-container' onFocus={() => console.log('blur1')}>{generateMultipleSelectedItems()}
            {isEditable && <Input
                type="text"
                //value={getInputValue()}
                //onChange={handleInputChange}
                onFocus={() => setDropdownVisible(true)}
                autoComplete="off"
                onKeyDown={onKeydown}
                //placeholder={placeholder}
                className="custom-input" />}
            </div>
            
            <div style={{cursor:'pointer',display:'inline-block',height:'100%',minWidth:'20px',position:'relative',textAlign:'right',alignContent:'center',padding:'.4rem'}}
            onClick={() => setDropdownVisible(!dropdownVisible)}><Icon icon={!dropdownVisible?'caret-down':'caret-up'}
                /></div></>}
            {!isMultiple && <Input
                type="text"
                value={getInputValue()}
                onChange={handleInputChange}
                onFocus={() => setDropdownVisible(true)}
                autoComplete="off"
                placeholder={placeholder}
                readOnly ={!isEditable}
                className="custom-input" />}
        
        </InputWrapper>
        {dropdownVisible && (
            <div ref={selectMenuRef} tabIndex={-1} className='popup-menu' style={{ position: 'absolute', padding: 0,zIndex: 999, backgroundColor: 'white', left:0,width:"100%" }}>
                
                {isMultiple && filterable && 
                    <>
                      {menuTitle &&<div className='select-header'>{menuTitle}</div>}
                      <div className='select-search-container'>
                        <InputWrapper icon={'search'} isShowClear={true} inputValue={searchInputValue} onClear={handlSearchClear}>
                          <input
                            type="text"
                            className='select-search'
                            style={{minWidth:'none'}}
                            value={searchInputValue}
                            placeholder='过滤选项'
                            onChange={handlSearchChange}
                            autoComplete="off" />
                          </InputWrapper>
                        </div>
                    </>
                }
                <ul className='popup-listview'>
                    {options.map((option) => {
                      var visible=true;
                      if(filterable){
                        if(isMultiple){
                          visible = option.label.toLowerCase().includes(searchInputValue.toLowerCase());
                        }else{
                          if(isEditable){
                            visible = hasValueContains(option)
                          }else{
                            visible = true
                          }
                          
                        }
                      }else{
                        visible = true;
                      }
                      return (
                    <li
                        className={`select-item-li ${visible?'':'select-item-li-hidden'}`}
                        key={option.value}
                        onClick={(e) => handleDropdownSelect(e,option.value,option.label)}
                    >
                        {isMultiple ? (
                          <div className='select-item'>
                            <label >
                              <Input type="checkbox"
                              data-value={option.value} 
                              data-label={option.label} 
                              checked={inputValue?.constructor===Array?
                                          (inputValue as string[]).includes(option.value):
                                          inputValue!==undefined && (inputValue as string).split(',').includes(option.value)?true:false}
                              onChange={(e) => handleCheckboxChange(option.value, (e.target as HTMLInputElement).checked)}/>
                              {option.label}
                            </label>
                          </div>
                          ) : option.label}
                    </li>
                    )})}
                </ul>
            </div>
        )}
      </div>
    );
  };
  export default Select;