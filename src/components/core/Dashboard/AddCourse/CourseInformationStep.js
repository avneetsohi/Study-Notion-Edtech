import React, { useEffect, useRef, useState } from 'react'

import { GrNext } from "react-icons/gr";
import categories, { courses } from '../../../../services/apis';
import { useForm } from 'react-hook-form';
import apiConnector from '../../../../services/apiconnector';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';
import { RequirementField } from './CourseInformation/RequirementField';
import { useDispatch, useSelector } from 'react-redux';
import { setCourse, setStep} from '../../../../slices/courseSlice';

import toast from 'react-hot-toast';
import { COURSE_STATUS } from '../../../../utils/constants';

import { TagsField } from './CourseInformation/TagsField';
import { Upload } from './Upload';

export const CourseInformationStep = () => {

    const [catgs,setCatgs]=useState(null);
    const [loading,setLoading]=useState(false);
    const {course,editDetails,step}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();


    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        reset,
        formState:{errors,isSubmitSuccessfull}
    }=useForm();


    function nextStepHandler(){
        dispatch(setStep(2))
    }
    
    
    const fetchAllCategories = async () => {
        try{
            setLoading(true);
            const result=await apiConnector('GET',categories.SHOWCATEGORIES_API);
            console.log("Fetched links",result)
            setCatgs(result?.data?.data);
            setLoading(false)
        }catch(error){
            setLoading(false);
            console.log("Could not fetch the category lists");
            console.log(error)
        }
    }

    const isFormUpdated = () => {
        const currentValues=getValues();
        if(
            currentValues.courseName !== course.courseName ||
            currentValues.courseDescription !== course.courseDescription ||
            currentValues.category !== course.category ||
            currentValues.thumbnail !== course.thumbnail || 
            currentValues.price !== course.price ||
            currentValues.instructions.toString() !== course.instructions.toString() ||
            currentValues.benefits !== course.whatYouWillLearn ||
            currentValues.tags.toString() !== course.tags.toString()
        ){
            return true;
        }
        return false;
    }

    const submitCourseInfo = async (data)=>{
        console.log("Reached submitCourseInfo function")
        try{
            if(editDetails){
                if(isFormUpdated()){
                    setLoading(true)
                    const currentValues=getValues();
                    const formData=new FormData()
                    formData.append("courseId",course._id)
                    
                    formData.append("thumbnailImage",currentValues.thumbnail)
                   
                    // console.log("Data ...",data.courseName)
                    // console.log("Current Values...",currentValues.courseName)
                    formData.append("courseName",currentValues.courseName)
                    // console.log("Data ...",data.courseDescription)
                    // console.log("Current Values...",currentValues.courseDescription)
                    formData.append("courseDescription",currentValues.courseDescription)
                    // console.log("Data ...",data.price)
                    // console.log("Current Values...",currentValues.price)
                    formData.append("price",currentValues.price)
                    // console.log("Data ...",data.category)
                    // console.log("Current Values...",currentValues.category)
                    formData.append("categoryId",currentValues.category)
                    // console.log("Data ...",data.benefits)
                    // console.log("Current Values...",currentValues.benefits)
                    formData.append("whatYouWillLearn",currentValues.benefits)
                    // console.log("Data ...",data.instructions)
                    // console.log("Current Values...",currentValues.instructions)
                    formData.append("instructions",JSON.stringify(data.instructions))
                    // console.log("Data ...",data.tags)
                    // console.log("Current Values...",currentValues.tags)
                    formData.append("tag",JSON.stringify(data.tags))
                    formData.append("status",course.status)


                    // if(currentValues.courseName!==course.courseName){
                    //     formData.append("courseName",currentValues.courseName)
                    // }
                    // if(currentValues.courseDescription!==course.courseDescription){
                    //     formData.append("courseDescription",currentValues.courseDescription)
                    // }
                    // if(currentValues.price!==course.price){
                    //     formData.append("price",currentValues.price)
                    // }
                    // if(currentValues.category!==course.category._id){
                    //     formData.append("category",currentValues.category)
                    // }
                    // if(currentValues.benefits!==course.benefits){
                    //     formData.append("whatYouWillLearn",currentValues.benefits)
                    // }
                    // console.log("Data ...",data.instructions)
                    // console.log("Current Values...",currentValues.instructions)
                    // if(currentValues.instructions.toString()!==course.instructions.toString()){
                    //     formData.append("instructions",JSON.stringify(currentValues.instructions))
                    // }
                    // if(currentValues.tags.toString()!==course.tags.toString()){
                    //     formData.append("tags",JSON.stringify(currentValues.tags))
                    // }
                    
                    const response=await apiConnector("PUT",courses.EDIT_COURSE_API,formData,{
                        "Content-Type":"mulitpart/form-data",
                        Authorization:`Bearer ${token}`
                    })
                    if(!response.data.success){
                        throw new Error(response.data.message)
                    }
                    console.log("EDIT COURSE DETAILS API RESPOSNE....",response)
                    if(response){
                        dispatch(setStep(2))
                        dispatch(setCourse(response?.data?.updatedCourseDetails))
                    }
                    toast.success("Updated the course successfully")
                    setLoading(false)
                }else{
                    setLoading(false)
                    toast.error("No changes made in the course details")
                }
                return
            }

            const formData=new FormData();
            formData.append("thumbnailImage",data.thumbnail)
            formData.append("courseName",data.courseName)
            formData.append("courseDescription",data.courseDescription)
            formData.append("price",data.price)
            formData.append("category",data.category)
            formData.append("whatYouWillLearn",data.benefits)
            
            formData.append("instructions",JSON.stringify(data.instructions))

            formData.append("status",COURSE_STATUS.DRAFT)
            
            formData.append("tag",JSON.stringify(data.tags))

            // console.log("BEFORE add course API call");
            // console.log("PRINTING FORMDATA", data);
            setLoading(true);
            const result=await apiConnector("POST",courses.CREATE_COURSE_API,formData,{
                "Content-Type": "multipart/form-data",
                Authorization:`Bearer ${token}`
            })
            
            
            if(!result.data.success){
                throw new Error(result.data.message)
            }
            console.log("CREATE COURSE API RESPONSE...",result)
            if(result){
                dispatch(setStep(2))
                dispatch(setCourse(result?.data?.data))
            }
            
            toast.success("Created a course Successfully")
            setLoading(false);
        }catch(error){
            setLoading(false);
            console.log("Error occured creating course",error)
            toast.error("Failed to create a course")
        }
    }




    useEffect(()=>{

        if(editDetails){
            setValue("courseName",course?.courseName)
            setValue("courseDescription",course?.courseDescription)
            setValue("price",course?.price)
            setValue("category",course?.category?._id)
            setValue("tags",course?.tags)
            setValue("thumbnail",course?.thumbnail)
            setValue("benefits",course?.whatYouWillLearn)
            setValue("instructions",course?.instructions)
            
        }else{
            setValue("courseName","")
            setValue("courseDescription","")
            setValue("price","")
            setValue("category","Choose a Category")
            setValue("tags","")
            setValue("thumbnail","")
            setValue("benefits","")
            setValue("instructions","")
        }
        
        fetchAllCategories();
    },[editDetails])

  return (
    <div className='rounded-lg p-6'>
        {
            loading?(
                <div className='custom-loader mx-auto mt-20'></div>
            ):(
                <form onSubmit={handleSubmit(submitCourseInfo)} className='p-6 flex flex-col bg-richblack-800 border border-richblack-700 rounded-lg gap-[26px]'>
                    <div className='flex flex-col w-full gap-[6px]'>
                        <label htmlFor='title' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Course title <sup className='text-pink-200'> *</sup></label>
                        <input className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'  type='text' 
                        placeholder='Enter Course Title' id='title' name='courseName' 
                        {...register("courseName",{required:true})}    
                        />
                        {
                            errors.courseName && (
                                <span className='text-yellow-25'>Please enter Course Title</span>
                            )
                        }
                    </div>
                    <div className='flex flex-col w-full gap-[6px]'>
                        <label htmlFor='description' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Course Short Description <sup className='text-pink-200'> *</sup></label>
                        <textarea rows={7} cols={20} className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'  type='text' 
                        placeholder='Enter Description' id='description' name='courseDescription' 
                        {...register("courseDescription",{required:true})}    
                        />
                        {
                            errors.courseDescription && (
                                <span className='text-yellow-25'>Please enter your Course Description</span>
                            )
                        }
                    </div>
                    <div className='flex flex-col w-full gap-[6px] relative'>
                        <label htmlFor='price' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Price<sup className='text-pink-200'> *</sup></label>
                        <input className=' outline-none py-3 pl-[40px] rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'  type='number' 
                        placeholder='Enter Price' id='price' name='price' 
                        {...register("price",{
                            required:true,
                        })}    
                        />
                        <HiOutlineCurrencyRupee className='absolute top-[41px] left-2 text-richblack-200' fontSize={23}/>
                        {
                            errors.price && (
                                <span className='text-yellow-25'>Please enter Price</span>
                            )
                        }

                    </div>

                    <div className='flex flex-col w-full gap-[6px]'>
                        <label htmlFor='category' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Category<sup className='text-pink-200'> *</sup></label>
                        <select className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full cursor-pointer'  
                        defaultValue="Choose a Category" id='category' name='category' 
                        {...register("category",{required:true})}    
                        >
                            <option  disabled>Choose a Category</option>
                            {
                                !catgs?(<option  disabled>Loading...</option>):(
                                    catgs.map((category,index)=>(
                                        <option className='cursor-pointer'  key={index} value={category._id}>{category.name}</option>
                                    ))
                                )
                            }
                        </select>
                        {
                            errors.category && (
                                <span className='text-yellow-25'>Please select a category</span>
                            )
                        }
                        
                    </div>

                    <TagsField name='tags' errors={errors} setValue={setValue} register={register}
                        label="Tags" placeholder="Enter Tags and press Enter" getValues={getValues}
                    />

                    <Upload
                        name="thumbnail"
                        label="Course Thumbnail"
                        register={register}
                        errors={errors}
                        setValue={setValue}
                        editData={course?.thumbnail?course.thumbnail:null}
                    />


                    <div className='flex flex-col w-full gap-[6px]'>
                        <label htmlFor='benefits' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Benefits of the course<sup className='text-pink-200'> *</sup></label>
                        <textarea rows={7} cols={20}   className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'  type='text' 
                        placeholder='Enter Benefits of the Course' id='benefits' name='benefits' 
                        {...register("benefits",{required:true})}    
                        />
                        {
                            errors.benefits && (
                                <span className='text-yellow-25'>Please enter benefits of the course</span>
                            )
                        }
                    </div>

                    <RequirementField name="instructions" setValue={setValue} register={register} errors={errors} />

                    <div className='w-full flex justify-end gap-4 mt-10 '>
                    
                        {
                            editDetails && <button type='button' className='flex gap-2 items-center bg-richblack-600  text-richblack-5 text-lg font-semibold px-6 py-2 rounded-md'
                            onClick={nextStepHandler}>
                                Continue without Saving
                            </button>
                        }
                        
                        <button type='button' onClick={handleSubmit(submitCourseInfo)}  className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
        >
                            {
                                !editDetails?('Next'):('Save Changes')
                            } 

                            <GrNext/>
                        </button>   
                    </div>
                </form>
            )
        }
        
    </div>
    
  )
}
