import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDBload } from "../../utils/DBLoader/DBLoaderContext";
import { Iobject } from '../MTable/MTable';
import { formatDateTime } from '../../utils/utils';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const { result,setSearch } = useDBload();
  const [doc, setDoc] = useState<Iobject>();
  // 解析查询参数
  const queryParams = new URLSearchParams(location.search);
  const docId = queryParams.get('docId');

  useEffect(() => {
    if (result && result.length > 0) {
        const filteredResult = result.find((res: Iobject) => {
            return res.docId.toString()===docId?.toString();
          });
        console.log(filteredResult)
        setDoc(filteredResult)
    }
  }, [docId,result]);
  return (
    <div>
      {doc ? (
          <div className='search-tag'>
            <div className='search-tag-header'>
                <div className='search-tag-pc'>
                    {`${doc.project}-${doc.category}`}
                </div>
                <div className='search-tag-date'>
                    {formatDateTime(doc.createTime,"yyyy/mm/dd")}
                </div>
                <div className='search-tag-title'>
                    {doc.title}
                </div>
            </div>
            <div className='search-tag-body'>
                <p>编号：</p><p>{doc.docId}</p>
                <p>经办人：</p><p>{doc.person}</p>
                <p>责任人：</p><p>{doc.agent}</p>
                <p>备注：</p><p>{doc.remark}</p>
                <p>标签：</p>{doc.description.length>0?<p className='search-tag-body-tags'>{doc.description.split(",").map((tag:string,index:Number)=>(
                  <div className='search-tag-body-tag'>{tag.trim()}</div>
                ))}</p>:<p></p>}
                <p>位置：</p><p>{doc.location}</p>
            </div>
        </div>
      ):(
      <p>没有找到记录</p>
      )}
    </div>
  );
};

export default SearchPage;