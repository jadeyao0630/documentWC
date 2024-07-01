import React, { useState } from 'react';
import logo from './logo.svg';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import './App.css';
import DBLoader from './utils/DBLoader/DBLoader';
import { DBLoaderProvider } from './utils/DBLoader/DBLoaderContext';
import SearchBar from './components/SearchBar/SearchBar';
import Dropdown, { OptionType } from './components/Select/Dropdown';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import {serverIp,serverPort} from './utils/config'
import io from 'socket.io-client';
import MTable from './components/MTable/MTable';
import FileUpload from './components/FileUpload/FileUpload';
library.add(fas)

const socket = io(`http://${serverIp}:${serverPort}`,{
    
  // path: '/socket.io', // Ensure the path matches the server configuration
  // transports: ['websocket'], // Use WebSocket as the transport protocol
}); 

function App() {

  return (
    <div className="App">
      <DBLoaderProvider>
          <DBLoader databaseType={'mssql'} />
          <FileUpload />
          <SearchBar/>
          <MTable/>
      </DBLoaderProvider>
    </div>
  );
}

export default App;
