import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImageUrl } from "../../utils/imageUrl";
import styles from "../../styles/styles";
import axios from "axios";
import { server } from "../../server";
import { useParams } from "react-router-dom";
import Loader from "../Layout/Loader";
import { Link } from "react-router-dom";
import { getAllProductShop } from "../../redux/actions/product";
function ShopInfo({ isOwner }) {
  const { products } = useSelector((state) => state.products);
  const [data, setData] = useState({});
  const { id } = useParams();
  const [isloading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllProductShop(id));
    setIsloading(true);
    axios
      .get(`${server}/shop/get-shop-info/${id}`, { withCredentials: true })
      .then((res) => {
        setData(res.data.shop);
        console.log(res.data);
        setIsloading(false);
      })
      .catch((error) => {
        console.log(error.response.data.message);
        setIsloading(false);
      });
  }, []);
  const TotalproductReviewLengthofShop =
    products && products.reduce((acc, product) => acc + product.reviews.length, 0);
  // each product -> all review of each product -> ratings of each review of that product
  const TotalRatingofShop =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0,
    );
  const avgRatingofShop = TotalRatingofShop / TotalproductReviewLengthofShop || 0;

  const logoutHandler = async () => {
    await axios.get(`${server}/shop/logout`, {
      withCredentials: true,
    });
    window.location.reload();
  };
  return (
    <div className="w-full">
      <div className="w-full py-5 px-3 sm:px-4">
        <div className="w-full flex items-center justify-center">
          <img
            src={getImageUrl(data?.avatar)}
            alt=""
            className="w-[90px] h-[90px] sm:w-[120px] sm:h-[120px] 800px:w-[150px] 800px:h-[150px] object-cover rounded-full"
          />
        </div>
        <h3 className="text-center py-2 text-[16px] sm:text-[18px] 800px:text-[20px] break-words">
          {/* {data.name} */}
        </h3>
        <p className="text-[14px] sm:text-[15px] 800px:text-[16px] text-[#000000a6] py-2 sm:p-[16px] flex items-center break-words">
          {data.description}
        </p>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[14px] sm:text-[15px]">Address</h5>
        <h4 className="text-[#000000a6] text-[14px] sm:text-[15px] break-words">
          {data.address}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[14px] sm:text-[15px]">Phone number</h5>
        <h4 className="text-[#000000a6] text-[14px] sm:text-[15px] break-words">
          {data.phoneNumber}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[14px] sm:text-[15px]">Total Products</h5>
        <h4 className="text-[#000000a6] text-[14px] sm:text-[15px]">
          {products && products.length}
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[14px] sm:text-[15px]">Shop Ratings</h5>
        <h4 className="text-[#000000a6] text-[14px] sm:text-[15px]">
          {avgRatingofShop}/5
        </h4>
      </div>
      <div className="p-3">
        <h5 className="font-[600] text-[14px] sm:text-[15px]">Joined On</h5>
        <h4 className="text-[#000000a6] text-[14px] sm:text-[15px]">
          {data?.createdAt?.slice(0, 10)}
        </h4>
      </div>
      {isOwner && (
        <div className="py-3 px-3 sm:px-4 flex flex-col gap-2">
          <Link to="/setting" className="w-full">
            <div
              className={`${styles.button} !w-full !h-[38px] sm:!h-[42px] !rounded-[5px]`}
            >
              <span className="text-white text-[14px] sm:text-[16px]">
                Edit Shop
              </span>
            </div>
          </Link>
          <div
            className={`${styles.button} !w-full !h-[38px] sm:!h-[42px] !rounded-[5px]`}
            onClick={logoutHandler}
          >
            <span className="text-white text-[14px] sm:text-[16px]">
              Log Out
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShopInfo;
