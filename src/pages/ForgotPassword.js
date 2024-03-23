import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import apiConnector from '../services/apiconnector';
import { resetPassword } from '../services/apis';
import { setLoading,setToken } from '../slices/authSlice';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
    const [emailSent,setEmailSent]=useState(false);
    // const {user}=useSelector((state)=>state.profile)
    const [email,setEmail]=useState("");
    const {loading}=useSelector((state)=>state.auth)
    const dispatch=useDispatch(); 
    const navigate=useNavigate();

    async function submitHandler(event){
        event.preventDefault();
        dispatch(setLoading(true));
        try{
            const result=await apiConnector("POST",resetPassword.RESET_PASSWORD_TOKEN_API,{email})
            console.log("RESET PASSWORD TOKEN RESPONSE... ", result)
            if(!result.data.success){
                throw new Error(result.data.message)
            }
            toast.success("Reset Password Email Sent Successfully")
            setEmailSent(true);
            dispatch(setLoading(false));
        }catch(error){
            dispatch(setLoading(false));
            console.log("RESET PASSWORD TOKEN ERROR",error)
            navigate("/error");
        }
        
    }
return (
    <div className='w-11/12 max-w-maxContent min-h-screen mx-auto flex '>
        {
            loading?(
                <div className='mx-auto mt-64 w-[37%} text-center text-richblack-100= text-3xl'>
                    <div className='custom-loader'></div>
                </div> 
                
            ):(
                emailSent?(
                    <div className='flex flex-col gap-5 w-[37%] mx-auto mt-56  text-richblack-5'>
                        <h1 className='text-4xl font-bold'>Check email</h1>
                        <p className='text-xl text-richblack-100'>We have sent the reset email to {email} </p>
                        <button onClick={submitHandler} className={`w-full text-center text-base font-bold p-3 rounded-md bg-yellow-50 text-black
                        hover:scale-95 transition-all duration-200 cursor-pointer`}>Resend email</button>
                        
                        <Link to='/login' className='flex gap-3 items-center '>
                            <FaLongArrowAltLeft/> Back to Login
                        </Link>
                    </div>
                ):(
                    <div className='flex flex-col gap-6 w-[37%] mx-auto mt-40 text-richblack-5'>
                        <h1 className='text-4xl font-bold'>Reset your password</h1>
                        <p className='text-xl text-richblack-100'>Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery</p>
                        <form onSubmit={submitHandler} className='flex flex-col gap-6'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor='email' className='pl-1 text-[14px] font-normal leading-[22px] text-richblack-5'>Email Address <sup className='text-pink-200'>*</sup></label>
                                <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium' type='email' placeholder='Enter email address' id='email' name='email'
                                value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                            </div>
                            <button className={`w-full text-center text-base font-bold p-3 rounded-md bg-yellow-50 text-black
                            hover:scale-95 transition-all duration-200 cursor-pointer`}>Submit</button>
                        </form>
                        
                        <Link to='/login' className='flex gap-3 items-center '>
                            <FaLongArrowAltLeft/> 
                            Back to Login
                        </Link>
                    </div>
                )
            )
        }
    </div>
  )
}

 {/*  */}