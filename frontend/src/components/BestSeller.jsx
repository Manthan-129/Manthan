import React from 'react'
import {ShopContext} from '../context/ShopContext'
import Title from './Title'
import ProductItems from './ProductItems'

const BestSeller = () => {
    const {products}= React.useContext(ShopContext);
    const [bestSeller, setBestSeller]= React.useState([]);

    React.useEffect(()=>{
        const bestProduct= products.filter((item)=> item.bestseller);
        console.log('Best Products:', bestProduct); 
        setBestSeller(bestProduct.slice(0,5));
    },[products])
  return (
    <div className="my-10">
        <div className="text-center py-8 text-3xl">
            <Title text1={'BEST'} text2={'SELLERS'}/>
            <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
                Discover our most loved products, handpicked by customers like you. These bestsellers are flying off the shelves for good reason!
            </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {
                bestSeller.map((item, index)=>(
                    <ProductItems key={index} id={item._id} image={item.image} name={item.name} price={item.price} />
                ))
            }
        </div>
    </div>
  )
}

export default BestSeller