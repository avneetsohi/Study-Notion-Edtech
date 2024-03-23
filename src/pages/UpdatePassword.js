import React, { useState } from 'react'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '../slices/authSlice';
import apiConnector from '../services/apiconnector';
import { resetPassword } from '../services/apis';
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";

export const UpdatePassword = () => {

    const [showPassword,setShowPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);

    const [passwordData,setPasswordData]=useState({
        password:"",confirmPassword:""
    })


    const {password,confirmPassword}=passwordData;

    const navigate=useNavigate();
    const location=useLocation();
    const dispatch=useDispatch();

    function changeHandler(event){
        setPasswordData((prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }))
    }

    const token=location.pathname.split("/").at(-1);
    const {loading}=useSelector((state)=>state.auth)

    async function submitHandler(event){
        event.preventDefault();
        if(password!==confirmPassword){
            toast.error("Passwords do not match")
            return;
        }
        dispatch(setLoading(true));
        try{
            const response=await apiConnector("PUT",resetPassword.RESET_PASSWORD_API,{password,confirmPassword,token});
            console.log("RESET PASSWORD RESPONSE....",response);
            if(!response.data.success){
                throw new Error(response.data.message);
            }
            toast.success("Password updated successfully")
            

        }catch(error){
            console.log("Unable to update the password",error);
            toast.error("Unsuccessful Password Updation")
        }
        dispatch(setLoading(false));
        navigate("/login");
        

    }

  return (
    <div className='w-11/12 min-h-screen max-w-maxContent mx-auto flex items-center justify-center'>
        {
            loading?
            (
                <div className='mx-auto  w-[37%} text-center text-richblack-100= text-3xl'>
                    <div className='custom-loader'></div>
                </div>
            )
            :
            (
                <div className='flex flex-col gap-6 w-[37%] mx-auto  text-richblack-5'>
                    <h1 className='text-4xl font-bold'>Choose new password</h1>
                    <p className='text-xl text-richblack-100'>Almost done. Enter your new password and you are all set.</p>
                    <form onSubmit={submitHandler} className='flex flex-col'>
                        <div className='flex flex-col relative w-full gap-[6px]'>
                            <label htmlFor='password' className='text-[14px] font-normal leading-[22px] text-richblack-5'>New Password<sup className='text-pink-200 ml-[2px]'>*</sup></label>
                            <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full' type={`${showPassword?"text":"password"}`} placeholder='Enter New Password' id='password' name='password' 
                            value={passwordData.password} onChange={changeHandler} required/>
                            <span className='absolute right-[10px] bottom-4 text-base cursor-pointer' onClick={()=>{setShowPassword(!showPassword)}}>
                                {
                                    showPassword?(<IoEyeOffOutline/>):(<IoEyeOutline/>)
                                }
                            </span>
                        </div>
                        <div className='flex flex-col relative w-full gap-[6px] mt-5'>
                            <label htmlFor='confirmPassword' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Confirm new password <sup className='text-pink-200 ml-[2px]'>*</sup></label>
                            <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full' type={`${showConfirmPassword?"text":"password"}`} placeholder='Enter Confirm Password' id='confirmPassword' name='confirmPassword' 
                            value={passwordData.confirmPassword} onChange={changeHandler} required/>
                            <span className='absolute right-[10px] bottom-4 text-base cursor-pointer' onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}>
                                {
                                    showConfirmPassword?(<IoEyeOffOutline/>):(<IoEyeOutline/>)
                                }
                            </span>
                        </div>
                        <div className='mt-6 flex gap-3'>
                            <div className='flex flex-col gap-1'>
                                <span className='flex gap-[6px] items-center font-inter text-[16px] leading-5 font-normal text-caribbeangreen-300'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM10.4069 6.79062C10.5674 6.56591 10.5153 6.25364 10.2906 6.09313C10.0659 5.93263 9.75364 5.98467 9.59313 6.20938L7.4362 9.22909L6.35355 8.14645C6.15829 7.95118 5.84171 7.95118 5.64645 8.14645C5.45118 8.34171 5.45118 8.65829 5.64645 8.85355L7.14645 10.3536C7.25037 10.4575 7.39476 10.5104 7.54124 10.4983C7.68772 10.4862 7.82144 10.4102 7.90687 10.2906L10.4069 6.79062Z" fill="#05A77B"/>
                                    </svg>
                                    <p>one lowercase character</p>
                                </span>
                                <span className='flex gap-[6px] items-center font-inter text-[16px] leading-5 font-normal text-caribbeangreen-300'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM10.4069 6.79062C10.5674 6.56591 10.5153 6.25364 10.2906 6.09313C10.0659 5.93263 9.75364 5.98467 9.59313 6.20938L7.4362 9.22909L6.35355 8.14645C6.15829 7.95118 5.84171 7.95118 5.64645 8.14645C5.45118 8.34171 5.45118 8.65829 5.64645 8.85355L7.14645 10.3536C7.25037 10.4575 7.39476 10.5104 7.54124 10.4983C7.68772 10.4862 7.82144 10.4102 7.90687 10.2906L10.4069 6.79062Z" fill="#05A77B"/>
                                    </svg>
                                    <p>one uppercase character</p>
                                </span>
                                <span className='flex gap-[6px] items-center font-inter text-[16px] leading-5 font-normal text-caribbeangreen-300'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM10.4069 6.79062C10.5674 6.56591 10.5153 6.25364 10.2906 6.09313C10.0659 5.93263 9.75364 5.98467 9.59313 6.20938L7.4362 9.22909L6.35355 8.14645C6.15829 7.95118 5.84171 7.95118 5.64645 8.14645C5.45118 8.34171 5.45118 8.65829 5.64645 8.85355L7.14645 10.3536C7.25037 10.4575 7.39476 10.5104 7.54124 10.4983C7.68772 10.4862 7.82144 10.4102 7.90687 10.2906L10.4069 6.79062Z" fill="#05A77B"/>
                                    </svg>
                                    <p>one number</p>
                                </span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='flex gap-[6px] items-center font-inter text-[16px] leading-5 font-normal text-caribbeangreen-300'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM10.4069 6.79062C10.5674 6.56591 10.5153 6.25364 10.2906 6.09313C10.0659 5.93263 9.75364 5.98467 9.59313 6.20938L7.4362 9.22909L6.35355 8.14645C6.15829 7.95118 5.84171 7.95118 5.64645 8.14645C5.45118 8.34171 5.45118 8.65829 5.64645 8.85355L7.14645 10.3536C7.25037 10.4575 7.39476 10.5104 7.54124 10.4983C7.68772 10.4862 7.82144 10.4102 7.90687 10.2906L10.4069 6.79062Z" fill="#05A77B"/>
                                    </svg>
                                    <p>one special character</p>
                                </span>
                                <span className='flex gap-[6px] items-center font-inter text-[16px] leading-5 font-normal text-caribbeangreen-300'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8ZM10.4069 6.79062C10.5674 6.56591 10.5153 6.25364 10.2906 6.09313C10.0659 5.93263 9.75364 5.98467 9.59313 6.20938L7.4362 9.22909L6.35355 8.14645C6.15829 7.95118 5.84171 7.95118 5.64645 8.14645C5.45118 8.34171 5.45118 8.65829 5.64645 8.85355L7.14645 10.3536C7.25037 10.4575 7.39476 10.5104 7.54124 10.4983C7.68772 10.4862 7.82144 10.4102 7.90687 10.2906L10.4069 6.79062Z" fill="#05A77B"/>
                                    </svg>
                                    <p>8 characters minimum</p>
                                </span>
                            </div>
                        </div>
                        <button type='submit' className={`w-full text-center text-base font-bold p-3 rounded-md bg-yellow-50 text-black
                        hover:scale-95 transition-all duration-200 cursor-pointer mt-6`}>Reset Password</button>
                    </form>
                    <Link to='/login' className='flex gap-3 items-center cursor-pointer'>
                        <FaLongArrowAltLeft/> 
                        Back to Login
                    </Link>
                </div>
            )
        }
    </div>
  )
}
