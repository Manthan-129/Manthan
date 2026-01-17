require('dotenv').config();
const Order= require('../models/orderModel');
const User= require('../models/userModel');
const Stripe= require('stripe');
const Razorpay= require('razorpay');

// global variables
const currency= 'inr';
const deliverCharge= 10

// gateway initialization
const stripe= new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpayInstance= new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,    
})

//placing order using COD method
const placeOrderCOD= async (req, res)=>{
    try{
        const userId= req.userId;
        const {items, amount, address}= req.body;

        const orderData= await Order.create({
            userId,
            items,
            amount,
            address,
            paymentMethod: "COD",
            payment: false,
            date: Date.now(),
        })

        let cartData= {};

        await User.findByIdAndUpdate(userId, {cartData});

        return res.status(200).json({success: true, message: "Order placed successfully", orderData, cartData});
    }catch(error){
        console.log("Place Order COD Error: ", error.message);
        return res.status(500).json({success: false, message: "Placing order failed", error: error.message});   
    }
}

//placing order using Stripe method
const placeOrderStripe= async (req, res)=>{
    try{
        const userId= req.userId;
        const {items, amount, address}= req.body;
        const {origin}= req.headers;

        const orderData= await Order.create({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Stripe",
            payment: false,
            date: Date.now(),
        })

        const line_items= items.map((item)=>(
            {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name
                    },
                    unit_amount: item.price * 100
                },
                quantity: item.quantity
            }
        ))

        line_items.push({
            price_data: {
                    currency: currency,
                    product_data: {
                        name: 'Delivery Charges'
                    },
                    unit_amount: deliverCharge * 100
                },
                quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${orderData._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${orderData._id}`,
            mode: 'payment',
            line_items: line_items,
        })
        res.status(200).json({success: true, message: "Stripe session created successfully", session_url : session.url});

    }catch(error){
        console.log("Place Order Stripe Error: ", error.message);
        return res.status(500).json({success: false, message: "Placing order failed", error: error.message});   
    }
}


//verify Stripe payment and update order status

const verifyStripePayment= async (req, res)=>{
    try{
        const userId= req.userId;
        const {orderId, success}= req.body;

        if(success === "true"){
            await Order.findByIdAndUpdate(orderId, {payment: true});
            await User.findByIdAndUpdate(userId, {cartData: {}});
            return res.status(200).json({success: true, message: "Payment verified and order placed successfully"});
        }else{
            await Order.findByIdAndDelete(orderId);
            res.json({success: false, message: "Payment failed, order cancelled"});
        }
    }catch(error){
        console.log("Verify Stripe Payment Error: ", error.message);
        return res.status(500).json({success: false, message: "Verifying payment failed", error: error.message});   
    }
}

//placing order using Razorpay method
const placeOrderRazorpay= async (req, res)=>{
    try{
        const userId= req.userId;
        const {items, amount, address}= req.body;

        const orderData= await Order.create({
            userId,
            items,
            amount,
            address,
            paymentMethod: "Razorpay",
            payment: false,
            date: Date.now(),
        })

        const options= {
            amount: amount * 100,
            currency: currency.toUpperCase(),
            receipt: orderData._id.toString(),
        }

        const order = await razorpayInstance.orders.create(options);
        
        return res.status(200).json({
            success: true, 
            message: "Razorpay order created successfully", 
            orderId: order.id, 
            order
        });

    }catch(error){
        console.log("Place Order Razorpay Error: ", error.message);
        return res.status(500).json({success: false, message: "Placing order failed", error: error.message});   
    }
}

const verifyRazorpayPayment= async (req, res)=>{
    try{
        const userId= req.userId;
        const { razorpay_order_id }= req.body;

        const orderInfo= await razorpayInstance.orders.fetch(razorpay_order_id);
        if(orderInfo.status === 'paid'){
            await Order.findByIdAndUpdate(orderInfo.receipt, {payment: true});
            await User.findByIdAndUpdate(userId, {cartData: {}});
            return res.status(200).json({success: true, message: "Payment verified and order placed successfully"});
        }else{
            await Order.findByIdAndDelete(orderInfo.receipt);
            return res.status(400).json({success: false, message: "Payment not successful, order cancelled"});
        }
        
    }catch(error){
        console.log("Verify Razorpay Payment Error: ", error.message);
        return res.status(500).json({success: false, message: "Verifying payment failed", error: error.message});
    }
}

//All orders data for Admin Panel
const allOrders= async (req, res)=>{
    try{
        const orders= await Order.find({}).sort({_id: -1});
        return res.status(200).json({success: true, message: "All orders fetched successfully", orders});
    }catch(error){
        console.log("All Orders Error: ", error.message);
        return res.status(500).json({success: false, message: "Fetching all orders failed", error: error.message});
    }
}

//user orders data for frontend
const userOrders= async (req, res)=>{
    try{
        const userId= req.userId;
        const orders= await Order.find({userId}).sort({_id: -1});

        return res.status(200).json({success: true, message: "User orders fetched successfully", orders});
    }catch(error){
        console.log("User Orders Error: ", error.message);
        return res.status(500).json({success: false, message: "Fetching user orders failed", error: error.message});   
    }
}

//update order status from admin panel
const updateOrderStatus= async (req, res)=>{
    try{
        const {orderId, status}= req.body;

        if(!orderId || !status){
            return res.status(404).json({success: false, message: "Order ID and status are required"});
        }

        const order= await Order.findById(orderId);
        if(!order){
            return res.status(404).json({success: false, message: "Order not found"});
        }

        order.status= status;
        await order.save();

        return res.status(200).json({success: true, message: "Order status updated successfully", order});
    }catch(error){
        console.log("Update Order Status Error: ", error.message);
        return res.status(500).json({success: false, message: "Updating order status failed", error: error.message});
    }
}

// Cancel Order
const cancelOrder= async (req, res)=>{
    try{
        const userId= req.userId;
        const {orderId}= req.body;

        if(!orderId){
            return res.status(404).json({success: false, message: "Order Id is required"})
        }
        const order= await Order.findById(orderId);

        if(!order){
            return res.status(404).json({success: false, message: "Order not found"});
        }

        if(order.userId != userId){
            return res.status(403).json({success: false, message: "You are not authorized to cancel this order"});
        }
        
        if (order.status === 'Delivered') {
            return res.status(400).json({ success: false, message: "Cannot cancel delivered orders" });
        }
        if (order.status === 'Shipped') {
            return res.status(400).json({ success: false, message: "Cannot cancel shipped orders. Please contact support." });
        }
        order.status= "Cancelled";
        await order.save();

        return res.status(200).json({ success: true, message: "Order cancelled successfully", order });
    }catch(error){
        console.log("Cancel Order Error: ", error.message);
        return res.status(500).json({success: false, message: "Cancelling order failed", error: error.message});
    }
}

// Get Single Order Details
const getSingleOrder= async (req, res)=>{
    try{
        const userId= req.userId;
        const {orderId}= req.params;

        if (!orderId) {
            return res.status(400).json({ success: false, message: "Order ID is required" });
        }

        const order= await Order.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        if (order.userId != userId) {
            return res.status(403).json({ success: false, message: "You are not authorized to view this order" });
        }

        return res.status(200).json({ success: true, message: "Order fetched successfully", order });
    }catch(error){
        console.log("Get Single Order Error: ", error.message);
        return res.status(500).json({success: false, message: "Fetching order failed", error: error.message});
    }
}
module.exports= { placeOrderCOD, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateOrderStatus, cancelOrder, getSingleOrder, verifyStripePayment, verifyRazorpayPayment };