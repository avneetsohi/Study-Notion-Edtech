import React, { useEffect, useState } from 'react'
import {Swiper,SwiperSlide} from 'swiper/react'
import 'swiper/css'
import { Autoplay, Pagination, Navigation,FreeMode } from 'swiper/modules';
import apiConnector from '../../services/apiconnector'
import { rating_Review } from '../../services/apis'
import RatingStars from './RatingStars';

export const ReviewSlider = () => {

    const [reviews,setReviews]=useState([])
    const truncated=15

    const fetchAllReviews=async()=>{
        try{
            const response=await apiConnector("GET",rating_Review.GET_ALL_REVIEWS)
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("GET ALL REVIEWS API RESPONSE",response)
            setReviews(response.data.data)
        }catch(error){
            console.log("Error occured while fetching Reviews",error)
        }
    }

    useEffect(()=>{
        fetchAllReviews()
    },[])

    if(reviews.length==0){
        return (
            <div className='w-11/12 max-w-maxContent flex items-center'>
                <p className=' mx-auto text-center text-xl font-semibold text-richblack-200'>No reviews Available!!!!</p>
            </div>
        )
    }

  return (
    <div className='w-11/12 max-w-maxContent flex items-center'>
        <Swiper
            spaceBetween={15}
            slidesPerView={4}
            autoplay={{
                delay: 2500,
                disableOnInteraction: false,
            }}
            loop={true}
            navigation={true}
            modules={[Autoplay,FreeMode,Navigation]}
            className="mySwiper"
        >
            {
                reviews?.map((data,index)=>(
                    <SwiperSlide>
                        <div key={index} className='text-white flex flex-col gap-3 bg-richblack-800 pl-3 pr-[11px] py-3 rounded-md max-h-[300px]'>
                            <div className='flex gap-2 items-center'>
                                <img
                                    className='w-14 h-14 rounded-full '
                                    src={data.user.image? 
                                        data.user.image:
                                        `https://api.dicebear.com/5.x/initials/svg?seed=${data.user.firstName} ${data.user.lastName}`}
                                />
                                <div className='flex flex-col'>
                                    <p className='text-richblack-50'>{data.user.firstName} {data.user.lastName}</p>
                                    <p className='text-richblack-50 text-[14px]'>{data.course.courseName}</p>
                                </div>
                            </div>
                            <p className='text-richblack-25 text-[15px]'>
                                {data.review.split(" ").splice(0,truncated).join(" ")}...
                            </p>
                            <div className='flex gap-2 items-center'>
                                <p className='text-lg font-semibold text-yellow-25'>{data.rating.toFixed(1)}</p>
                                <RatingStars
                                    Review_Count={data.rating}
                                    Star_Size={20}
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }
        </Swiper>
    </div>
  )
}
