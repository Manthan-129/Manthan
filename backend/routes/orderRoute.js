const express= require('express');
const {placeOrderCOD, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateOrderStatus, cancelOrder, getSingleOrder, verifyStripePayment, verifyRazorpayPayment } = require('../controllers/orderController');
const orderRouter= express.Router();

const {authUser} = require('../middleware/auth.js');
const {adminAuth}= require('../middleware/adminAuth.js');

// Payment Fetures - User Authentication required routes
orderRouter.post('/cod', authUser, placeOrderCOD);
orderRouter.post('/stripe', authUser, placeOrderStripe);
orderRouter.post('/razorpay', authUser, placeOrderRazorpay);

// User Features - User Authentication required routes
orderRouter.get('/user', authUser, userOrders);

// Admin Authentication required routes
orderRouter.get('/list', adminAuth, allOrders);
orderRouter.post('/status', adminAuth, updateOrderStatus);

// Common Routes
orderRouter.post('/cancel', authUser, cancelOrder);
orderRouter.get('/:orderId', authUser, getSingleOrder);


//  verify payment
orderRouter.post('/verifyStripe', authUser, verifyStripePayment);
orderRouter.post('/verifyRazorpay', authUser, verifyRazorpayPayment);
module.exports= orderRouter;