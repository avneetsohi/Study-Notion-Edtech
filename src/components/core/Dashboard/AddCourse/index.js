import React, { useState } from 'react'
import { RenderSteps } from './RenderSteps'
import { useSelector } from 'react-redux'

export default function AddCourse() {
  
  const {editDetails}=useSelector((state)=>state.course)

  
  return (
    <div className='flex '>
        <div className='flex flex-col gap-8 w-full rounded-lg'>
            <h1 className='text-4xl font-medium text-richblack-5'>{editDetails?"Edit":"Add"} Course</h1>
            <RenderSteps />
        </div>
        {
          
          !editDetails && <div className='flex flex-col h-fit p-6 gap-[19px] rounded-lg border border-richblack-700 bg-richblack-800 w-[45%]'>
            <p className='text-[18px] font-semibold leading-[26px] text-richblack-5'>⚡Course Upload Tips</p>
            <ul className='list-item list-disc items-center space-y-[11px] '>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5 '>Set the Course Price option or make it free.</li>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5  '>Standard size for the course thumbnail is 1024x576.</li>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5  '>Video section controls the course overview video.</li>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5  '>Course Builder is where you create & organize a course.</li>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5  '>Add Topics in the Course Builder section to create lessons, quizzes, and assignments.</li>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5  '>Information from the Additional Data section shows up on the course single page.</li>
                <li className='text-[12px] font-medium leading-[20px] text-richblack-5  '>Make Announcements to notify any important</li>
                <li className='text-[12px] font-medium leading-[20px]  text-richblack-5 '>Notes to all enrolled students at once.</li>
              </ul>
          </div> 
        }
    </div>
  )
}
