import React, { useEffect, useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { useSelector } from 'react-redux';

export const TagsField = ({label,placeholder,name,errors,setValue,register,getValues}) => {

   const [tag,setTag]=useState("");
   const [tagList,setTagList]=useState([]);
   const {course,editDetails}=useSelector((state)=>state.course)

   

   const addTag=(event)=>{
    if(event.key==='Enter' || event.key===','){
        event.preventDefault()
          
        if (tag && !tagList.includes(tag)){
            const newTagList=[...tagList]
            newTagList.push(tag);
            setTagList(newTagList)
            setTag("")    
        }
    }
   }

    const removeTag = (index)=>{
    const updatedTagList=[...tagList]
    updatedTagList.splice(index,1);
   
    setTagList(updatedTagList)
   }

   useEffect(()=>{

        if(editDetails){
            setTagList(course.tags)
        }
        register(name,{
            required:true,
            validatate:(value)=>value.length>0
        })
    },[])

    useEffect(()=>{
        console.log("Tag List",tagList)
        setValue(name,tagList)
    },[tagList])

  


  return (
    <div className='flex flex-col w-full gap-[6px]'>
        <label htmlFor={name} className='text-[14px] font-normal leading-[22px] text-richblack-5'>{label}<sup className='text-pink-200'> *</sup></label>
        {
            tagList.length>0 && 
            <div className='flex flex-wrap gap-3 gap-y-2 justify-start items-center'>
                {
                    tagList.map((item,index)=>(
                        <span key={index} className='text-base flex items-center justify-center gap-2 
                        border border-yellow-200 bg-yellow-50 bg-opacity-30 text-richblack-5 
                        px-2 py-1 rounded-lg'>
                            {item} 
                            <RxCross2 className='cursor-pointer' fontSize={22} color='white' onClick={()=>removeTag(index)}/>
                        </span>
                    ))
                }
            </div>
        }
        <input  className='outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'  type='text' 
        placeholder={placeholder} id={name} name={name} 
        onChange={(e)=>setTag(e.target.value)} value={tag}
        onKeyDown={addTag}
        />
        {
            errors[name] && (
                <span className='text-yellow-25'>{label} is Required</span>
            )
        }

    </div> 
  )
}
