import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { getImageUrl } from "../../utils/imageUrl";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductShop } from "../../redux/actions/product";
import { addToCartItem } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import { server } from "../../server";
import {
  addToWishlistItem,
  removeFromWishlistItem,
} from "../../redux/actions/wishlist";
import Ratings from "./Ratings";
import axios from "axios";
function ProductDetail({ data }) {
  console.log(data);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const [active, setActive] = useState(1);
  const { products } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const TotalproductReviewLengthofShop =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);
  // each product -> all review of each product -> ratings of each review of that product
  const TotalRatingofShop =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0,
    );
  const avgRatingofShop =
    TotalRatingofShop / TotalproductReviewLengthofShop || 0;
  useEffect(() => {
    if (data) {
      dispatch(getAllProductShop(data && data.shop._id));
      if (wishlist && wishlist.find((i) => i._id === data._id)) {
        setClick(true);
      } else {
        setClick(false);
      }
    }
  }, [wishlist, data]);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const incrementCount = () => {
    setCount(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const handleSubmitMessage = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const addToCartHandler = (id) => {
    const isItemExist = cart && cart.find((i) => i._id === id);
    if (isItemExist) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("Product stock is limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCartItem(cartData));
        toast.success("Item added to cart successfully");
      }
    }
  };

  const addToWishListHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlistItem(data));
  };
  const removeFromWishListHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlistItem(data));
  };

  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={getImageUrl(data.images?.[select])}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        className={`${select === 0 ? "border" : ""} cursor-pointer`}
                      >
                        <img
                          src={getImageUrl(i)}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                  <div
                    className={`${select === 1 ? "border" : "null"} cursor-pointer`}
                  ></div>
                </div>
              </div>
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + "$" : null}
                  </h3>
                </div>
                <div className="flex pr-3 mt-12 items-center justify-between">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        onClick={() => removeFromWishListHandler(data)}
                        className="cursor-pointer"
                        color={`${click ? "red" : "#333"}`}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        onClick={() => addToWishListHandler(data)}
                        className="cursor-pointer"
                        color={`${click ? "red" : "#333"}`}
                        title="Add to wishlist"
                      />
                    )}
                  </div>
                </div>
                <div
                  onClick={() => addToCartHandler(data._id)}
                  className={`${styles.button} !mt-6 !h-11 !rounded flex items-center`}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShoppingCart className="ml-1" />
                  </span>
                </div>
                <div className="flex items-center pb-8">
                  <Link to={`/shop/${data.shop._id}`}>
                    <img
                      src={getImageUrl(data?.shop?.avatar)}
                      alt=""
                      className="h-[50px] w-[50px] mr-2 rounded-full"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/${data.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({avgRatingofShop}/5) Ratings
                    </h5>
                  </div>
                  <div
                    onClick={handleSubmitMessage}
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ProductDetailInfo
            data={data}
            products={products}
            TotalproductReviewLengthofShop={TotalproductReviewLengthofShop}
            avgRatingofShop={avgRatingofShop}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
}

const ProductDetailInfo = ({
  data,
  products,
  TotalproductReviewLengthofShop,
  avgRatingofShop,
}) => {
  const [active, setActive] = useState(1);
  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 rounded ">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            onClick={() => setActive(1)}
            className="text-[18px] text-[#000] px-1 leading-5 font-[600] cursor-pointer 800px:font-[20px]"
          >
            Product Details
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            onClick={() => setActive(2)}
            className="text-[18px] text-[#000] px-1 leading-5 font-[600] cursor-pointer 800px:font-[20px]"
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
        <div className="relative">
          <h5
            onClick={() => setActive(3)}
            className="text-[18px] text-[#000] px-1 leading-5 font-[600] cursor-pointer 800px:font-[20px]"
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`} />
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews?.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={getImageUrl(item.user.avatar)}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.fullName}</h1>
                    <Ratings rating={data?.ratings} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews?.length === 0 && (
              <h5>No Reviews have for this product!</h5>
            )}
          </div>
        </div>
      ) : null}
      {active === 3 && (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/${data && data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={getImageUrl(data?.shop?.avatar)}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-3 text-[15px]">
                    ({avgRatingofShop}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>
          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on{" "}
                <span className="font-[500]">{data.shop.createdAt}</span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Products{" "}
                <span className="font-[500]">
                  {products && products.length}
                </span>
              </h5>
              <h5 className="font-[600] pt-3">
                Total Reviews{" "}
                <span className="font-[500]">
                  {TotalproductReviewLengthofShop}
                </span>
              </h5>
              <Link to={`/shop/${data.shop._id}`}>
                <div
                  className={`${styles.button} !rounded-[4px] mt-3 !h-[39.5px]`}
                >
                  <h4 className="text-white">Visit Shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;

