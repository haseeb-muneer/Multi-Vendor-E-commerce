import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProduct, getAllProductShop } from "../../redux/actions/product";
import { getAllEventShop } from "../../redux/actions/event";
import Loader from "../Layout/Loader";
import { Link } from "react-router-dom";
// Material UI Components (Modern v5/v6)
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import styles from "../../styles/styles";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import {toast} from "react-toastify";
function AllCoupouns() {
  
  const { seller } = useSelector((state) => state.seller);
  const [loading , setLoading]=useState(false);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [coupouns , setCoupouns]=useState([]);
 const { products } = useSelector((state) => state.products);
  const dispatch = useDispatch();
  useEffect(() => {
    setLoading(true);
     axios.get(`${server}/coupoun/get-coupoun-code/${seller._id}` , {withCredentials:true}).then((res)=>{
    setLoading(false);
    setCoupouns(res.data.coupoun);
    console.log(res.data);
    }).catch((error)=>{
        setLoading(false);
        toast.error(error.response.data.message);
    })
  }, [dispatch]);
  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
    window.location.reload();
  };
  //   console.log(products);
  const handleSubmit = async(e) => {
    e.preventDefault();
    await axios.post(`${server}/coupoun/create-coupoun-code` , {
        name , 
        value , 
        minAmount ,
        maxAmount,
        selectedProduct,
        shopId:seller._id,
    } , {withCredentials:true}).then((res)=>{
        console.log(res.data);
          toast.success("Coupon is created successfully");
          setOpen(false);
          window.location.reload(true);
    }).catch((error)=>{
        toast.error(error.response.data.message);
        setOpen(false);
    })
  };
  const columns = [
    { field: "id", headerName: "Product Id", minWidth: 150, flex: 0.7 },
    {
      field: "name",
      headerName: "Name",
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: "price",
      headerName: "Price",
      minWidth: 100,
      flex: 0.6,
    },
   
   
    {
      field: "Delete",
      flex: 0.8,
      minWidth: 120,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];
  const row = [];

  coupouns &&
    coupouns.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + "%",
       
      });
    });
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              onClick={() => setOpen(true)}
              className={`${styles.button} !w-max !h-45 px-3 !rounded-[5px] mr-3 mb-3`}
            >
              <span className="text-white">Create Coupoun Code</span>
            </div>
          </div>
          <DataGrid
            rows={row}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            autoHeight
          />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] flex items-center justify-center z-[20000]">
              <div className="w-[90%] 800px:w-[40%] max-h-[90vh] overflow-y-auto bg-white rounded-md shadow p-4">
                <div className="flex items-center justify-end">
                  <RxCross1
                    size={30}
                    className="cursor-pointer"
                    onClick={() => setOpen(false)}
                  />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">
                  Create CouponCode
                </h5>
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />
                  <div>
                    <lable className="pb-2">
                      Coupon Name <span className="text-red-500">*</span>
                    </lable>
                    <input
                      type="text"
                      name="name"
                      value={name}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your coupon name..."
                    />
                  </div>
                  <br />
                  <div>
                    <lable className="pb-2">
                      Discount Percentage{" "}
                      <span className="text-red-500">*</span>
                    </lable>
                    <input
                      type="text"
                      name="value"
                      value={value}
                      required
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Enter your coupon percentage..."
                    />
                  </div>
                  <br />
                  <div>
                    <lable className="pb-2">Min Amount</lable>
                    <input
                      type="number"
                      name="minAmount"
                      value={minAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Enter your minimum Amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <lable className="pb-2">Max Amount</lable>
                    <input
                      type="number"
                      name="maxAmount"
                      value={maxAmount}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Enter your maximum Amount..."
                    />
                  </div>
                  <br />
                  <div>
                    <label className="pb-2">Selected Product</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        Choose a selected product
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <br />
                  <div>
                    
                    <input
                      type="Submit"
                      
                      value="Create"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      
                    />
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AllCoupouns;
