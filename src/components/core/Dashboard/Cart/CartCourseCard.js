import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import StarRatings from 'react-star-ratings';
import RemoveIcon from '../../../../assets/Logo/RemoveIcon.svg'
import { averageRating } from '../../../../utils/averageRating';
import { removeFromCart} from '../../../../slices/cartSlice';
import RatingStars from '../../../common/RatingStars';

export const CartCourseCard = ({course,index}) => {
    const {itemCart,totalItems,total}=useSelector((state)=>state.cart)
    const dispatch=useDispatch()
  return (
    <div className={`flex gap-4 lg:gap-14 justify-between items-start pb-4 pl-2 pr-1 ${index!==itemCart.length?"border-b border-richblack-700":""}`}>
            
        <div className='w-[80%] flex gap-5'>
            <div className='w-[35%]'>
                <img
                    src={course?.thumbnail}
                    className='w-[100px] lg:w-[250px] lg:h-[135px] object-contain'
                />
            </div>
            <div className='flex flex-col gap-1'>
                <p className='text-lg text-richblack-5'>{course.courseName}</p>
                <p className='text-sm text-richblack-5 mt-1'>{course.category.name}</p>
                <div className='flex flex-row mt-1 items-center gap-x-2 text-yellow-25 text-xl'>
                    <p >{averageRating(course.ratingAndReviews)}</p>
                    <RatingStars
                        Review_Count={averageRating(course.ratingAndReviews)}
                        Star_Size={28}
                       
                    />
                    <p>{course.ratingAndReviews.length} Reviews</p>
                </div>
            </div>
        </div>
        

        <div className='flex flex-col gap-3 md:w-full lg:w-fit items-end'>
            <button className='text-pink-200 bg-richblack-600 flex items-center gap-2 py-4 px-3 rounded-md'
            onClick={()=>{
                dispatch(removeFromCart(course._id))
            }}>
                <img src={RemoveIcon}
                width="24px"
                height="22px"
                className='text-pink-200'
                />  
                Remove
            </button>

            <p className='text-yellow-25 text-2xl font-semibold'>₹ {course.price}</p>
        </div>
    </div>
  )
}
