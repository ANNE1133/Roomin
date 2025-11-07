// controllers/userController.js
import supabase from '../config/supabaseClient.js'
import { createServerClient } from '@supabase/ssr';
import dotenv from 'dotenv';
dotenv.config();

// ======================================================================
// 🔹 REGISTER (สมัครสมาชิก)
// ======================================================================
export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(201).json({
      message: 'User registered successfully',
      user: data.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ======================================================================
// 🔹 LOGIN (Email/Password)
// ======================================================================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(200).json({
      message: 'Login successful',
      user: data.user,
      session: data.session,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ======================================================================
// 🔹 ดึงข้อมูลผู้ใช้จาก Token
// ======================================================================
export const user = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ message: error.message });
    }

    return res.status(200).json({ user: data.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ======================================================================
// 🔹 สร้าง Supabase Client ที่เชื่อมกับ cookie
// ======================================================================
const createSupabaseClient = (req, res) => {
  let headersSent = false;
  res.on('finish', () => { headersSent = true });

  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY,
    {
      cookies: {
        get: (name) => req.cookies[name],
        set: (name, value, options) => {
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

// ======================================================================
// 🔹 1. เริ่ม Login ด้วย Google (มี role ที่เลือก)
// ======================================================================
export const handleGoogleLogin = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  
  // 1.1 "อ่าน" Role ที่ส่งมาจาก Frontend
  const role = req.query.role || 'TENANT'; 

  console.log(`🟦 [handleGoogleLogin] Setting auth_role cookie to: ${role}`);

  // 1.2 🔻 (สำคัญ!) "ฝัง" Role ที่อ่านได้... ลงใน Cookie
  // เราจะตั้งชื่อมันว่า 'auth_role' และให้มัน "ตาย" ใน 5 นาที
  res.cookie('auth_role', role, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    maxAge: 5 * 60 * 1000 // 5 นาที
  });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      // 1.3 🔻 (สำคัญ!) "ลบ" options.data และ ?role=... ออกจาก URL นี้
      redirectTo: 'http://localhost:3000/api/auth/callback', 
    },
  });

  if (error) {
    console.error(' Error signing in with Google:', error);
    return res.status(500).send('Something went wrong');
  }
  return res.redirect(data.url);
};

// ======================================================================
// 🔹 2. Callback หลังจาก Google Login
// ======================================================================
export const handleGoogleCallback = async (req, res) => {
  const code = req.query.code;
  const supabase = createSupabaseClient(req, res);

  // 2.1 🔻 (สำคัญ!) "อ่าน" Role จาก "Cookie" ที่เรา "ฝัง" ไว้
  // (ไม่ใช่จาก req.query.role หรือ user_metadata)
  const role = req.cookies.auth_role || 'TENANT';

  console.log(` [handleGoogleCallback] Received code, Role from Cookie: ${role}`);

  // 2.2 🔻 (สำคัญ!) "เคลียร์" Cookie ทิ้ง (ไม่ให้มันค้าง)
  res.clearCookie('auth_role', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

  if (code) {
    // 2.3 (เหมือนเดิม) "แลก" code ... 
    const { data, error } = await supabase.auth.exchangeCodeForSession(String(code));
    
    if (error) {
      console.error(' Error exchanging code for session:', error);
      return res.status(500).send('Something went wrong');
    }
  }

  // 2.4 🔻 (สำคัญ!) "ส่งต่อ" Role ที่ "ถูกต้อง" (จาก Cookie) ไปให้ checkProfile
  res.redirect(`/api/auth/check-profile?role=${role}`);
};

// ======================================================================
// 🔹 3. ตรวจสอบว่าผู้ใช้มี Profile แล้วหรือยัง
// ======================================================================
export const checkProfile = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  const roleFromQuery = req.query.role || 'TENANT';
  const frontendUrl = 'http://localhost:5173';

  console.log(`[checkProfile] role from query: ${roleFromQuery}`);

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('User')
    .select('role')
    .eq('authId', user.id)
    .maybeSingle();

  if (error) {
    console.error('DB error in checkProfile:', error);
    return res.status(500).json({ message: 'Database Error' });
  }

  if (data) {
    // มี profile แล้ว -> ไปหน้า dashboard ตาม role จริง
    if (data.role === 'OWNER') {
      console.log(`➡️ Redirect to OWNER dashboard`);
      return res.redirect(`${frontendUrl}/owner/dashboard`);
    } else {
      console.log(`➡️ Redirect to TENANT dashboard`);
      return res.redirect(`${frontendUrl}/tenant/dashboard`);
    }
  } else {
    // ยังไม่มี profile -> ไปหน้า inform ตาม role ที่เลือกตอน login
    if (roleFromQuery === 'OWNER') {
      console.log(`➡️ Redirect to OWNER inform`);
      return res.redirect(`${frontendUrl}/owner/inform`);
    } else {
      console.log(`➡️ Redirect to TENANT inform`);
      return res.redirect(`${frontendUrl}/tenant/inform`);
    }
  }
};

// ======================================================================
// 🔹 4. ดึงข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบัน
// ======================================================================
export const getMyProfile = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('User')
    .select('*')
    .eq('authId', user.id)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile for /me:', profileError);
    return res.status(500).json({ message: "Error fetching profile: " + profileError.message });
  }

  if (!profile) {
    return res.status(404).json({ message: 'Profile not found', needsProfile: true });
  }

  return res.status(200).json({ user: profile });
};

// ======================================================================
// 🔹 5. แสดงฟอร์มกรอกโปรไฟล์
// ======================================================================
export const showCompleteProfileForm = (req, res) => {
  res.render('complete-profile');
};

// ======================================================================
// 🔹 6. บันทึกข้อมูลโปรไฟล์ (หลังกรอก inform)
// ======================================================================
export const handleCompleteProfileSubmit = async (req, res) => {
  const supabase = createSupabaseClient(req, res);

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { FName, LName, Name, phone, role } = req.body;
    const userRole = (role === 'OWNER') ? 'OWNER' : 'TENANT';

    const { data: newRow, error: insertError } = await supabase.from('User').insert({
      authId: user.id,
      email: user.email,
      FName,
      LName,
      Name,
      phone,
      role: userRole
    }).select().single();

    if (insertError) {
      console.error('Error saving profile:', insertError);
      return res.status(500).json({ message: insertError.message });
    }

    return res.status(200).json({ message: 'Profile completed successfully', user: newRow });
  } catch (err) {
    console.error('Critical Error in handleCompleteProfileSubmit:', err.message);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// ======================================================================
// 🔹 7. Dashboard
// ======================================================================
export const showDashboard = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  res.render('dashboard');
};

// ======================================================================
// 🔹 8. Logout
// ======================================================================
export const handleLogout = async (req, res) => {
  const supabase = createSupabaseClient(req, res);
  await supabase.auth.signOut();
  return res.status(200).json({ message: 'Logged out successfully' });
};
