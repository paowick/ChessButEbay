import mariadb from 'mariadb';
const pool = mariadb.createPool({
    host: "db", 
    port: 3306,
    user: "root", 
    password: "admin",
    database: "chessbutebay"
    
})

export async function connect(){
    console.log('hi');
    let conn;
    try{
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `log`");
        return rows
    }
    finally{
        if (conn) conn.release();
    }
}