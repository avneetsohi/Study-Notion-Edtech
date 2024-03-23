import React, { useEffect, useState } from 'react'
import { FaCheck } from "react-icons/fa6";
import { CourseBuilderStep } from './CourseBuilderStep';
import { PublishCouseStep } from './PublishCouseStep';
import { CourseInformationStep } from './CourseInformationStep';
import { useSelector } from 'react-redux';


export const RenderSteps = () => {
    
    const {editDetails,step}=useSelector((state)=>state.course)
    

    return (
    <div className='w-full rounded-lg'>
        <div className='flex gap-[2px]'>
            <div className='flex flex-col items-center gap-3 w-full relative'>
                <button className={`flex p-[7px] justify-center items-center gap-[10px] border ${step===1?"border-yellow-50 bg-yellow-900":"border-yellow-50 bg-yellow-50"} rounded-[200px]`}
                >
                    <p className='text-yellow-50 flex w-5 h-5 flex-col justify-center text-[18px] font-semibold leading-[26px]'>
                        {
                            step>1?(
                                <FaCheck fontSize={18} color='black'/>
                            ):(
                                1
                            )
                        }
                    </p>
                </button>
                <p className={`text-[14px] font-normal leading-[22px] ${step>=1?"text-richblack-5":"text-richblack-500"}`}>Course Information</p>
                <div className={`absolute h-[1px] w-[90px] top-[19px] left-[50px] ${editDetails?"md:w-[160px] lg:w-[297px] md:left-[114px] lg:left-[184px] ":"md:w-[100px] lg:w-[198px]  md:left-[80px] lg:left-[130px]"} border border-dashed ${step>1?"border-yellow-50":"border-[#424854]"} `}></div>
            </div>
            <div className='flex flex-col items-center gap-3 w-full relative'>
                <button className={`flex p-[7px] justify-center items-center gap-[10px] border ${step>=2?(step==2?"border-yellow-50 bg-yellow-900":"border-yellow-50 bg-yellow-50"):"border-richblack-700 bg-richblue-800"}  rounded-[200px]`}
                >
                    <p className={` flex w-5 h-5 flex-col justify-center text-[18px] font-semibold leading-[26px] ${step===2?"text-yellow-50":"text-richblack-300"}`}>
                        {
                            step>2?(
                                <FaCheck fontSize={18} color='black'/>
                            ):(
                                2
                            )
                        }
                    </p>
                </button>
                <p className={`text-[14px] font-normal leading-[22px] ${step>=2?"text-richblack-5":"text-richblack-500"}`}>Course Buidler</p>
                <div className={`absolute h-[1px] w-[90px] top-[19px] left-[50px] ${editDetails?"md:w-[160px] lg:w-[297px] md:left-[114px] lg:left-[184px] ":"md:w-[100px] lg:w-[198px]  md:left-[80px] lg:left-[130px]"} border border-dashed ${step>2?"border-yellow-50":"border-[#424854]"}  `}></div>
            </div>
            <div className='flex flex-col items-center gap-3 w-full relative'>
                <button className={`flex p-[7px] justify-center items-center gap-[10px] border ${step>=3?(step==3?"border-yellow-50 bg-yellow-900":"border-yellow-50 bg-yellow-50"):"border-richblack-700 bg-richblue-800"}  rounded-[200px]`}
                >
                    <p className={` flex w-5 h-5 flex-col justify-center text-[18px] font-semibold leading-[26px] ${step===3?"text-yellow-50":"text-richblack-300"}`}>
                        {
                            step> 3?(
                                <FaCheck fontSize={18} color='black'/>
                            ):(
                                3
                            )
                        }
                    </p>
                </button>
                <p className={`text-[14px] font-normal leading-[22px] ${step>=3?"text-richblack-5":"text-richblack-500"}`}>Publish</p>
                
            </div>
        </div>

        {
            step===1?(
                <CourseInformationStep  />
            ):(
                step===2?(
                    <CourseBuilderStep  />
                ):(
                    <PublishCouseStep />
                )
            )
        }

        
    </div>
  )
}
