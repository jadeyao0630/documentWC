import React, { useEffect } from 'react';
import { useDBload } from './DBLoaderContext';
import {serverIp,serverPort} from '../../utils/config'

type databaseType = 'mysql' | 'mssql'

// 定义上下文中的值的类型
interface DatabaseLoaderProps {
  databaseType?:databaseType
}
//const serverIp='192.168.10.122'//'192.168.6.213'
//const serverPort = '4555'

const headers={
    'Content-Type': 'application/json'
  };
const DatabaseLoader: React.FC<DatabaseLoaderProps> = (props) => {
    const {databaseType='mssql'} = props
    const { setResult,setSearch } = useDBload();
      useEffect(() => {
        fetch("http://"+serverIp+":"+serverPort+"/getData",{
          headers:headers,
          method: 'POST',
          body: JSON.stringify({ type: databaseType,query:`
            select 
            docId AS '编号',
            createTime AS '创建日期',
            project AS '所属项目',
            category AS '分类',
            title AS '请示名称',
            person  AS '经办人',
            location AS '分类',
            modifiedTime AS '更新日期',
            description AS '标签',
            coverPage AS '封面页',
            attachement AS '附件' 
            from documents_list
            `})
        })
          .then(response => response.json())
          .then(data => {
            console.log("DatabaseLoader",data)
            if(data && data.data){
                setResult(data.data.recordset);
                setSearch(data.data.recordset);
            }
          })
    },[databaseType, setResult])
    return <></>;
};
export default DatabaseLoader