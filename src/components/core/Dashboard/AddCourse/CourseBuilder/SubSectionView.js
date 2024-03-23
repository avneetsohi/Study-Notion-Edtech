import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { Overlay } from '../../../../common/Overlay';
import { ConfirmationModal } from '../../../../common/ConfirmationModal';
import apiConnector from '../../../../../services/apiconnector';
import { subSection } from '../../../../../services/apis';
import { setCourse } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';
import { SubSectionModal } from './SubSectionModal';

export const SubSectionView = ({lecture,section}) => {
    const {course}=useSelector((state)=>state.course)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    const [viewingLecture,setViewingLecture]=useState(null);
    const [editingLecture,setEditingLecture]=useState(null);
    const [modal,setModal]=useState(false);
    const [overlay,setOverlay]=useState(false);
    const [sectionId,setSectionId]=useState(null)
    const [subSectionId,setSubSectionId]=useState(null)

    const handleDeleteSubSection= async() => {
        setModal(false);
        setOverlay(false);
        
        try{
            const response=await apiConnector("DELETE",subSection.DELETE_SUBSECTION_API,{
                courseId:course._id,
                sectionId,
                subSectionId
            },{
                Authorization:`Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("DELETE SUBSECTION API RESPONSE",response)
            dispatch(setCourse(response?.data?.data))
            
            toast.success("DELETED THE SUBSECTION SUCCESSFULLY")


        }catch(error){
            console.log("Error occured while deleting the subsection",error)
            toast.error("Failed to delete the subsection")
        }
        setSectionId(null)
        setSubSectionId(null)
    }

  return (
    <div>
        <details>
            <summary className='mt-2 mx-6 flex items-center justify-between cursor-pointer py-2  border-b-2 border-richblack-600 '
            onClick={()=>{
                setOverlay(true)
                setViewingLecture(lecture)
                
            }}
            >
                <div className='flex gap-2 items-center text-lg font-semibold'>
                    <RxDropdownMenu fontSize={26}/>
                    <p className='text-[15px] text-richblack-50 uppercase'>{lecture.title}</p>
                </div>

                <div className='flex items-center gap-[10px] text-base text-richblack-400'>
                    
                    <button type='button' onClick={(e)=>{
                        e.stopPropagation()
                        setOverlay(true)
                        setEditingLecture({...lecture,sectionId:section._id})
                        
                        
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none">
                            <path d="M2.96389 16.2376L1.57592 19.7075C1.39634 20.1565 1.84188 20.602 2.29085 20.4224L5.76077 19.0345C6.31403 18.8132 6.81657 18.4818 7.23792 18.0605L19.249 6.04986C20.1603 5.13859 20.1603 3.66113 19.249 2.74986C18.3378 1.83859 16.8603 1.83859 15.949 2.74986L3.93792 14.7605C3.51657 15.1818 3.18519 15.6844 2.96389 16.2376Z" fill="#6E727F"/>
                        </svg>
                    </button>
                    
                    <button type='button'
                    onClick={(e)=>{
                        e.stopPropagation()
                        setModal(true)
                        setOverlay(true)
                        setSectionId(section._id)
                        setSubSectionId(lecture._id)
                        
                    }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 22 22" fill="none">
                        <g clip-path="url(#clip0_11167_21577)">
                        <path d="M19.1654 2.5H14.9987V2.08333C14.9987 1.5308 14.7792 1.0009 14.3885 0.610194C13.9978 0.219493 13.4679 0 12.9154 0L7.08203 0C6.5295 0 5.99959 0.219493 5.60889 0.610194C5.21819 1.0009 4.9987 1.5308 4.9987 2.08333V2.5H0.832031V5H2.4987V17.5C2.4987 18.163 2.76209 18.7989 3.23093 19.2678C3.69977 19.7366 4.33566 20 4.9987 20H14.9987C15.6617 20 16.2976 19.7366 16.7665 19.2678C17.2353 18.7989 17.4987 18.163 17.4987 17.5V5H19.1654V2.5ZM14.9987 17.5H4.9987V5H14.9987V17.5Z" fill="#6E727F"/>
                        <path d="M9.16797 7.5H6.66797V15H9.16797V7.5Z" fill="#6E727F"/>
                        <path d="M13.332 7.5H10.832V15H13.332V7.5Z" fill="#6E727F"/>
                        </g>
                        <defs>
                        <clipPath id="clip0_11167_21577">
                        <rect width="20" height="20" fill="white"/>
                        </clipPath>
                        </defs>
                        </svg>
                    </button>
                </div>
            </summary>
            
        </details>

        {
            viewingLecture && 
            <SubSectionModal
            modalData={viewingLecture}
            setModalData={setViewingLecture}
            view={true}
            setOverlay={setOverlay}
            />
        }

        {
            editingLecture  && 
            <SubSectionModal 
                modalData={editingLecture}
                setModalData={setEditingLecture}
                edit={true}
                setOverlay={setOverlay}
            /> 
        }
        {
            modal &&
            <ConfirmationModal setModal={setModal} setOverlay={setOverlay} iconBtnText={"Delete"} iconBtnHandler={handleDeleteSubSection} modalHeading={"Delete this Sub-Section?"} modalText={"This lecture will be deleted"}/>
        }

        {
            overlay &&
            <Overlay/>
        }
    </div>
  )
}
