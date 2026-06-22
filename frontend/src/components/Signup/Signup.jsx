import React, { useState } from 'react'
import {AiOutlineEye, AiOutlineEyeInvisible} from "react-icons/ai";
import styles from "../../styles/styles.js";
import {Link, } from "react-router-dom";
import {RxAvatar} from "react-icons/rx";
import axios from "axios";
import { server } from '../../server.js';
import { toast } from 'react-toastify';
function Signup() {

    const [email , setEmail]=useState("");
    const [password , setPassword]=useState("");
    const [FullName , setFullName]=useState("");
    const [visible , setVisible]=useState(false);
    const [avatar , setAvatar]=useState(null);
    const handleSubmit= async (e)=>{
      e.preventDefault();
      const config={
        headers:{
          "Content-type":"multipart/form-data; boundary=----WebKitFormBoundary..."
        }
      }
      const newForm =new FormData();
      newForm.append("file" , avatar);
      newForm.append("name" , FullName);
      newForm.append("email" , email);
      newForm.append("password" , password);
      axios.post(`${server}/user/create-user`,newForm , config).then((res)=>{
        if(res.data.success===true){
          toast.success(res.data.message);
          setFullName("");
          setEmail("");
          setPassword("");
          setAvatar();
        }
      }).catch((error)=>{
        
        toast.error(error.response.data.message);
      });

    }
    const handleFileinputChange=(e)=>{
      const file=e.target.files[0];
      setAvatar(file);
      
    }
  return (
    <div className='min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
        <div className='sm:mx-auto sm:max-w-md sm:w-full'>
            <h2 className='mt-6 text-3xl text-center font-extrabold text-gray-900'>Register as a new user</h2>
        </div>
        <div className='mt-8 sm:mx-auto sm:max-w-md sm:w-full'>
            <div className='bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10'>
                <form onSubmit={handleSubmit} className='space-y-6'>
                 <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                      Full Name
                    </label>
                    <div className='mt-1'>
                        <input type='text' name='text' autoComplete='name' value={FullName} required onChange={(e)=>setFullName(e.target.value)} className='appearance-none block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 rounded-mg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    </div>  
                   <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                      Email address
                    </label>
                    <div className='mt-1'>
                        <input type='email' name='email' autoComplete='email' value={email} required onChange={(e)=>setEmail(e.target.value)} className='appearance-none block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 rounded-mg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                    </div>
                    </div>      
                 <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                      Password
                    </label>
                    <div className='mt-1 relative'>
                        <input type={visible ? "text" : "password"} name='password' autoComplete='password' value={password} required onChange={(e)=>setPassword(e.target.value)} className='appearance-none block w-full px-3 py-2 border rounded-md shadow-sm border-gray-300 rounded-mg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm' />
                        {visible ? <AiOutlineEye size={25} className='absolute right-2 top-2 pointer' onClick={ ()=>setVisible(false)} /> : <AiOutlineEyeInvisible size={25} className='absolute right-2 top-2 pointer' onClick={ ()=>setVisible(true)}/>}
                    </div>
                    </div> 
                      <div className=''>
                        <label htmlFor='avatar' className='block text-sm font-medium text-gray-700'></label>
                        <div className='mt-2 flex items-center'>
                          <span className='inline-block h-8 w-8 rounded-full overflow-hidden'>
                           {avatar ? (<img src={URL.createObjectURL(avatar)} alt='avatar' className='h-full w-full object-cover rounded-full'/>):(<RxAvatar className='h-8 w-8'/>)}
                          </span>
                          <label htmlFor='fileInput' className='ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'>
                            <span>Upload Avatar</span>
                            <input type='file' id='fileInput' accept='.jpg,.jpeg,.png' name='file' onChange={handleFileinputChange} className='sr-only'/>
                          </label>

                        </div>
                      </div>
                        <div >
                            <button type='submit' className='group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700'>Submit</button>

                        </div>
                        <div className={`${styles.noramlFlex} w-full`}>
                            <h4>Already have an account?</h4>
                            <Link to="/login" className='text-blue-600 pl-2'>Sign In</Link>
                        </div>
                </form>

            </div>
        </div>
      
    </div>
  )
}

export default Signup
