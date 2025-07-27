import express from "express";
import pool from "../database.js";
import jwt from "jsonwebtoken";



const dashboard = express.Router();
const KEY = 'alsjk24jlsa'

dashboard.get("/dashboard", (req,res)=>{
    try{
        
        const token = req.cookies['access_token'];
        const decoded = jwt.verify(token,KEY);
        if(decoded){
            
            res.render("dashboard", {"result":""});
        }
    }catch(err){
        console.log(err);
        res.redirect('/login')
    }
});

dashboard.post("/grades" ,async(req,res)=>{
    const {name , rollno} = req.body;
    const result = await pool.query(
        "SELECT * FROM grades WHERE name = $1 AND id = $2",[name, rollno]
    );
    console.log(typeof(result.rows[0]))

    res.render("dashboard", {"result" :result.rows[0]})
})




export default dashboard;