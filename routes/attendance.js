import express from "express";
import pool from "../database.js";



const attendance = express.Router();


attendance.get("/dashboard/attendance",(req,res)=>{
    res.render("attendance");
})


attendance.post("/attendance",async(req,res)=>{
    try{

        const {id, name,date ,lecture,status} = req.body;

        const already = await pool.query(
            "SELECT * FROM attendance WHERE id = $1, name =$2"
        )
        
        await pool.query(
            "INSERT INTO attendance (id,name,date,class,status) VALUES ($1,$2,$3,$4,$5)"
            ,[id,name,date,lecture,status]
        )
        res.redirect("/dashboard/attendance");
    }
    catch(err){
        res.redirect("/dashboard/attendance");
    }

})

export default attendance;