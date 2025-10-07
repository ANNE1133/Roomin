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
  user
} from '../controllers/auth.js';

const router = express.Router();

router.post('/register',register)
router.post('/login',login)
router.post('/user',user)
router.post('/admin',user)

export default router;