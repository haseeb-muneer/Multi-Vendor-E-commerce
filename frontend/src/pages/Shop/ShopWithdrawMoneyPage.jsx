import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar'
import Withdraw from "../../components/Shop/Withdraw";
function ShopWithdrawMoneyPage() {
  return (
     <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={11} />
        </div>
        <Withdraw />
      </div>
    </div>
  )
}

export default ShopWithdrawMoneyPage