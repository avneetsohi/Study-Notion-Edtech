import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { IconButton } from '../../common/IconButton'
import { GrPrevious, GrNext } from 'react-icons/gr'
import apiConnector from '../../../services/apiconnector'
import { subSection } from '../../../services/apis'
import { setCompletedLectures, updateCompletedLectures } from '../../../slices/viewCourseSlice'
import { IoPlaySharp } from "react-icons/io5";
import toast from 'react-hot-toast'

export const VideoDetails = () => {
    const {courseId,sectionId,subSectionId}=useParams()
    const location=useLocation()
    const [endedVideo,setEndedVideo]=useState(false)
    const {courseSectionData,courseEntireData,completedLectures,totalNoOfLectures}=useSelector((state)=>state.viewCourse)
    const navigate=useNavigate()
    const [videoData,setVideoData]=useState(null)
    const playerRef=useRef(null)
    const [loading,setLoading]=useState(false)
    const {token}=useSelector((state)=>state.auth)
    const dispatch=useDispatch()
    const [play,setPlay]=useState(false)
    

    useEffect(()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
        const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex((subSec)=>subSec._id===subSectionId)
        const lectureData=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex]
        setVideoData(lectureData)
        setEndedVideo(false);
        setPlay(false)
    },[location.pathname,completedLectures])

    
    const isFirstVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
        
        const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex((subSec)=>subSec._id===subSectionId)

        if(currentSectionIndex===0 && currentSubSectionIndex===0){
            return true;
        }
        return false;
    }

    const isLastVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
        const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex((subSec)=>subSec._id===subSectionId)

        if(currentSectionIndex===courseSectionData.length-1 && currentSubSectionIndex===courseSectionData[currentSectionIndex].subSection.length-1){
            return true;
        }
        return false
    }
    
    const goToNextVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
       
        const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex((subSec)=>subSec._id===subSectionId)
        

        if(currentSubSectionIndex!==courseSectionData[currentSectionIndex].subSection.length-1){
            const nextSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex+1]?._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        }else{
            const nextSectionId=courseSectionData[currentSectionIndex+1]?._id
            const nextSubSectionId=courseSectionData[currentSectionIndex+1].subSection[0]?._id
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo=()=>{
        const currentSectionIndex=courseSectionData.findIndex((section)=>section._id===sectionId)
        const currentSubSectionIndex=courseSectionData[currentSectionIndex].subSection.findIndex((subSec)=>subSec._id===subSectionId)
        
        if(currentSubSectionIndex!==0){
            const prevSubSectionId=courseSectionData[currentSectionIndex].subSection[currentSubSectionIndex-1]?._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)

        }else{
            const prevSectionId=courseSectionData[currentSectionIndex-1]?._id
            const prevSubSectionId=courseSectionData[currentSectionIndex-1].subSection[courseSectionData[currentSectionIndex-1].subSection.length-1]?._id
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion=async()=>{
        setLoading(true)
        try{
            const response=await apiConnector("PUT",subSection.UPDATE_LECTURE_COMPLETION_STATUS_API,{courseId,subSectionId},{
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("UPDATE LECTURE COMPLETION STATUS API RESPONSE",response)
            dispatch(updateCompletedLectures(subSectionId))

        }catch(error){
            console.log("Error occured while Updating Lecture Completion Status",error)
            toast.error("Failed to Mark the Lecture as Completed")
        }
        setLoading(false)
    }


  return (
    <div className=' flex flex-col gap-4 w-full'>
        <div className='relative '>
            <ReactPlayer 
                ref={playerRef}
                onEnded={()=>{
                    setEndedVideo(true)
                }}
                playing={play}
                url={videoData?.videoUrl}
                light={<img src={`${courseEntireData.thumbnail}`} alt='Thumbnail' className='w-[800px] h-[400px]'/>}
                playIcon={<IoPlaySharp className='text-white bg-black absolute top-72 translate-x-64 left-96 px-2 pl-3 py-2 rounded-full ' fontSize={44} />}
                playsinline={false}
                controls={true}
                onClickPreview={()=>{
                    setPlay(true)
                }}
                width={1300}
                height={600}
                className='rounded-md'
            />

            {
                
                endedVideo && 
                <div className='absolute top-0 left-0 bottom-0 right-0 bg-opacity-50 bg-richblack-200 z-10'></div>
            }
            {
                endedVideo && 
                <div className=' absolute top-44 left-96 translate-x-[60%] flex flex-col translate-y-[50%] gap-4 items-center w-[100px] md:w-[20%] z-20'>
                    {
                        !completedLectures.includes(subSectionId) && 
                        <IconButton iconBtnText={`${loading?"Loading...":"Mark As Watched"}`} iconBtnHandler={handleLectureCompletion} />
                    }

                    <button className='bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
                    disabled={loading}
                    onClick={()=>{
                        if(playerRef?.current){
                            playerRef.current.seekTo(0)
                            playerRef.current.showPreview()
                        }
                        setEndedVideo(false)
                        
                        
                    }}>
                        Rewatch
                    </button>

                    <div className='w-full flex justify-center gap-2'>

                        {
                            !isFirstVideo() && 
                            <button type='button' className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
                            onClick={goToPrevVideo} disabled={loading}>
                                <GrPrevious fontSize={20}/>
                                Prev
                            </button>
                        }
                        {
                            !isLastVideo() && 
                            <button type='button'  className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
                            onClick={goToNextVideo} disabled={loading}>
                                Next
                                <GrNext fontSize={20}/>
                            </button>
                        }

                    </div>
                
                </div>
            }
        </div>

        <div className='flex flex-col gap-2 '>
            <h1 className='text-2xl text-richblack-5 font-semibold '>{videoData?.title}</h1>
            <p className='text-base text-richblack-5 font-medium '>{videoData?.description}</p>
        </div>
    </div>
  )
}
