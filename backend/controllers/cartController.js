const User = require('../models/userModel');

// add products to user Cart

const addToCart= async (req, res)=>{
    try{
        const userId= req.userId;
        const {itemId, size}= req.body;

        const userData= await User.findById(userId);
        if(!userData){
            return res.status(404).json({success: false, message: "User not found"});
        }
        let cartData= await userData.cartData;

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size]+=1;
            }else{
                cartData[itemId][size]=1;
            }
        }else{
            cartData[itemId]={};
            cartData[itemId][size]=1;
        }

        await User.findByIdAndUpdate(userId, {cartData: cartData});
        console.log("adding successfully");
        return res.status(200).json({success: true, message: "Item added to cart successfully", cartData});
    }catch(error){
        console.log("Add to cart error: ", error.message);
        return res.status(500).json({success: false, message: "Adding to cart failed", error: error.message});
    }
}

const updateCart= async (req, res)=>{
    try{
        const userId= req.userId;
        const {itemId, size, quantity}= req.body;

        const userData= await User.findById(userId);
        if(!userData){
            return res.status(404).json({success: false, message: "User not found"});
        }
        let cartData= await userData.cartData;

        cartData[itemId][size]= quantity;

        await User.findByIdAndUpdate(userId, {cartData: cartData});
        return res.status(200).json({success: true, message: "Cart updated", cartData});

    }catch(error){
        console.log("Update cart error: ", error.message);
        return res.status(500).json({success: false, message: "Updating cart failed", error: error.message});
    }
}

const getUserCart= async (req, res)=>{
    try{
        const userId= req.userId;
        const userData= await User.findById(userId);
        if(!userData){
            return res.status(404).json({success: false, message: "User not found"});
        }

        let cartData= await userData.cartData;
        return res.status(200).json({success: true, message: "User cart fetched successfully", cartData});
    }catch(error){
        console.log("Get user cart error: ", error.message);
        return res.status(500).json({success: false, message: "Fetching user cart failed", error: error.message});
    }
}

module.exports= {addToCart, updateCart, getUserCart};