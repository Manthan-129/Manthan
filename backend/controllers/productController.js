
const addProduct= async (req, res)=>{
    try{
        const { name, description, price, category, subCategory, bestSeller, sizes } = req.body;
        
        const image1= req.files.image1[0]
        const image2= req.files.image2[0]
        const image3= req.files.image3[0]
        const image4= req.files.image4[0]

        console.log(image1, image2, image3, image4);
        console.log(name, description, price, category, subCategory, bestSeller, sizes);

        return res.status(200).json({success: true, message: "Product added successfully"});
    }catch(error){
        return res.status(500).json({success: false, message: "Adding product failed", error: error.message});
    }
}

const listProduct= async (req, res)=>{

}

const removeProduct= async (req, res)=>{

}

const singleProductInfo= async (req, res)=>{

}

module.exports= { addProduct, listProduct, removeProduct, singleProductInfo }