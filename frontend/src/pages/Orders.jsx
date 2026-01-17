import axios from 'axios';
import React from 'react';
import { toast } from 'react-toastify';
import Title from '../components/Title';
import { ShopContext } from '../context/ShopContext';

const Orders = () => {
  const {backendUrl, token, navigate, currency, products} = React.useContext(ShopContext);

  const [orderData, setOrderData]= React.useState([]);
  const [cancellingOrderId, setCancellingOrderId]= React.useState(null);

  const loadOrderData= async ()=>{
    try{
      if(!token) return null;

      const response= await axios.get(backendUrl + '/api/order/user',{
        headers: {Authorization: `Bearer ${token}`}
      });
      
      if(response.data.success){
        // console.log("Order data loaded", response.data.orders);
        setOrderData(response.data.orders.reverse());
      }else{
        toast.error(response.data.message);
      }
      
    }catch(error){
      console.error("Load orders error:", error);
      toast.error("Failed to load orders");
    }
  }

  React.useEffect(()=>{
    loadOrderData();
  },[token])
    
  const handleCancelOrder= async (orderId)=>{
    try{
      const confirmCancel= window.confirm("Are you sure you want to cancel this order?");
      if(!confirmCancel) return;

      setCancellingOrderId(orderId);

      const response= await axios.post(backendUrl + '/api/order/cancel', { orderId },{
        headers: { Authorization: `Bearer ${token}` }
      });

      if(response.data.success){
        toast.success("Order cancelled successfully");
        loadOrderData();
      } else {
        toast.error(response.data.message);
      }
    }catch(error){
      console.error("Cancel order error:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingOrderId(null);
    }
  }

  const handleViewInvoice= (orderId)=>{
    navigate(`/invoice/${orderId}`);
  }
  return (


    <div className="border-t pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8">


      <div className="text-2xl mb-8">


        <Title text1={'MY'} text2={'ORDERS'}/>
        <p className="text-gray-600 text-sm mt-2">Track and manage all your orders in one place</p>


      </div>


      <div className="space-y-6 max-w-6xl mx-auto">


        {
          orderData.map((order, index)=>{
            return (


              <div key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">


                {/* Order Header */}
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order ID</p>
                        <p className="font-mono text-sm font-medium text-gray-900">#{order._id}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Order Date</p>
                        <p className="text-sm text-gray-700">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                      <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                        <p className="text-sm font-semibold text-gray-900">{currency}{order.amount}</p>
                      </div>
                    </div>
                    


                    {/* ✅ UPDATED: Added color badges for all status types */}
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'Out for Delivery'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'Packing'
                          ? 'bg-orange-100 text-orange-800'
                          : order.status === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          order.status === 'Delivered' 
                            ? 'bg-green-500' 
                            : order.status === 'Shipped'
                            ? 'bg-blue-500'
                            : order.status === 'Out for Delivery'
                            ? 'bg-purple-500'
                            : order.status === 'Packing'
                            ? 'bg-orange-500'
                            : order.status === 'Cancelled'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}></span>
                        {order.status}
                      </span>
                    </div>


                  </div>
                </div>


                {/* Order Items */}
                <div className="divide-y divide-gray-100">


                {order.items && order.items.map((item, itemIndex)=>{
                  const product= products.find(prod=> prod._id === item._id);
                  
                  if(!product) return null;

                  return (


                    <div key={itemIndex} className="p-6 hover:bg-gray-50 transition-colors duration-200">


                      <div className="flex flex-col md:flex-row gap-6">


                        {/* Product Image & Info */}
                        <div className="flex gap-4 flex-1">


                          <div className="relative flex-shrink-0">
                            <img className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm" src={product.image[0]} alt={product.name} />
                            <div className="absolute -top-2 -right-2 bg-gray-900 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {item.quantity}
                            </div>
                          </div>


                          <div className="flex-1 min-w-0">


                            <h3 className="font-medium text-gray-900 mb-2">{product.name}</h3>


                            <div className="flex flex-wrap gap-3 text-sm mb-3">
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">Price:</span>
                                <span className="font-semibold text-gray-900">{currency}{product.price}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">Qty:</span>
                                <span className="font-medium text-gray-900">{item.quantity}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-gray-500">Size:</span>
                                <span className="font-medium text-gray-900 uppercase">{item.size}</span>
                              </div>
                            </div>


                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>💳</span>
                              <span>{order.paymentMethod}</span>
                              {order.payment && (
                                <>
                                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                                  <span className="text-green-600 font-medium">Paid</span>
                                </>
                              )}
                            </div>


                          </div>
                        </div>


                        {/* Action Button */}
                        <div className="flex md:flex-col md:justify-center md:items-end">


                          <button onClick={loadOrderData} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-gray-900 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-900 hover:text-white transition-all duration-200">
                            Track Order
                          </button>


                        </div>
                      </div>
                    </div>


                  )
                })}


                </div>


                {/* Order Footer */}
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
                    <div className="text-gray-600">
                      Need help? <a href="#" className="text-gray-900 font-medium hover:underline">Contact Support</a>
                    </div>
                    <div className="flex gap-3">


                      <button onClick= {()=> handleViewInvoice(order._id)} className="text-gray-700 hover:text-gray-900 font-medium">View Invoice</button>


                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && order.status !== 'Shipped' && (
                        <>
                          <span className="text-gray-300">•</span>
                          <button 
                            onClick={() => handleCancelOrder(order._id)}
                            disabled={cancellingOrderId === order._id}
                            className="text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
                          >
                            {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                        </>
                      )}


                    </div>
                  </div>
                </div>


              </div>


            )
          })
        }


      </div>
    </div>
  )
}

export default Orders