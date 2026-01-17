import React from 'react'
import axios from 'axios';
import { backendUrl } from '../App.jsx';
import { toast } from 'react-toastify';
import {assets} from '../assets/assets'
import { currency } from '../App.jsx';  

const Orders = ({token}) => {

  const [orders, setOrders]= React.useState([]);

  const fetchOrders= async ()=>{
    if(!token) return null;
    try{
      const response= await axios.get(backendUrl + '/api/order/list', {
        headers: {Authorization: `Bearer ${token}`}
      })
      
      if(response.data.success){
        console.log(orders);
        setOrders(response.data.orders.reverse());
      }else{
        toast.error(response.data.message);
      }
    }catch(error){
      console.error("Fetch orders error:", error.message);
      toast.error("Failed to fetch orders. Please try again.");
    }
  }

  React.useEffect(()=>{
    fetchOrders();
  },[token])

  const handleStatusChange= async (e, orderId)=>{
    try{
      const status= e.target.value;
      const response= await axios.post(backendUrl + '/api/order/status',{orderId, status},{
        headers: {Authorization: `Bearer ${token}`}
      })

      if(response.data.success){
        toast.success("Order status updated successfully");
        await fetchOrders();
      }else{
        toast.error(response.data.message);
      }
    }catch(error){
      toast.error("Failed to update order status. Please try again.");
      console.log("Update order status error:", error.message);
    }
  }
  return (


    <div className="p-6 sm:p-10 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen antialiased">


        <h3 className="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Order Management</h3>


        <div className="space-y-6 max-w-7xl">


          {
            orders.map((order, index)=>(


              <div key={index} className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border-l-[6px] ${
                order.status === 'Cancelled' 
                  ? 'border-red-500 bg-red-50' 
                  : order.status === 'Delivered'
                  ? 'border-green-500'
                  : order.status === 'Shipped' || order.status === 'Out for Delivery'
                  ? 'border-blue-500'
                  : 'border-yellow-500'
              }`}>


                <div className="p-8">


                  <div className="flex items-start gap-8">


                    <img src={assets.parcel_icon} alt="parcel icon" className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0" />


                    <div className="flex-1 min-w-0">


                      {/* ✅ Show cancelled badge */}
                      {order.status === 'Cancelled' && (
                        <div className="bg-red-600 text-white px-5 py-2 rounded-full text-sm font-bold inline-flex items-center gap-2 mb-4 shadow-md">
                          <span className="text-lg">⚠️</span>
                          <span className="tracking-wide">CANCELLED</span>
                        </div>
                      )}


                      <div className="mb-6">


                        <h4 className="font-bold text-gray-900 mb-3 text-base tracking-wide">ORDER ITEMS:</h4>
                        <div className="space-y-2">


                          {
                            order.items.map((item, idx)=>{
                              if(idx == order.items.length - 1){
                                return <p key={idx} className="text-base text-gray-800 leading-relaxed font-medium"> {item.name} x {item.quantity} <span className="text-gray-600 text-sm uppercase ml-2 font-semibold bg-gray-100 px-2 py-0.5 rounded">{item.size}</span></p>
                              }else{
                                return <p key={idx} className="text-base text-gray-800 leading-relaxed font-medium"> {item.name} x {item.quantity} <span className="text-gray-600 text-sm uppercase ml-2 font-semibold bg-gray-100 px-2 py-0.5 rounded">{item.size}</span></p>
                              }
                            })
                          }


                        </div>
                      </div>


                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-200">


                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Customer Details</h4>
                          <p className="text-base font-bold text-gray-900 mb-2">{order.address.firstName + " " + order.address.lastName}</p>


                          <div className="mt-2 text-base text-gray-700 leading-relaxed">


                            <p className="font-medium">{order.address.street}</p>
                            <p className="font-medium">{order.address.city}, {order.address.state}</p>
                            <p className="font-medium">{order.address.country}, {order.address.zipcode}</p>


                          </div>


                          <p className="mt-3 text-base text-gray-900 font-bold flex items-center gap-2">
                            <span className="text-xl">📞</span>
                            <span>{order.address.phone}</span>
                          </p>


                        </div>


                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wider">Order Details</h4>


                          <div className="space-y-2 text-base">


                            <p className="text-gray-800 leading-relaxed"><span className="font-bold text-gray-900">Items:</span> <span className="font-semibold">{order.items.length}</span></p>
                            <p className="text-gray-800 leading-relaxed"><span className="font-bold text-gray-900">Method:</span> <span className="font-semibold">{order.paymentMethod}</span></p>
                            <p className="text-gray-800 leading-relaxed"><span className="font-bold text-gray-900">Payment:</span> <span className={`font-bold ${order.payment ? 'text-green-600' : 'text-orange-600'}`}>{ order.payment ? 'Done ✓' : 'Pending'}</span></p>
                            <p className="text-gray-800 leading-relaxed"><span className="font-bold text-gray-900">Date:</span> <span className="font-semibold">{new Date(order.date).toLocaleString()}</span></p>


                          </div>
                        </div>


                      </div>
                    </div>


                    <div className="flex flex-col items-end gap-4 flex-shrink-0">


                      <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{currency}{order.amount}</p>


                      <select 
                        onChange={(e)=> handleStatusChange(e, order._id)} 
                        value={order.status}
                        disabled={order.status === 'Cancelled'}
                        className={`px-5 py-3 rounded-xl border-2 font-bold text-base transition-all duration-200 shadow-sm min-w-[200px] ${
                          order.status === 'Cancelled'
                            ? 'bg-red-100 text-red-900 border-red-400 cursor-not-allowed opacity-80'
                            : order.status === 'Delivered'
                            ? 'bg-green-100 text-green-900 border-green-400 hover:border-green-500 hover:shadow-md cursor-pointer'
                            : order.status === 'Shipped' || order.status === 'Out for Delivery'
                            ? 'bg-blue-100 text-blue-900 border-blue-400 hover:border-blue-500 hover:shadow-md cursor-pointer'
                            : 'bg-yellow-100 text-yellow-900 border-yellow-400 hover:border-yellow-500 hover:shadow-md cursor-pointer'
                        }`}
                      >


                        <option value="Order Placed">Order Placed</option>
                        <option value="Packing">Packing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>


                      </select>


                      {/* ✅ Show cancellation note */}
                      {order.status === 'Cancelled' && (
                        <p className="text-red-700 text-sm font-bold italic max-w-[220px] text-right leading-relaxed bg-red-100 px-3 py-2 rounded-lg border border-red-300">
                          ⚠️ This order was cancelled by the customer
                        </p>
                      )}


                    </div>
                  </div>
                </div>


              </div>


            ))
          }


        </div>
    </div>
  )
}

export default Orders