import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from "../database.js"
import cookieparser from "cookie-parser";




const login = express.Router();
const KEY = 'alsjk24jlsa'
login.use(cookieparser());

login.get("/login", (req,res)=>{
    res.render("ulogin");
});


login.post("/login", async(req,res)=>{
    const {username, password}= req.body;

    try{

        const get_user = await pool.query(
            "SELECT * FROM students WHERE name = $1",[username]
        )
        console.log(get_user.rows[0].password   )
        bcrypt.compare(password, get_user.rows[0].password, (err,isMatch)=>{
            if(err)console.log(err);

            if(isMatch){
                const data = {"username": username}

                const token  = jwt.sign(data, KEY);
                res.cookie("access_token", token);

                res.redirect("/dashboard")
            }
            else{
                console.log("no match , wrong username")
                res.redirect("/login")
            }
        })

    }catch(err){console.log("wrong username or password",err)}
    
})




export default login; 