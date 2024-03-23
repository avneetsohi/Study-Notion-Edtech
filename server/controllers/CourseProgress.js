const CourseProgress = require("../models/CourseProgress")
const User = require("../models/User")

exports.updateLectureCompletionStatus=async(req,res)=>{
    
    try{
        const id=req.user.id
        const {courseId,subSectionId}=req.body

        if(!courseId){
            return res.status(401).json({
                success:false,
                message:"Course Id not found"
            })
        }
        

        const userDetails=await User.findById(id)
                                  .populate("courseProgress")
                                  .exec()

        console.log("User details",userDetails)
            
        
        const courseProgressInstance=userDetails.courseProgress.filter((data)=>data.courseID==courseId)
        
        if(courseProgressInstance.length===0){
            return res.status(400).json({
                success:false,
                message:"Course Progress doesn't exist for this Enrolled Course"
            })
        }
        
        const courseProgressId=courseProgressInstance[0]._id

        const courseProgress=await CourseProgress.findById(courseProgressId)
        
        if(courseProgress.completedVideos.includes(subSectionId)){
            return res.status(400).json({
                success:false,
                message:"Lecture already marked as completed"
            })
        }
        

        const updatedCourseProgress=await CourseProgress.findByIdAndUpdate(courseProgressId,{
                                                                                                $push:{
                                                                                                    completedVideos:subSectionId
                                                                                                }
                                                                                            },
                                                                                            {
                                                                                                new:true
                                                                                            })
        return res.status(200).json({
            success:true,
            message:"Marked the lecture completed",
            data:{
                updatedCourseProgress,
                userDetails
            }
        })


    }catch(error){
       
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}