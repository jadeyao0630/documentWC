import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';


type databaseType = 'mysql' | 'mssql'

// 定义上下文中的值的类型
interface DBLoaderContextType {
//   databaseType:databaseType
//   setDatabaseType:(type:databaseType)=>void;
  result?:Array<object>;
  setResult:(result:Array<object>)=>void;
  search?:Array<object>;
  setSearch:(search:Array<object>)=>void;
}

// 创建上下文
const DBLoaderContext = createContext<DBLoaderContextType | undefined>(undefined);

// 上下文提供者组件的Props类型
interface DBLoaderProviderProps {
  children: ReactNode;
}

export const DBLoaderProvider: React.FC<DBLoaderProviderProps> = ({ children }) => {
    //const [databaseType, setDatabaseType] = useState<databaseType>('mssql');
    const [result, setResult] = useState<Array<object>>();
    const [search, setSearch] = useState<Array<object>>();
  return (
    <DBLoaderContext.Provider value={{ result, setResult,search, setSearch}}>
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