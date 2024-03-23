import React, { useState } from 'react'
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

import LoginImage from '../assets/Images/login.webp'
import FrameImage from '../assets/Images/frame.png'
import { Link, useNavigate } from 'react-router-dom';
import apiConnector from '../services/apiconnector';
import { auth } from '../services/apis';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setToken } from '../slices/authSlice';
import { setUser } from '../slices/profileSlice';
import { setCart } from '../slices/cartSlice';

export const Login = () => {

  const [showPassword,setShowPassword]=useState(false)
  
  const [loginForm,setLoginForm]=useState({
    email:"",password:""
  })
  const dispatch=useDispatch();
  function changeHandler(event){
    const {name,value}=event.target;
    setLoginForm((prev)=>({
      ...prev,
      [name]:value
    }))
    
  }
  const navigate=useNavigate();
  const {email,password}=loginForm;
  const {loading}=useSelector((state)=>state.auth)
  async function submitHandler(event){
    event.preventDefault();
    dispatch(setLoading(true));
    try{
      const response=await apiConnector("POST",auth.LOGIN_API,{email,password});
      console.log("Login succesfull response...", response);
      if(!response.data.success){
        throw new Error(response.data.message);
      }
      toast.success("Login Successfull");

      dispatch(setToken(response?.data?.token));
      const userImage=response?.data?.user?.image ? response?.data?.user?.image : 
      `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`

      dispatch(setUser({...response.data.user,userImage}));

      localStorage.setItem("token",JSON.stringify(response.data.token));
      localStorage.setItem("user",JSON.stringify({...response.data.user,userImage}));
      dispatch(setCart({
        itemCart:response.data.user.cartItems,
        totalAmount:response.data.user.cartTotalAmount,
        totalItems:response.data.user.cartItemCount
      }))
      
      navigate("/dashboard/my-profile");
    }catch(error){
      console.log("Login failed response error...",error)
      toast.error('Login attempt unsuccessfull');
    }
    dispatch(setLoading(false));
  }

  function forgotPasswordHandler(){
    navigate("/forgot-password");
  }
  
  return (
    <div className='w-11/12 max-w-maxContent mx-auto mt-20'>
      {
        loading?(
          <div className='mx-auto mt-44 w-[37%} text-center text-richblack-100 text-3xl'>
            <div className='custom-loader mx-auto'></div>
          </div>
        ):(
          <div className='w-full flex justify-between text-white text-[16px]'>

            <div className='flex flex-col font-inter w-[45%] font-bold p-6'>

              <div className='font-inter text-[30px] leading-[38px] font-semibold text-richblack-5'>Welcome Back</div>
              <div className='flex flex-col leading-[20px] font-light mt-3'>
                  <p className=' text-[18px] leading-[26px] font-normal text-richblack-100'>Build skills for today, tomorrow, and beyond.</p>
                  <p className='font-edu-sa text-[16px] leading-[26px] font-bold text-blue-100 italic tracking-tight'>Education to future-proof your career</p>
              </div>
            
          
              <form onSubmit={submitHandler} className='flex flex-col mt-9'>
                  <div className='flex flex-col'>
                    <div className='flex flex-col gap-[6px]'>
                      <label htmlFor='email' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Email Address <sup className='text-pink-200'>*</sup></label>
                      <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium' type='email' placeholder='Enter email address' id='email' name='email'
                      value={loginForm.email} onChange={changeHandler} required/>
                    </div>
                    <div className='flex flex-col relative w-full gap-[6px] mt-5'>
                      <label htmlFor='password' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Create Password <sup className='text-pink-200 ml-[2px]'>*</sup></label>
                      <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full' type={`${showPassword?"text":"password"}`} placeholder='Enter Password' id='password' name='password' 
                      value={loginForm.password} onChange={changeHandler} required/>
                      <span className='absolute right-[10px] bottom-4 text-base cursor-pointer' onClick={()=>{setShowPassword(!showPassword)}}>
                          {
                            showPassword?(<IoEyeOffOutline/>):(<IoEyeOutline/>)
                          }
                      </span>
                    </div>
                    <div className='flex justify-end mt-[5px] pr-1'>
                      <span className='text-blue-200 text-[13px] leading-[18px] font-light cursor-pointer' onClick={()=>{forgotPasswordHandler()}}>Forgot Password?</span>
                    </div>
                </div>
                    
                
                <button className={`mt-9 w-full text-center text-base font-medium p-3 rounded-md bg-yellow-50 text-black
                hover:scale-95 transition-all duration-200 cursor-pointer`}>Log In</button>
                
              </form>
            </div>
            <div className='p-8'>
              <img src={FrameImage} className=' translate-x-8 translate-y-8'/>
              <img src={LoginImage} className='translate-y-[-100%]'/>
            </div>
        </div>
        )
      }
  </div>  
  )
}
