const express= require('express');
const {loginUser, registerUser, adminLogin} = require('../controllers/userController');

const userRouter= express.Router();

userRouter.post('/login', loginUser);
userRouter.post('/register', registerUser);
userRouter.post('/admin', adminLogin);

module.exports= userRouter;