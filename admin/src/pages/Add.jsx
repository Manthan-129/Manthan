import React from 'react'
import {assets} from '../assets/assets'
import axios from 'axios'
import {backendUrl} from '../App.jsx' 
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1, setImage1]= React.useState(false);
  const [image2, setImage2]= React.useState(false);
  const [image3, setImage3]= React.useState(false);
  const [image4, setImage4]= React.useState(false);

  const [name, setName]= React.useState("");
  const [description, setDescription]= React.useState("");
  const [category, setCategory]= React.useState("Men");
  const [subCategory, setSubCategory]= React.useState("Topwear");
  const [price, setPrice]= React.useState("");
  const [sizes, setSizes]= React.useState([]);
  const [bestSeller, setBestSeller]= React.useState(false);


  const onSubmitHandler= async (e)=>{
    e.preventDefault();
    try{
      const formData= new FormData();

      formData.append("name",name);
      formData.append("description",description);
      formData.append("category",category);
      formData.append("subCategory",subCategory);
      formData.append("price",price);
      formData.append("sizes",JSON.stringify(sizes));
      
      if(bestSeller){
        formData.append("bestSeller", true);
      }

      image1 && formData.append("image1",image1);
      image2 && formData.append("image2",image2);
      image3 && formData.append("image3",image3);
      image4 && formData.append("image4",image4);
      

      const response= await axios.post(backendUrl + "/api/product/add", formData,{
        headers:{ 
        Authorization: `Bearer ${token}` 
      }
      })
      if(response.data.success){
        toast.success(response.data.message);
        setName("");
        setDescription("");
        setPrice("");
        setSizes([]);
        setBestSeller(false);
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
      }else{
        toast.error(response.data.message);
      }      
    }catch(error){
      console.log("Error while adding product: ", error.message);
      toast.error("Error while adding product. Please try again later.");
    }
  }
  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col w-full items-start gap-6 max-w-4xl">
      
      {/* Upload Images Section */}
      <div className="w-full">
        <p className="mb-3 text-lg font-medium text-gray-700">Upload Images</p>
        <div className="flex gap-3 flex-wrap">
          <label htmlFor="image1" className="group">
            <img 
              className="w-24 h-24 object-cover cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-all group-hover:scale-105" 
              src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} 
              alt="upload Image" 
            />
            <input onChange={(e)=> setImage1(e.target.files[0])} type="file" id="image1" accept="image/*" hidden />
          </label>
          <label htmlFor="image2" className="group">
            <img 
              className="w-24 h-24 object-cover cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-all group-hover:scale-105" 
              src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} 
              alt="upload Image" 
            />
            <input onChange={(e)=> setImage2(e.target.files[0])} type="file" id="image2" accept="image/*" hidden />
          </label>
          <label htmlFor="image3" className="group">
            <img 
              className="w-24 h-24 object-cover cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-all group-hover:scale-105" 
              src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} 
              alt="upload Image" 
            />
            <input onChange={(e)=> setImage3(e.target.files[0])} type="file" id="image3" accept="image/*" hidden />
          </label>
          <label htmlFor="image4" className="group">
            <img 
              className="w-24 h-24 object-cover cursor-pointer border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-500 transition-all group-hover:scale-105" 
              src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} 
              alt="upload Image" 
            />
            <input onChange={(e)=> setImage4(e.target.files[0])} type="file" id="image4" accept="image/*" hidden />
          </label>
        </div>
      </div>

      {/* Product Name */}
      <div className="w-full">
        <p className="mb-2 text-sm font-medium text-gray-700">Product Name</p>
        <input 
          onChange={(e)=>setName(e.target.value)} 
          value={name} 
          className="w-full max-w-[500px] px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
          type="text" 
          placeholder="Enter product name" 
          required
        />
      </div>

      {/* Product Description */}
      <div className="w-full">
        <p className="mb-2 text-sm font-medium text-gray-700">Product Description</p>
        <textarea 
          onChange={(e)=>setDescription(e.target.value)} 
          value={description} 
          className="w-full max-w-[500px] px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none h-32" 
          placeholder="Write product description" 
          required
        />
      </div>

      {/* Category, Sub Category, and Price */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-gray-700">Product Category</p>
          <select 
            onChange={(e)=>setCategory(e.target.value)} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white cursor-pointer"
          >
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-gray-700">Sub Category</p>
          <select 
            onChange={(e)=>setSubCategory(e.target.value)} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white cursor-pointer"
          >
            <option value="Topwear">Topwear</option>
            <option value="Bottomwear">Bottomwear</option>
            <option value="Winterwear">Winterwear</option>
          </select>
        </div>

        <div className="flex-1">
          <p className="mb-2 text-sm font-medium text-gray-700">Product Price</p>
          <input 
            onChange={(e)=>setPrice(e.target.value)} 
            value={price} 
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all" 
            type="Number" 
            placeholder="25" 
            required
          />
        </div>
      </div>  

      {/* Product Sizes */}
      <div className="w-full">
        <p className="mb-3 text-sm font-medium text-gray-700">Product Sizes</p>
        <div className="flex gap-3 flex-wrap">
          <div 
            onClick={()=>setSizes(prev=> prev.includes("S") ? prev.filter(item=> item !== "S"): [...prev, "S"])} 
            className={`px-5 py-2 cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
              sizes.includes("S") 
                ? "bg-black text-white border-black" 
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <p className="font-medium">S</p>
          </div>
          <div 
            onClick={()=>setSizes(prev=> prev.includes("M") ? prev.filter(item=> item !== "M"): [...prev, "M"])} 
            className={`px-5 py-2 cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
              sizes.includes("M") 
                ? "bg-black text-white border-black" 
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <p className="font-medium">M</p>
          </div>
          <div 
            onClick={()=>setSizes(prev=> prev.includes("L") ? prev.filter(item=> item !== "L"): [...prev, "L"])} 
            className={`px-5 py-2 cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
              sizes.includes("L") 
                ? "bg-black text-white border-black" 
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <p className="font-medium">L</p>
          </div>
          <div 
            onClick={()=>setSizes(prev=> prev.includes("XL") ? prev.filter(item=> item !== "XL"): [...prev, "XL"])} 
            className={`px-5 py-2 cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
              sizes.includes("XL") 
                ? "bg-black text-white border-black" 
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <p className="font-medium">XL</p>
          </div>
          <div 
            onClick={()=>setSizes(prev=> prev.includes("XXL") ? prev.filter(item=> item !== "XXL"): [...prev, "XXL"])} 
            className={`px-5 py-2 cursor-pointer rounded-lg border-2 transition-all hover:scale-105 ${
              sizes.includes("XXL") 
                ? "bg-black text-white border-black" 
                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
            }`}
          >
            <p className="font-medium">XXL</p>
          </div>
        </div>
      </div>

      {/* Bestseller Checkbox */}
      <div className="flex gap-3 items-center">
        <input 
          onChange={()=>setBestSeller(prev => !prev)} 
          checked={bestSeller} 
          className="w-4 h-4 cursor-pointer accent-black" 
          type="checkbox" 
          id='bestseller'
        />
        <label className="cursor-pointer text-sm text-gray-700 select-none" htmlFor="bestseller">
          Add to bestseller
        </label>
      </div>

      {/* Submit Button */}
      <button 
        className="px-8 py-3 mt-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow-md hover:shadow-lg" 
        type="submit"
      >
        ADD PRODUCT
      </button>
    </form> 
  )
}

export default Add