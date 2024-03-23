const { response } = require("express");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadMediaToCloudinary } = require("../utils/imageUploader");
const { trusted, Mongoose, default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");

require("dotenv").config();

// create subsection
exports.createSubSection = async(req,res) => {

   try{
        // fetch data
        const {courseId,title,description,sectionId}=req.body;

        const video=req.files.videoFile;

        // data validation
        if(!courseId || !title || !sectionId  || !description || !video){        
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }

        // Upload video to cloudinary
        const uploadedVideoDetails=await uploadMediaToCloudinary(video,process.env.FOLDER_NAME);
        // console.log("UPLOADED VIDEO DETAILS...",uploadedVideoDetails)
        // create db entry for subsection
        const newSubSection=await SubSection.create({
            title,
            description,
            videoUrl:uploadedVideoDetails.secure_url,
            timeDuration:uploadedVideoDetails.duration
        })

        // update the section schema for the new subsection added
        const updatedSectionDetails=await Section.findByIdAndUpdate(sectionId,
                                                                    {
                                                                        $push:{
                                                                            subSection:newSubSection._id
                                                                        }
                                                                    },
                                                                    {new:true})
                                                                    .populate("subSection").exec();

        const courseDetails=await Course.findById(courseId)
                                                .populate({
                                                    path:"courseContent",
                                                    populate:{
                                                        path:"subSection"
                                                    }
                                                }).populate("category")
                                                .exec()

        console.log("Updated Section Details: ",updatedSectionDetails);
        // response
        return res.status(200).json({
            success:true,
            message:"New Sub Section created in the Course Successfully",
            newSubSection,
            updatedSectionDetails,
            uploadedVideoDetails,
            data:courseDetails
        })

   }catch(error){
        return res.status(500).json({
            success:false,              
            message:"Failed to Create the New  SubSection",
            error:error.message
        })
   }

}

exports.updateSubSection=async(req,res)=>{
    try{
        // data fetch
        const {courseId,subSectionId,title,description}=req.body;
        const video=req.files.videoFile

        // data validation
        if(!courseId || !subSectionId || !title || !description || !video){        
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }

        // upload the video file to cloudinary, this might be the case where updation is needed in video file uploaded
        const newVideoUploadedDetails=await uploadMediaToCloudinary(video,process.env.FOLDER_NAME);

        // update the db entry
        const updatedSubSectionDetails=await SubSection.findByIdAndUpdate(subSectionId,
                                                        {
                                                            title,timeDuration:newVideoUploadedDetails.duration
                                                            ,description,
                                                            videoUrl:newVideoUploadedDetails.secure_url
                                                        },{
                                                            new:true
                                                        })
        
        const courseDetails=await Course.findById(courseId)
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection"
                                            }
                                        }).populate("category")
                                        .exec()

        // return response
        return res.status(200).json({
            success:true,
            message:'Details of Sub Section updated Successfully',
            updatedSubSectionDetails,
            data:courseDetails
        })

    }catch(error){
        return res.status(500).json({
            success:false,              
            message:"Failed to Update the SubSection",
            error:error.message
        })
    }
}


exports.deleteSubSection=async(req,res)=>{
    try{
        // data fetch
        const {courseId,subSectionId,sectionId}=req.body;

        // data validation
        if(!courseId || !subSectionId || !sectionId){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }

        // delete db entry
        await SubSection.findByIdAndDelete(subSectionId);

        

        // update the section schema 
        // AGAIN THE QUESITON RISES ---> DO WE NEED TO DO THIS?????? [TODO --> TESTING]
        await Section.findByIdAndUpdate(sectionId,
                                    {
                                        $pull:{

                                            subSection:subSectionId
                                        }
                                    },
                                    {new:true})
        
        const courseDetails=await Course.findById(courseId)
                                        .populate({
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection"
                                            }
                                        }).populate("category")
                                        .exec()
        

        // return resposne
        return res.status(200).json({
            success:true,
            message:'Successfully deleted the SubSection',
            data:courseDetails
        })

        

    }catch(error){
        return res.status(500).json({
            success:false,              
            message:"Failed to Delete the SubSection",
            error:error.message
        })
    }
}