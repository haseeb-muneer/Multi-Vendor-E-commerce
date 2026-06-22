import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar'
import AllOrders from "../../components/Shop/AllOrders";
function ShopAllOrders() {
  return (
     <div>
        <DashboardHeader />
        <div className="flex justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashBoardSideBar active={2} />
            </div>
            <div className="w-full justify-center flex">
                <AllOrders />
            </div>
          </div>
    </div>
  )
}

export default ShopAllOrders