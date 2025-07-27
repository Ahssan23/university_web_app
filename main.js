import express from 'express';
import home from "./routes/home.js"
import contact from "./routes/contact.js"
import admin from "./routes/admin.js";
import login from "./routes/login.js";
import dashboard from "./routes/dashboard.js";
import cookieParser from 'cookie-parser';
import admission from "./routes/admission.js"
import attendance from './routes/attendance.js';

const app = express();

app.use(cookieParser());
app.set("view engine" , "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", home);
app.use("/",contact);
app.use("/" ,admin);
app.use("/" , login);
app.use("/", dashboard);
app.use("/",admission);
app.use("/",attendance);


app.listen(3000,()=>console.log("listening on the server."));