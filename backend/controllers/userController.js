require('dotenv').config();
const User= require('../models/userModel');
const validator= require('validator');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');

const createToken= (userId)=>{
    return jwt.sign({id: userId}, process.env.JWT_SECRET_KEY, {expiresIn: '7d'});
}

const loginUser= async (req, res)=>{
    const {email, password}= req.body;
    try{
        if(!email || !password){
            return res.status(400).json({success: false, message: "All fields are required"});
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: "Invalid email"});
        }
        const findUser= await User.findOne({email});
        if(!findUser){
            return res.status(400).json({success: false, message: "User does not exist"});
        }
        const isMatch= await bcrypt.compare(password, findUser.password);
        if(!isMatch){
            return res.status(400).json({success: false, message: "Incorrect password"});
        }
        const token= createToken(findUser._id);
        return res.status(200).json({success: true, message: "Login successful", token});
    }catch(error){
        console.log(error);
        return res.status(500).json({success: false, message: "Login failed", error: error.message});
    }
}

const registerUser= async (req, res)=>{
    try{
        const {name, email, password}= req.body;
        if (!name || !email || !password) {
            return res.status(400).json({success: false, message: "All fields are required" });
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: "Invalid email"});
        }
        const existingUser= await  User.findOne({email});
        if(existingUser){
            return res.status(400).json({success: false, message: "User already exists"});
        }
        if(password.length < 8){
            return res.status(400).json({success: false, message: "Password must be at least 8 characters long"});
        }
        const hashPass = await bcrypt.hash(password, 10);

        const newUser= await User.create({
            name, email, password: hashPass
        })
        
        const token= createToken(newUser._id)
        
        return res.status(200).json({success: true, message: "User created Successfully", token});
    }catch(error){
        return res.status(500).json({success: false, message: "Registration failed", error: error.message});
    }
}

const adminLogin= async (req, res)=>{

}

module.exports= { loginUser, registerUser, adminLogin };