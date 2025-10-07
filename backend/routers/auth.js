const express = require('express');
const router = express.Router();

const { register, login, user } = require('../controllers/auth');

router.post('/register',register)
router.post('/login',login)
router.post('/user',user)
router.post('/admin',user)
// // สมัครสมาชิก
// router.post('/register', async (c) => {
//   return c.json({ message: 'Register endpoint' })
// })

// // เข้าสู่ระบบ
// router.post('/login', async (c) => {
//   return c.json({ message: 'Login endpoint' })
// })

// // ดูข้อมูลตัวเอง (ต้อง login)
// router.get('/me', async (c) => {
//   return c.json({ message: 'Get my profile' })
// })

// // เปลี่ยนรหัสผ่าน
// router.post('/change-password', async (c) => {
//   return c.json({ message: 'Change password' })
// })

module.exports = router