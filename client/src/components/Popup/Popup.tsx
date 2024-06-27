import React, { useState, useEffect,useRef ,forwardRef} from 'react';
import classNames from "classnames";
import useClickOutside from '../../hooks/useClickOutside';
import { CssStyleClass } from '@fortawesome/fontawesome-svg-core';

export type PopupPositionTo = "target" | "mouse" | "window"
interface PopupProps {
    children: React.ReactNode; // 使用React.ReactNode类型来接受任何类型的子组件
    positionTo?:PopupPositionTo|HTMLElement;
    isShow:boolean;
    data?:any;
    style?:React.CSSProperties;
    refElement?:React.RefObject<HTMLElement>;
  }
export const Popup:React.FC<PopupProps> = (props)=> {
    const margin=5;
    const {children,positionTo,isShow,style,refElement,...restPorps} = props
    const [_isShow,setIsShow] = useState(isShow)
    const [currentMousePosition,setCurrentMousePosition] = useState({x:0,y:0})
    const ref= useRef<HTMLDivElement>(null);
    useEffect(()=>{
        const listener = (event:MouseEvent) => {
          //console.log('listener',refPopup,event.target);
          //console.log(typeof(positionTo),positionTo,event.target,_isShow,isShow);

            if (ref===undefined || !ref.current || ref.current.contains(event.target as HTMLElement)){
                return
            }else if(positionTo!==undefined && positionTo!==null && positionTo===event.target ){
                setIsShow(show=>!show);
            }else if( refElement?.current!==null && refElement?.current===event.target){
                setIsShow(show=>!show);
            }else{
                setIsShow(false);
            }
            setCurrentMousePosition({x:event.clientX,y:event.clientY})
            //if(ref.current) console.log('document clicked',ref.current,event.target,ref.current.contains(event.target as HTMLElement))
            //onClickOutSide?.()
            //setIsShow(false);
        }
        
        document.addEventListener('click',listener)
        return () => {
            document.removeEventListener('click',listener)
        }
      },[ref, positionTo])
      
      console.log('listener',_isShow,isShow)
    const classes = classNames('popup',{
        'popup-positionToMouse':positionTo==='mouse',
        'popup-positionToTarget':positionTo==='target'||positionTo instanceof HTMLElement,
        'popup-positionToWindow':positionTo==='window',
        'hide':!_isShow,
    })
    var _style = style?style:{}
    //if(positionTo!==undefined && positionTo!==null) console.log('positionTo',positionTo,(positionTo as HTMLElement).getBoundingClientRect());
    if(positionTo!==null && (positionTo instanceof HTMLElement || typeof(positionTo)==='object')){
        const rect=(positionTo as HTMLElement).getBoundingClientRect()
        console.log('constructor',positionTo,rect)
        _style={..._style,...{left:rect.x+window.scrollX,top:rect.y+ window.scrollY+rect.height+margin}}
    }else if(positionTo==='window'){
        if(ref.current!==null){
            const rect=(ref.current as HTMLDivElement).getBoundingClientRect()
            _style={..._style,...{left:window.innerWidth/2-rect.width+window.scrollX,top:window.innerHeight/2-rect.height+ window.scrollY}}
        }
        
    }else if(positionTo==='mouse'){
        //const rect=(ref.current as HTMLDivElement).getBoundingClientRect()
        _style={..._style,...{left:currentMousePosition.x+window.scrollX,top:currentMousePosition.y+ window.scrollY}}
    }
    return <div ref={ref as React.Ref<HTMLDivElement>} className={classes} style={_style} {...restPorps}>{children}</div>
};