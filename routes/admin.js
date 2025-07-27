import express from "express";
import validator from 'validator';
import pool from "../database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import admission from "./admission.js";


const admin = express.Router();




const SECRET_KEY = "jsdfjj3j2243242";

admin.get("/admin", (req,res)=>{
    res.render("login");
});


admin.get("/add",(req,res)=>{
    res.render("add_admin");
});

admin.post("/add_admin" ,async(req,res)=>{
    const salt = 10;
    const {username ,password, role, email}= req.body;

    const hash = await  bcrypt.hash(password, salt);

    await pool.query(
        "INSERT INTO users (username, password, email ,role) VALUES ($1,$2,$3,$4)"
        ,[username, hash, email, role]
    );
})


admin.post("/admin_login", async(req,res)=>{
    const {username,password}= req.body;

    try{
        const get_user = await pool.query(
            "SELECT * FROM users WHERE username = $1",[username]
        
        );
        bcrypt.compare(password, get_user.rows[0].password, (err,isMatch)=>{
            if(err)console.log(err);

            if(isMatch){
                console.log("it is a match homie yes it is")
                const data = {"role": "admin"}
                const token = jwt.sign(data,SECRET_KEY, {expiresIn: "20min"})

                res.cookie("access_token" ,token);
                res.redirect("/admin/dashboard")

            }else{
                console.log("no problem homie no problem we cool")
            }
        })

    }catch(error){console.log('error occured in fetching user' ,error)};
});



admin.get("/admin/dashboard", (req,res)=>{
    try{

        const token = req.cookies['access_token'];
        const decoded = jwt.verify(token, SECRET_KEY);
        
        if ( decoded["role"] == "admin"){
            res.render("admin");
        }
        else{
            res.redirect("/login")
        }
    }catch{
        res.redirect("/login")
    }
})



admin.post("/insert_student", async(req,res)=>{
    const salts= 10;
    const {name,password,major, email,section}= req.body; 
    let {midterm, final}= req.body;
    if (!validator.isEmail(email)) {
    return res.status(400).send("Invalid email provided");
}
    const hash = await bcrypt.hash(password, salts);
    
    try{
        
        await pool.query(
            "INSERT INTO students (name,password,email,section, major) VALUES ($1,$2,$3,$4, $5) ", [name,hash,email,section,major]
            
        );
        const get_student  = await pool.query(
            "SELECT * FROM students WHERE name = $1 AND email = $2", [name,email]
        );
        const rollno_grades = get_student.rows[0].rollno;
        const name_grades = get_student.rows[0].name;
        const section_grades = get_student.rows[0].section;
        const major_grades = get_student.rows[0].major;
        
        if ( midterm == "" ){
            midterm = null;
        }
        if (final == ""){
            final = null;
        };



        await pool.query(
            "INSERT INTO grades (id ,name, section, major, midterm, final) VALUES ( $1,$2,$3,$4, $5,$6)",
             [rollno_grades,name_grades,section_grades,major_grades, midterm,final]
        );
        
        res.redirect("/admin/dashboard");



    }catch(err){console.log(err)
        res.redirect("/admin/dashboard");
    };
});


admin.post("/update" , async(req,res)=>{
    const {roll ,name, midterm ,final} = req.body;

    try{

        const get_students = await pool.query(
            "UPDATE grades SET midterm =$1 ,final=$2 WHERE id = $3 and name = $4",
            [midterm,final, roll, name]
        );

        res.redirect("/admin/dashboard");

    }catch(err){console.log(err)
        res.redirect("/admin/dashboard");
    };
   
});

admin.get("/dashboard/admissions",async  (req, res)=>{

    const admissions  = await pool.query(
        "SELECT * FROM admission"
    );
    console.log(admissions.rows)
    
    res.render("dashboard_admissions", {'admissions': admissions.rows})
})





export default admin;