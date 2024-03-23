const { populate } = require("../models/Category");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");

exports.createSection=async(req,res)=>{

    try{
        // FETCH DATA
        const {sectionName,courseId}=req.body;
        // VALIDATION
        if(!sectionName || !courseId){
            return res.status(404).json({
                success:false,
                message:'All fields are required'
            })
        }
        // CREATE DB ENTRY FOR SECTION
        const sectionDetails=await Section.create({sectionName})

        // UPDATE THE COURSE SCHEMA FOR THE COURSE CONTENT FIELD
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
                                                        {
                                                            $push:{
                                                                courseContent:sectionDetails._id
                                                            }
                                                        },{new:true})
                                                        .populate({
                                                            path:"courseContent",
                                                            populate:{
                                                                path:"subSection"
                                                            }
                                                        }).populate("category")
                                                        .exec();

        // HW: use populate to replace sections/sub-sections both in the updatedCourseDetails 


        // RETURN RESPONSE
        return res.status(200).json({
            success:true,
            message:"New section created in the Course Successfully",
            sectionDetails,
            data:updatedCourseDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,              
            message:"Failed to Create the New Section",
            error:error.message
        })
    }
}

exports.updateSection=async(req,res)=>{
    try{
        // fetch data
        const {newSectionName,sectionId,courseId}=req.body;

        // validation
        if(!newSectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }

        // update the db entry
        const updatedSectionDetails=await Section.findByIdAndUpdate(sectionId,
                                                                    {
                                                                        sectionName:newSectionName
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
        // return response
        return res.status(200).json({
            success:true,
            message:"Section's details updated successfully",
            data:courseDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,              
            message:"Failed to Update the Section",
            error:error.message
        })
    }
}

exports.deleteSection=async(req,res)=>{
    try{
        // Assuming that we are sending sectionId in 
        // fetch data
        const {sectionId,courseId}=req.body;

        // validation
        if(!sectionId){
            return res.status(400).json({
                success:false,
                message:'All fields are required'
            })
        }

        const section=await Section.findById(sectionId);
        if(!section){
            return res.status(401).json({
                success:false,
                message:"Section not found"
            
            })
        }

        // delete the entry from db
        SubSection.deleteMany({_id:{$in:section.subSection}})

        await Section.findByIdAndDelete(sectionId);

        
        
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
                                       {
                                        $pull:{
                                            courseContent:sectionId
                                        }
                                       },{
                                        new:true
                                       })
                                       .populate({
                                        path:"courseContent",
                                        populate:{
                                            path:"subSection"
                                        }
                                       }).populate("category")
                                       .exec()

        return res.status(200).json({
            success:true,
            message:"Section Deleted Successfully",
            data:updatedCourseDetails
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to delete the section"
        })
    }
}