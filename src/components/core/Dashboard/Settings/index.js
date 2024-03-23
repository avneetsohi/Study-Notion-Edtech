import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";


import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import apiConnector from '../../../../services/apiconnector';

import { setUser } from '../../../../slices/profileSlice';
import toast from 'react-hot-toast';
import { auth, profile } from '../../../../services/apis';
import RemoveIcon from '../../../../assets/Logo/RemoveIcon.svg'
import { setToken } from '../../../../slices/authSlice';
import { UpdateProfilePictureSection } from './UpdateProfilePictureSection';



export default function Settings(){
    const {user}=useSelector((state)=>state.profile)
    const [showPassword,setShowPassword]=useState(false);
    const [showNewPassword,setShowNewPassword]=useState(false);
    const [showConfirmPassword,setShowConfirmPassword]=useState(false);
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();
    const navigate=useNavigate();

    const [passwordData,setPasswordData]=useState({
        currentPassword:"",
        newPassword:"",
        confirmNewPassword:""
    })

    function changeHandler(event){
       
        setPasswordData((prev)=>({
            ...prev,
            [event.target.name]:event.target.value
        }))
    }

    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessfull}
    }=useForm();


    useEffect(()=>{
        if(isSubmitSuccessfull){
            reset({
                firstName:user.firstName,
                lastName:user.lastName,
                gender:"",
                contactNumber:"",
                dateOfBirth:"",
                about:""
            })
        }
    },[reset,isSubmitSuccessfull])



    const submitProfileInfo = async (data) => {

        console.log("Logging profile data...",data)
        
        try{
            console.log("About to fetch")
            const response=await apiConnector("PUT",profile.UPDATE_PROFILE_API,data,
            {
                Authorization: `Bearer ${token}`
            });

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("UPDATE PROFILE API RESPONSE...",response)
            
            
            dispatch(setUser(response.data.updatedUserDetails));
            localStorage.setItem("user",JSON.stringify(response.data.updatedUserDetails))

            toast.success("Successfully updated the profile details")
            
        }catch(error){
            
            console.log("Error occured while profile details",error);
            toast.error("Couldn't update the profile details")
        }
    }


    const passwordSubmitHandler = async (event) => {
        event.preventDefault();
        try{
            const response=await apiConnector("PUT",auth.CHANGE_PASSWORD_API,passwordData,
            {
                Authorization: `Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("CHANGE PASSWORD API RESPONSE", response)
            toast.success("Password Changed Successfully")
        }catch(error){
            console.log("Error Occured while updating the password",error)
            toast.error("Failed to update the password")
        }
    }

    const logOutHandler = () => {
        
        dispatch(setToken(null));
        localStorage.setItem("token",null);
        dispatch(setUser(null));
        localStorage.setItem("user",null);
        toast.success('Logged Out')
        navigate("/login")
    }

    async function deleteProfileHandler(){
        try{
            const response = await apiConnector("DELETE",profile.DELETE_PROFILE_API,null,
            {
                Authorization:`Bearer ${token}`
            })
            
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("DELETE PROFILE API RESPONSE...",response)

            toast.success("Deleted the account successfully")
            logOutHandler();

        }catch(error){
            console.log("Error occured while deleting the account".error)
            toast.error("Failed to delete the account")
        }   
    }

    return (
      <div className='w-full mx-auto'>
          <h1 className='text-4xl font-medium text-richblack-5'>Edit Profile</h1>
          <div className='w-full mt-10 flex flex-col gap-10'>
  
              {/* section 1 */}
                <UpdateProfilePictureSection/>
  
              {/* section 2 */}
                <form onSubmit={handleSubmit(submitProfileInfo)} className='flex flex-col gap-10'>
                    <div className='py-6 px-10 flex justify-between items-start bg-richblack-800 rounded-md'>
                        <div className='flex flex-col gap-8 justify-between '>
                            <p className='text-richblack-5 font-semibold text-xl'>Profile Information</p>
                            <div className='flex flex-wrap justify-between gap-x-[2px] gap-y-5'>
                                <div className='flex flex-col w-full lg:w-[49%] gap-[6px]'>
                                    <label htmlFor='firstname' className='text-[14px] font-normal leading-[22px] text-richblack-5'>First Name </label>
                                    <input className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full -placeholder-richblack-900' type='text' 
                                    placeholder={`${user.firstName ?? "Enter your first name"}`} id='firstname' name='firstName' 
                                    {...register("firstName",{required:true})}    
                                    />
                                    {
                                        errors.firstName && (
                                            <span className='text-yellow-50'>Please enter your First Name</span>
                                        )
                                    }
                                </div>
                                <div className='flex flex-col w-full lg:w-[49%] gap-[6px]'>
                                    <label htmlFor='lastname' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Last Name</label>
                                    <input className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full' type='text' 
                                    placeholder={`${user.lastName ?? "Enter your last name"}`} id='lastname' name='lastName' 
                                    {...register("lastName",{required:true})}
                                    />
                                    {
                                        errors.lastName && (
                                            <span className='text-yellow-50'>Please enter your Last Name</span>
                                        )
                                    }
                                </div>

                                <div className='flex flex-col w-full lg:w-[49%] gap-[6px]'>
                                    <label htmlFor='dateOfBirth' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Date of Birth</label>
                                    <input className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full' type='date' 
                                    placeholder='dd-mm-yyyy' id='dateOfBirth' name='dateOfBirth' 
                                    {...register("dateOfBirth",{required:true})}
                                    />
                                    {
                                        errors.dateOfBirth && (
                                            <span className='text-yellow-50'>Please enter your Date of Birth</span>
                                        )
                                    }
                                </div>

                                <div className='flex flex-col w-full lg:w-[49%] gap-[6px]'>
                                    <label htmlFor='gender' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Gender</label>
                                    <select className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full'
                                    id='gender' name='gender' {...register("gender")}>
                                        <option value={"Male"} defaultValue>Male</option>
                                        <option value={"Female"}>Female</option>
                                        <option value={"Non-Binary"}>Non-Binary</option>
                                        <option value={"Prefer Not to Say"}>Prefer Not to Say</option>
                                        <option value={"Other"}>Other</option>
                                    </select>
                                </div>

                                <div className='flex flex-col w-full lg:w-[49%] gap-[6px]'>
                                    <label htmlFor='contact' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Contact Number</label>
                                    <input className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full'  type='text' 
                                    placeholder='Enter your contact number' id='contact' name='contactNumber' 
                                    {...register("contactNumber",
                                                {
                                                    required:{value:true,message:"Enter your phone number"},
                                                    minLength:{value:8,message:"Invalid phone number"},
                                                    maxLength:{value:10,message:"Invalid phone number"}
                                                })}    
                                    />
                                    {
                                        errors.contactNumber && (
                                            <span className='text-yellow-50'>{errors.contactNumber.message}</span>
                                        )
                                    }
                                </div>

                                <div className='flex flex-col w-full lg:w-[49%] gap-[6px]'>
                                    <label htmlFor='about' className='text-[14px] font-normal leading-[22px] text-richblack-5'>About</label>
                                    <input className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full' type='text' 
                                    placeholder='About Yourself' id='about' name='about' 
                                    {...register("about",{required:true})}
                                    />
                                    {
                                        errors.about && (
                                            <span className='text-yellow-50'>Please tell us about yourself</span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end items-center gap-4'>
                        <Link to='/dashboard/my-profile' className={` flex items-center gap-2 font-inter text-center text-lg leading-[24px] px-[25px] py-[10px] rounded-md font-bold bg-richblack-500`}>
                            Cancel
                        </Link>
                        <button type='submit' className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'>
                            Save
                        </button>   
                    </div>
                </form>
  
              {/* section 3 */}
              <form onSubmit={passwordSubmitHandler} className='flex flex-col gap-10'>
                <div className='py-6 px-10 flex flex-wrap justify-between gap-x-48 gap-y-10 bg-richblack-800 rounded-md'>
                    <div className='w-full flex flex-col gap-8 '>
                        <p className='text-richblack-5 font-semibold text-xl'>Change Password</p>
                        <div className='w-full flex flex-col lg:flex-row gap-5 justify-between'>
                            <div className='flex flex-col relative w-full lg:w-[49%] gap-[6px]'>
                                <label htmlFor='currentPassword' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Current Password </label>
                                <input className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full flex items-center' type={`${showPassword?"text":"password"}`} placeholder='Enter Current Password' id='currentPassword' name='currentPassword' 
                                value={passwordData.currentPassword} onChange={changeHandler} required/>
                                <span className='absolute right-[10px] bottom-4 text-base cursor-pointer' onClick={()=>{setShowPassword(!showPassword)}}>
                                    {
                                        showPassword?(<IoEyeOffOutline />):(<IoEyeOutline />)
                                    }
                                </span>
                            </div>

                            <div className='flex flex-col relative w-full lg:w-[49%] gap-[6px]'>
                                <label htmlFor='password' className='text-[14px] font-normal leading-[22px] text-richblack-5'>New Password </label>
                                <input className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 text-base font-medium w-full flex items-center' type={`${showNewPassword?"text":"password"}`} placeholder='Enter New Password' id='password' name='newPassword' 
                                value={passwordData.newPassword} onChange={changeHandler} required/>
                                <span className='absolute right-[10px] bottom-4 text-base cursor-pointer' onClick={()=>{setShowNewPassword(!showNewPassword)}}>
                                    {
                                        showNewPassword?(<IoEyeOffOutline />):(<IoEyeOutline />)
                                    }
                                </span>
                            </div>
                            <div className='flex flex-col relative w-full lg:w-[49%] gap-[6px]'>
                                <label htmlFor='confirmPassword' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Confirm New Password </label>
                                <input className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-5 flex items-center
                                text-base font-medium w-full' type={`${showConfirmPassword?"text":"password"}`} 
                                placeholder='Enter Confirm Password' id='confirmPassword' name='confirmNewPassword' onChange={changeHandler} value={passwordData.confirmNewPassword} required/>
                                <span className='absolute right-[10px] bottom-4 cursor-pointer' onClick={()=>{setShowConfirmPassword(!showConfirmPassword)}}>
                                    {
                                        showConfirmPassword?(<IoEyeOffOutline />):(<IoEyeOutline />)
                                    }
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-end items-center gap-4'>
                    <Link to='/dashboard/my-profile' className={` flex items-center gap-2 font-inter text-center text-lg leading-[24px] px-[25px] py-[10px] rounded-md font-bold bg-richblack-500`}>
                        Cancel
                    </Link>
                    <button type='submit' className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'>
                        Update
                    </button>   
                </div>
              </form>


              {/* section 4 */}
              <div className='p-6 flex gap-[19px] items-start border border-pink-700 bg-pink-900 rounded-md'>
                <div className='p-[14px] flex place-items-center gap-[10px] rounded-full bg-pink-700'>
                    <img src={RemoveIcon}
                        width="24px"
                        height="22px"
                        className='text-pink-200'
                    />
                </div>
                <div className='flex flex-col pr-30 gap-2'>
                    <p className='text-[18px] font-bold leading-[26px] text-pink-5'>Delete Account</p>
                    <div className='w-[60%]'>
                        <p className='text-[14px] text-pink-25 leading-[22px] font-medium'>Would you like to delete account?</p>
                        <p className='text-[14px] text-pink-25 leading-[22px] font-medium'>This account contains Paid Courses. Deleting your account will remove all the contain associated with it.</p>
                    </div>
                    <button className='text-pink-300 text-base italic font-medium flex items-start cursor-pointer'
                    onClick={deleteProfileHandler}>
                        I want to delete my account.
                    </button>
                </div>
              </div>
                            
          </div>
      </div>
    )
}
