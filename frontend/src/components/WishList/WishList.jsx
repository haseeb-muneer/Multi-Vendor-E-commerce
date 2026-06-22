import React from 'react'
import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx'
import styles from '../../styles/styles'
import {IoBagHandleOutline} from "react-icons/io5";
import {BsCartPlus} from "react-icons/bs";
import {Link} from "react-router-dom";
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlistItem } from '../../redux/actions/wishlist';
import { backend_url } from '../../server';
import { addToCartItem } from '../../redux/actions/cart';
function WishList({setOpenWishList}) {
   const {wishlist}=useSelector((state)=>state.wishlist);
    const dispatch=useDispatch();
     const removeFromWishlistHandler=(data)=>{
        console.log(`remove pressed`);
       dispatch(removeFromWishlistItem(data));
     }
     const addToCartHandler=(data)=>{
        const newData={...data , qty:1}
         dispatch(addToCartItem(newData));
         setOpenWishList(false);
     }
  return (
    <div className='fixed w-full top-0 left-0 bg-[#0000004b] h-screen z-10'>
    <div className='fixed top-0 right-0 w-[25%] bg-white min-h-full flex flex-col justify-between'>
        
     {wishlist && wishlist.length===0?(
        <div className="w-full h-screen flex items-center justify-center">
                   <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
                     <RxCross1
                       size={25}
                       className="cursor-pointer"
                       onClick={() => setOpenWishList(false)}
                     />
                   </div>
                   <h5>Wishlist is empty!</h5>
                 </div>
     ):(<>  
         <div>
            <div className='flex justify-end w-full pt-5 pr-5'>
                <RxCross1 size={25} className='cursor-pointer' onClick={()=>setOpenWishList(false)}/>
            </div>
            <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25}/>
                <h5 className='text-[20px] font-[500] pl-2'>{wishlist && wishlist.length}</h5>
            </div>
           {/* {single cart item} */}
           <br/>
           <div className='w-full border-t'>
            {
                wishlist && wishlist.map((i,index)=>(
                    <CartSingle data={i} key={index} removeFromWishlistHandler={removeFromWishlistHandler} addToCartHandler={addToCartHandler}/>
                ))
            }
           </div>
         </div> 
       
            </> )}  
        </div>
    </div>
  )
}
const CartSingle=({data , removeFromWishlistHandler , addToCartHandler})=>{
    const [value,setValue]=useState(1);
    const totalPrice=value*data.discountPrice;
    return (
        <div className='border-b p-4'>
            <div className='w-full flex items-center'>
                <RxCross1 className='cursor-pointer' onClick={()=>removeFromWishlistHandler(data)}/>
                <img src={`${backend_url}${data?.images[0]}`} alt='' className='w-[130px] h-min ml-2 mr-2 rounded-[5px]'/>
            
                
                <div className='pl-[5px]'>
                    <h1>{data.name}</h1>
                    
                    <h4 className='font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto'>
                        US${totalPrice}
                    </h4>
                </div>
                <div>
                    <BsCartPlus className="cursor-pointer" size={20} title="add to wishlist" onClick={()=>addToCartHandler(data)}/>
                </div>
                
            </div>

        </div>
    )
}

export default WishList