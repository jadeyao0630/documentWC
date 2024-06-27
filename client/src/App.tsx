import React from 'react';
import logo from './logo.svg';
import './App.css';
import DBLoader from './utils/DBLoader/DBLoader';
import MTable from './components/MTable/MTable';
import { DBLoaderProvider } from './utils/DBLoader/DBLoaderContext';
import SearchBar from './components/SearchBar/SearchBar';

function App() {
  return (
    <div className="App">
      <DBLoaderProvider>
          <DBLoader databaseType={'mssql'} />
          <SearchBar/>
          <MTable/>
        </DBLoaderProvider>
    </div>
  );
}

export default App;
