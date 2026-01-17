import axios from 'axios';
import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const Invoice = () => {
  const { orderId } = useParams();
  const { backendUrl, token, currency, products } = React.useContext(ShopContext);

  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const loadOrderData = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/order/${orderId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Load order error:", error);
      toast.error("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (token && orderId) {
      loadOrderData();
    }
  }, [token, orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (!order) {
    return <div className="flex justify-center items-center min-h-screen">Order not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white my-8 shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
          <p className="text-gray-600">Order #{order._id}</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">Your Store Name</h2>
          <p className="text-gray-600">123 Business St</p>
          <p className="text-gray-600">City, State 12345</p>
          <p className="text-gray-600">contact@store.com</p>
        </div>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Bill To:</h3>
          <p className="text-gray-700">{order.address.firstName} {order.address.lastName}</p>
          <p className="text-gray-700">{order.address.street}</p>
          <p className="text-gray-700">{order.address.city}, {order.address.state} {order.address.zipcode}</p>
          <p className="text-gray-700">{order.address.country}</p>
          <p className="text-gray-700">{order.address.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-700"><span className="font-semibold">Date:</span> {new Date(order.date).toLocaleDateString()}</p>
          <p className="text-gray-700"><span className="font-semibold">Payment Method:</span> {order.paymentMethod}</p>
          <p className="text-gray-700"><span className="font-semibold">Status:</span> <span className={`${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</span></p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full mb-8">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-3 font-semibold">Item</th>
            <th className="text-center p-3 font-semibold">Size</th>
            <th className="text-center p-3 font-semibold">Quantity</th>
            <th className="text-right p-3 font-semibold">Price</th>
            <th className="text-right p-3 font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {order.items.map((item, index) => {
            const product = products.find(p => p._id === item._id);
            if (!product) return null;

            return (
              <tr key={index}>
                <td className="p-3">{product.name}</td>
                <td className="p-3 text-center uppercase">{item.size}</td>
                <td className="p-3 text-center">{item.quantity}</td>
                <td className="p-3 text-right">{currency}{product.price}</td>
                <td className="p-3 text-right">{currency}{product.price * item.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Total */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-t">
            <span className="font-semibold">Subtotal:</span>
            <span>{currency}{order.amount}</span>
          </div>
          <div className="flex justify-between py-2 border-t-2 border-gray-900">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-lg">{currency}{order.amount}</span>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="flex justify-center gap-4 print:hidden">
        <button
          onClick={handlePrint}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
        >
          Print Invoice
        </button>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Orders
        </button>
      </div>
    </div>
  );
};

export default Invoice;