import React from 'react'
import axios from 'axios'
import {backendUrl, currency} from '../App.jsx'
import { toast } from 'react-toastify'

const List = ({token}) => {
  const [list, setList]= React.useState([]);

  const fetchList= async ()=>{
    try{
      const response= await axios.get(backendUrl + "/api/product/list",{
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if(response.data.success){
        setList(response.data.products);
      }
      else{
        toast.error(response.data.message);
      }
    }catch(error){
      toast.error("Error while fetching product list. Please try again later.");
      console.log("Error while fetching product list: ", error.message);
    }
  }

  const removeProduct= async (id)=>{
    try{
      const response= await axios.delete(backendUrl + "/api/product/remove",{
        data: {productId: id},
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if(response.data.success){
        toast.success("Product removed successfully");
        fetchList();
      }else{
        toast.error(response.data.message);
      }
    }catch(error){
      toast.error("Error while removing product. Please try again later.");
      console.log(error.message);
    }
  }
  React.useEffect(()=>{
    fetchList();
  },[token])

  return (
    <>
      <p className="mb-4 text-xl font-semibold text-gray-800">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List Table Title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-3 px-4 border border-gray-300 bg-gray-100 text-sm font-semibold text-gray-700 rounded-lg">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product List */}
        {
          list.map((item, index)=>(
            <div className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors" key={index}>
              <img className="w-16 h-16 object-cover rounded-md" src={item.image[0]} alt="" />
              <p className="text-sm md:text-base text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-600">{item.category}</p>
              <p className="text-sm font-medium text-gray-800">{currency}{item.price}</p>
              <p onClick={() => removeProduct(item._id)} className="text-center text-red-500 cursor-pointer hover:text-red-700 hover:scale-110 transition-all font-bold text-lg md:text-xl">X</p>
            </div>
          ))
        }
      </div>  
    </>
  )
}

export default List