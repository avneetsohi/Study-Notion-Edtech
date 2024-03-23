import React, { useEffect, useState } from 'react'
import { ViewCourseSidebar } from '../components/core/ViewCoursePage/ViewCourseSidebar'
import { Outlet, useParams } from 'react-router-dom'
import apiConnector from '../services/apiconnector'
import { courses } from '../services/apis'
import { ReviewModal } from '../components/core/ViewCoursePage/ReviewModal'
import { Overlay } from '../components/common/Overlay'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { setCompletedLectures, setCourseEntireData, setCourseSectionData, setTotalNoOfLectures} from '../slices/viewCourseSlice'

export const ViewCourse = () => {

    const {courseId}=useParams()
    const [reviewModal,setReviewModal]=useState(false)
    const [overlay,setOverlay]=useState(false)
    const [loading,setLoading]=useState(false)
    const [courseData,setCourseData]=useState(null)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()

    const fetchCourseDetails=async()=>{
        try{
            setLoading(true)
            const response=await apiConnector("POST",courses.GET_COURSE_DETAILS_API_AUTHENTICATED,{courseId},{
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("FETCH COURSE DETAILS API RESPOSNE",response)
            setCourseData(response.data.data.courseDetails)
            dispatch(setCourseEntireData(response.data.data.courseDetails))
            dispatch(setCourseSectionData(response.data.data.courseDetails.courseContent))
            dispatch(setCompletedLectures(response.data.data.completedVideos))
            let lectures=0
            response.data.data.courseDetails.courseContent.forEach((section)=>{
                lectures+=section.subSection.length
            })
            dispatch(setTotalNoOfLectures(lectures))
        }catch(error){
            console.log("Error occured while fetching the course details",error)
            toast.error("Failed to fetch course details")
        }
        setLoading(false)
    }

    useEffect(()=>{
        fetchCourseDetails()
    },[courseId])

    if(loading){
        return (
            <div className='mt-52 mx-auto custom-loader'></div>
        )
    }

    if(!courseData?.courseContent?.length){
        return (
            <div className='text-richblack-100 mx-auto mt-52 text-3xl font-semibold'>No Course Content Found</div>
        )
    }

  return (
    <div>
        <div className={` h-[calc(100vh-3.5rem)]  flex w-full overflow-y-hidden`}>
            <ViewCourseSidebar course={courseData} setReviewModal={setReviewModal} setOverlay={setOverlay}/>
            <div className='min-h-[calc(100vh-3.5rem)] w-full overflow-y-auto'>
                <div className='mx-auto w-11/12  py-10 px-5'>
                    <Outlet/>
                </div>
            </div>
        </div>

        {reviewModal && <ReviewModal course={courseData} setReviewModal={setReviewModal} setOverlay={setOverlay}/>}

        {overlay && <Overlay/>}
    </div>
  )
}

// w-11/12 max-w-[1000px] 