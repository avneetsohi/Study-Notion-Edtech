import React, { useEffect, useState } from 'react'
import { GrPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from 'react-redux';
import { resetCourseState, setStep } from '../../../../slices/courseSlice';
import { COURSE_STATUS } from '../../../../utils/constants';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import apiConnector from '../../../../services/apiconnector';
import { courses } from '../../../../services/apis';
import toast from 'react-hot-toast';
import { BiCheckboxChecked } from 'react-icons/bi';

export const PublishCouseStep = () => {
  
  const {
    register,
    handleSubmit,
    setValue,
    getValues
  }=useForm()

  const dispatch=useDispatch()
  const {course}=useSelector((state)=>state.course)
  const {token}=useSelector((state)=>state.auth)
  const navigate=useNavigate()
  const [loading,setLoading]=useState(false)

  const {editDetails}=useSelector((state)=>state.course)

  function prevStepHandler(){
    dispatch(setStep(2))
  }
  

  function draftCourseHandler(){
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const onSubmit = async (data) => {
    
    if((course?.status===COURSE_STATUS.PUBLISHED && getValues("status")===true) || 
    (course?.status===COURSE_STATUS.DRAFT && getValues("status")===false)){
      dispatch(resetCourseState())
      navigate("/dashboard/my-courses")
      return
    }

    const formData=new FormData()
    formData.append("courseId",course._id)
    formData.append("status",data.status?COURSE_STATUS.PUBLISHED:COURSE_STATUS.DRAFT)
    
    formData.append("courseName",course.courseName)
    formData.append("courseDescription",course.courseDescription)
    formData.append("price",course.price)
    formData.append("categoryId",course.category._id)
    formData.append("whatYouWillLearn",course.whatYouWillLearn)
    formData.append("instructions",course.instructions)
    formData.append("tag",course.tags)
    

    try{
      setLoading(true)
      
      const response=await apiConnector("PUT",courses.EDIT_COURSE_API,formData,{

        Authorization:`Bearer ${token}`
      })
     
      if(!response.data.success){
        throw new Error(response.data.message)
      }
      console.log("EDIT COURSE STATUS API RESPONSE......",response)
      toast.success("Updated the course details successfully")
      dispatch(resetCourseState())
      setLoading(false)
      navigate("/dashboard/my-courses")
    }catch(error){
      setLoading(false)
      console.log("Error occured while updating course status",error)
      toast.error("Failed to update the Course Status")
    }
    
  }

  useEffect(()=>{
    console.log("COURSE DETAILS",course)
    if(course?.status===COURSE_STATUS.PUBLISHED){
      setValue("status",true)
    }
  },[])

  return (
    <div className='bg-richblack-800 rounded-lg py-6 px-6 mt-10 mr-3'>
        <h1 className='text-2xl font-medium text-richblack-5 mt-2 px-6'>Course Builder</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-2 px-6 mt-[26px] items-center'>
            <input type='checkbox' name='status' id='status' className='rounded-md h-5 w-5' 
            {...register("status") }
            />
            <label htmlFor='status' className='text-base font-medium text-richblack-400'>Make this Course Public</label>
          </div>

          <div className='w-full flex justify-between items-center mt-[26px] pr-2'>
              <button type='button' className='bg-richblack-800  text-richblack-25 px-6 py-2 flex gap-[3px] items-center rounded-md'
              disabled={loading}
              onClick={prevStepHandler}>
                  <GrPrevious fontSize={14}/>
                  Back
              </button>

              <div className='flex gap-x-2 '>
                  {
                    !editDetails &&
                    <button type='button' className='flex gap-2 items-center bg-richblack-700  text-richblack-25 text-lg font-semibold px-6 py-2 rounded-md'
                    onClick={draftCourseHandler}>
                      Save as Draft
                    </button>
                  }
                  <button className='flex gap-2 items-center bg-yellow-50 border border-yellow-50 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
                  disabled={loading}
                  >
                      {
                        editDetails?"Save Changes":"Save and Publish"
                      }
                  </button>
              </div>
          </div>
        </form>
    </div>
  )
}
