import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Iobject } from '../../components/MTable/MTable';


type databaseType = 'mysql' | 'mssql'

// 定义上下文中的值的类型
export interface DBLoaderContextType {
//   databaseType:databaseType
//   setDatabaseType:(type:databaseType)=>void;
  result?:Array<Iobject>;
  setResult:(result:Array<Iobject>)=>void;
  search?:Array<Iobject>;
  setSearch:(search:Array<Iobject>)=>void;
  projects?:Array<Iobject>;
  setProjects:(projects:Array<Iobject>)=>void;
  categories?:Array<Iobject>;
  setCategories:(categories:Array<Iobject>)=>void;
  locations?:Array<Iobject>;
  setLocations:(locations:Array<Iobject>)=>void;
  tags?:Array<Iobject>;
  setTags:(tags:Array<Iobject>)=>void;
  tagsToAdd?:Array<Iobject>;
  setTagsToAdd:(tagsToAdd:Array<Iobject>)=>void;
  reload?:Number;
  setReload?:(reload:Number)=>void
}

// 创建上下文
const DBLoaderContext = createContext<DBLoaderContextType | undefined>(undefined);

// 上下文提供者组件的Props类型
interface DBLoaderProviderProps {
  children: ReactNode;
}

export const DBLoaderProvider: React.FC<DBLoaderProviderProps> = ({ children }) => {
    //const [databaseType, setDatabaseType] = useState<databaseType>('mssql');
    const [result, setResult] = useState<Array<Iobject>>();
    const [search, setSearch] = useState<Array<Iobject>>();
    const [projects, setProjects] = useState<Array<Iobject>>();
    const [categories, setCategories] = useState<Array<Iobject>>();
    const [locations, setLocations] = useState<Array<Iobject>>();
    const [tags, setTags] = useState<Array<Iobject>>();
    const [tagsToAdd, setTagsToAdd] = useState<Array<Iobject>>();
    const [reload, setReload] = useState<Number>();
  return (
    <DBLoaderContext.Provider value={{ result, setResult,
                                        search, setSearch,
                                        projects, setProjects,
                                        categories, setCategories,
                                        locations, setLocations,
                                        tags, setTags,
                                        tagsToAdd, setTagsToAdd,
                                        reload, setReload}}>
      {children}
    </DBLoaderContext.Provider>
  );
};

// 自定义钩子，用于在组件中访问上下文
export const useDBload = (): DBLoaderContextType => {
  const context = useContext(DBLoaderContext);
  if (!context) {
    throw new Error('usePreload must be used within a DatabaseLoaderProvider');
  }
  return context;
};