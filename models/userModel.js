const db = require("../config/db");

const createUser = (data, callback)=>{
    const sql = "INSERT INTO users (username,name,email,password,phone,role) VALUES (?,?,?,?,?,?)";
    db.query(sql,data,callback);
};

const findUserByEmail = (email,callback)=>{
    db.query("SELECT * FROM users WHERE email = ?",[email],callback);
};

module.exports = {
    createUser,
    findUserByEmail
};