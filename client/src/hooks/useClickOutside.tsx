import { RefObject, useEffect} from "react"

function useClickOutside(ref:RefObject<HTMLElement>, handler:Function){
    useEffect(()=>{
        const listener = (event:MouseEvent) => {
            if (ref===undefined || !ref.current || ref.current.contains(event.target as HTMLElement)){
                return
            }
            //if(ref.current) console.log('document clicked',ref.current,event.target,ref.current.contains(event.target as HTMLElement))
            handler(event)
        }
        
        document.addEventListener('click',listener)
        return () => {
            document.removeEventListener('click',listener)
        }
    },[ref,handler])
}
export default useClickOutside
