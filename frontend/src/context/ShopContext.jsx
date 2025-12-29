import React from 'react';
import {products} from '../assets/assets'
import { toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

export const ShopContext = React.createContext();

export const ShopContextProvider= (props)=>{
    const currency= '$';
    const delivery_fee= 10;
    
    const [search,setSearch]= React.useState('');
    const [showSearch, setShowSearch]= React.useState(false);
    const [cartItems, setCartItems]= React.useState([]);
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
    const value= {
        products, currency, delivery_fee,
        search, setSearch,
        showSearch, setShowSearch,
        cartItems, setCartItems, addToCart, 
        getCartCount,
        updateQuantity,
        getCartAmount,
        navigate
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}