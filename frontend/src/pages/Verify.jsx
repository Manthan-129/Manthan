import React from 'react'
import {ShopContext} from '../context/ShopContext'
import axios from 'axios';
import {toast} from 'react-toastify';
import { useSearchParams } from 'react-router-dom';

const Verify = () => {
    const { navigate, token, setCartItems, backendUrl }= React.useContext(ShopContext);
    const [searchParams]= useSearchParams();
    const [isVerifying, setIsVerifying]= React.useState(true);

    const success = searchParams.get('success');
    const orderId = searchParams.get('orderId');

    const verifyPayment= React.useCallback(async ()=>{
        if(!token) {
            navigate('/login');
            return;
        }

        if(!success || !orderId) {
            toast.error("Invalid payment parameters");
            navigate('/cart');
            return;
        }

        try{
            setIsVerifying(true);
            const response= await axios.post(backendUrl + '/api/order/verifyStripe',{success, orderId},{
                headers: {Authorization: `Bearer ${token}`}
            })
            if(response.data.success){
                toast.success(response.data.message);
                setCartItems({});
                navigate('/orders');
            }else{
                toast.error(response.data.message);
                navigate('/cart');
            }
        }catch(error){
            console.log("Verify Payment Error: ", error.message);
            toast.error("An error occurred while verifying payment.");
            navigate('/cart');
        }finally{
            setIsVerifying(false);
        }
    }, [token, success, orderId, backendUrl, navigate, setCartItems])

    React.useEffect(()=>{
        verifyPayment();
    },[verifyPayment])

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                {isVerifying ? (
                    <>
                        <div className="w-16 h-16 border-4 border-gray-300 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-lg text-gray-600">Verifying your payment...</p>
                    </>
                ) : (
                    <p className="text-lg text-gray-600">Processing...</p>
                )}
            </div>
        </div>
    )
}

export default Verify