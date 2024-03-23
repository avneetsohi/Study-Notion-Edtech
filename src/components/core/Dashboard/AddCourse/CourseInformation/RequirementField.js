import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export const RequirementField = ({register,errors,setValue,name}) => {

    const [requirementList,setRequirementList]=useState([]);
    const [requirement,setRequirement]=useState("")
    const {course,editDetails}=useSelector((state)=>state.course)

    useEffect(()=>{
        if(editDetails){
            setRequirementList(course.instructions)
        }

        register(name,{
            required:true,
            ValidityState:(value)=>value.length>0
        })
    },[])


    useEffect(()=>{
        setValue(name,requirementList)
    },[requirementList])

    const addRequirementHandler = () => {
        if(requirement!==""){
            const newRequirementList=[...requirementList,requirement]
            setRequirementList(newRequirementList)
            setRequirement("");
        }
        
    }
    const removeRequirementHandler = (index) => {
        const updatedRequirementList = [...requirementList];
        updatedRequirementList.splice(index, 1);
        setRequirementList(updatedRequirementList);
        
    }

    return (
    <div className='flex flex-col w-full gap-[6px] items-start'>
        <label htmlFor='reqs' className='text-[14px] font-normal leading-[22px] text-richblack-5'>Requirements/Instructions<sup className='text-pink-200'> *</sup></label>
        <input className=' outline-none p-3 rounded-[8px] bg-richblack-700 text-richblack-200 text-base font-medium w-full'  type='text' 
        placeholder='Enter Requirements/Instructions of the Course' id='reqs' name={name}  value={requirement}
        onChange={(e)=>setRequirement(e.target.value)}
        />
        {
            errors[name] && (
                <span className='text-yellow-25'>Please enter instructions of the course</span>
            )
        }
        <button type='button' className='text-base font-bold bg-transparent text-yellow-50 text-left'
        onClick={addRequirementHandler}>
            Add
        </button>
        {
            requirementList.length>0 && 
            <ul className='text-richblack-5'>
                {
    
                
                    requirementList.map((item,index)=>(
                        <li key={index} className='flex gap-2'>
                            <span>{item}</span>
                            <button className='text-xs text-pure-greys-300' type='button' onClick={()=>removeRequirementHandler(index)}>Clear</button>
                        </li>
                    ))
                
                }
            </ul>
        }
        
        
    </div>
  )
}
