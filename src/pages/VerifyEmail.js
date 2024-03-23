import React, { useEffect, useState } from 'react'
import OTPInput from 'react-otp-input'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../slices/authSlice';
import apiConnector from '../services/apiconnector';
import { auth } from '../services/apis';
import toast from 'react-hot-toast';

export const VerifyEmail = () => {

    const [otp,setOtp]=useState('');
    const dispatch=useDispatch();
    const navigate=useNavigate(); 
    const{loading,signupData}=useSelector((state)=>state.auth)
    

    useEffect(()=>{
        if(!signupData){
            navigate("/signup");
            return;
        }
    },[])

    async function submitHandler(event){  
        event.preventDefault();
        const {firstName,lastName,email,password,confirmPassword,accountType}=signupData;
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",auth.SIGNUP_API,{firstName,lastName,email,password,confirmPassword,accountType,otp})
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            console.log("RESPONSE VERIFY EMAIL",response);
            toast.success("Email verified successfully");
            navigate("/login");
        }catch(error){
            toast.error("Email could not get Verified");
            console.log("ERROR VERIFYING EMAIL",error.message);
        }
        dispatch(setLoading(false));
        
    }

    async function resendHandler(){
        dispatch(setLoading(true));
        const {email}=signupData;
        try{
            const response=await apiConnector("POST",auth.SEND_OTP_API,{email})
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            console.log("RESPONSE RESEND OTP",response)
            toast.success("Otp resent to the email entered")

        }catch(error){
            toast.error("Error occured while resending OTP");
            console.log("ERROR RESENDING OTP",error);
        }
        dispatch(setLoading(false));
    }
  return (
    <div className='w-11/12 max-w-maxContent min-h-screen mx-auto flex '>
        {
            loading?(
                <div className='mx-auto mt-64 w-[37%} text-center text-richblack-100= text-3xl'>
                    <div className='custom-loader'></div>
                </div>  
            ):(
                <div className='flex flex-col gap-6 w-[37%] mt-52 mx-auto text-richblack-5'>
                    <h1 className='text-4xl font-bold'>Verify Email</h1>
                    <p className='text-xl text-richblack-100'>A verification code has been sent to you. Enter the code below</p>
                    <form onSubmit={submitHandler} className='flex flex-col gap-6'>
                        <OTPInput 
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            placeholer=''
                            renderSeparator={<span className='text-richblack-500'>-</span>}
                            containerStyle={"flex justify-between items-center w-full"}
                            inputStyle={"outline-none px-2 py-1 text-[40px] h-[50px] rounded-[8px] bg-richblack-800 text-richblack-200  font-extralight"}
                            inputType='text'
                            renderInput={(props)=><input {...props}/>}
                        />
                        <button className={`w-full text-center text-base font-bold p-3 rounded-md bg-yellow-50 text-black
                        hover:scale-95 transition-all duration-200 cursor-pointer `}>Verify email</button>
                    </form>
                    <div className='flex w-full justify-between items-center'>
                        <Link to='/login' className='flex gap-3 items-center cursor-pointer'>
                            <FaLongArrowAltLeft/> 
                            Back to Login
                        </Link>
                        
                        <span className='text-blue-200  font-light 
                        flex gap-2 cursor-pointer items-center' onClick={resendHandler}>
                            <RxCountdownTimer/> Resend it
                        </span>   
                    </div>
                </div>
            )
        }
    </div>
  )
}
