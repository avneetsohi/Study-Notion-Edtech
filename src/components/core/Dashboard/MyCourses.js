import React, { useEffect, useState } from 'react'
import apiConnector from '../../../services/apiconnector';
import { CiCirclePlus } from "react-icons/ci";

import toast from 'react-hot-toast';
import { courses } from '../../../services/apis';
import { BsEmojiFrown } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetCourseState, setCourse, setEditDetails, setStep } from '../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../utils/constants';
import { LuClock } from "react-icons/lu";
import { ConfirmationModal } from '../../common/ConfirmationModal';
import { Overlay } from '../../common/Overlay';
import { FormatDate } from '../../../services/FormatDate';

export const MyCourses = () => {
    const [myCourses,setMyCourses]=useState(null);
    const {token}=useSelector((state)=>state.auth)
    const navigate=useNavigate()
    const {course}=useSelector((state)=>state.course)
    const dispatch=useDispatch();
    const [editIconHover,setEditIconHover]=useState(false);
    const [deleteIconHover,setDeleteIconHover]=useState(false);
    const [modal,setModal]=useState(false);
    const [overlay,setOverlay]=useState(false);
    const [courseId,setCourseId]=useState(null);
    const [loading,setLoading]=useState(false);
    const [courseDurations,setCourseDurations]=useState([])
    
   
    const getInstrutorCourses = async() => {
        
        try{
            setLoading(true);
            const response=await apiConnector("GET",courses.GET_INSTRUCTOR_COURSES_API,null,
            {
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("GET INSTRUCTOR COURSES API RESPONSE...",response)
            setMyCourses(response.data.data.courses)
            setCourseDurations(response.data.data.courseDurations)
            
        }catch(error){
            console.log("Error while fetching the courses",error)
            toast.error("Failed to fetch the courses")
        }
        
        setLoading(false)
    }

    const editCourse = (course) => {
        dispatch(setEditDetails(true))
        dispatch(setCourse(course))
        
        dispatch(setStep(1))

        navigate(`/dashboard/edit-course/${course._id}`)

    }

    function createCourse(){
        dispatch(resetCourseState())

        navigate("/dashboard/add-course");
    }

    const deleteCourse = async() => {
        setModal(false);
        setOverlay(false);
        try{
            const response=await apiConnector("DELETE",courses.DELETE_COURSE_API,{
                courseId
            },{
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("DELETE COURSE API RESPONSE...",response)
            toast.success("Deleted the course successfully")
            

        }catch(error){
            console.log("Error occured while deleting the course",error)
            toast.error("Failed to delete the course")
        }
        setCourseId(null);

    }


    useEffect(()=>{
        getInstrutorCourses();
    },[courseId])
  return (
    <div className='flex flex-col gap-14'>
        <div className='flex items-center justify-between w-full'>
            <h1 className='text-4xl font-medium text-richblack-5'>My Courses</h1>
            <button className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
            onClick={createCourse}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <g clipPath="url(#clip0_85103_3235)">
                    <path d="M9 0C7.21997 0 5.47991 0.527841 3.99987 1.51677C2.51983 2.50571 1.36628 3.91131 0.685088 5.55585C0.00389957 7.20038 -0.17433 9.00998 0.172937 10.7558C0.520204 12.5016 1.37737 14.1053 2.63604 15.364C3.89472 16.6226 5.49836 17.4798 7.24419 17.8271C8.99002 18.1743 10.7996 17.9961 12.4442 17.3149C14.0887 16.6337 15.4943 15.4802 16.4832 14.0001C17.4722 12.5201 18 10.78 18 9C17.9974 6.61384 17.0484 4.32616 15.3611 2.63889C13.6738 0.951621 11.3862 0.00258081 9 0V0ZM9 16.5C7.51664 16.5 6.0666 16.0601 4.83323 15.236C3.59986 14.4119 2.63856 13.2406 2.07091 11.8701C1.50325 10.4997 1.35473 8.99168 1.64411 7.53682C1.9335 6.08197 2.64781 4.74559 3.6967 3.6967C4.7456 2.64781 6.08197 1.9335 7.53683 1.64411C8.99168 1.35472 10.4997 1.50325 11.8701 2.0709C13.2406 2.63856 14.4119 3.59985 15.236 4.83322C16.0601 6.06659 16.5 7.51664 16.5 9C16.4978 10.9885 15.7069 12.8948 14.3009 14.3009C12.8948 15.7069 10.9885 16.4978 9 16.5ZM12.75 9C12.75 9.19891 12.671 9.38968 12.5303 9.53033C12.3897 9.67098 12.1989 9.75 12 9.75H9.75V12C9.75 12.1989 9.67099 12.3897 9.53033 12.5303C9.38968 12.671 9.19892 12.75 9 12.75C8.80109 12.75 8.61033 12.671 8.46967 12.5303C8.32902 12.3897 8.25 12.1989 8.25 12V9.75H6C5.80109 9.75 5.61033 9.67098 5.46967 9.53033C5.32902 9.38968 5.25 9.19891 5.25 9C5.25 8.80109 5.32902 8.61032 5.46967 8.46967C5.61033 8.32902 5.80109 8.25 6 8.25H8.25V6C8.25 5.80109 8.32902 5.61032 8.46967 5.46967C8.61033 5.32902 8.80109 5.25 9 5.25C9.19892 5.25 9.38968 5.32902 9.53033 5.46967C9.67099 5.61032 9.75 5.80109 9.75 6V8.25H12C12.1989 8.25 12.3897 8.32902 12.5303 8.46967C12.671 8.61032 12.75 8.80109 12.75 9Z" fill="#000814"/>
                    </g>
                    <defs>
                    <clipPath id="clip0_85103_3235">
                    <rect width="18" height="18" fill="white"/>
                    </clipPath>
                    </defs>
                </svg>
                Add Course 
            </button>
        </div>
        <div>
            {
                !myCourses?(
                    <div className='custom-loader mx-auto mt-52'></div>
                ):(
                    !myCourses.length?(
                        <p className='text-richblack-5 text-lg font-medium text-center flex items-center justify-center gap-2'>Sorry, but we are unable to find any courses prepared by you.  <BsEmojiFrown fontSize={24}/></p>
                    ):(
                        <div className='w-full border border-richblack-600 rounded-md'>
                            <div className='flex border-b border-richblack-600 pr-5'>
                                <div className=' p-4 text-[14px] font-medium leading-[22px] text-richblack-100 uppercase w-full'>Courses</div>
                                <div className='flex justify-between w-[70%]'>
                                    <div className='p-4  uppercase text-[14px] font-medium leading-[22px] text-richblack-100 w-[25%]'>Duration</div>
                                    <div className='p-4 ml-10 uppercase text-[14px] font-medium leading-[22px]  text-richblack-100 w-[25%] '>Price</div>
                                    <div className='p-4 uppercase text-[14px] font-medium leading-[22px] text-richblack-100 w-[20%] '>Actions</div>
                                </div>
                            </div>
                            {
                                myCourses.map((course,index)=>(
                                    <div key={course._id} className='flex'>
                                        <div className='w-full flex gap-x-5 p-4 items-start'>
                                            <div className='w-[30%]'>
                                                <img src={course.thumbnail}
                                                className='object-contain w-44 h-44'
                                                />
                                            </div>
                                            <div className='w-[79%]'>
                                                <p className='text-xl font-semibold text-richblack-5'>{course.courseName} </p>
                                                <p className='mt-2 text-[14px] leading-[22px] font-normal text-richblack-100'>{course.courseDescription}</p>
                                                <p className='mt-3 text-[12px] font-medium leading-5 text-richblack-25'>Created: {FormatDate(course.createdAt)} </p>
                                                <div className={`flex items-center gap-[6px] ${course.status===COURSE_STATUS.PUBLISHED?"text-yellow-50":"text-pink-200"} rounded-[20px] px-3 py-[4px] bg-richblack-700 w-fit mt-4 `}>
                                                    {
                                                        course.status===COURSE_STATUS.PUBLISHED?(
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M7.99961 14.3996C11.5342 14.3996 14.3996 11.5342 14.3996 7.99961C14.3996 4.46499 11.5342 1.59961 7.99961 1.59961C4.46499 1.59961 1.59961 4.46499 1.59961 7.99961C1.59961 11.5342 4.46499 14.3996 7.99961 14.3996ZM11.0849 6.55251C11.2798 6.28452 11.2205 5.90927 10.9525 5.71437C10.6845 5.51946 10.3093 5.57871 10.1144 5.84671L7.32736 9.67884L5.82387 8.17534C5.58956 7.94103 5.20966 7.94103 4.97535 8.17534C4.74103 8.40966 4.74103 8.78956 4.97535 9.02387L6.97535 11.0239C7.09942 11.148 7.2716 11.2115 7.44654 11.1978C7.62148 11.184 7.78164 11.0944 7.88485 10.9525L11.0849 6.55251Z" fill="#FFD60A"/>
                                                            </svg>):(
                                                                <LuClock className='text-pink-200'/>
                                                            )
                                                    }
                                                    {/* {course.status} */}
                                                    {
                                                        course.status===COURSE_STATUS.PUBLISHED?("Published"):("Drafted")
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className='flex justify-between items-center w-[70%] pr-5'>
                                            <div className='p-4 text-[14px] font-medium leading-[22px] text-richblack-100 w-[25%]'>{courseDurations[index]}</div>
                                            <div className='p-4 uppercase text-[14px] font-medium leading-[22px] text-right text-richblack-100 w-[25%]'>₹{course.price}</div>
                                            <div className='p-4 uppercase text-[14px] font-medium leading-[22px] text-richblack-100 w-[20%]  flex gap-[10px]  items-center '>
                                                <button onMouseOver={()=>setEditIconHover(true)} onMouseOut={()=>setEditIconHover(false)} onClick={()=>editCourse(course)} className='w-[25px] h-[25px]'
                                                disabled={loading}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className={`${editIconHover?"scale-100 transition-all duration-200":""}`} width={`${editIconHover?"24":"22"}`} height={`${editIconHover?"24":"22"}`} viewBox="0 0 22 22" fill="none">
                                                        <path d="M2.96389 16.2376L1.57592 19.7075C1.39634 20.1565 1.84188 20.602 2.29085 20.4224L5.76077 19.0345C6.31403 18.8132 6.81657 18.4818 7.23792 18.0605L19.249 6.04986C20.1603 5.13859 20.1603 3.66113 19.249 2.74986C18.3378 1.83859 16.8603 1.83859 15.949 2.74986L3.93792 14.7605C3.51657 15.1818 3.18519 15.6844 2.96389 16.2376Z" 
                                                        fill={`${editIconHover?"#049069":"#6E727F"}`} />
                                                    </svg>
                                                </button>
                                                <button onMouseOver={()=>setDeleteIconHover(true)} onMouseOut={()=>setDeleteIconHover(false)} className='w-[25px] h-[25px]' disabled={loading}
                                                onClick={()=>{
                                                    setModal(true)
                                                    setOverlay(true)
                                                    setCourseId(course._id)
                                                }}>
                                                    <svg className={`${deleteIconHover?"scale-100 transition-all duration-200":""}`} xmlns="http://www.w3.org/2000/svg" width={`${deleteIconHover?"24":"22"}`} height={`${deleteIconHover?"24":"22"}`} viewBox="0 0 22 22" fill={`${deleteIconHover?"#EF476F":"#6E727F"}`}>
                                                        <g clipPath="url(#clip0_11167_21031)">
                                                            <path d="M21.0827 2.75H16.4994V2.29167C16.4994 1.68388 16.2579 1.10098 15.8281 0.671214C15.3984 0.241443 14.8155 0 14.2077 0L7.79102 0C7.18323 0 6.60033 0.241443 6.17056 0.671214C5.74079 1.10098 5.49935 1.68388 5.49935 2.29167V2.75H0.916016V5.5H2.74935V19.25C2.74935 19.9793 3.03908 20.6788 3.55481 21.1945C4.07053 21.7103 4.77 22 5.49935 22H16.4994C17.2287 22 17.9282 21.7103 18.4439 21.1945C18.9596 20.6788 19.2493 19.9793 19.2494 19.25V5.5H21.0827V2.75ZM16.4994 19.25H5.49935V5.5H16.4994V19.25Z" fill={`${deleteIconHover?"#EF476F":"#fffff"}`}/>
                                                            <path d="M10.084 8.25H7.33398V16.5H10.084V8.25Z" fill={`${deleteIconHover?"#EF476F":"#fffff"}`}/>
                                                            <path d="M14.666 8.25H11.916V16.5H14.666V8.25Z" fill={`${deleteIconHover?"#EF476F":"#fffff"}`}/>
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_11167_21031">
                                                            <rect width={`${deleteIconHover?"24":"22"}`} height={`${deleteIconHover?"24":"22"}`} fill="white"/>
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </button>

                                            </div>
                                        </div>


                                    </div>
                                ))
                            }

                        </div>
                    )
                )
            }
        </div>

        {
            modal && 
            <ConfirmationModal setModal={setModal} setOverlay={setOverlay} 
            iconBtnText={"Delete"} iconBtnHandler={deleteCourse} 
            modalHeading={"Do you want to delete this course?"} 
            modalText={"All the data related to this course will be deleted"}/>
        }

        {
            overlay && <Overlay/>
        }
    </div>
  )
}
