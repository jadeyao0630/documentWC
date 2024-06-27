const dotenv = require('dotenv');
const path = require("path");
const { env } = process;
var mysql=require("mysql");
dotenv.config({
    path: path.resolve(
        __dirname,
        `./.env${process.env.NODE_ENV ? "."+process.env.NODE_ENV : ""}`
      ),
});
console.log(env.HOST,env.USER)
var pool = mysql.createPool({
    host: env.HOST,
    user:env.HOST===env.USER,
    password:env.PASSWORD,
    database:env.DATABASE,
    port:env.DB_PORT,
});

var query=function(sql,callback){

    pool.getConnection(function(err,conn){
        if(err){
            console.log(err);
            callback?.(err,null);
        }else{
            conn.query(sql,function(err,results){
                //事件驱动回调
                callback?.(err,results);
            });
            //释放连接，需要注意的是连接释放需要在此处释放，而不是在查询回调里面释放
            conn.release();
        }
    });
};

module.exports=query;