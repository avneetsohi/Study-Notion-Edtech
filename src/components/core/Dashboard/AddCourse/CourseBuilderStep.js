import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { GrNext, GrPrevious } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useDispatch, useSelector } from 'react-redux';
import { NestedView } from './CourseBuilder/NestedView';
import { setCourse, setEditDetails, setStep } from '../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import apiConnector from '../../../../services/apiconnector';
import { section } from '../../../../services/apis';


export const CourseBuilderStep = () => {

    const[loading,setLoading]=useState(false);
    const [editSectionName,setEditSectionName]=useState(null);
    const {course}=useSelector((state)=>state.course)
    const dispatch=useDispatch()
    const {token}=useSelector((state)=>state.auth)

    function nextStepHandler(){
        if(course.courseContent.length===0){
            toast.error("Please add atleast one section")
            return
        }
        if(course.courseContent.some((section)=>section.subSection.length===0)){
            toast.error(`Please add atleast one sub section in Section ${section?.sectionName}` )  
            return
        }

        dispatch(setStep(3))
        
    }

    function prevStepHandler(){
        dispatch(setStep(1))
        
        
    }

    function cancelEdit(){
        setEditSectionName(null);
        setValue("sectionName","");
    }

    function handleChangeEditSection(sectionName,sectionId){
        if(editSectionName===sectionId){
            cancelEdit();
            return;
        }

        setEditSectionName(sectionId);
        setValue("sectionName",sectionName)
    }

    const submitSection =  async (data) => {
        setLoading(true);
        try{
            let result;
            if(editSectionName){
                result=await apiConnector("PUT",section.UPDATE_SECTION_API,{
                    newSectionName:data.sectionName,
                    sectionId:editSectionName,
                    courseId:course._id
                },
                {
                    Authorization:`Bearer ${token}`
                })

                if(!result.data.success){
                    throw new Error(result.data.message)
                }

                console.log("UPDATE SECTION API RESPONSE....",result)

                toast.success("Updated the section name successfully")
            }else{
                result=await apiConnector("POST",section.CREATE_SECTION_API,{
                    sectionName:data.sectionName,
                    courseId:course._id
                },{
                    Authorization:`Bearer ${token}`
                })

                if(!result.data.success){
                    throw new Error(result.data.message)
                }

                console.log("CREATE SECTION API RESPONSE....",result)

                toast.success("Created the section name successfully")
            }
            if(result){
                dispatch(setCourse(result.data.data))
                setEditSectionName(null);
                setValue("sectionName","");
            }
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log("Error while updating/creating section",error)
            toast.error(`Failed to ${editSectionName?"Update":"Create"} the Section`)
        }
    }
    
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors,isSubmitSuccessful}
    }=useForm();


  return (
    <div className='rounded-lg p-6'>
        {
            loading?(
                <div className='custom-loader mx-auto mt-20 '></div>
            ):(
                <div className='bg-richblack-800  border border-richblack-700 rounded-lg flex flex-col gap-y-[26px] '>
                    <form onSubmit={handleSubmit(submitSection)} className=' p-6 flex flex-col bg-richblack-800  gap-y-[26px] items-start'>
                        <h1 className='text-4xl font-medium text-richblack-5'>Course Builder</h1>
                        <div className='flex flex-col w-full gap-[6px]'>
                            <label htmlFor='sectionName' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Section Name <sup className='text-pink-200'>*</sup></label>
                            <input type='text'  id='sectionName' name='sectionName' placeholder='Add a section to build your course'
                            className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'
                            {...register("sectionName",{required:true})}
                            />
                            {
                                errors.sectionName && 
                                <span className='text-yellow-25'>Section Name is required</span>
                            }
                        </div>
                        <div className='flex gap-3'>
                            <button type='sumbit' className='flex py-3 px-6 justify-center items-center gap-1 rounded-lg border border-yellow-50 text-yellow-50'>
                                {
                                    editSectionName?"Edit Section Name":"Create Section"
                                }  
                                <IoMdAddCircleOutline fontSize={20}/>
                            </button>
                            {
                                editSectionName && 
                                <button type='button' className='text-sm text-richblack-300 underline'
                                onClick={cancelEdit}>
                                    Cancel Edit
                                </button>
                            }
                        </div>

                        
                    </form>

                    {
                        course?.courseContent?.length>0 &&
                        <NestedView handleChangeEditSection={handleChangeEditSection} />
                    }

                    <div className='w-full flex justify-between p-6'>
                        <button type='button' className='text-richblack-5 flex gap-[3px] items-center'
                        onClick={prevStepHandler}>
                            <GrPrevious fontSize={20}/>
                            Back
                        </button>

                        <button type='button'  className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
                        onClick={nextStepHandler} disabled={loading}>
                            Next
                            <GrNext/>
                        </button>
                    </div>
                </div>
            )
        }
    </div>
  )
}
