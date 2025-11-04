// const { default: supabase } = require("../config/supabaseClient");

// exports.register = async(req, res) => {
//     try {
//         const { email, password } = req.body
//         if(!email) {
//             return res.status(400).json({ massage: 'Email !!!'})
//         }
//         if(!password) {
//             return res.status(400).json({ massage: 'password !!!'})
//         }
//         const user = await supabase.

//         console.log(email,password)
//         res.send('hello in re con');
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Server Error"})
//     } 
// };

// exports.login = async(req, res) => {
//     try {
//         res.send('hello in login con');
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Server Error"})
//     } 
// };

// exports.user = async(req, res) => {
//     try {
//         res.send('hello in user con');
//     } catch (err) {
//         console.log(err)
//         res.status(500).json({ message: "Server Error"})
//     } 
// };
// controllers/userController.js
import supabase from '../config/supabaseClient.js'
import { createServerClient } from '@supabase/ssr';
import dotenv from 'dotenv';
dotenv.config();

// 🔹 Register (สมัครสมาชิก)
export const register = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // ใช้ Supabase Auth สมัครผู้ใช้
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return res.status(400).json({ message: error.message })
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// 🔹 Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }

    // ใช้ Supabase Auth ล็อกอิน
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return res.status(401).json({ message: error.message })
    }

    return res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// 🔹 Get current user (ดึงข้อมูลผู้ใช้จาก token)
export const user = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] // Bearer token
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { data, error } = await supabase.auth.getUser(token)

    if (error) {
      return res.status(401).json({ message: error.message })
    }

    return res.status(200).json({ user: data.user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server Error' })
  }
}

// ฟังก์ชันนี้จะ "สร้าง" ล่าม Supabase ที่รู้จัก cookie
const createSupabaseClient = (req, res) => {
  let headersSent = false;
  res.on('finish', () => { headersSent = true }); // ตรวจจับว่า response ถูกส่งแล้ว

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      cookies: {
        get: (name) => req.cookies[name],
        set: (name, value, options) => {
          // ✅ ป้องกันไม่ให้ set cookie หลัง response ถูกส่ง
          if (!headersSent && !res.headersSent) {
            res.cookie(name, value, options);
          }
        },
        remove: (name, options) => {
          if (!headersSent && !res.headersSent) {
            res.cookie(name, '', options);
          }
        },
      },
    }
  );
};

// 1. Controller สำหรับ "เริ่ม" ล็อกอิน
export const handleGoogleLogin = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'http://localhost:3000/auth/callback', 
    },
  });

  if (error) {
    console.error('Error signing in with Google:', error);
    return res.status(500).send('Something went wrong');
  }

  // ส่งผู้ใช้ไปหน้า Google
  return res.redirect(data.url);
};

// 2. Controller สำหรับ "รับ" ผู้ใช้กลับจาก Google
export const handleGoogleCallback = async (req, res) => {
  const code = req.query.code; // Google จะส่ง code กลับมา
  const supabase = createSupabaseClient(req, res);

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(String(code));
    if (error) {
      console.error('Error exchanging code for session:', error);
      return res.status(500).send('Something went wrong');
    }
  }

  // พอล็อกอินเสร็จ... ส่งไปหน้า dashboard (หรือหน้าหลัก)
  setTimeout(() => {
    res.redirect('/auth/check-profile');
  }, 0);
};

export const checkProfile = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  
  // 1. หาว่า "ฉันคือใคร" (จากคุกกี้)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return res.redirect('/auth/show-login'); // ถ้าไม่เจอก็กลับไปล็อกอิน

  const { data, error } = await supabase.from('User') // (R ใหญ่, ไม่มี s)
                                     .select('UserID')
                                     .eq('authId', user.id) // user.id คือ "authId"
                                     .single();

  if (data) {
    return res.redirect('/dashboard'); // ◀️ "แก้" (เติม return)
  } else {

    return res.redirect('/auth/complete-profile'); // ◀️ "แก้" (เติม return)
  }
};

export const showCompleteProfileForm = (req, res) => {
  // ไปหาไฟล์ 'views/complete-profile.ejs' มาโชว์
  res.render('complete-profile');
};

// 6. (Controller ใหม่!) "รับ" ข้อมูลจากฟอร์ม (POST)
export const handleCompleteProfileSubmit = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  
  // 1. หาว่า "ฉันคือใคร" (จากคุกกี้)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return res.redirect('/auth/show-login');

  // 2. ดึงข้อมูลจากฟอร์ม (req.body)
  const { FName, LName, Name, phone } = req.body;
  
  // 3. (นี่คือ "INSERT" ใหม่!) สร้างข้อมูลในตาราง "User"
  const { error } = await supabase.from('User').insert({
    authId: user.id,          // ◀️ จาก Google Auth
    email: user.email,        // ◀️ จาก Google Auth
    FName: FName,             // ◀️ จากฟอร์ม
    LName: LName,             // ◀️ จากฟอร์ม
    Name: Name,               // ◀️ จากฟอร์ม
    phone: phone,             // ◀️ จากฟอร์ม
    role: 'TENANT'            // (ตั้งค่า default)
  });

  if (error) {
    console.error('Error saving profile:', error);
    // (ควรโชว์ Error ที่หน้าฟอร์ม... แต่ตอนนี้แค่เด้งกลับไปก่อน)
    return res.redirect('/auth/complete-profile');
  }

  // 4. "บันทึกสำเร็จ!" -> ส่งไปหน้าหลัก
  return res.redirect('/auth/dashboard');
};

export const showDashboard = async (req, res) => {
  const supabase = createSupabaseClient(req, res);

  // "เช็ก" (อีกครั้ง) ว่าล็อกอินมารึเปล่า
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    // ถ้า "ไม่" -> ไล่กลับไปล็อกอิน
    return res.redirect('/auth/show-login'); 
  }

  // ถ้า "ใช่" -> "ฉาย" หนังเรื่อง 'dashboard'
  res.render('dashboard'); 
};

// 3. Controller สำหรับ Logout
export const handleLogout = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  await supabase.auth.signOut();
  return res.redirect('/auth/show-login');
};
