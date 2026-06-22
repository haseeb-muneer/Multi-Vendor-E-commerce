import React from 'react'
import styles from '../../styles/styles'
import { navItems } from '../../static/data'
import { Link } from 'react-router-dom'
function Navbar({active}) {
  return (
    <div className={`block 800px:${styles.noramlFlex}`}>
        {
            navItems && navItems.map((i,index)=>(
               <div className='flex'>
                <Link to={i.url} className={`${active===index + 1 ? "text-[#17dd1f]": "800px:text-[#fff] text-[#000000]"} pb-[30px] 800px:pb-0 px-6 cursor-pointer font-[500]`}>
                {i.title}
                </Link>
               </div>
            ))
        }
    </div>
  )
}

export default Navbar