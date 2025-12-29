import React from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItems from './ProductItems';

const RelatedProducts = ({category, subCategory}) => {
    const [related, setRelated]= React.useState([]);
    const {products}= React.useContext(ShopContext);

    React.useEffect(()=>{
        if (!products || products.length === 0) return;

        let updateProduct = [...products];
        updateProduct= updateProduct.filter((item)=> item.category === category);
        updateProduct= updateProduct.filter((item)=> item.subCategory === subCategory);
        console.log('Related Products:', updateProduct.slice(0,4));
        setRelated(updateProduct.slice(0,4));
    }, [products, category, subCategory])

  return (
    <div className="my-24">
        <div className="text-center text-3xl py-2">
            <Title text1={'RELATED'} text2={'PRODUCTS'}></Title>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
            {
                related.map((item, index)=>(
                    <ProductItems key={index} id={item._id} image={item.image} name={item.name} price={item.price} />    
                ))
            }
        </div>
    </div>
  )
}

export default RelatedProducts