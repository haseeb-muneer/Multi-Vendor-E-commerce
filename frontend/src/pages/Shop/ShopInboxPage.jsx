import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar'
import ShopInbox from "../../components/Shop/ShopInbox";
function ShopInboxPage() {
  return (
   <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={8} />
        </div>
        < ShopInbox />
      </div>
    </div>
  )
}

export default ShopInboxPage