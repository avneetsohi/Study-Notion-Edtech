import React, { useEffect, useState } from 'react'
import CountryCodes from '../../../data/countrycode.json'

import { useForm } from 'react-hook-form';
import apiConnector from '../../../services/apiconnector';
import { enquiry } from '../../../services/apis';
import toast from 'react-hot-toast';

export const ContactUsForm = () => {

    const [loading,setLoading]=useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState:{errors,isSubmitSuccessful}
    } = useForm();

    const submitContactForm = async (data) => {
       
        console.log("Logging data",data)
        setLoading(true);
        try{
            const response= await apiConnector("POST",enquiry.CONTACTUS_API,data);
            
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("RESPONSE API",response)
            toast.success("Your message has been send")
        }catch(error){
            console.log("ERROR IN CONTACT US FORM",error.message);
            toast.error("Error while sending the message");
        }
        setLoading(false);

    }

    useEffect(()=>{
        if(isSubmitSuccessful){
            reset({
                firstName:"",
                lastName:"",
                email:"",
                message:"",
                contact:""
            })
        }
    },[reset,isSubmitSuccessful])

  return (
    <div>
        {
            loading?(
                <div className='custom-loader mx-auto'></div>
            ):(
                <form onSubmit={handleSubmit(submitContactForm)} className='w-full flex flex-col gap-5'>
                    {/* FirstName and Lastname */}
                    <div className='flex flex-col lg:flex-row gap-x-4 gap-y-3'>
                        <div className='flex flex-col w-full gap-[6px]'>
                            <label htmlFor='firstname' className='text-[14px] font-normal leading-[22px] text-richblack-5'>First Name <sup className='text-pink-200'> *</sup></label>
                            <input className=' outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full'  type='text' 
                            placeholder='Enter your first name' id='firstname' name='firstName' 
                            {...register("firstName",{required:true})}    
                            />
                            {
                                errors.firstName && (
                                    <span>Please enter your First Name</span>
                                )
                            }
                        </div>
                        <div className='flex flex-col w-full gap-[6px]'>
                            <label htmlFor='lastname' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Last Name</label>
                            <input className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium w-full' type='text' 
                            placeholder='Enter your last name' id='lastname' name='lastName' 
                            {...register("lastName")}
                            />
                        </div>
                    </div>

                    {/* email */}
                    <div className='flex flex-col  gap-[6px]'>
                        <label htmlFor='email' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Email Address <sup className='text-pink-200'> *</sup></label>
                        <input type='email'  className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium' 
                        placeholder='Enter email address' id='email' name='email' 
                        {...register("email",{required:true})}
                        />
                        {
                            errors.email && (
                                <span>Please enter your email address</span>
                            )
                        }

                    </div>

                    {/* phone number */}
                    <div className='flex flex-col gap-[6px]'>
                        <label htmlFor='contact' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Phone Number <sup className='text-pink-200'> *</sup> </label>
                        <div className='flex gap-x-4'>
                            <select className='w-[20%] outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium'
                            name='dropdown' id='dropdown' {...register("dropdown",{required:true})}>
                                {
                                    CountryCodes.map((element,index)=>(
                                    <option key={index} value={element.code} selected={`${element.country==='India'?"selected":""}`} >{element.code} {" "} -{element.country}</option>
                                    ))
                                }
                            </select>
                            <input type='number'  className='w-full outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium' 
                            placeholder='1234567890' id='contact' name='contact' 
                            {...register("contact",
                                {
                                    required:{value:true,message:"Please enter your Phone number"},
                                    maxLength:{value:10,message:"Invalid Phone Number"},
                                    minLength:{value:8,message:"Invalid Phone Number"}
                                })
                            } 
                            />
                            {
                                errors.contact && (
                                    <span>{errors.contact.message}</span>
                                )
                            }
                        </div>
                    </div>

                    {/* message */}
                    <div className='flex flex-col gap-[6px] '>
                        <label htmlFor='message' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Message <sup className='text-pink-200'> *</sup></label>
                        <textarea rows={8} cols={15} className='outline-none p-3 rounded-[8px] bg-richblack-800 text-richblack-200 text-base font-medium' 
                        placeholder='Enter your message here' id='message' name='message' 
                        {...register("message",{required:true})}
                        />
                        {
                            errors.message && (
                                <span>Please enter your message</span>
                            )
                        }
                    </div>

                    <button className={`w-full text-center text-base font-semibold p-3 rounded-md bg-yellow-50 text-black
                    hover:scale-95 transition-all duration-200 cursor-pointer `}>
                        Send Message
                    </button>
                </form>
            )
        }
    </div>
  )
}


// {firstName:data.firstName,lastName:data.lastName,email:data.email,contact:data.contact,message:data.message}