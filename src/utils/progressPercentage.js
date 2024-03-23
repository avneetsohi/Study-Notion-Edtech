import { useSelector } from "react-redux"


export const getCourseProgress=(course,user) => {

    let totalNoOfLectures=0

    if(course.courseContent.length===0){
        return 0
    }
    
    course.courseContent.forEach((section)=>{
        totalNoOfLectures+=section.subSection.length
    })

    if(totalNoOfLectures===0){
        return 0
    }
    console.log("TotalNOOFLECTURES",totalNoOfLectures)
    let lecturesCompleted=0 

    user.courseProgress.forEach((cp)=>{
        if(cp.courseID.toString()===course._id.toString()){
            lecturesCompleted=cp?.completedVideos?.length
        }
    })
    return Math.round((lecturesCompleted/totalNoOfLectures)*100)
}