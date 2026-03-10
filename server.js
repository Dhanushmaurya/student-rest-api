const express = require("express");
const mysql = require("mysql2");
const bodyparser = require("body-parser");

const app = express();
app.use(bodyparser.json());

//mysql connection

const db= mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "college"
});

db.connect(err => {
    if(err){
        console.error("db connection failed:", err);
        return;
    }
    else{
        console.log("connected to mysql database(college)");
    }
});

//database create

app.post("/college_student", (req, res) => {
    const{name, email, course, age}= req.body;
    const sql = "INSERT INTO college_student(name, email, course, age) VALUES(?,?,?,?)";
    db.query(sql, [name, email, course, age], (err, result) => {
        if(err)return res.status(500).json ({error:err.message});
        res.status(201).json ({id:result.insertId,name, email, course, age});
    });
});

//read all user

app.get("/college_student", (req, res) => {
    db.query("SELECT * FROM college_student", (err, result) => {
        if(err)return res.status(500).json ({error:err.message});
        res.json(result);
    });
});

//read one users

app.get("/college_student:id", (req, res) => {
    db.query("SELECT * FROM college_student WHERE id=", [req.params.id], (err, result) => {
        if(err)return res.status(500).json ({error:err.message});
        if(result.length === 0)return res.status(404).json ({error:err.message});
        res.json(result[0]);
    });
});


//update users

app.put("/college_student:id", (req, res) => {
    const{name, email, course, age}= req.body;
    const sql = "UPDATE college_student SET name=?, email=?, course=?, age=?";
    db.query(sql, [name, email, course, age, req.params.id], (err, result) => {
        if(err)return res.status(500).json ({error:err.message});
        if(result.affectRows === 0)return res.status(404).json ({error:"college student not found"});
        res.json({id:req.params.id,name, email, course, age});
    });
});

//delete users

app.delete("college_student:id", (req, res) => {
    const sql = "DELETE FROM college_student WHERE id= ?";
    db.query(sql, [req.params.id], (err, result) => {
        if(err)return res.status(500).json ({error:err.message});
        if(result.affectRows === 0){
            return res.status(404).json ({error:"college student not found"});
        }
        res.json({message:"college student deleted successfully"});
    });
});


//start server

app.listen(3000, () => {
    console.log("server running on http://localhost:3000");
});