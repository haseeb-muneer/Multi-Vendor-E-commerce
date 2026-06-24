import React from 'react' 
import { useState } from 'react';
import { RxCross1 } from 'react-icons/rx'
import styles from '../../styles/styles'
import {IoBagHandleOutline} from "react-icons/io5";
import {HiPlus , HiOutlineMinus} from "react-icons/hi";
import {Link} from "react-router-dom";
import { getImageUrl } from '../../utils/imageUrl';
import { useDispatch, useSelector } from 'react-redux';
import {addToCartItem, removeFromCartItem} from "../../redux/actions/cart";
import { toast } from 'react-toastify';
function Cart({setOpenCart}) {
 const {cart}=useSelector((state)=>state.cart);
 const dispatch=useDispatch();

 const removeFromCartHandler=(data)=>{
    console.log(`remove pressed`);
   dispatch(removeFromCartItem(data));
 }
 const totalPrice=cart.reduce((acc,item)=>
    acc+item.qty * item.discountPrice,0
)
const qtyChangeHandler=(data)=>{
  dispatch(addToCartItem(data));
}
  return (
    <div className='fixed w-full top-0 left-0 bg-[#0000004b] h-screen z-10'>
   <div className="
  fixed
  top-0
  right-0
  h-screen
  bg-white
  flex
  flex-col
  justify-between
  shadow-lg
  w-full
  sm:w-[80%]
  md:w-[50%]
  lg:w-[35%]
  xl:w-[25%]
">
       {cart && cart.length===0 ? (
    <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5>Cart Items is empty!</h5>
          </div>
       ):(
        <>
         <div>
            <div className='flex justify-end w-full pt-5 pr-5'>
                <RxCross1 size={25} className='cursor-pointer' onClick={()=>setOpenCart(false)}/>
            </div>
            <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25}/>
                <h5 className='text-[20px] font-[500] pl-2'>{cart && cart.length} items</h5>
            </div>
           {/* {single cart item} */}
           <br/>
           <div className='w-full border-t overflow-y-auto flex-1'>
            {
                cart && cart.map((i,index)=>(
                    <CartSingle data={i} key={index} qtyChangeHandler={qtyChangeHandler}  removeFromCartHandler={removeFromCartHandler} />
                ))
            }
           </div>
         </div> 
         <div className='px-5 mb-3'>
            <Link to="/checkout">
           <div className='h-[50px] w-full flex items-center justify-center bg-[#e44343] rounded-[5px]'>
              <h1 className='text-white text-sm sm:text-base md:text-lg font-[600] text-center px-2'>Checkout Now (USD${totalPrice})
              </h1>
            </div>
            </Link>
            </div>   </>
       )}
        </div>
    </div>
  )
}
const CartSingle=({data , removeFromCartHandler , qtyChangeHandler})=>{
    const [value,setValue]=useState(data.qty);
    const totalPrice=value*data.discountPrice;
    const increment=(data)=>{
       if(data.stock<value){
        toast.error("Item Stock limited!");
       }else{
         setValue(value+1);
        const updatedCartData={...data , qty:value+1};
        qtyChangeHandler(updatedCartData);
       }
    }
    const decrement=(data)=>{
        setValue(value===1?1:value-1);
        const updatedCartData={...data , qty:value===1?1:value-1};
        qtyChangeHandler(updatedCartData);
    }
    return (
        <div className='border-b p-4'>
            <div className='w-full flex items-start gap-3'>
              
                 <div className='flex flex-col items-center min-w-[30px]' >
                    <div className={`${styles.noramlFlex} bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] justify-center cursor-pointer`} onClick={()=>increment(data)}>
                       <HiPlus size={18} color="#fff" />
                    </div>
                    <span className='pl-[10px]'>{value}</span>
                    <div className='bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer' onClick={()=>decrement(data)}>
                      <HiOutlineMinus size={16} color="#7d879c"/>
                    </div>
                </div>
                <img src={getImageUrl(data?.images?.[0])} alt='' className='w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] object-cover rounded-[5px]'/>
                <div className='flex-1 min-w-0'>
                    <h1 className='text-sm sm:text-base font-medium break-words'>{data.name}</h1>
                    <h4 className='font-[400] text-[15px] text-[#00000082]'>${data.discountPrice} * {value}</h4>
                    <h4 className='font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto'>
                        US${totalPrice}
                    </h4>
                </div>
               <RxCross1
  size={18}
  className='cursor-pointer flex-shrink-0 mt-1'
  onClick={() => removeFromCartHandler(data)}
/>
                 
            </div>

        </div>
    )
}

export default Cart
