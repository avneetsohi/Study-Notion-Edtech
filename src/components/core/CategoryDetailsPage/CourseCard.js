import React, { useEffect, useState } from 'react'
import apiConnector from '../../../services/apiconnector';
import { rating_Review } from '../../../services/apis';
import { Link } from 'react-router-dom';
import { COURSE_STATUS } from '../../../utils/constants';
import RatingStars from '../../common/RatingStars';
import { averageRating } from '../../../utils/averageRating';


export const CourseCard = ({course}) => {

    // Use if want to use average rating function made in Utils folder
    //const avgRating=averageRating(course.ratingAndReviews);


    const [averageRating,setAverageRating]=useState(null);
    
    const fetchAverageRating = async(courseID) => {
        
        try{
            const result=await apiConnector("POST",rating_Review.GET_AVERAGE_RATING_API,{courseID});
            if(!result.data.success){
                throw new Error(result.data.message);
            }
            
            setAverageRating(result.data.averageRating);
            
        }catch(error){
            console.log("Error occured while fetching average rating for course list",error);
            return 0;
        }
        
    }
    
    useEffect(()=>{
        fetchAverageRating(course._id);
    },[])

  return (
    <>
        {
            course.status===COURSE_STATUS.PUBLISHED &&
            <Link to={`/courses/${course._id}`} key={course._id} 
            className='flex flex-col justify-start cursor-pointer'>                            
                <div >
                    <img src={course.thumbnail}
                        className='w-[390px] h-[280px] object-contain aspect-video'
                    />
                </div>
                <p className='text-[18px] text-richblue-5 font-medium'>{course.courseName}</p>
                <p className='text-richblack-5 text-sm font-medium italic'>{course.instructor?.firstName} {course.instructor?.lastName}</p>
                <div className='flex gap-2 items-center'>
                    <p className='text-yellow-50 text-sm font-medium'>{averageRating ?? 0}</p>
                    <RatingStars Review_Count={averageRating} Star_Size={18}/>
                    <p className='text-richblack-200 text-[13px] font-normal'>{course.ratingAndReviews.length} Ratings</p>
                </div>
                <p className='text-richblack-5 text-[18px] font-medium'>Rs.{course.price}</p> 
            </Link>
        }
    </>
    
  )
}
