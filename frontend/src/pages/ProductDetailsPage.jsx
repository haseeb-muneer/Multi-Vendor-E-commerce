import React from 'react'
import Header from '../components/Layout/Header'
import Footer from '../components/Layout/Footer'
import ProductDetail from "../components/Product/ProductDetail"
import SuggestedProduct from "../components/Product/SuggestedProduct";
import { useState , useEffect } from 'react'
import { productData } from '../static/data'
import { useParams , useSearchParams } from 'react-router-dom'
import { useSelector , useDispatch } from 'react-redux';
import { getAllProductShop } from '../redux/actions/product';
function ProductDetailsPage() {
const { allProducts } = useSelector((state) => state.products);
const { allEvents } = useSelector((state) => state.events);
const [searchParams] = useSearchParams();
  const eventData = searchParams.get("isEvent");
// console.log(`prodducts included ${products}`);
// console.log(products);
    const [data,setData]=useState(null);
        const {id}=useParams();
        // const productName=name.replace(/-/g," ");
       useEffect(() => {
    if (eventData!==null) {
        const data=allEvents?.find((i)=>i._id===id);
        setData(data);
    }else{
      const data = allProducts?.find((i) => i._id===id);
        
        setData(data);
    }
}, [ allProducts , allEvents , data]);
  return (
    <div>
    <Header/>
    <ProductDetail data={data}/>
    { !eventData  && 
      <>
      {data && <SuggestedProduct data={data}/>}
      </>}
    <Footer/>
  </div>
  )
}

export default ProductDetailsPage