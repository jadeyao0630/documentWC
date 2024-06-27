import { RefObject, useEffect} from "react"

function useTableScroll(ref:RefObject<HTMLElement>, handler:Function){
    useEffect(()=>{
        const tableContainer=ref.current;
        if(tableContainer!==null){
            tableContainer.scrollLeft=0
            const tableColumnShadow=tableContainer.querySelectorAll('#column-shadow')
            
            const scrollHandler= ():void => {
                //console.log(tableContainer?.scrollLeft)
                if(tableColumnShadow!==undefined && tableColumnShadow!==null && tableColumnShadow.length>0){
                    //tableColumnShadow.style.left=tableContainer.scrollLeft+"px"
                    (tableColumnShadow[0] as HTMLElement).style.right=tableContainer.scrollLeft*-1+"px"
                }
            }
            tableContainer.addEventListener('scroll',scrollHandler)
    
            return () => {
                tableContainer.removeEventListener('scroll',scrollHandler)
            }
        }
    },[ref,handler])
}
export default useTableScroll