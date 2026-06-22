import React from 'react'

import Footer from '../../components/Layout/Footer'
import ShopSettings from "../../components/Shop/ShopSettings";
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar';
function ShopSettingPage() {
  return (
   <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashBoardSideBar active={11} />
        </div>
        <ShopSettings />
      </div>
    </div>
  )
}

export default ShopSettingPage