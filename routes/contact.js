import express from "express";
import pool from "../database.js";
import nodemailer from "nodemailer";
import validator from "validator";


const contact = express.Router();

const transporter = nodemailer.createTransport({
    service : "gmail",
    auth:   {
        user :"ahssanrajpoot4444@gmail.com",
        pass:"hfaa efeb dagf qvkr "
    }
})


contact.post("/contact", async(req,res)=>{
    const {email, name, message} = req.body;
    if(!validator.isEmail(email)){
        return res.status(400).send("invalid email provided");
    };
    
    try{
        await pool.query(
            "INSERT INTO contact (email, name, messge) VALUES ($1,$2,$3)"
            ,[email, name, message]
        )

        const mailOptions = {
            from :"ahssanrajpoot4444@gmail.com",
            to :"ahssanrajpoot4444@gmail.com",
            subject: "contact", 
            text : `${message}`
        }
        transporter.sendMail(mailOptions,(error,info)=>{
            if(error)console.log(error);

            // if(info)console.log();
            
        })
        res.redirect("/")
    }
    catch(error){console.log(error)
        res.redirect("/contact");
    }

})


export default contact;