const jwt= require("jsonwebtoken");

const adminAuth= (req, res, next)=>{
    try{
        const authHeader= req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({success: false, message: "Unauthorized access"});
        }
        const token= authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({success: false, message: "Unauthorized access"});
        }
        const decoded= jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(decoded.email !== process.env.ADMIN_EMAIL){
            return res.status(403).json({success: false, message: "Forbidden access"});
        }
        req.admin= decoded;
        return next();
    }catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({success: false, message: "Invalid token"});
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({success: false, message: "Token expired"});
        }
        return res.status(500).json({success: false, message: "Authentication failed", error: error.message});
    }
}

module.exports= { adminAuth };