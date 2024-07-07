import React, { useEffect, useState } from 'react';
import Select, { ActionMeta, components, InputProps, MultiValue, OptionProps, SingleValue, StylesConfig, ValueContainerProps } from 'react-select';
import { DropdownIndicator } from 'react-select/dist/declarations/src/components/indicators';
import { Iobject } from '../MTable/MTable';

export interface OptionType {
  label: string;
  value: string;
}

interface DropdownProps {
  defaultValues?: string[];
  options: OptionType[];
  isMulti?: boolean;
  showInput?:boolean;
  isClearable?:boolean;
  showDropIndicator?:boolean;
  placeholder?:string;
  style?:React.CSSProperties;
  onChange?: (selectedOptions: SingleValue<OptionType> | MultiValue<OptionType>) => void;
  onAdd?:(added: OptionType) => void;
}
//   const CustomOption = (props: OptionProps<OptionType>) => {
//     return (
//       <components.Option {...props}>
//         <input
//           type="checkbox"
//           checked={props.isSelected}
//           onChange={() => null} // Prevent checkbox click from triggering the option's onClick
//         />
//         <label style={{ marginLeft: 10 }}>{props.label}</label>
//       </components.Option>
//     );
//   };  
const getMarginValues = (style: React.CSSProperties) => {
    const margins = {
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      marginLeft: 0,
    };
  
    const parseMargin = (margin: string) => {
      const marginValues = margin.split(' ');
  
      switch (marginValues.length) {
        case 1:
          return {
            marginTop: parseFloat(marginValues[0]),
            marginRight: parseFloat(marginValues[0]),
            marginBottom: parseFloat(marginValues[0]),
            marginLeft: parseFloat(marginValues[0]),
          };
        case 2:
          return {
            marginTop: parseFloat(marginValues[0]),
            marginRight: parseFloat(marginValues[1]),
            marginBottom: parseFloat(marginValues[0]),
            marginLeft: parseFloat(marginValues[1]),
          };
        case 3:
          return {
            marginTop: parseFloat(marginValues[0]),
            marginRight: parseFloat(marginValues[1]),
            marginBottom: parseFloat(marginValues[2]),
            marginLeft: parseFloat(marginValues[1]),
          };
        case 4:
          return {
            marginTop: parseFloat(marginValues[0]),
            marginRight: parseFloat(marginValues[1]),
            marginBottom: parseFloat(marginValues[2]),
            marginLeft: parseFloat(marginValues[3]),
          };
        default:
          return margins;
      }
    };
  
    if (typeof style.margin === 'string') {
      Object.assign(margins, parseMargin(style.margin));
    } else if (typeof style.margin === 'number') {
      margins.marginTop = margins.marginRight = margins.marginBottom = margins.marginLeft = style.margin;
    }
  
    if (typeof style.marginTop === 'string') {
      margins.marginTop = parseFloat(style.marginTop);
    } else if (typeof style.marginTop === 'number') {
      margins.marginTop = style.marginTop;
    }
  
    if (typeof style.marginRight === 'string') {
      margins.marginRight = parseFloat(style.marginRight);
    } else if (typeof style.marginRight === 'number') {
      margins.marginRight = style.marginRight;
    }
  
    if (typeof style.marginBottom === 'string') {
      margins.marginBottom = parseFloat(style.marginBottom);
    } else if (typeof style.marginBottom === 'number') {
      margins.marginBottom = style.marginBottom;
    }
  
    if (typeof style.marginLeft === 'string') {
      margins.marginLeft = parseFloat(style.marginLeft);
    } else if (typeof style.marginLeft === 'number') {
      margins.marginLeft = style.marginLeft;
    }
  
    return margins;
  };
const Dropdown: React.FC<DropdownProps> = ({ options, isMulti,isClearable=true,showInput,showDropIndicator,defaultValues,style={margin:10},placeholder="请选择", onChange, onAdd }) => {
    
const customStyles: StylesConfig<OptionType> = {
    container:(provided) => ({
        ...provided, ...style,
    }),
    control: (provided,state) => ({
        ...provided, 
        boxShadow: state.isFocused ? '0 0 5px #007bff' : '',
        borderColor: state.isFocused ? 'rgba(66, 153, 225, 0.1)' : provided.borderColor,
        '&:hover': {
            borderColor: state.isFocused ? 'rgba(66, 153, 225, 0.6)' : provided.borderColor
        }
    }),
    menu: (provided) => ({
      ...provided, 
      //backgroundColor: '#f0f0f0', // Custom background color for the menu
      zIndex:1000,
      //margin:`${margin}px 10px 10px 10px`,
    }),
    option: (provided, state) => ({
      ...provided,
      //backgroundColor: state.isSelected ? '#a0a0a0' : state.isFocused ? '#d0d0d0' : '#f0f0f0',
      //color: '#000000',
      textAlign:"left"
    }),
  };
  const [inputValue, setInputValue] = useState('');
  const [selectOptions, setSelectOptions] = useState<OptionType[]>(options);
  var selected:OptionType[]|undefined=[]
  if(defaultValues && defaultValues.length>0){
    selected=options.filter(opt=>defaultValues.includes(opt.value))
  }
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>(selected);
  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
  };
  useEffect(() => {
    setSelectOptions(options);
  }, [options]);
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
        var val="1";
        if(selectOptions && selectOptions.length>0){
            const maxIdObject = selectOptions.reduce((maxObj, currentObj) => {
                return Number(currentObj.value) > Number(maxObj.value) ? currentObj : maxObj;
              }, selectOptions[0]);
            val=(Number(maxIdObject.value)+1).toString()
        }
        
        console.log(val)
        const newOption = { label: inputValue, value: val };
        setSelectedOptions((prev) => {
          
          handleChange([
            ...prev,
            newOption,
          ])
          return [
            ...prev,
            newOption,
          ]
        });
        if(selectOptions.filter(opt => opt.label === inputValue).length===0){
            setSelectOptions([...selectOptions, newOption]);

        }
        setInputValue('');
        onAdd?.(newOption);
        event.preventDefault();
        break;
    }
  };

  
  const handleChange = (newValue: SingleValue<OptionType> | MultiValue<OptionType>) => {
    console.log("handleChange",newValue)
    setSelectedOptions(Array.isArray(newValue) ? newValue : [newValue]);
    if(onChange) onChange(newValue);
  };

  const CustomInput: React.FC<InputProps<OptionType, boolean>> = (props) => {
    return <components.Input {...props} style={{ opacity: 0, height: 0 }} />;
  };
  const customComponents:Iobject = {
    //Input: CustomInput,
  };
  if(!showDropIndicator){
    customComponents['DropdownIndicator'] = null;
  }
  if(!showInput){
    customComponents['Input']=CustomInput
  }
  return (
    <Select
      value={selectedOptions}
      isMulti={isMulti}
      options={selectOptions}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDown}
      inputValue={inputValue}
      components={customComponents}
      styles={customStyles}
      closeMenuOnSelect={!isMulti}
      placeholder={placeholder}
      noOptionsMessage={()=>"没有更多"}
      isClearable={isClearable}
    />
  );
};

export default Dropdown;