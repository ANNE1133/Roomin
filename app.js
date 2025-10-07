// const express = require ( 'express' ); 
// // const router = require ('./backend/routers/users.js')
// const app = express ();
// // const path = require('path');
// const { readdirSync } = require('fs')
// const cors = require('cors');
// const morgan = require('morgan');

// // middleware
// app.use(morgan('dev'))
// app.use(express.json())
// app.use(cors())

// readdirSync('./backend/routers')
//   .forEach((c) => app.use('/api', require('./backend/routers/' + c)));



// // app.set('views',path.join(__dirname,'views'))
// // app.set('view engine','ejs')
// // app.use(router)
// // app.use(express.static(path.join(__dirname,'public')))


// const port = process.env.PORT || 3000; // You can use environment variables for port configuration
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });
import dotenv from "dotenv";
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


dotenv.config();

// ใช้เพื่อให้ __dirname ใช้งานได้ใน ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 🔹 Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// 🔹 โหลด routes ทั้งหมดจาก ./backend/routers
const routerFiles = readdirSync('./backend/routers');
for (const file of routerFiles) {
  const { default: router } = await import(`./backend/routers/${file}`);
  app.use('/api', router);
}


// 🔹 Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
