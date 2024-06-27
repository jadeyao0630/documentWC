const mysqlQuery = require('./mMysql.js');
const mssqlQuery = require('./mMssql.js');

const path = require("path");
const Jimp = require('jimp');
let instance;

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    async mssqlGet(query){
        try{
            //const LAST_VERSION_QUERY='SELECT * FROM sync_version WHERE table_name = "'+table+'"';
            const response = await new Promise(async(resolve,reject)=>{
                mssqlQuery(query, (err,results)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                success:false,
                data:error,
                query:query,
            }
        }
    }
    async mysqlGet(query){
        try{
            //const LAST_VERSION_QUERY='SELECT * FROM sync_version WHERE table_name = "'+table+'"';
            const response = await new Promise(async(resolve,reject)=>{
                mysqlQuery(query, (err,results)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                success:false,
                data:error,
                query:query,
            }
        }
    }
    async mysqlExcute(query){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                mysqlQuery(query, (err,results)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                'success':false,
                'data':error
            }
        }
    }
    async mssqlExcute(query){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                mssqlQuery(query, (err,results)=>{
                    if (err) resolve ({
                        success:false,
                        data:err,
                        query:query,
                    })
                    //console.log('results',results)
                    resolve({
                        success:true,
                        data:results
                    });
                });
            })
            return response
        }catch(error){
            console.log(error);
            return {
                'success':false,
                'data':error,
                query:query,
            }
        }
    }
    async uploadImage(rootPath,folder,file,newFileName){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                const extension=file.name.split('.').pop();
                const _newfilename=newFileName.replace('.'+extension,'')+"_thumb."+extension;
                const localFilePath = path.join(rootPath,folder, newFileName);
                await new DbService().uploadFileL(rootPath,folder,file,newFileName).then(async(data)=>{
                    if(data.success){
                        const image = await Jimp.read(localFilePath);
                        image.scaleToFit(200,200, function(err){
                            if (err) throw err;
                        })
                        .write(path.join(rootPath,folder, _newfilename));

                    }
                    resolve(data)
                });
            });
            return response;
        }catch (error){
            console.log(error);
        }
    }
    async uploadFileL(rootPath,folder,file,newFileName){
        try{
            const response = await new Promise(async(resolve,reject)=>{
                var fileName=file.name;
                const extension=file.name.split('.').pop();
                const _newfilename=newFileName.replace('.'+extension,'');
                //const remoteFilePath = path.join(filePath, fileName); // Replace 'filename.jpg' with the desired file name
                
                const localFilePath = path.join(rootPath,folder, newFileName); // Save the uploaded file to the 'uploads' directory
                file.mv(localFilePath, async function(err) {
                    if (err) {
                        console.error('Error saving file:', err);
                        reject(new Error(err.message));
                        resolve({
                            status:500,
                            success:false,
                            message:'Error saving file '+fileName,
                            newFileName:newFileName,
                            originalFileName:fileName,
                            error:err
                        });
                    }
                    
                    resolve({
                        status:200,
                        success:true,
                        message:'File uploaded successfully '+fileName,
                        newFileName:newFileName,
                        originalFileName:fileName,
                    });
                    
                });
            });
            return response;
        }catch (error){
            console.log(error);
        }
        
    }
}
module.exports = DbService;