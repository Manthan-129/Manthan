require('dotenv').config();
const express= require('express');
const cors= require('cors');
const morgan= require('morgan');
const { connectDB } = require('./config/db');
const {connectCloudinary}= require('./config/cloudinary');
const PORT= process.env.PORT || 5000;
const userRouter= require('./routes/userRoute');
const productRouter = require('./routes/productRoute');
const cartRouter= require('./routes/cartRoute');
const orderRouter= require('./routes/orderRoute');

//App config
const app= express();
connectDB();
connectCloudinary();

//middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//api endpoints
app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.get('/',(req,res)=>{
    return res.status(200).json({message:"API is running successfully"});
})

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})