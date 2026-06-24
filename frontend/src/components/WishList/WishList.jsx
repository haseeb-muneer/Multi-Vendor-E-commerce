import React from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlistItem } from "../../redux/actions/wishlist";
import { addToCartItem } from "../../redux/actions/cart";
import { getImageUrl } from "../../utils/imageUrl";

function WishList({ setOpenWishList }) {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlistItem(data));
  };

  const addToCartHandler = (data) => {
    const newData = {
      ...data,
      qty: 1,
    };

    dispatch(addToCartItem(newData));
    setOpenWishList(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0000004b] z-[9999]">
      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          bg-white
          shadow-xl
          flex
          flex-col
          w-full
          sm:w-[85%]
          md:w-[60%]
          lg:w-[40%]
          xl:w-[28%]
        "
      >
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center relative">
            <RxCross1
              size={25}
              className="cursor-pointer absolute top-5 right-5"
              onClick={() => setOpenWishList(false)}
            />

            <AiOutlineHeart size={60} className="text-gray-300 mb-4" />

            <h5 className="text-lg font-medium text-gray-600">
              Wishlist is empty!
            </h5>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b z-10">
              <div className="flex justify-end p-4">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishList(false)}
                />
              </div>

              <div className={`${styles.noramlFlex} px-4 pb-4`}>
                <AiOutlineHeart size={24} />

                <h5 className="text-lg sm:text-xl font-semibold pl-2">
                  {wishlist?.length} Item
                  {wishlist?.length > 1 ? "s" : ""}
                </h5>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto">
              {wishlist &&
                wishlist.map((item, index) => (
                  <WishlistSingle
                    key={index}
                    data={item}
                    removeFromWishlistHandler={
                      removeFromWishlistHandler
                    }
                    addToCartHandler={addToCartHandler}
                  />
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const WishlistSingle = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
}) => {
  return (
    <div className="border-b p-3 sm:p-4">
      <div className="flex items-start gap-3">
        {/* Remove Button */}
        <button
          className="flex-shrink-0 mt-1"
          onClick={() => removeFromWishlistHandler(data)}
        >
          <RxCross1
            size={18}
            className="cursor-pointer text-gray-500 hover:text-red-500"
          />
        </button>

        {/* Product Image */}
        <img
          src={getImageUrl(data?.images?.[0])}
          alt={data?.name}
          className="
            w-[80px]
            h-[80px]
            sm:w-[95px]
            sm:h-[95px]
            object-cover
            rounded-md
            border
            flex-shrink-0
          "
        />

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-medium text-gray-800 line-clamp-2">
            {data?.name}
          </h1>

          <h4 className="font-semibold text-red-600 text-base sm:text-lg mt-2">
            USD ${data?.discountPrice}
          </h4>
        </div>

        {/* Add To Cart */}
        <button
          className="
            flex-shrink-0
            p-2
            rounded-full
            hover:bg-gray-100
            transition
          "
          onClick={() => addToCartHandler(data)}
          title="Add to Cart"
        >
          <BsCartPlus
            size={22}
            className="cursor-pointer text-[#444]"
          />
        </button>
      </div>
    </div>
  );
};

export default WishList;
