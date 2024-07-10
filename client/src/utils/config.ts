import { Iobject } from "../components/MTable/MTable"

const local ="192.168.10.122"
const glory ="192.168.10.213"
export const serverIp=glory
export const serverPort="4555"

export interface ColumnData {
    label: string;
    isEditble?: boolean; // 假设每行数据中有一个fileName字段
    isFilterable?: boolean;
    width:string|number;
    type:string;
    data:Array<any>;
    value:Array<any>;
    isHide:boolean;
    style?:React.CSSProperties;
    backupKey?:string;
  }
export const tableColumns:Iobject={
    docId:{
        label:'编号',
        width:80,
        type:'text',
        isFilterable:true
    },
    createTime:{
        label:'创建日期',
        width:100,
        type:'date',
        format:'yyyy/mm/dd'
    },
    project:{
        label:'所属项目',
        isEditble:true,
        width:140,
        style:{maxWidth:140},
        type:'combobox',
        data:[],
        value:["0"],
        isFilterable:true,
        backupKey:'projectId'
    },
    category:{
        label:'分类',
        isEditble:true,
        width:140,
        style:{maxWidth:140},
        type:'combobox',
        data:[],
        value:["0"],
        isFilterable:true,
        backupKey:'categoryId'
    },
    title:{
        label:'名称',
        isEditble:true,
        width:300,
        style:{minWidth:200},
        type:'textarea',
        isFilterable:true
    },
    agent:{
        label:'责任者',
        isEditble:true,
        width:"auto",
        type:'text',
        isFilterable:true
    },
    person:{
        label:'经办人',
        isEditble:true,
        width:120,
        style:{maxWidth:120},
        type:'text',
        isFilterable:true
    },
    location:{
        label:'位置',
        isEditble:true,
        width:"auto",
        type:'combobox',
        data:[],
        value:["0"],
        isFilterable:true,
        backupKey:'locationId'
    },
    modifiedTime:{
        label:'更新日期',
        width:100,
        type:'date',
        isHide:true
    },
    remark:{
        label:'备注',
        isEditble:true,
        width:"auto",
        type:'text',
        isFilterable:true
    },
    description:{
        label:'标签',
        isEditble:true,
        width:200,
        type:'multiCombobox',
        data:[],
        value:[],
        isFilterable:true
    },
    coverPage:{
        label:'封面页',
        width:50,
        type:'img'
    },
    attachement:{
        label:'附件',
        width:"auto",
        type:'file',
        isHide:true
    },
}