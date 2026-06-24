import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { AiOutlineHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
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
    const newData = { ...data, qty: 1 };
    dispatch(addToCartItem(newData));
    setOpenWishList(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0000004b] z-50">
      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          bg-white
          flex
          flex-col
          shadow-lg
          w-full
          sm:w-[80%]
          md:w-[55%]
          lg:w-[40%]
          xl:w-[25%]
        "
      >
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenWishList(false)}
              />
            </div>

            <h5 className="text-lg font-medium">
              Wishlist is empty!
            </h5>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex justify-end w-full pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishList(false)}
                />
              </div>

              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="text-[18px] sm:text-[20px] font-[500] pl-2">
                  {wishlist && wishlist.length} Items
                </h5>
              </div>

              <div className="w-full border-t overflow-y-auto flex-1">
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
  const [value] = useState(1);

  const totalPrice = value * data.discountPrice;

  return (
    <div className="border-b p-3 sm:p-4">
      <div className="w-full flex items-start gap-3">
        <RxCross1
          size={18}
          className="cursor-pointer flex-shrink-0 mt-1"
          onClick={() => removeFromWishlistHandler(data)}
        />

        <img
          src={getImageUrl(data?.images?.[0])}
          alt={data?.name}
          className="
            w-[80px]
            h-[80px]
            sm:w-[100px]
            sm:h-[100px]
            object-cover
            rounded-[5px]
          "
        />

        <div className="flex-1 min-w-0">
          <h1 className="text-sm sm:text-base font-medium break-words">
            {data.name}
          </h1>

          <h4 className="font-[600] text-[16px] sm:text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            USD ${totalPrice.toFixed(2)}
          </h4>
        </div>

        <div className="flex-shrink-0">
          <BsCartPlus
            size={22}
            className="cursor-pointer"
            title="Add to Cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default WishList;
