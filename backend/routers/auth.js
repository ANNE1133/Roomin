// const express = require('express');
// const router = express.Router();

// const { register, login, user } = require('../controllers/auth');

// router.post('/register',register)
// router.post('/login',login)
// router.post('/user',user)
// router.post('/admin',user)

// module.exports = router

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
  handleLogout
} from '../controllers/auth.js';


const router = express.Router();

router.get('/show-login', (req, res) => {
  res.render('login'); 
});
//google login
router.get('/login', handleGoogleLogin);
router.get('/callback', handleGoogleCallback);
router.post('/logout', handleLogout);

router.post('/register',register)
router.post('/login',login)
// router.post('/user',user)
// router.post('/admin',user)

//complete profile
router.get('/check-profile', checkProfile);
router.get('/complete-profile', showCompleteProfileForm);
router.post('/complete-profile', handleCompleteProfileSubmit);
router.get('/dashboard', showDashboard);
router.post('/logout', handleLogout);


export default router;