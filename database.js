import {Pool} from "pg";


const pool = new Pool({
    host:'localhost',
    user:'postgres',
    port:5432,
    password: "root",
    database: "university"
})


export default pool;