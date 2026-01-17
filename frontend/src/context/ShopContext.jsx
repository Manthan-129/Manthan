import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

export const ShopContext = React.createContext();

export const ShopContextProvider= (props)=>{
    const currency= '$';
    const delivery_fee= 10;
    
    const backendUrl= import.meta.env.VITE_BACKEND_URL;

    const [search,setSearch]= React.useState('');
    const [showSearch, setShowSearch]= React.useState(false);
    const [cartItems, setCartItems]= React.useState([]);
    const [products, setProducts]= React.useState([]);
    const [token, setToken]= React.useState("");
    const navigate= useNavigate();

    const addToCart= async (itemId, size)=>{

        if(!size){
            toast.error('Please select a size before adding to cart');
            return;
        }

        let cartData= structuredClone(cartItems);   

        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size]+= 1;
            } else {
                cartData[itemId][size]= 1;
            }
        }else {
            cartData[itemId]= {};
            cartData[itemId][size]= 1;
        }
        setCartItems(cartData);

        if(token){
            try{
                const response= await axios.post(backendUrl + '/api/cart/add',{ itemId, size },{
                    headers: { Authorization: `Bearer ${token}` }
                });
                if(response.data.success){
                    console.log("Item added to cart on server");
                    toast.success("Item added to cart");
                }else{
                    toast.error(response.data.message);
                }
            }catch(error){
                console.error("Add to cart error:", error.message);
                toast.error("Failed to add item to cart. Please try again.");
            }
        }
    }

    const getCartCount= ()=>{

        let totalCount =0;
        for(let items in cartItems){
            for(let item in cartItems[items]){
                try{
                    if(cartItems[items][item] > 0){
                        totalCount += cartItems[items][item];
                    }
                }catch(error){

                }
            }
        }
        return totalCount;
    }

    const updateQuantity= async (itemId, size, quantity)=>{
        let cartData= structuredClone(cartItems);
        cartData[itemId][size]= quantity;
        setCartItems(cartData);

        if(token){
            try{
                const response= await axios.post(backendUrl + '/api/cart/update',{itemId, size, quantity},{
                    headers: {Authorization: `Bearer ${token}`}
                })
                if(response.data.success){
                    console.log("Cart updated on server");
                    toast.success("Cart updated");
                }else{
                    toast.error(response.data.message);
                }
            }catch(error){
                console.error("Update cart error:", error.message);
                toast.error("Failed to update cart. Please try again.");
            }
        }
    }

    const getUserCart= async ()=>{
        try{
            const response= await axios.get(backendUrl + '/api/cart/get',{
                headers: {Authorization: `Bearer ${token}`}
            });
            if(response.data.success){
                setCartItems(response.data.cartData);
            }else{
                toast.error(response.data.message);
            }
        }catch(error){
            console.error("Get cart error:", error.message);
            toast.error("Failed to retrieve cart. Please try again.");
        }
    }

    const getCartAmount = ()=>{
        let totalAmount= 0;
        for(let items in cartItems){
            const product= products.find((prod)=> prod._id === items);
            if(!product) continue;
            for(let item in cartItems[items]){
                if(cartItems[items][item]<=0) continue;
                totalAmount+= product.price * cartItems[items][item];
            }
        }
        return totalAmount;
    }

    const getProductsData = async ()=>{
    try{
        const response= await axios.get(backendUrl + '/api/product/list');
        if(response.data.success){
            setProducts(response.data.products);
        }else{
            toast.error(response.data.message);
        }       
    }catch(error){
        console.error('Full error:', error.message);
        toast.error("Failed to load products. Check console for details.");
    }
}

    React.useEffect(()=>{
        getProductsData();
    },[])

    React.useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
        }
    },[])

    React.useEffect(()=>{
        if(token){
            getUserCart();
        }
    },[token])

    const value= {
        products, currency, delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate,
        backendUrl,
        token , setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}