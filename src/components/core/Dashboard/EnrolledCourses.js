import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import apiConnector from '../../../services/apiconnector';
import { courses } from '../../../services/apis';
import toast from 'react-hot-toast';
import { BsEmojiFrown } from "react-icons/bs";
import ProgressBar from '@ramonak/react-progress-bar';
import { Link } from 'react-router-dom';
import { getCourseProgress } from '../../../utils/progressPercentage';

export const EnrolledCourses = () => {
    const [enrolledCourses,setEnrolledCourses]=useState(null);
    const [loading,setLoading]=useState(false);
    const [courseDurations,setCourseDurations]=useState([])
    const [coursePercentages,setCoursePercentages]=useState([])
    const {token}=useSelector((state)=>state.auth)
    const {user}=useSelector((state)=>state.profile)

    const getEnrolledCourses = async() => {
        
        
        try{
            const response=await apiConnector("GET",courses.GET_ENROLLED_COURSES_API,null,
            {
                Authorization: `Bearer ${token}`,
            })
            
            console.log("ENROLLED COURSES API RESPONSE....",response)
            setEnrolledCourses(response.data.data.enrolledCourses)
            setCourseDurations(response.data.data.courseDurations) 
            setCoursePercentages(response.data.data.coursePercentages)
        }catch(error){
            console.log(error);
            toast.error("Error in fetching the courses")
        }
        
    }

    console.log("Enrolled Courses",enrolledCourses)

    useEffect(()=>{
        getEnrolledCourses();
    },[])
  return (
    <div className='flex flex-col gap-14 '>
        <h1 className='text-4xl font-medium text-richblack-5'>Enrolled Courses</h1>
        <div>
            <div className='w-full '>
                
                {
                    !enrolledCourses?(
                        <div className='custom-loader mx-auto mt-52'></div>
                    ):(
                        enrolledCourses.length===0?(
                            <p className='text-richblack-5 text-lg font-medium text-center flex items-center justify-center gap-2'>Sorry, but we are unable to find any courses in which you are enrolled.  <BsEmojiFrown fontSize={24}/></p>
                        ):(
                            <div className='w-full border border-richblack-500 rounded-md text-richblack-5'>
                                <div className='bg-richblack-500 flex  justify-between flex-2 1 1 px-4 py-3 text-richblack-5 rounded-md'>
                                    <p className='w-[60%]'>Course Name</p>
                                    <p className='w-[15%]'>Duration</p>
                                    <p className='w-[15%] text-center'>Progress</p>
                                </div>
                                
                                {
                                    enrolledCourses.map((course,index)=>(
                                        <Link to={`/view-course/${course?._id}/section/${course?.courseContent[0]?._id}/sub-section/${course?.courseContent[0]?.subSection[0]?._id}`} key={course?._id} className=' flex justify-between gap-3 items-center  px-6 py-3 rounded-md'>
                                            <div className='flex gap-x-5 items-center w-[60%]'>
                                                <img src={course.thumbnail}
                                                    className='w-56 h-44 object-contain'
                                                />
                                                <div>
                                                    <p className='text-lg font-semibold'>{course?.courseName}</p>
                                                    <p className='text-sm'>{course?.courseDescription}</p>
                                                </div>
                                            </div>

                                            <div className='w-[15%]'>
                                                <p className=''>{courseDurations[index]} </p>
                                            </div>

                                            <div className='flex flex-col gap-4 w-[15%]'>
                                                <p className='text-center'>Progress {coursePercentages[index] || 0}%</p>
                                                <ProgressBar    //Learn about this from  ramonak library npm react when need to style
                                                    height='8px'
                                                    completed={coursePercentages[index] || 0}
                                                    isLabelVisible={false}
                                                />
                                            </div>
                                        </Link>
                                    ))
                                }
                                
                            </div>
                        )
                    )
                }
            </div>
        </div>
    </div>
  )
}



// coursePercentages[index]
// getCourseProgress(course,user)