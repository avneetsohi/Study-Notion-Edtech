import React, { useEffect, useState } from 'react'
import { MdArrowBackIos } from "react-icons/md";
import { Link, useLocation, useParams } from 'react-router-dom';
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useSelector } from 'react-redux';

export const ViewCourseSidebar = ({course,setReviewModal,setOverlay}) => {
    const location=useLocation()
    const {sectionId,subSectionId}=useParams()
    const {totalNoOfLectures,completedLectures,courseSectionData,courseEntireData}=useSelector((state)=>state.viewCourse)
    const [activeSection,setActiveSection]=useState(sectionId)
    const [activeSubSectionId,setActiveSubSectionId]=useState(subSectionId)
    

    useEffect(()=>{
        setActiveSection(sectionId)
        setActiveSubSectionId(subSectionId)
    },[location.pathname,completedLectures])
    
  return (
    <div className=' min-w-[265px] flex flex-col pt-6 border-r-[1px] border-r-richblack-700 bg-richblack-800 min-h-[calc(100vh-3.5rem)] overflow-hidden'>
        <div className='px-3'>
            <div className='flex justify-between'>
                <Link to='dashboard/enrolled-courses' className='flex items-center justify-center rounded-full bg-richblack-500 pl-3 pr-2 py-3'>
                    <MdArrowBackIos className='text-white'/>
                </Link>
                <button className='bg-yellow-50 px-4 py-2 rounded-md flex items-center text-richblack-900 font-semibold'
                onClick={()=>{
                    setReviewModal(true)
                    setOverlay(true)
                }}>
                    Add Review
                </button>
            </div>
            <div className='mt-4'>
                <p className='text-[16px] font-medium text-richblack-50'>{course?.courseName}</p> 
                <p className='text-[16px] font-medium text-richblack-100'>
                    {completedLectures.length}/{totalNoOfLectures}
                </p>
            </div>
            <div className='w-full h-[1px] bg-richblack-500 mt-2'></div>
        </div>

        <div>
            {
                course?.courseContent.map((section)=>(
                    <div key={section._id} className='mt-3'>
                        <div  className='px-3 flex items-center justify-between bg-richblack-500 py-3 cursor-pointer'
                        onClick={()=>{
                            if(activeSection===section._id){
                                setActiveSection(null)
                            }else{
                                setActiveSection(section._id)
                            }
                        }}>
                            <p className='text-richblack-25 font-semibold text-sm'>{section?.sectionName}</p>
                            {
                                activeSection===section._id?(<IoIosArrowUp className='text-richblack-5'/>):(<IoIosArrowDown className='text-richblack-5'/>)
                            }
                        </div> 
                        
                        {
                            activeSection===section._id && section?.subSection?.map((lecture)=>(
                                <div key={lecture._id} className={`px-3 py-2 text-richblack-5 flex items-center gap-2 mt-2 ${activeSubSectionId===lecture._id?"bg-yellow-100":""}`}>
                                    <input type='checkbox'
                                        checked={completedLectures.includes(lecture._id)}
                                        readOnly
                                    />
                                    <Link to={`view-course/${course._id}/section/${section._id}/sub-section/${lecture._id}`} className= {` ${activeSubSectionId===lecture._id?"text-richblack-900":""} w-full font-semibold text-[14px]`}
                                    onClick={()=>{
                                        setActiveSubSectionId(lecture._id)
                                        
                                    }}>
                                        {lecture?.title}
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                ))
            }
        </div>
    </div>
  )
}
