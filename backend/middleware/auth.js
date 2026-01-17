require('dotenv').config();
const jwt= require('jsonwebtoken');

const authUser= async (req, res, next)=>{
    try{
        const authHeader= req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({success: false, message: "Authorization token is missing"});
        }
        const token= authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({success: false, message: "Authorization token is missing"});
        }

        const token_decode= jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId= token_decode.id;
        return next();
    }catch(error){
        console.log("Auth Error: ", error);
        return res.status(500).json({success: false, message: "Authentication failed", error: error.message});
    }
}

module.exports= { authUser };