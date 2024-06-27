import { ChangeEvent, RefObject, useEffect} from "react"

function useTableCheckboxChanged(checkAllRef:RefObject<HTMLInputElement>, tbodyRef:RefObject<HTMLDivElement>){
    useEffect(()=>{
        
       // console.log('useTableCheckboxChanged',checkAllRef,tbodyRef)
        if (checkAllRef.current && checkAllRef.current instanceof HTMLInputElement && tbodyRef.current && tbodyRef.current instanceof HTMLDivElement){
            const checkall= (checkAllRef.current as HTMLInputElement)
            const tbody= (tbodyRef.current as HTMLDivElement)
            const subCheck=tbody.querySelectorAll<HTMLInputElement>('[data-name^="table-checkbox-"]')
            //console.log('subCheck',subCheck)
            const listener = (event:Event) => {
                //console.log(event.target)
                const checkbox=(event.target as HTMLInputElement)
                if(checkbox.dataset.name==='table-checkbox-all'){
                    subCheck.forEach(subCB=>{
                        const subCheckbox=(subCB)
                        subCheckbox.checked=checkbox.checked
                    })
                }else{
                    checkall.checked=Array.from(subCheck).every(checkbox => checkbox.checked)
                }
            }
            checkall.addEventListener('change',listener)
            subCheck.forEach(subCB=>{
                subCB.addEventListener('change',listener)
            })
            return () => {
                checkall.removeEventListener('change',listener)
                subCheck.forEach(subCB=>{
                    subCB.removeEventListener('change',listener)
                })
            }
        }
        
    })
}
export default useTableCheckboxChanged
