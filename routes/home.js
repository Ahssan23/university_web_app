import express from 'express';


const home = express.Router();

home.get("/", (req,res)=>{
    res.render("home.ejs");
});

home.get("/about", (req,res)=>{
    res.render('about');
})


home.get("/contact", (req,res)=>{
    res.render("contact");
})


export default home;