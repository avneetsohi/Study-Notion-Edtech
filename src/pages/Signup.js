import React, { useState } from 'react'
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import SignupImage from '../assets/Images/signup.webp'
import FrameImage from '../assets/Images/frame.png'
import {FcGoogle} from 'react-icons/fc'
import { useNavigate } from 'react-router-dom';
import apiConnector from '../services/apiconnector';
import { auth } from '../services/apis';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setSignupData } from '../slices/authSlice';
import { ACCOUNT_TYPE } from '../utils/constants';

export const Signup = () => {

    const [accountType,setAccountType]=useState(ACCOUNT_TYPE.STUDENT)
    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const navigate=useNavigate();
    const dispatch=useDispatch();
    const {loading}=useSelector((state)=>state.auth)
    
    
    const [formData,setFormData]=useState({
        firstName:"",lastName:"",email:"",
        password:"",confirmPassword:""
    });

    function changeHandler(event){
       setFormData((prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }))

    }

    const {firstName,lastName,email,password,confirmPassword}=formData;
    
    

    async function submitHandler(event){
        event.preventDefault();
        if(password!==confirmPassword){
            toast.error("Passwords do not match");
            return;
        }
        const finalSignupData={
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType
            
        }
        dispatch(setSignupData(finalSignupData));
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("POST",auth.SEND_OTP_API,{email});
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            navigate("/verify-email");
            toast.success("OTP sent successfully");
        }catch(error){
            console.log("OTP API ERROR",error);
            toast.error("Sign up Failed")
            dispatch(setSignupData(null));
            navigate("/signup")
        }
        dispatch(setLoading(false));

        setFormData={
            firstName:"",lastName:"",email:"",
            password:"",confirmPassword:""
        }
        setAccountType(ACCOUNT_TYPE.STUDENT);
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

                        <div className=' text-[30px] leading-[38px] font-semibold text-richblack-5'>Join the millions learning to code with StudyNotion for free</div>
                        <div className='flex flex-col leading-[20px] font-light mt-3'>
                            <p className=' text-[18px] leading-[26px] font-normal text-richblack-100'>Build skills for today, tomorrow, and beyond.</p>
                            <p className='font-edu-sa text-[16px] leading-[26px] font-bold text-blue-100 italic tracking-tight'>Education to future-proof your career</p>
                        </div>
                        
                        
                        <form onSubmit={submitHandler} className='flex flex-col mt-9'>
                            <div className='flex flex-col'>
                                <div className='flex gap-[5px] p-1 rounded-[500px] w-fit bg-richblack-800 shad-['>
                                    <div className={`py-[6px] px-[18px] rounded-full cursor-pointer ${accountType===ACCOUNT_TYPE.STUDENT?"bg-richblack-900 text-richblack-5":"text-richblack-200"}`} onClick={()=>{setAccountType(ACCOUNT_TYPE.STUDENT)}}>Student</div>
                                    <div className={`py-[6px] px-[18px] rounded-full cursor-pointer ${accountType===ACCOUNT_TYPE.INSTRUCTOR?"bg-richblack-900 text-richblack-5":"text-richblack-200"}`} onClick={()=>{setAccountType(ACCOUNT_TYPE.INSTRUCTOR)}}>Instuctor</div>
                                </div>

                                <div className='flex mt-9 gap-5'>
                                    <div className='flex flex-col w-full gap-[6px]'>
                                        <label htmlFor='firstname' className='text-[14px] font-normal leading-[22px] text-richblack-5'>First Name<sup className='text-pink-200'> *</sup></label>
                                        <input className=' outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full'  type='text' placeholder='Enter your first name' id='firstname' name='firstName'
                                        value={formData.firstName} onChange={changeHandler} required/>
                                    </div>
                                    <div className='flex flex-col w-full gap-[6px]'>
                                        <label htmlFor='lastname' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Last Name<sup className='text-pink-200'> *</sup></label>
                                        <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full' type='text' placeholder='Enter your last name' id='lastname' name='lastName'
                                        value={formData.lastName} onChange={changeHandler} required/>
                                    </div>
                                </div>
                                <div className='flex flex-col mt-5 gap-[6px]'>
                                    <label htmlFor='email' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Email Address <sup className='text-pink-200'>*</sup></label>
                                    <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium' type='email' placeholder='Enter email address' id='email' name='email'
                                    value={formData.email} onChange={changeHandler} required/>
                                </div>

                                <div className='flex  mt-5 gap-5'>
                                    <div className='flex flex-col relative w-full gap-[6px]'>
                                        <label htmlFor='password' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Create Password <sup className='text-pink-200 ml-[2px]'>*</sup></label>
                                        <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full' type={`${showPassword?"text":"password"}`} placeholder='Enter Password' id='password' name='password' 
                                        value={formData.password} onChange={changeHandler} required/>
                                        <span className='absolute right-[10px] bottom-4 text-base cursor-pointer' onClick={()=>{setShowPassword(!showPassword)}}>
                                            {
                                                showPassword?(<IoEyeOffOutline/>):(<IoEyeOutline/>)
                                            }
                                        </span>
                                    </div>
                                    <div className='flex flex-col relative w-full gap-[6px]'>
                                        <label htmlFor='confirmPassword' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Confirm Password <sup className='text-pink-200'>*</sup></label>
                                        <input className='outline-none p-3 rounded-[8px] bg-richblack-800 
                                        text-richblack-200 text-base font-medium w-full' type={`${showConfirmPassword?"text":"password"}`} 
                                        placeholder='Enter Confirm Password' id='confirmPassword' name='confirmPassword' onChange={changeHandler} value={formData.confirmPassword} required/>
                                        <span className='absolute right-[10px] bottom-4 cursor-pointer' onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}>
                                            {
                                                showConfirmPassword?(<IoEyeOffOutline/>):(<IoEyeOutline/>)
                                            }
                                        </span>
                                    </div>
                                </div>


                            </div>

                            
                            <button className={`w-full text-center text-base font-medium p-3 rounded-md bg-yellow-50 text-black
                            hover:scale-95 transition-all duration-200 cursor-pointer mt-9 `}>Create Account</button>
                            
                        </form>
                    
                        <div className='flex w-full items-center mt-4 gap-x-2'>
                            <div className='h-[1px] w-full bg-richblack-700'></div>
                            <p className='text-richblack-700 font-medium leading-[1.375rem] '>OR</p>
                            <div className='h-[1px] w-full bg-richblack-700'></div>
                        </div>

                        <button className='flex justify-center items-center rounded-[8px] font-medium
                        text-richblack-100 border border-richblack-700 w-full p-3 gap-x-2 mt-4 cursor-pointer'> <FcGoogle/> Sign in with Google</button>

                    </div>

            

                    <div className='p-8'>
                    
                        <img src={FrameImage}  alt='Frame Image' width={558} height={490} loading='lazy'  className=' translate-x-8 translate-y-8'/>
                        <img src={SignupImage} alt='Image' width={558} height={504} loading='lazy' className='translate-y-[-100%]'/>
                        
                    </div>
                </div>
            )
        }
    </div>
  )
}
