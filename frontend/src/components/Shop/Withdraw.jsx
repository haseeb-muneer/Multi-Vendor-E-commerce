import React, { useEffect } from 'react'
import styles from '../../styles/styles'
import { useDispatch, useSelector } from 'react-redux';
import { getAllOrdersOfShop } from '../../redux/actions/order';
import { getAllProductShop } from '../../redux/actions/product';

function Withdraw() {
      const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
     dispatch(getAllOrdersOfShop(seller._id));
     dispatch(getAllProductShop(seller._id));
  }, [dispatch]);
  const availableBalance=seller?.availableBalance.toFixed(2);
  return (
    <div className='w-full h-[90vh] p-8'>
        <div className='w-full h-full bg-white rounded flex items-center justify-center flex-col'>
            <h5 className='text-[20px] pb-4 !h-[42px] !rounded'>Available Balanace: ${availableBalance} </h5>
            <div className={`${styles.button} text-white`}>
                Withdraw
            </div>
        </div>
    </div>
  )
}

export default Withdraw