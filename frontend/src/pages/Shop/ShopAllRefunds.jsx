import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar';
import AllRefundOrders from "../../components/Shop/AllRefundOrders";

const ShopAllRefunds = () => {
  return (
    <div>
    <DashboardHeader />
    <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={10} />
        </div>
        <div className="w-full justify-center flex">
           <AllRefundOrders />
        </div>
      </div>
</div>
  )
}

export default ShopAllRefunds