import React from 'react';
import {products} from '../assets/assets'

export const ShopContext = React.createContext();

export const ShopContextProvider= (props)=>{
    const currency= '$';
    const deliver_fee= 10;
    const value= {
        products, currency, deliver_fee

    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}