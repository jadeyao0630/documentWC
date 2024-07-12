import { Iobject } from "../components/MTable/MTable";

 function formatDateTime(dateTimeStr:string,format:string="yyyy-mm-dd hh:mm") {
    const date = new Date(dateTimeStr);
    if (format===undefined || format ===null) format="yyyy-mm-dd hh:mm"
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return format.toLowerCase()
              .replace("yyyy",year.toString())
              .replace("mm",month.toString())
              .replace("dd",day.toString())
              .replace("hh",hours.toString())
              .replace("mm",minutes.toString())
              .replace("ss",seconds.toString())//`${year}年${month}月${day}日 ${hours}:${minutes}`;
}
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
const findColumnByLabel = (columns: Iobject, label: string) => {
    const key = Object.keys(columns).find(key => key === label && columns[key].isEditble);
    return key ? columns[key] : undefined;
  }
export {formatDate,formatDateTime,findColumnByLabel}