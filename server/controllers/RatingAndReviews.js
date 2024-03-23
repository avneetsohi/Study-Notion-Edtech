const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");

exports.createRating = async(req,res) => {

    try{
        // fetch data
        const {id}=req.user; 
        const {courseId,rating,review}=req.body;

        const courseDetails=await Course.findById(courseId);

        // const courseDetails=await Course.findOne(
        //                                         {_id:courseId,
        //                                         studentsEnrolled:{$elemMatch:{$eq:id}},
        //                                     })                                         

        // check if user is enrolled or not
        if(!courseDetails.studentsEnrolled.includes(id)){
            return res.status(400).json({
                status:false,
                message:"Student is not enrolled in the course"
            })
        }

        // check if user already reviewed the course
        
        const alreadyReviewed = await RatingAndReview.findOne({
                                                              user:id,
                                                              course:courseId
                                                            })

        if(alreadyReviewed){
            return res.status(403).json({
                status:false,
                message:"Course is already reviewed by the user"
            })
        }

        // validation
        if(!rating || !review || !courseId){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        // create db entry for rating and review
        const reviewDetails=await RatingAndReview.create({
            user:id,
            rating,
            review,
            course:courseId
        })

        // update the course schema for the rating and review fields
        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
                                                                  {
                                                                    $push:{
                                                                        ratingAndReviews:reviewDetails._id
                                                                    }
                                                                  },
                                                                  {new:true})
        console.log(updatedCourseDetails)
        // return response
        return res.status(200).json({
            success:true,
            message:"Ratings and Reviews created successfully",
            data:{
                reviewDetails,
                updatedCourseDetails
            }
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while creating reviews",

        })
    }

}

// getAverageRating 
exports.getAverageRating = async(req,res) => {
    try{
        // fetch data
        const {courseID}=req.body;
        
        //validation
        if(!courseID){
            return res.status(400).json({
                success:false,
                message:"Course not found"
            })
        }

        const result=await RatingAndReview.aggregate([
            {
                $match:{
                    course:new mongoose.Types.ObjectId(courseID)
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating:{$avg:"$rating"}
                }
            }
        ])

        if(result.length>0){
            return res.status(200).json({
                success:true,
                message:"Fetched Average rating successfully",
                averageRating:Math.round(result[0].averageRating*10)/10
            })
        }
        
        return res.status(200).json({
            success:true,
            message:"Average Rating is 0, no ratings given till now",
            averageRating:0
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching Average Rating",
            
        })
    }
}

// get All Ratings And Reviews
exports.getAllRatings = async(req,res) => {
    try{

        // fetch ratings from db for the course
        const reviews=await RatingAndReview.find({})
                                                .sort({rating:-1})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName"
                                                })
                                                .exec();

        return res.status(200).json({
            success:true,
            message:"Fetched all the reviews and ratings successfully",
            data: reviews
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching all the ratings",
            
        })
    }
}


// get All Course Specific Ratings And Reviews
exports.getCourseRatings = async(req,res) => {
    try{
        // fetch data
        const {courseID}=req.body;

        // validation
        if(!courseID){
            return res.status(400).json({
                success:false,
                message:"Course not found"
            })
        }

        // fetch ratings from db for the course
        const reviews=await RatingAndReview.find({course:courseID})
                                                .sort({rating:-1})
                                                .populate({
                                                    path:"user",
                                                    select:"firstName lastName email image"
                                                })
                                                .populate({
                                                    path:"course",
                                                    select:"courseName" 
                                                })
                                                .exec();

        return res.status(200).json({
            success:true,
            message:"Fetched all the course specific reviews and ratings successfully",
            data: reviews
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching all the ratings",
            
        })
    }
}