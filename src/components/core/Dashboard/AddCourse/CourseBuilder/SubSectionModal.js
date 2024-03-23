import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import apiConnector from '../../../../../services/apiconnector';
import { subSection } from '../../../../../services/apis';
import { setCourse } from '../../../../../slices/courseSlice';
import { RxCross2 } from "react-icons/rx";
import { Upload } from '../Upload';

export const SubSectionModal = ({modalData,setModalData,add=false,view=false,edit=false,setOverlay}) => {

    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        formState:{errors}
    }=useForm();

    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch()

    const isFormUpdated = () => {
        const currentValues=getValues()

        if(currentValues.title!==modalData.title || 
           currentValues.description!==modalData.description ||
           currentValues.video !== modalData.videoUrl){
            return true
        }
        return false
    }

    const handleEditSection= async(data) => {
        const currentValues=getValues()
        const formData=new FormData()
        formData.append("subSectionId",modalData?._id)
        
        formData.append("courseId",course._id)
        // if(currentValues.title!==modalData?.title){
            formData.append("title",data.title)
        // }
        // if(currentValues.description!==modalData.description){
            formData.append("description",data.description)
        // }
        
        formData.append("videoFile",currentValues.video)

        try{
            toast.loading("Updating the lecture details")
            setLoading(true);
            const response=await apiConnector("PUT",subSection.UPDATE_SUBSECTION_API,formData,{
                "Content-Type":"multipart/form-data",
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("UPDATE SUBSECTION API RESPONSE",response)
            dispatch(setCourse(response?.data?.data))  
            toast.dismiss()
            toast.success("Updated the lecture Successfully")   
        }catch(error){
            console.log("Error occured while editing the suB-section",error)
            toast.error("Failed to update the lecture")
        }
        setModalData(null);
        setLoading(false);
    }

    const submitSubSection = async(data) => {
        setLoading(true)
        setOverlay(false);
        setModalData(null);

        if(edit){
            if(!isFormUpdated()){
                toast.error("No changes made to the form")
            }
            else{
                handleEditSection(data);
            }
            return
        }

        const formData=new FormData()
        formData.append("title",data.title)
        formData.append("description",data.description)
        formData.append("courseId",course._id)
        formData.append("sectionId",modalData)
        formData.append("videoFile",data.video)

        try{
            toast.loading("Uploading lecture details")
            
            const response=await apiConnector("POST",subSection.CREATE_SUBSECTION_API,formData,{
                "Content-Type":"multipart/form-data",
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log('ADD SUBSECTION API RESPONSE',response)
            dispatch(setCourse(response?.data?.data))
            toast.dismiss()
            toast.success("Added the lecture successfully")
            
        }catch(error){
            toast.dismiss()
            console.log("Error occured while adding New Sub-Section",error)
            toast.error("Failed to add new Sub-Section")
        }
        
        setLoading(false);
    }

    useEffect(()=>{
        if(edit || view){
            setValue("title",modalData?.title)
            setValue("description",modalData?.description)
            setValue("video",modalData?.videoUrl)
        }

        
    },[])

  return (
    <div className='absolute w-[30%] top-3 left-96 translate-x-[50%] z-50 border border-richblack-25 rounded-[15px]'>
        <div className='bg-richblack-700 flex justify-between px-5 py-4 rounded-t-[15px]'>
            <h1 className='text-lg font-medium text-richblack-5'>
                {add && "Adding"} {view && "Viewing"} {edit && "Editing"} Lecture
            </h1>
            <button
            onClick={()=>{
                setOverlay(false)
                !loading && setModalData(null)    
                
            }}>
                <RxCross2 fontSize={24} className='text-richblack-300'/>
            </button>
        </div>
        <form onSubmit={handleSubmit(submitSubSection)} className='bg-richblack-800 flex flex-col gap-[11px] px-5 py-4 pb-7 rounded-b-[15px]'>
            
            <Upload
                name="video"
                label="Lecture Video"
                register={register}
                errors={errors}
                setValue={setValue}
                video={true}
                viewData={view?modalData?.videoUrl:null}
                editData={edit?modalData?.videoUrl:null}
            />

            <div className='flex flex-col w-full gap-[6px]'>
                <label htmlFor='title' className='text-[14px] font-normal leading-[22px] text-richblack-5'>
                    Lecture Title
                    {
                        view?(<sup></sup>):(<sup className='text-pink-200'>*</sup>)
                    }
                </label>
                {
                    view?(
                        <div className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'>
                            {modalData?.title}
                        </div>
                    ):(
                        <div className='flex flex-col gap-[6px]'>
                            <input className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'
                            type='text'  id='title' name='title' placeholder='Enter Lecture Title'
                            {...register("title",{required:true})}
                            />
                            {
                                errors.title &&
                                <span className='text-yellow-25'>Lecture Title is Required</span>
                            }
                        </div>
                    )
                }
            </div>
            <div className='flex flex-col w-full gap-[6px]'> 
                <label htmlFor='description' className='text-[14px] font-normal leading-[22px] text-richblack-5'>
                    Lecture Description
                    {
                        view?(<sup></sup>):(<sup className='text-pink-200'>*</sup>)
                    }
                </label>
                {
                    view?(
                        <div className=' outline-none p-3 rounded-[8px] h-40 bg-richblack-700 text-richblack-200 text-base font-medium w-full'>
                            {modalData?.description}
                        </div>
                    ):(
                        <div className='flex flex-col gap-[6px]'>
                            <textarea  rows={6} cols={20} className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'
                            type='text' id='description' name='description' placeholder='Enter Lecture Description'
                            {...register("description",{required:true})}
                            />
                            {
                                errors.description &&
                                <span className='text-yellow-25'>Lecture Description is Required</span>
                            }
                        </div>
                    )
                }
                
            </div>

            {
                !view?(
                <div className='flex justify-end mt-5'>
                    <button  className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'>
                        {
                            add?("Save"):("Save Changes")
                        }
                    </button>
                </div>
            ):(
                <div></div>
            )
            }
        </form>
    </div>
  )
}
