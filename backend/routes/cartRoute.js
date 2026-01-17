const express= require('express');
const {addToCart, updateCart, getUserCart}= require('../controllers/cartController');
const cartRouter= express.Router();
const {authUser} = require('../middleware/auth.js');

cartRouter.post('/add',authUser, addToCart);
cartRouter.post('/update', authUser, updateCart);
cartRouter.get('/get', authUser, getUserCart);

module.exports= cartRouter;