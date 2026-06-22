import React from 'react'

import Footer from '../../components/Layout/Footer'
import UserOrderDetails from '../../components/Shop/UserOrderDetails'
import Header from '../../components/Layout/Header'

function OrderDetailsPage() {
  return (
    <div>
        <Header />
        <UserOrderDetails/>
        <Footer/>
        
    </div>
  )
}

export default OrderDetailsPage