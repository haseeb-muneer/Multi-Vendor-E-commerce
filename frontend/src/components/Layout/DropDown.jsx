import React from 'react'
import {useNavigate} from "react-router-dom";
import styles from "../../styles/styles"
function DropDown({categoriesData , setDropDown}) {
  const navigate=useNavigate();
  const HandleSubmit=(i)=>{
    navigate(`/products?category=${i.title}`);
    setDropDown(false);
    window.location.reload();
  }
  return (
    <div className='w-[270px] pb-4 bg-[#fff] absolute z-30 rounded-b-md shadow-sm'>{
      categoriesData && categoriesData.map((i,index)=>(
        <div key={index} onClick={()=>HandleSubmit(i)} className={`${styles.noramlFlex}`}>
          <img src={i.image_Url} style={{width:"25px" , height:"25px" , objectFit:"contain" , userSelect:"none" , marginLeft:"10px"}} alt=''/>
          <h3 className='m-3 cursor-pointer select-none'>{i.title}</h3>

        </div>
      ))
    }</div>
  )
}

export default DropDown