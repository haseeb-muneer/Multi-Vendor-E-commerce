import React, { useState } from 'react'
import { useEffect } from 'react';
import { server } from '../../server';
import { useParams } from 'react-router-dom';
import axios from 'axios';
function SellerActivation() {
    const {activation_token}=useParams();
    const [error , setError]=useState(false);
    useEffect(()=>{
      console.log(activation_token);
        if(activation_token){
        const activationEmail=async()=>{
            try{
          const res=await axios.post(`${server}/shop/activation`,{
            activation_token
          } , {withCredentials:true ,
            headers: { 'Content-Type': 'application/json' }
          })
          console.log(res.data.message);
        }catch(error){
        //   console.log(error.response.data.message);
          console.log(error);
          setError(true);
        }
        }
        activationEmail();
    }

    },[])
  return (
    <div style={{
        width:"100%",
        height:"100vh",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
    }}>{
        error ? (<p>Your token is Expired</p>) :
        (<p>Your account is created successfully</p>)
    }
   
    </div>
  )
}

export default SellerActivation
