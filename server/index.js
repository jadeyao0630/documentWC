const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  // transports: ['websocket'], 
  // path: '/socket.io',
});

const fs = require('fs');
const multer = require('multer');
const Jimp = require('jimp');
const CryptoJS = require('crypto-js')
function encryptMD5(data) {
    return CryptoJS.MD5(data).toString();
  }
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
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
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


var _socket;
var clients={};
io.on('connection', (socket) => {

  console.log('a user connected');
  _socket=socket;
  socket.on('disconnect', () => {
    console.log('user disconnected',socket.id);
    if(clients.hasOwnProperty(socket.id)){
      delete clients[socket.id];
    }
    
  });
  socket.on('message', (data) => {
    console.log('user login message: ',data,socket.id);
    if(data!=null && data.recordLoginHistory==1){
      clients[socket.id]=data;
      io.emit('message', "wlecome "+data);
    }
  });
});


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
    const {type="mssql",query="select * from p_Room"} = request.body;
    
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

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
