import * as dotenv from 'dotenv'
dotenv.config()
import mariadb from 'mariadb';
const pool = new mariadb.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_NAME,
    acquireTimeout: 5000,
})

export async function getAllUser() {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM `User` WHERE Admin = 0");
        return rows
    }
    finally {
        if (conn) conn.destroy();
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
        if (conn) conn.destroy();
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
        if (conn) conn.destroy();
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
        if (conn) conn.destroy();
    }
}

export async function InsertUser(Email, Password, Name, Score) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("INSERT INTO `User` (`Email`, `Password`, `Name`, `Score`, `Admin`) VALUES (?, ?, ?, ?, 0);", [Email, Password, Name, Score]);
        console.log(rows.affectedRows);
        if(rows.affectedRows == 1){
            return true
        }
        return false
    } finally {
        if (conn) conn.destroy();
    }

}

export async function resetPassword(email,newPassword) {
    let conn;
    try {
        console.log(email);
        console.log(newPassword);
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE User SET User.Password = ? WHERE User.Email = ?;",[newPassword,email]);
        console.log(rows);
        return rows.affectedRows == 1 ? true : false
    } finally {
        if (conn) conn.destroy();
    }
}

export async function editinfo(id,name,fname,lname) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE User SET User.Name = ? , User.Fname = ? , User.Lname = ? WHERE Id = ?;",[name,fname,lname,id]);
        console.log(rows);
        return rows.affectedRows == 1 ? true : false
    } finally {
        if (conn) conn.destroy();
    }
}
export async function editpassword(id,password) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("UPDATE User SET User.Password = ? WHERE Id = ?;",[password,id]);
        return rows.affectedRows == 1 ? true : false
    } finally {
        if (conn) conn.destroy();
    }
}

export async function deleteuser(user) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("DELETE FROM `User` WHERE Id = ?;",[user.Id]);
        console.log(rows);
        return rows.affectedRows == 1 ? true : false
    } finally {
        if (conn) conn.destroy();
    }
    
}