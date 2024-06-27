import { RefObject, useEffect} from "react"
function useTextOverflow(ref:RefObject<HTMLTableCellElement>, handler:Function){
    useEffect(()=>{
        
        const mouseOverListener=(e:MouseEvent)=>{
            const element=(e.currentTarget as HTMLElement);
            //const parent = element?element.parentElement:null
            if(element!==null){
                //console.log(element,element.scrollWidth,element.clientWidth,element.scrollWidth > element.clientWidth)
                handler(element.scrollWidth > element.clientWidth)
            }
        }
        const mouseLeaveListener=()=>{
            handler(false)
        }
        const self = ref.current
        const element=(self as HTMLTableCellElement);
        //const parent = element?element.parentElement:null
        if(self!==null){
            element.addEventListener('mouseover',mouseOverListener)
            element.addEventListener('mouseleave',mouseLeaveListener)
            return () => {
                
                element.removeEventListener('mouseover',mouseOverListener)
                element.removeEventListener('mouseleave',mouseLeaveListener)
                
               
            }
            //console.log(parent.scrollWidth,parent.clientWidth);
            //handler(parent.scrollWidth > parent.clientWidth)
        }
        // const self = ref.current
        // const checkOverflow = () => {
            
        //     if (self!==null) {
        //         self?.addEventListener('mouseover',mouseOverListener)
        //         self?.addEventListener('mouseleave',mouseLeaveListener)
        //     }
        // };
        // checkOverflow();
        
    },[ref,handler])
}
export default useTextOverflow