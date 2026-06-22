import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import ProductCardDetails from "../ProductCardDetails/ProductCardDetails";
import {
  AiOutlineStar,
  AiFillStar,
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineEye,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlistItem, removeFromWishlistItem } from "../../../redux/actions/wishlist";
import { toast } from "react-toastify";
import { addToCartItem } from "../../../redux/actions/cart";
import Ratings from "../../Product/Ratings";
function handleAddtoCart() {}
function ProductCard({ data , isEvent }) {
  const {wishlist}=useSelector((state)=>state.wishlist);
  const {cart}=useSelector((state)=>state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch=useDispatch();
  const addToWishListHandler=(data)=>{
    setClick(!click);
    dispatch(addToWishlistItem(data));
  }
  const removeFromWishListHandler=(data)=>{
      setClick(!click);
      dispatch(removeFromWishlistItem(data));
  }
  useEffect(()=>{
      if(wishlist && wishlist.find((i)=>i._id===data._id)){
        setClick(true);
      }else{
        setClick(false);
      }

  },[wishlist])
   const addToCartHandler=(id)=>{
      const isItemExist=cart && cart.find((i)=>i._id===id);
      if(isItemExist){
        toast.error("Item already in cart!");
      }else{
      if(data.stock < 1){
           toast.error("Product stock is limited!");
      }else{
         const cartData={...data , qty:1}
       dispatch(addToCartItem(cartData));
       toast.success("Item added to cart successfully");
      }
      }
    }
  return (
    <div className="w-full h-[370px] bg-white rounded-lg shadow-sm p-3 relative cursor-pointer">
      <div className="flex justify-end"></div>
      <Link to={isEvent===true? `/product/${data._id}?isEvent=true` : `/product/${data._id}` }>
        <img
          src={`${backend_url}${data.images && data.images[0]}`}
          alt=""
          className="w-full h-[170px] object-contain"
        />
      </Link>
      <Link to={`/shop/${data?.shop._id}`}>
        <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
      </Link>
      <Link to={isEvent===true? `/product/${data._id}?isEvent=true` : `/product/${data._id}` }>
        <h4>
          {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
        </h4>
        <div className="flex ">
          <Ratings rating={data?.ratings}/>
        </div>
      </Link>
      <div className="py-2 flex items-center justify-between">
        <div className="flex">
          <h5 className={`${styles.productDiscountPrice}`}>
            {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}
            $
          </h5>
          <h4 className={`${styles.price}`}>
            {data.originalPrice ? data.originalPrice + "$" : null}
          </h4>
        </div>
        <span className="text-[17px] font-[400] text-[#68d284]">
          {data?.sold_out} sold
        </span>
      </div>
      {/* {side options} */}
      <div>
        {click ? (
          <AiFillHeart
            size={22}
            onClick={() => removeFromWishListHandler(data)}
            className="absolute top-5 right-2"
            color={`${click ? "red" : "#333"}`}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            onClick={() => addToWishListHandler(data)}
            className="absolute top-5 right-2"
            color={`${click ? "red" : "#333"}`}
            title="Add to wishlist"
          />
        )}
        <AiOutlineEye
          size={22}
          onClick={() => setOpen(!open)}
          className="absolute top-14 right-2"
          color="#333"
          title="Quick view"
        />
        <AiOutlineShoppingCart
          size={25}
          onClick={()=>addToCartHandler(data._id)}
          className="absolute top-24 right-2"
          color="#444"
          title="Add to cart"
        />
        {open ? <ProductCardDetails data={data} setOpen={setOpen} /> : null}
      </div>
    </div>
  );
}

export default ProductCard;
