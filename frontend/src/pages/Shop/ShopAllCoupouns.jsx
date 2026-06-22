import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar'
import AllCoupouns from "../../components/Shop/AllCoupouns";

function ShopAllCoupouns() {
  return (
     <div>
        <DashboardHeader />
        <div className="flex justify-between w-full">
            <div className="w-[80px] 800px:w-[330px]">
              <DashBoardSideBar active={9} />
            </div>
            <div className="w-full justify-center flex">
                <AllCoupouns />
            </div>
          </div>
    </div>
  )
}

export default ShopAllCoupouns