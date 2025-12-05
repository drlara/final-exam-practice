import 'dotenv/config'; //importing .env environment values

import express from 'express';
import mysql from 'mysql2/promise';
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
//for Express to get values using the POST method
app.use(express.urlencoded({extended:true}));
//setting up database connection pool
const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 10,
    waitForConnections: true
});

//routes
app.get('/',   async (req, res) => {
    res.render('home.ejs', {"randomComic" : await getRandomComic() })
});

app.get('/api/randomComic',   async (req, res) => {
    res.send(await getRandomComic());
});

async function getRandomComic(){
 let sql = `SELECT comicUrl, comicSiteName 
               FROM fe_comics
               NATURAL JOIN fe_comic_sites
               ORDER BY RAND()
               LIMIT 1`;
  const [randomComic] = await pool.query(sql);
  return randomComic;
}

app.get("/dbTest", async(req, res) => {
   try {
        const [rows] = await pool.query("SELECT CURDATE()");
        res.send(rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Database error!");
    }
});//dbTest


app.listen(3000, ()=>{
    console.log("Express server running")
})