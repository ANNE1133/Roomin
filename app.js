import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { readdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';//

dotenv.config();

// ใช้เพื่อให้ __dirname ใช้งานได้ใน ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(cors());
app.use(morgan('dev'));                          // log request
app.use(cors({ origin: '*' }));                  // เปิด CORS (ปรับ origin ตามต้องการ)
app.use(express.json());                          // แปลง JSON body
app.use(express.urlencoded({ extended: true })); // รองรับ form submission
app.use(cookieParser());                          // รองรับ cookies
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// // 🔹 EJS Template (เผื่อใช้ render หน้าเว็บ)
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'views'));
// app.use(express.static(path.join(__dirname, 'public')));

// // 🔹 โหลด router auth แยกเฉพาะ
// import authRouter from './routers/auth.js';
// app.use('/api/auth', authRouter);

// โหลด routes ทั้งหมดจาก ./backend/routers
const routerFiles = readdirSync('./backend/routers');
for (const file of routerFiles) {
  const { default: router } = await import(`./backend/routers/${file}`);
  app.use('/api', router);
}


// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
