import express from "express";
import pool from "../database.js"


const admission = express.Router();


admission.get("/admission" ,(req,res)=>{

    const submitted = req.query.submitted === "true";
    res.render("admission", {'submitted' :submitted})
});


admission.post("/admission", async(req,res)=>{
    
    try{
        
        const {name,cnic,fname,birth, address,city}= req.body;
        
        await pool.query(
            "INSERT INTO admission (name,cnic, fathername,birth,address, city) VALUES ($1,$2,$3,$4,$5,$6)", 
            [name,cnic,fname,birth, address,city]
        )
      
        res.redirect("/admission?submitted=true")
    }catch(err){
 
        res.redirect("/admission?submitted=false");
    }
})


export default admission;

