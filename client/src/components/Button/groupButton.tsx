import {ButtonHTMLAttributes,AnchorHTMLAttributes,FC,RefObject, useState} from "react";
import classNames from "classnames";
import Button, { ButtonProps, ButtonSize, ButtonTypes } from "./button";
import Icon from "../Icon/icon";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { string } from "prop-types";
import { Tooltip } from "react-tooltip";

export type GroupButtonType ='checkbox' | 'radio' | 'default'
interface IGroupItemData{
    btnType:ButtonTypes,
    icon:IconProp,
    label:string,
    value?:string
}
export interface IGroupButtonData{
    style:React.CSSProperties,
    hasTooltip:boolean,
    iconOnly:boolean,
    data:IGroupItemData[],

}
export interface IGroupButtonProps {
    /** 数据 */
    data:IGroupButtonData,
    onClicked?:(e:React.MouseEvent<HTMLElement, MouseEvent>)=>void,
    name?:string,
    size?:ButtonSize,
    tooltipId?:string,
    type?:GroupButtonType
    values?:string[]|string
    onValuesChanged?:(old:string[]|string|undefined,values:string[]|string|undefined)=>void,
}
export const GroupButton: FC<IGroupButtonProps> = (props) => {
    const {
        type='default',
        size='default',
        data,
        name,
        tooltipId,
        values,
        onClicked,
        onValuesChanged,
        ...restProps
    } = props
    const [_values, setValues ]= useState(values)
    const ClickedHandler=(e:React.MouseEvent<HTMLElement, MouseEvent>,val?:string)=>{
        //console.log(val,e.currentTarget.dataset.name )
        if(val !== undefined){
            setValues(values=>{
                var old=values;
                //console.log("before",values)
                if(type==='checkbox'){
                    if(values===undefined) values=[]
                    if(values.constructor===String) values=[ val ]
                    else {
                        var vals =(values as string[]);
                        console.log("before",vals.includes(val))
                        if(vals.includes(val)) {
                            vals=vals.filter(v=>v!==val)
                        }else{
                            vals=[...vals,val]
                        }
                        values=vals
                    }
                    //console.log("after",values)
                }else if(type==='radio'){
                    values=val;
                }
                if(type==='radio' || type==='checkbox') onValuesChanged?.(old,values);
                return values
            })
        }
        
        onClicked?.(e)
    }
    console.log(size);
    return(
        <div className='conrol-group-btn' {...restProps}>
            {data.data.map((btnData,index)=>{
                const btn_value=btnData.value? btnData.value : index.toString();
                const classes = classNames('group-btn',{
                    'group-button-first':index===0,
                    'group-button-last':index===data.data.length-1
                })
                return(
                    <Button key={index} data-name={name} size={size} btnType={btnData.btnType} className={classes} style={data.style} 
                        data-value={btn_value}
                        data-tooltip-id={data.hasTooltip?(tooltipId?tooltipId:"_main-tooltips"):''}
                        data-tooltip-content={btnData.label}
                        isChecked={_values!==undefined && type!=='default'?(_values.constructor===String?btn_value===(_values as string):(_values as string[]).includes(btn_value)) : false}
                        onClick={e=>ClickedHandler(e,btn_value)}>
                        {<Icon icon={btnData.icon} />}
                        {!data.iconOnly && <span style={{marginLeft:btnData.icon?"3px":'0px'}} >{btnData.label}</span>}
                    </Button>
                )
            })}
            <Tooltip id={"_main-tooltips"} style={{zIndex:3000}}/>
        </div>
        
    )
}

export default GroupButton;