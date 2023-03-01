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

export async function connect() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User`");
        return rows
    }
    finally {
        if (conn) conn.end();
    }
}

export async function userCheckBackEnd(email, id) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User` WHERE Email = ? AND Id = ?", [email, id]);
        if (rows[0] == null) {
            return false
        }
        return true
    } finally {
        if (conn) conn.end();
    }
}
export async function userCheckBackEndPass(email, password) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User` WHERE Email = ? AND Password = ?", [email, password]);
        if (!rows[0]) {
            return {
                Response: false
            }
        }
        return {
            Response: true,
            data: rows[0]
        }
    } finally {
        if (conn) conn.end();
    }
}
export async function userQurey(email) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User` WHERE Email = ?", [email]);
        if (rows[0] == null) {
            return {
                Response: false
            }
        }
        return {
            Response: true,
        }
    } finally {
        if (conn) conn.end();
    }
}
export async function qureyId() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT Id from `User` ORDER BY id DESC LIMIT 1;",);
        return rows[0]//bug here
    } finally {
        if (conn) conn.end();
    }

}
export async function InsertUser(Id, Email, Password, Name, Score, Admin) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO `User` (`Id`, `Email`, `Password`, `Name`, `Score`, `Admin`) VALUES (?, ?, ?, ?, ?, ?);", [Id, Email, Password, Name, Score, Admin]);
        console.log(rows.affectedRows);
        return rows.affectedRows == 1 ? true : false
    } finally {
        if (conn) conn.end();
    }

}