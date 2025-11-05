import express from 'express';
import {
  register,
  login,
  showDashboard,
  handleGoogleLogin,
  handleGoogleCallback,
  checkProfile,
  showCompleteProfileForm,
  handleCompleteProfileSubmit,
  handleLogout,
  getMyProfile
} from '../controllers/auth.js';


const router = express.Router();

//google login
router.get('/login', handleGoogleLogin);
router.get('/callback', handleGoogleCallback);
router.post('/logout', handleLogout);
router.get('/me', getMyProfile);

router.post('/user/register',register)
router.post('/login',login)
// router.post('/user',user)
// router.post('/admin',user)

//complete profile
router.get('/check-profile', checkProfile);
router.get('/complete-profile', showCompleteProfileForm);
router.post('/complete-profile', handleCompleteProfileSubmit);
router.get('/dashboard', showDashboard);
router.post('/logout', handleLogout);








// verลองทำเอง ยังไม่ได้
// import express from "express";
// import {
//   login,
//   handleGoogleLogin,
//   checkProfile,
//   handleCompleteProfileSubmit,
// } from "../controllers/auth.js";

// // const router = express.Router();

// router.post("/login", login);
// router.get("/google-login", handleGoogleLogin);
// router.get("/check-profile", checkProfile);
// router.post("/complete-profile", handleCompleteProfileSubmit);

export default router;

