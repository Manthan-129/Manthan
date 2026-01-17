const {cloudinary} = require("../config/cloudinary");
const Product= require("../models/productModel");

// function to add a new product
const addProduct= async (req, res)=>{
    try{
        const { name, description, price, category, subCategory, bestSeller, sizes } = req.body;
        

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({success: false, message: "At least one image is required"});
        }

        const image1= req.files.image1 ? req.files.image1[0] : null;
        const image2= req.files.image2 ? req.files.image2[0] : null;
        const image3= req.files.image3 ? req.files.image3[0] : null;
        const image4= req.files.image4 ? req.files.image4[0] : null;
        
        const images=[image1,image2,image3,image4].filter((item)=> item !== null && item !== undefined);
        
        if (images.length === 0) {
            return res.status(400).json({success: false, message: "No valid images found"});
        }

        let imagesUrl= await Promise.all(
            images.map(async (image)=>{
                let result= await cloudinary.uploader.upload(image.path, {folder: "products", resource_type: "image"});
                return result.secure_url;
            })
        )
        
        let parsedSizes;
        try {
            parsedSizes = JSON.parse(sizes);
        } catch (error) {
            return res.status(400).json({success: false, message: "Invalid sizes format"});
        }

        const productData= await Product.create({
            name, description, price: Number(price), category, subCategory, 
            bestSeller: Boolean(bestSeller),
            sizes: parsedSizes,
             image: imagesUrl,
             date: Date.now()
        })

        if(!productData){
            return res.status(500).json({success: false, message: "Product creation failed"});
        }
        console.log("ProductData: " , productData);

        return res.status(200).json({success: true, message: "Product added successfully", productData});
    }catch(error){
        return res.status(500).json({success: false, message: "Adding product failed", error: error.message});
    }
}

// function to list all products
const listProduct= async (req, res)=>{
    try{
        const products= await Product.find({}).sort({date: -1});
        return res.status(200).json({success: true, message: "Products fetched successfully", products});
    }catch(error){
        return res.status(500).json({success: false, message: "Fetching products failed", error: error.message});
    }
}

// function to remove a product
const removeProduct= async (req, res)=>{
    try{
        const {productId}= req.body;
        if(!productId){
            return res.status(404).json({success: false, message: "Product ID is required"});
        }
        const deletedProduct= await Product.findByIdAndDelete(productId);
        if(!deletedProduct){
            return res.status(500).json({success: false, message: "Product deletion failed"});
        }
        return res.status(200).json({success: true, message: "Product deleted successfully", deletedProduct});
    }catch(error){
        return res.status(500).json({success: false, message: "Deleting product failed", error: error.message});
    }
}

// function to get single product info
const singleProductInfo= async (req, res)=>{
    try{
        const {productId}= req.query;
        if(!productId){
            return res.status(404).json({success: false, message: "Product ID is required"});
        }
        const product= await Product.findById(productId);
        if(!product){
            return res.status(500).json({success: false, message: "Product not found"});
        }
        return res.status(200).json({success: true, message: "Product fetched successfully", product});
    }catch(error){
        return res.status(500).json({success: false, message: "Fetching product failed", error: error.message});
    }
}

module.exports= { addProduct, listProduct, removeProduct, singleProductInfo }