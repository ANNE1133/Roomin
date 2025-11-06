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
router.get('/auth/login', handleGoogleLogin);
router.get('/auth/callback', handleGoogleCallback);
router.post('/auth/logout', handleLogout);
router.get('/auth/me', getMyProfile);

router.post('/auth/user/register',register)
router.post('/auth/login',login)
// router.post('/user',user)
// router.post('/admin',user)

//complete profile
router.get('/auth/check-profile', checkProfile);
router.get('/auth/complete-profile', showCompleteProfileForm);
router.post('/auth/complete-profile', handleCompleteProfileSubmit);
router.get('/auth/dashboard', showDashboard);
router.post('/auth/logout', handleLogout);

export default router;