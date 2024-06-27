import { ChangeEvent, Dispatch, RefObject, SetStateAction, useEffect} from "react"

function useTableCheckboxList(setCheckboxList:Dispatch<SetStateAction<HTMLInputElement[]>>, sub_ref:RefObject<HTMLInputElement>){
    useEffect(()=>{
        console.log(sub_ref)
        if (sub_ref.current && sub_ref.current instanceof HTMLInputElement){
            setCheckboxList((current)=> [...current,(sub_ref.current as HTMLInputElement)])
        }
    },[setCheckboxList,sub_ref])
}
export default useTableCheckboxList
