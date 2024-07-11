const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const xlsx = require('xlsx');
const WebSocket = require('ws');

const CryptoJS = require('crypto-js')

const keyStr = 'it@glory.com'
const ivStr = 'it@glory.com'
function encryptMD5(data) {
  return CryptoJS.MD5(data).toString();
}
function decrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const cipher = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  const decrypted = cipher.toString(CryptoJS.enc.Utf8) // 返回的是加密之前的原始数据->字符串类型
  return decrypted
}

function encrypt(data, keyS, ivS) {
  let key = keyS || keyStr
  let iv = ivS || ivStr
  key = CryptoJS.enc.Utf8.parse(key)
  iv = CryptoJS.enc.Utf8.parse(iv)
  const src = CryptoJS.enc.Utf8.parse(data)
  const cipher = CryptoJS.AES.encrypt(src, key, {
    iv: iv, // 初始向量
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7, // 填充方式
  })
  const encrypted = cipher.toString()
  return encrypted
}
const wss = new WebSocket.Server({ port: 3002 });

wss.on('connection', (ws) => {
  console.log('WebSocket connection established');
  ws.on('message', (message) => {
    console.log('received: %s', message);
  });
});
const moment = require('moment');
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  //credentials: true,
  // transports: ['websocket'], 
  // path: '/socket.io',
});

const fs = require('fs');
const multer = require('multer');
const Jimp = require('jimp');

const { env } = process;
require('dotenv').config({
  path: path.resolve(
      __dirname,
      `./env.${process.env.NODE_ENV ? process.env.NODE_ENV : "local"}`
    ),
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.json()); // 解析 application/json
//app.use(express.urlencoded({ extended: true })); // 解析 application/x-www-form-urlencoded

var corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    
  }
app.use(cors(corsOptions)).use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    next();
});

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         const folder = req.body.folder || '';
//         const uploadPath = path.join(env.UPLOADS_PATH, folder);

//         // 确保目录存在
//         fs.mkdirSync(uploadPath, { recursive: true });
//         cb(null, uploadPath); // 设置上传文件的存储路径
//     },
//     filename: function (req, file, cb) {
//         const extension=path.extname(file.originalname);
//         const filename=file.fieldname;
//         const encryptedFileName=encryptMD5(new Date().getTime()+filename)+"."+extension;
//         cb(null, encryptedFileName + extension); // 设置上传文件的文件名
//     }
// });

const upload = multer({ dest: env.UPLOADS_PATH }); // 指定上传目录




const DbService = require('./dbService');
const db= DbService.getDbServiceInstance();

app.post('/getData',async(request,response) => {
    //console.log('request----',request);
    const {type="mssql",query="select * from p_Room"} = request.body;
    
    try {
        if(type==="mssql"){
            const result = await db.mssqlGet(query)
            response.json({data:result.data})
        }else{
            db.mysqlGet(query).then((res)=>{
                if(!res.success) console.log(res)
                response.json({data:res})
            });
        }
        
        //response.json({data:type,query:query})
    }catch(err){
        console.error('Database polling error:', err);
        response.json({data:err})
    }

});
app.post('/saveData',async(request,response) => {
    //console.log('request----',request);
    const {type="mssql",query="select * from p_Room",notify=false} = request.body;
    
    //console.log(type,query)
    try {
        if(type==="mssql"){
            const result = await db.mssqlExcute(query)
            console.log("saveData notify",notify)
            if(notify){
              wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                  client.send(JSON.stringify({ type:'table-item-add', status: 'success', data: result.data }));
                }
              });
            }
            response.json({data:result.data})
        }else{
            db.mysqlExcute(query).then((res)=>{
                if(!res.success) console.log(res)
                response.json({data:res})
            });
        }
        
        //response.json({data:type,query:query})
    }catch(err){
        console.error('Database polling error:', err);
        response.json({data:err})
    }

});
app.post('/getUser',async(request,response) => {
  //console.log('request----',request);
  const {type="mssql",userName,pass} = request.body;
  const query = `
    select * from user_list where userName='${userName}' and pass='${encrypt(pass,keyStr,ivStr)}'
  `
  try {
      if(type==="mssql"){
          const result = await db.mssqlGet(query)
          response.json({data:result.data})
      }else{
          db.mysqlGet(query).then((res)=>{
              if(!res.success) console.log(res)
              response.json({data:res})
          });
      }
      
      //response.json({data:type,query:query})
  }catch(err){
      console.error('Database polling error:', err);
      response.json({data:err})
  }

});
app.post('/saveUser',async(request,response) => {
  //console.log('request----',request);
  const {type="mssql",data} = request.body;
  console.log("saveUser",data)
  const q_keys=[]
  const q_skeys=[]
  const q_values=[]
  const q_valuesKeys=[]
  var data_json=JSON.parse(data)
  Object.keys(data_json).forEach(key=>{
    if(key!=="id"){
      q_keys.push(key)
      q_skeys.push('source.'+key)
      if(key==="pass") data_json[key]=encrypt(data_json[key],keyStr,ivStr);
      q_values.push("'"+data_json[key]+"'")
      q_valuesKeys.push(`${key} = source.${key}`)
    }
  })
  const query=`
        MERGE INTO user_list AS target
        USING (VALUES (${q_values.join(", ")})) AS source (${q_keys.join(", ")})
        ON target.userName = source.userName
        WHEN MATCHED THEN
            UPDATE SET ${q_valuesKeys.join(", ")}
        WHEN NOT MATCHED THEN
            INSERT (${q_keys.join(", ")})
            VALUES (${q_skeys.join(", ")});
        `
  //console.log(type,query)
  try {
      if(type==="mssql"){
          const result = await db.mssqlExcute(query)
          response.json({data:result.data})
      }else{
          db.mysqlExcute(query).then((res)=>{
              if(!res.success) console.log(res)
              response.json({data:res})
          });
      }
      
      //response.json({data:type,query:query})
  }catch(err){
      console.error('Database polling error:', err);
      response.json({data:err})
  }

});

const sqlFilePath = './createDB.sql';
const sqlQuery = fs.readFileSync(sqlFilePath, 'utf8');

app.post('/init',async(request,response)=>{
    console.log(request.body)
    
    //console.log(type,query)
    try {
        const result = await db.mssqlExcute(sqlQuery)
        response.json({data:result})
        
        //response.json({data:type,query:query})
    }catch(err){
        console.error('Database polling error:', err);
        response.json({data:err})
    }

});

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const file = req.file;
    const folder = req.body.folder; // 获取附带的参数
    const uploadPath = path.join(env.UPLOADS_PATH, folder);

    // 确保目录存在
    fs.mkdirSync(uploadPath, { recursive: true });
    const extension=path.extname(file.originalname);
    const filename=file.fieldname;
    const encryptedFileName=encryptMD5(new Date().getTime()+filename)+extension;

    const targetPath = path.join(env.UPLOADS_PATH, folder, encryptedFileName);

    // 移动文件到指定目录
    fs.renameSync(file.path, targetPath);

    // 生成缩略图
    const thumbnailPath = path.join(env.UPLOADS_PATH, folder, 'thumb_' + encryptedFileName);
    const image = await Jimp.read(targetPath)
    .then(image=>{
        return image
        .resize(Jimp.AUTO, 100) // 高度设为100，宽度等比例缩放
        .write(thumbnailPath);
    })
    .then(() => {
      res.send({
        message: 'File uploaded successfully.',
        success:true,
        file: encryptedFileName,
        thumbnail: 'thumb_' + encryptedFileName
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send({
        message: err,
        success:false
      });
    });

    //res.send('File uploaded successfully.');
  });
app.get('/preview', async (req, res) => {
  const fileName = decodeURIComponent(req.query.fileName);
  const folder = req.query.folder;
  //const filePath = 'uploads/国瑞信息软件表.xlsx';
  res.sendFile(path.join(env.UPLOADS_PATH,folder,fileName));
});
app.post('/uploadImage', async (req, res) => {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        //return res.status(400).send('No files were uploaded.');
        res.json({
          status:400,
          success:false,
          message:'No files were uploaded.',
        });
      }
      const file = req.file;
      const extension=file.split('.').pop();
      const filename=file.replace('.'+extension,'');
      const encryptedFileName=encryptMD5(new Date().getTime()+filename)+"."+extension;
      const result = db.uploadImage(env.UPLOADS_PATH,encryptedFileName);
      result
      .then(data => {
        console.log(folder);
        res.json(data);
      } )
      .catch(err => console.log(err));
      
    } catch (err) {
      console.error('Error handling file upload:', err);
      //res.status(500).send('Error handling file upload');
      res.json({
        status:500,
        success:false,
        message:'Error handling file upload',
        error:err,
        requestBody:req.body
      });
    }
  });

  app.post('/importExcel', upload.single('file'), async (req, res) => {
    res.setHeader('Content-Type', 'application/json'); 
    const results=[]
    var currentSheet=""
    var currentRow=0
    var currentValues={}
    try {
        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetNames = workbook.SheetNames;
        const timespanRecords=[]
        var lastDate=undefined
        // 遍历每个sheet
        const tableQuery = `
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='documents_list' AND xtype='U')
            BEGIN
                CREATE TABLE documents_list (
                    id INT IDENTITY(1,1),
                    docId INT,
                    title NVARCHAR(1000) default '',
                    category NVARCHAR(255) default '',
                    categoryId INT default -1,
                    project NVARCHAR(255) default '',
                    projectId INT default -1,
                    agent NVARCHAR(1000) default '',
                    person NVARCHAR(1000) default '',
                    location NVARCHAR(255) default '',
                    locationId INT default -1,
                    createTime DATETIME,
                    modifiedTime DATETIME,
                    description NVARCHAR(1000) default '',
                    remark NVARCHAR(1000) default '',
                    coverPage NVARCHAR(1000) default '',
                    attachement NVARCHAR(1000) default '',
                    isDisabled BIT default 0,
                    PRIMARY KEY (id, docId)
                )
            END;

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='tags' AND xtype='U')
            BEGIN
                CREATE TABLE tags (
                    id INT PRIMARY KEY,
                    name NVARCHAR(1000),
                    freq INT DEFAULT 1,
                    isDisabled BIT default 0,
                )
            END;

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='projects' AND xtype='U')
            BEGIN
                CREATE TABLE projects (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(1000),
                    isDisabled BIT default 0,
                )
            END;
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='categories' AND xtype='U')
            BEGIN
                CREATE TABLE categories (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(1000),
                    isDisabled BIT default 0,
                )
            END;
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='locations' AND xtype='U')
            BEGIN
                CREATE TABLE locations (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    name NVARCHAR(1000),
                    isDisabled BIT default 0,
                )
            END;

            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='user_list' AND xtype='U')
            BEGIN
                CREATE TABLE user_list (
                    id INT IDENTITY(1,1),
                    name NVARCHAR(1000),
                    userName NVARCHAR(255),
                    pass NVARCHAR(1000),
                    auth NVARCHAR(1000),
                    userData NVARCHAR(1000),
                    isDisabled BIT default 0,
                    PRIMARY KEY (id, userName)
                )
            END;
            `
        try {
          const result = await db.mssqlExcute(tableQuery)
        }catch(err) {
          console.error('SQL Error: ', err,tableQuery);
        }
        const categories = []
        const projects = []
        const locations = []
        const itemsQueries = []
        for (const sheetName of sheetNames) {
            const worksheet = workbook.Sheets[sheetName];
            const sName=sheetName==="Sheet1"?"其它":sheetName
            //const mergeValueMap = handleMergedCells(worksheet);
            const data = xlsx.utils.sheet_to_json(worksheet);
            categories.push(sName)
            const cateQuery = `IF NOT EXISTS (SELECT 1 FROM categories WHERE name = N'${sName}')
                INSERT INTO categories (name) VALUES (N'${sName}')
                ELSE
                UPDATE categories SET name = N'${sName}' WHERE name = N'${sName}'`
            try {
              const result = await db.mssqlExcute(cateQuery)
            }catch(err) {
              console.error('SQL Error: ', err,cateQuery);
            }
            // 遍历每行数据
            for (const [rowIndex, row] of data.entries()) {
                if(row['日期']===undefined) row['日期']=lastDate?lastDate:moment().format('YYYY-MM-DD');
                lastDate=row['日期']
                const currentTime = moment().format('HH:mm:ss');
                const converted = convertExcelDate(row['日期'])
                var timespan = new Date(`${moment(converted).format('YYYY-MM-DD')} ${currentTime}`).getTime()/1000;
                while (timespanRecords.includes(timespan)){
                  timespan++;
                }
                timespanRecords.push(timespan)
                if (row['所属项目']!==undefined && !projects.includes(row['所属项目'])) {
                  projects.push(row['所属项目'])
                  const projQuery = `IF NOT EXISTS (SELECT 1 FROM projects WHERE name = N'${row['所属项目']}')
                  INSERT INTO projects (name) VALUES (N'${row['所属项目']}')
                  ELSE
                  UPDATE projects SET name = N'${row['所属项目']}' WHERE name = N'${row['所属项目']}'`
                  try {
                    
                    const result = await db.mssqlExcute(projQuery)
                  }catch(err) {
                    console.error('SQL Error: ', err,projQuery);
                  }
                }
                if (row['存放位置']!==undefined && row['存放位置'] && !locations.includes(row['存放位置'])) {
                  locations.push(row['存放位置'])
                  const locaQuery = `IF NOT EXISTS (SELECT 1 FROM locations WHERE name = N'${row['存放位置']}')
                  INSERT INTO locations (name) VALUES (N'${row['存放位置']}')
                  ELSE
                  UPDATE locations SET name = N'${row['存放位置']}' WHERE name = N'${row['存放位置']}'`
                  try {
                    
                    const result = await db.mssqlExcute(locaQuery)
                  }catch(err) {
                    console.error('SQL Error: ', err,locaQuery);
                  }
                }
                if (row['盒号']!==undefined && row['盒号'] && !locations.includes(row['盒号'])) {
                  locations.push(row['盒号'])
                  const locaQuery = `IF NOT EXISTS (SELECT 1 FROM locations WHERE name = N'${row['盒号']}')
                  INSERT INTO locations (name) VALUES (N'${row['盒号']}')
                  ELSE
                  UPDATE locations SET name = N'${row['盒号']}' WHERE name = N'${row['盒号']}'`
                  try {
                    
                    const result = await db.mssqlExcute(locaQuery)
                  }catch(err) {
                    console.error('SQL Error: ', err,locaQuery);
                  }
                }
                //console.log(row['日期'],`${moment(converted).format('YYYY-MM-DD')} ${currentTime}`,sheetName,converted)
                const dateStr=converted.toISOString().slice(0, 19).replace('T', ' ')
                // const docId = timespan; // 用日期转化成timestamp
                // const createTime = dateStr;
                // const title = row['文件名称'] || row['请示名称'] || row['工程名称'] || row['图纸名称'] || row['合同名称'];
                // const category = sheetName;
                // const project = row['所属项目'];
                // const agent = row['出图单位'] || row['发文单位'] || row['责任人'] || row['签发单位'];
                // const person = row['经办人'] || row['存档人'] || row['规划院移交人'];
                // const location = row['存放位置'] || row['盒号'];
                // const remark = row['中标金额'] || row['抵扣工程合同清单'] || row['版本号'] || row['抵押物'] || row['原件或复印件'];
                const values = {
                  docId:timespan,
                  createTime : dateStr,
                  title : row['文件名称'] || 
                  row['请示名称'] || 
                  row['工程名称'] || 
                  ((row['图纸名称'] || "")+"-" +(row['版本号']||"")) || 
                  (row['合同名称']|| "")+"-"+ (row['合同编号']|| "")+"-"+ (row['签订日期']|| "") || '',
                  category : sheetName==="Sheet1"?"其它":sheetName,
                  project : row['所属项目']||'',
                  agent : row['出图单位'] || row['发文单位'] || row['责任人'] || row['签发单位'] || row['中标单位'] || row['签订单位'] || '',
                  person : row['经办人'] || row['存档人'] || row['规划院移交人'] || '',
                  location : row['存放位置'] || row['盒号'] || '',
                  remark : row['中标金额'] || row['抵扣工程合同清单'] || row['移交日期'] || row['抵押物'] || row['原件或复印件'] || row['省份'] || row['中标金额'] || ''
                }
                const keys=[]
                const sourceKeys=[]
                const vals=[]
                const setVals=[]
                Object.keys(values).forEach(key=>{
                  keys.push(key)
                  sourceKeys.push(`source.${key}`)
                  var v=`N'${values[key]?values[key]:""}'`
                  if(key==="docId" || key==="createTime" || key==="modifiedTime"){
                    v=`'${values[key]?values[key]:""}'`
                  }
                  vals.push(v)
                  if(key!=="title" && key!=="createTime")
                    setVals.push(key + " = " + v)
                })
                // 构建SQL插入语句
                // const query = `
                //     INSERT INTO documents_list (docId, createTime, title, category, project, agent, person, location, modifiedTime, remark)
                //     VALUES ('${docId}', '${createTime}', N'${title?title:''}', N'${category}', N'${project?project:''}', N'${agent?agent:''}', N'${person?person:''}', N'${location?location:''}', '${createTime}', N'${remark?remark:''}')
                // `;
                const query = `MERGE INTO documents_list AS target
                USING (VALUES (${vals.join(", ")})) 
                AS source (${keys.join(", ")})
                ON target.title = source.title AND target.createTime = source.createTime
                WHEN MATCHED THEN
                    UPDATE SET ${setVals.join(", ")}
                WHEN NOT MATCHED THEN
                    INSERT (${keys.join(", ")})
                    VALUES (${sourceKeys.join(", ")});`
                itemsQueries.push(query)
                // 执行SQL插入
                currentSheet=sheetName
                currentRow=rowIndex + 1
                currentValues=values
                try {
                  //console.log(query)
                    //const result = await db.mssqlExcute(query)
                    results.push(values)
                    wss.clients.forEach(client => {
                      if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type:'excel', status: 'success', data: values }));
                      }
                    });
                } catch (err) {
                    console.error('SQL Error: ', err);
                    results.push({ sheet: sheetName, row: rowIndex + 2, error: err.message })
                    wss.clients.forEach(client => {
                      if (client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify({ type:'excel',status: 'error', data: { sheet: sheetName, row: rowIndex + 2, error: err.message } }));
                      }
                    });
                    res.json({data:results,success:false})
                }
            }
            
        }
        try {
          //console.log(query)
            await executeBatchQueries(itemsQueries,500)
            
            res.json({data:results,success:true})
        } catch (err) {
          console.error('SQL Error: ', err);
          res.json({data:results,success:false})
        }
        //res.send('File processed and data inserted into MSSQL');
    } catch (err) {
        console.error("error",err);
        results.push({ sheet: currentSheet, row: currentRow + 2, error: err.message })
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type:'excel',status: 'failed', data: { sheet: currentSheet, row: currentRow + 2, error: err.message } }));
          }
        });
        res.json({data:results,success:false})
        //res.status(500).send('Error processing file');
    }
});
const executeBatchQueries = async (queries, batchSize) => {
  for (let i = 0; i < queries.length; i += batchSize) {
      const batch = queries.slice(i, i + batchSize);
      const batchQuery = batch.join(' ');
      //console.log(batchQuery)
      await db.mssqlExcute(batchQuery)
  }
};
const convertExcelDate = (excelDate) => {
  // Excel's date system starts on 1900-01-01, but it treats 1900 as a leap year, which it isn't
  const excelEpoch = new Date(1899, 11, 30); // 1899-12-30 is the correct epoch for Excel dates
  const days = excelDate - 1; // adjust for Excel's leap year bug
  const date = new Date(excelEpoch.getTime() + days * 24 * 60 * 60 * 1000);
  return date;
};
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
