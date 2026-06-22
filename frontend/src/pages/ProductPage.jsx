import React, { useEffect , useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Header from '../components/Layout/Header';
import styles from '../styles/styles';
import ProductCard from '../components/Route/ProductCard/ProductCard';
import Footer from '../components/Layout/Footer';
import { useSelector } from 'react-redux';
function ProductPage() {
    const {allProducts}=useSelector((state)=>state.products);
    const [searchParams]=useSearchParams();
    const categoryData=searchParams.get("category");
    const [data,setData]=useState([]);
    useEffect(()=>{
        if(categoryData===null){
            const d=allProducts;
            setData(d);
        }else{
            const d=allProducts && allProducts.filter((i,index)=>i.category===categoryData);
            setData(d);
        }
    },[allProducts])
  return (
    <div>
        <Header activeHeading={3}/>
        <br/>
        <br/>
        <div className={`${styles.section}`}>
            <div className='grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12'>
                 {data && data.map((i,index)=>(
                    <ProductCard data={i} key={index}/>
                 ))}
            </div>
            <div>
                {data?.length===0 ?(
                    <h1 className='w-full text-center text-[20px] pb-[100]px'>No products Found!</h1>
                ):null}
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default ProductPage