import { RefObject, useEffect} from "react"
function useTooltipOutside(ref:RefObject<HTMLDivElement>){
    useEffect(()=>{
        const tooltip=ref.current;
        const table=tooltip?.closest('table')
        //console.log(rect.right , tooltip.closest('table')?.offsetWidth);
        if(tooltip!==null && table !==undefined && table !==null){
            const rect = tooltip.getBoundingClientRect();
            // eslint-disable-next-line no-restricted-globals
            if (rect.left < 0) {
                // Tooltip is off the left side of the screen
                tooltip.style.left = '0';
                tooltip.style.transform = 'translateX(0)';
            // eslint-disable-next-line no-restricted-globals
            } else if (rect.right > table.offsetWidth) {
                console.log("out",tooltip,rect.right , table.offsetWidth);
                // Tooltip is off the right side of the screen
                tooltip.style.left = 'auto';
                tooltip.style.right = '-500px';
                tooltip.style.transform = 'translateX(0)';
            }
        }
        
        return () => {
            
           
        }
    },[ref])
}
export default useTooltipOutside