import * as dotenv from 'dotenv' 
dotenv.config()
import mariadb from 'mariadb';
const pool = mariadb.createPool({
    host: process.env.DB_HOST, 
    port: process.env.DB_PORT,
    user: process.env.DB_USER, 
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_NAME
    
})

export async function connect(){
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User`");
        return rows
    }
    finally{
        if (conn) conn.end();
    }
}

export async function userCheckBackEnd(email){
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User` WHERE Email = ?",[email]);
        console.log(rows[0]);
        if(rows[0] == null){
            return{
                Response:false
            }
        }
        return {
            Response:true,
        }
    }finally{
        if (conn) conn.end();
    }
}