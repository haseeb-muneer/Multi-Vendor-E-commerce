import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import DashBoardSideBar from '../../components/Shop/Layout/DashBoardSideBar';
import CreateProduct from "../../components/Shop/CreateProduct.jsx";
function ShopCreateProduct() {
  return (
     <div>
          <DashboardHeader/>
          <div className='flex items-center justify-between w-full'>
            <div className='w-[80px 800px:]w-[330px]'>
              <DashBoardSideBar active={4}/>
            </div>
            <div className='w-full justify-center flex'>
                <CreateProduct/>
            </div>
          </div>
        </div>
  )
}

export default ShopCreateProduct