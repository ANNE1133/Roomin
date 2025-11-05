// // controllers/userController.js
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
      redirectTo: 'http://localhost:3000/api/auth/callback', 
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
    res.redirect('/api/auth/check-profile');
  }, 0);
};

export const checkProfile = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  
  // 1. หาว่า "ฉันคือใคร" (จากคุกกี้)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
  return res.status(401).json({ message: 'Unauthorized' });
}

  const { data, error } = await supabase.from('User')
                                     .select('role')
                                     .eq('authId', user.id) // user.id คือ "authId"
                                     .maybeSingle();
                                    
  const frontendUrl = 'http://localhost:5173';

  if (data) { 
  // 3. "ตัดสินใจ" จาก data ที่ "ดึง" มาได้
  if (data.role === 'OWNER') {
    return res.redirect(`${frontendUrl}/owner/dashboard`);
  } else {
    return res.redirect(`${frontendUrl}/tenant/dashboard`);
  }

} else {
  // (ไม่เจอ = User ใหม่)
  return res.redirect(`${frontendUrl}/tenant/inform`); 
}
};

export const getMyProfile = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  
  // 1. เช็ก Auth (จากคุกกี้)
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    // 401 (ยังไม่ล็อกอิน) - นี่ "ไม่ใช่" Error, นี่คือ "สถานะ"
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // 2. ถ้า Auth ผ่าน, ไปหา Profile (จากตาราง 'User')
  // (เราต้องเช็ก RLS SELECT ของคุณอีกครั้ง... แต่คราวนี้เราจะ select *)
  const { data: profile, error: profileError } = await supabase.from('User')
                                             .select('*') // ◀️ ดึงมาทั้งแถว
                                             .eq('authId', user.id)
                                             .single(); // (เราแก้ซ้ำแล้ว, .single() ปลอดภัย)
  
  if (profileError) {
    // ถ้า RLS ของ SELECT * ยังไม่ได้เปิด... มันจะพังตรงนี้
    console.error('Error fetching profile for /me:', profileError);
    return res.status(500).json({ message: "Error fetching profile: " + profileError.message });
  }

  if (!profile) {
    // มี Auth, แต่ไม่มี Profile (เคสที่ต้องไป /inform)
    return res.status(404).json({ message: 'Profile not found', needsProfile: true });
  }

  // 3. สำเร็จ! ส่งข้อมูล "Profile" กลับไปให้ React
  return res.status(200).json({ user: profile });
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
    return res.status(500).json({ message: error.message });
  }

  // 4. "บันทึกสำเร็จ!" -> ส่ง JSON กลับไปให้ React
  return res.status(200).json({ message: 'Profile completed successfully' });
};

export const showDashboard = async (req, res) => {
  const supabase = createSupabaseClient(req, res);

  // "เช็ก" (อีกครั้ง) ว่าล็อกอินมารึเปล่า
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
  return res.status(401).json({ message: 'Unauthorized' }); 
}

  // ถ้า "ใช่" -> "ฉาย" หนังเรื่อง 'dashboard'
  res.render('dashboard'); 
};

// 3. Controller สำหรับ Logout
export const handleLogout = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  await supabase.auth.signOut();
  // บอกว่า "ออกจากระบบสำเร็จแล้ว"
  return res.status(200).json({ message: 'Logged out successfully' }); 
};
// controllers/userController.js
// verลองทำเอง ยังไม่ได้
// import supabase from "../config/supabaseClient.js";

// // 🔹 สร้าง Supabase server client สำหรับ SSR / cookie
// const createSupabaseClient = (req, res) => {
//   return supabase; // สำหรับง่าย ๆ ใช้ Supabase client เดิม
// };

// // 🔹 Email/Password Login
// export const login = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) return res.status(400).json({ message: "กรอก email/password" });

//   const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//   if (error) return res.status(401).json({ message: error.message });

//   res.status(200).json({ user: data.user, session: data.session });
// };

// // 🔹 Google Login start
// export const handleGoogleLogin = async (req, res) => {
//   const { data } = await supabase.auth.signInWithOAuth({
//     provider: "google",
//     options: { redirectTo: "http://localhost:3000/auth/callback" },
//   });
//   res.json({ url: data.url });
// };

// // 🔹 Google callback → เช็ก profile
// export const checkProfile = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ redirect: "/login" });

//   const { data: { user }, error } = await supabase.auth.getUser(token);
//   if (error || !user) return res.status(401).json({ redirect: "/login" });

//   // ตรวจสอบว่ามี profile ใน DB หรือยัง
//   const { data: profile } = await supabase.from("User").select("UserID").eq("authId", user.id).single();

//   if (profile) res.json({ redirect: "/dashboard" });
//   else res.json({ redirect: "/complete-profile" });
// };

// // 🔹 รับข้อมูล Complete Profile
// export const handleCompleteProfileSubmit = async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) return res.status(401).json({ redirect: "/login" });

//   const { data: { user } } = await supabase.auth.getUser(token);
//   if (!user) return res.status(401).json({ redirect: "/login" });

//   const { FName, LName, Name, phone } = req.body;
//   const { error } = await supabase.from("User").insert({
//     authId: user.id,
//     email: user.email,
//     FName,
//     LName,
//     Name,
//     phone,
//     role: "TENANT",
//   });

//   if (error) return res.status(500).json({ message: error.message });
//   res.json({ redirect: "/dashboard" });
// };

