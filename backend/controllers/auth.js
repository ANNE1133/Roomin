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
