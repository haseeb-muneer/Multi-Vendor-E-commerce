import React from 'react'
import styles from '../../../styles/styles'

function Sponsored() {
  return (
    <div className={`${styles.section} hidden sm:block bg-white py-10 px-5 mb-12 rounded-xl cursor-pointer`}>
        <div className='flex justify-between w-full'>
            <div className='flex items-start'>
                <img src='https://logos-world.net/wp-content/uploads/2020/04/Sony-Logo.png' alt='' style={{width:"150px" , objectFit:"contain"}}/>
            </div>
            <div className='flex items-start'>
                <img src='https://logos-world.net/wp-content/uploads/2020/08/Dell-Logo-1989-2016.png' alt='' style={{width:"150px" , objectFit:"contain"}}/>
            </div>
            <div className='flex items-start'>
                <img src='https://images.squarespace-cdn.com/content/v1/502a8efb84ae42cbccf920c4/1585574686746-VCDIHSO21O76WR72WIAD/LG-Logo.png' alt='' style={{width:"150px" , objectFit:"contain"}}/>
            </div>
            <div className='flex items-start'>
                <img src='https://1000logos.net/wp-content/uploads/2016/10/Apple-Logo.jpg' alt='' style={{width:"150px" , objectFit:"contain"}}/>
            </div>
            <div className='flex items-start'>
                <img src='https://static.vecteezy.com/system/resources/previews/014/018/578/non_2x/microsoft-logo-on-transparent-background-free-vector.jpg' alt='' style={{width:"150px" , objectFit:"contain"}}/>
            </div>
        </div>
    </div>
  )
}

export default Sponsored