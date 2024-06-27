import { Iobject } from "../components/MTable/MTable";

 function formatDateTime(dateTimeStr:string) {
    const date = new Date(dateTimeStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}
const findColumnByLabel = (columns: Iobject, label: string) => {
    const key = Object.keys(columns).find(key => columns[key].label === label && columns[key].isEditble);
    return key ? columns[key] : undefined;
  }
export {formatDateTime,findColumnByLabel}