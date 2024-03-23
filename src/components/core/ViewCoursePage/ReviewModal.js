import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-stars';
import apiConnector from '../../../services/apiconnector';
import { rating_Review } from '../../../services/apis';
import toast from 'react-hot-toast';

export const ReviewModal = ({setReviewModal,setOverlay}) => {
    const {courseId}=useParams()
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)
    const [loading,setLoading]=useState(false)
    const [rating,setRating]=useState(0)
    const {
        register,
        handleSubmit,
        formState:{errors},
        setValue,
        getValues
    }=useForm()

    const ratingChangeHandler=(newRating)=>{
        
        setRating(newRating)
    }

    const createReviewHandler=async (data)=>{
        setReviewModal(false)
        setOverlay(false)
        try{    
            const response=await apiConnector("POST",rating_Review.CREATE_RATING_API,{courseId,rating,review:data.review},{
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("Create Rating API RESPONSE",response)
            toast.success("Added Your Review to the Course Successfully ")

        }catch(error){
            console.log("Error occured while creating review",error)
            toast.error("You have Already Reviewed the Course")
        }
       
        
    }

  return (
    <div className='absolute top-40 translate-x-[20%] lg:left-72 lg:translate-x-[50%] rounded-md bg-richblack-800 border mx-auto border-richblack-100  z-20 px-6 py-7 flex flex-col '>
        <div className='flex items-center px-2 justify-between text-white'>   
            <p className='text-lg font-medium '>Add Review</p>
            <button className=''
            onClick={()=>{
                setReviewModal(false)
                setOverlay(false)
            }}>
                <RxCross2 fontSize={18} />
            </button>
        </div>
        <div className='w-full h-[2px] bg-richblack-700 mt-2'></div>
        <div className='flex flex-col px-6 mt-4'>
            <div className='flex gap-3 items-center justify-center text-white'>
                <img
                    src={user.image}
                    className='w-20 rounded-full object-contain'
                />
                <div className='flex flex-col gap-[1px] items-center'>
                    <p className='text-lg font-medium text-richblack-50 '>{user.firstName} {user.lastName}</p>
                    <p className='text-base font-medium text-richblack-100'>Hosting Publicly</p>
                </div>
            </div>

            <div className='mt-2 flex justify-center'>
                <ReactStars
                    size={30}
                    onChange={ratingChangeHandler}
                />
            </div>

            <form onSubmit={handleSubmit(createReviewHandler)}>
                <div className='flex flex-col w-full gap-[6px] mt-2'>
                    <label htmlFor='review' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Add Your Experience <sup className='text-pink-200'>*</sup></label>
                    <textarea className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium min-h-[130px] w-full' type='text'
                        placeholder='Enter your Valuable Review'
                        draggable="false" 
                        name="review" id="review" 
                        cols={50}
                        {...register("review",{required:true})}
                    />
                    {
                        errors?.review && 
                        (
                            <span className='text-yellow-25'>
                                Review is Required!
                            </span>
                        )
                    }
                </div>

                <div className='flex justify-end gap-4 mt-6'>
                    <button type='button' className='bg-richblack-700 px-4 py-2 rounded-md flex items-center text-richblack-5 font-semibold'
                    onClick={()=>{
                        setReviewModal(false)
                        setOverlay(false)
                    }}>
                        Cancel
                    </button>

                    <button className='bg-yellow-50 px-4 py-2 rounded-md flex items-center text-richblack-900 font-semibold'>
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}
