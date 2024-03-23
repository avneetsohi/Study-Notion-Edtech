const User = require("../models/User");
const Category = require ("../models/Category")
const {uploadMediaToCloudinary}=require("../utils/imageUploader");
const Course = require("../models/Course");
const { secsToDuration } = require("../utils/secsToDuration");
const CourseProgress = require("../models/CourseProgress");

require("dotenv").config();

// createCourse Handler function
exports.createCourse = async(req,res) => {
    try{
        // data fetch
        const {courseName,courseDescription,whatYouWillLearn,price,category,
            tag:_tag,
            status,
            instructions:_instructions}=req.body;

        // get thumbnail
        const thumbnail=req.files.thumbnailImage;

        const tag=JSON.parse(_tag)
        const instructions=JSON.parse(_instructions)
        
        // validation
        if( !courseName || 
            !courseDescription || 
            !whatYouWillLearn || 
            !price || 
            !category || 
            !thumbnail ||
            !tag || 
            !instructions
        ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }

        if(!status || status===undefined){
            status="Draft"
        }

        // check for instructor
        //BIG DOUBT ---> Yeh krne ki zrurat hi kyon h jab userId aur instructorDetails._id to ek hi baat h
        // ANSWER - YEH ISLIYE CHAHIYE KI KABHI KOI AISA CASE HOJAAYE JISMEIN USER MIDDLEWARE WALI AUTHENTICATION AUTHORISATION KO BYPASS KRJAAYE TOH USSE BACHNE KE LIYE, IN SHORT MIDDLEWARE APNA KAAM NAA KR SKA TOH EK SECURITY CHECK KI TARAH YEH KAAM KR RHA H
        const userId=req.user.id;
        const instructorDetails=await User.findById(userId,{accountType:"Instructor"});
        console.log("Instructor details: ",instructorDetails)
        
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:'Instructor Details are not found'
            })
        }

        // check for given category is valid or not

        // BIG DOUBT ---> YAHAN PE CATEGORY MEIN CATEGORY KI ID THODI AARI HOGI
        const categoryDetails=await Category.findById(category);

        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:'Category is not found'
            })
        }

          
        // Upload image to cloudinary
        const thumbnailImage=await uploadMediaToCloudinary(thumbnail,process.env.FOLDER_NAME)
     
        

        // create new db entry for course
        // DOUBT ----> userId SE HI SEEDHA HO JAATA instructor wali field
        const newCourse=await Course.create({
            courseName,courseDescription,instructor:userId,
            whatYouWillLearn:whatYouWillLearn,price,category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            tags:tag,
            status,instructions
        })  

        // add the new course to the user schema of Instructor
        // Again the doubt raises here
        await User.findByIdAndUpdate(userId,
                                    {
                                        $push:{
                                             courses:newCourse._id
                                        }
                                    },
                                    {new:true})


        // update the CATEGORY ka schema
        await Category.findByIdAndUpdate(categoryDetails._id,
                                    {
                                        $push:{
                                            courses:newCourse._id
                                        }
                                    },
                                    {new:true})
 
        // return resposne
        return res.status(200).json({
            success:true,
            message:'Course Created Successfully',
            data:newCourse
        }) 

    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error:error.message
        })
    }
}

// getAllCourses handler function
exports.showAllCourses = async(req,res) => {
    try{
        
        const allCourses=await Course.find({},
                                           {
                                            courseName:true,
                                            price:true,
                                            thumbnail:true,
                                            instructor:true,
                                            ratingsAndReviews:true,
                                            studentsEnrolled:true})
                                            .populate("instructor")
                                            .exec();

    return res.status(200).json({
        success:true,
        message:'Data for all courses fetched successfully',
        data:allCourses
    })
    
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            mesaage:'Cannot fetch Course Data',
            error:error.message
        })
    }
}

// fetch details of a specific course
exports.getCourseDetails=async(req,res)=>{
    
    try{
        // fetch data
        const {courseId}=req.body;
        
        // data validation  
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Invalid Course ID"
            })
        }

        //find the course from db
        const courseDetails=await Course.findById(courseId)
                            .populate({
                                path:"instructor",
                                populate:{
                                    path:"additionalDetails"
                                }
                            })
                            .populate({
                                path:"courseContent",
                                populate:{
                                    path:"subSection"
                                }
                            })
                            .populate("ratingAndReviews")
                            .populate("category")
                            .populate("studentsEnrolled")
                            .exec();
                            
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Coudld not find the course with id ${courseId}`

            })
        }

        let totalDurationInSeconds=0
        courseDetails.courseContent.map((content)=>{
            content.subSection.map((lecture)=>{
                const timeDurationInSeconds=parseInt(lecture.timeDuration)
                totalDurationInSeconds+=timeDurationInSeconds
            })
        })
        const courseDuration=secsToDuration(totalDurationInSeconds)
        
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:{
                courseDetails,
                courseDuration
            }
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching course details",
            
        })
    }

}

exports.getFullCourseDetails=async(req,res)=>{
    
    try{
        // fetch data
        const {courseId}=req.body;
        const id=req.user.id
        
        // data validation  
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Invalid Course ID"
            })
        }

        //find the course from db
        const courseDetails=await Course.findById(courseId)
                            .populate({
                                path:"instructor",
                                populate:{
                                    path:"additionalDetails"
                                }
                            })
                            .populate({
                                path:"courseContent",
                                populate:{
                                    path:"subSection"
                                }
                            })
                            .populate("ratingAndReviews")
                            .populate("category")
                            .populate("studentsEnrolled")
                            .exec();
                            
        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Coudld not find the course with id ${courseId}`

            })
        }

        const userDetails=await User.findById(id)
                                    .populate("courseProgress")
                                    .exec()

        const courseProgress=userDetails.courseProgress.filter((c)=>c.courseID==courseId)
        console.log("Course Progress",courseProgress)

        let totalDurationInSeconds=0
        courseDetails.courseContent.map((content)=>{
            content.subSection.map((lecture)=>{
                const timeDurationInSeconds=parseInt(lecture.timeDuration)
                totalDurationInSeconds+=timeDurationInSeconds
            })
        })
        const courseDuration=secsToDuration(totalDurationInSeconds)
        
        return res.status(200).json({
            success:true,
            message:"Course details fetched successfully",
            data:{
                courseDetails,
                courseDuration,
                completedVideos:courseProgress[0]?.completedVideos?courseProgress[0]?.completedVideos:[]
            }
        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while fetching full course details",
             
        })
    }

}


// edit details of a specific course
exports.editCourseDetails=async(req,res)=>{
    try{
        // fetch data
        const {courseId,courseName,courseDescription,price,whatYouWillLearn,status,
            tag:_tag,
            categoryId,
            instructions:_instructions
        }=req.body;
        let thumbnail=null;
        if(req?.files?.thumbnailImage){
            thumbnail=req.files.thumbnailImage;
        }

        // data validation

        const tag=JSON.parse(_tag)
        const instructions=JSON.parse(_instructions)
    
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Fields are required"
            })
        }
        
        let uploadedImageDetails=null;
        if(thumbnail){
            uploadedImageDetails= await uploadMediaToCloudinary(thumbnail,process.env.FOLDER_NAME)
        }

        // Update course details in DB
        if(uploadedImageDetails){
            await Course.findByIdAndUpdate(courseId,
                {
                    thumbnail:uploadedImageDetails.secure_url
                },
                {
                    new:true
                })
        }

        const courseDetails=await Course.findById(courseId);

        // if(!courseName || courseName===undefined){
        //     courseName=courseDetails.courseName
        // }

        // if(!courseDescription || courseDescription===undefined){
        //     courseDescription=courseDetails.courseDescription
        // }

        // if(!price || price===undefined){
        //     price=courseDetails.price
        // }

        // if(!whatYouWillLearn || whatYouWillLearn===undefined){
        //     whatYouWillLearn=courseDetails.whatYouWillLearn
        // }

        // if(!tag || tag===undefined){
        //     tag=courseDetails.tags
        // }

        // if(!categoryId || categoryId===undefined){
        //     categoryId=courseDetails.category
        // }

        // if(!status || status===undefined){
        //     status=courseDetails.status
        // }
        
        await Category.findByIdAndUpdate(courseDetails.category,
                                        {
                                            $pull:{
                                                courses:courseId
                                            }
                                        })

        

        const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,
                                                                {
                                                                    courseName,courseDescription,whatYouWillLearn,
                                                                    price,status,
                                                                    tags:tag,category:categoryId,
                                                                    instructions:instructions
                                                                },
                                                                {
                                                                    new:true
                                                                }).populate({
                                                                    path:"courseContent",
                                                                    populate:{
                                                                        path:"subSection"
                                                                    }
                                                                }).populate("category")
                                                                .exec()
        
        const updatedCategoryDetails=await Category.findByIdAndUpdate(categoryId,
                                                    {
                                                        $push:{
                                                            courses:courseId
                                                        }
                                                    })
        
        // return resposne
        return res.status(200).json({
            success:true,
            message:"Course details updated Successfully",   
            updatedCourseDetails
        })

    }catch(error){
        console.log(error.mesaage);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while updating the Course details",   
            
        })
    }
}

// Delete a Course
exports.deleteCourse=async(req,res)=>{
    try{
        // fetch data
        const userId=req.user.id;
        const {courseId}=req.body;

        // data validation
        if(!courseId){
            return res.status(400).json({
                success:false,
                message:"Fields are required"
            })
        }


        const courseDetails=await Course.findById(courseId);

        await Category.findByIdAndUpdate(courseDetails.category,
                                                        {
                                                            $pull:{
                                                                courses:courseId
                                                            }
                                                        },{new:true})

        // delete course from DB
        await Course.findByIdAndDelete(courseId);

        
        const updatedUserDetails=await User.findByIdAndUpdate(userId,
                                                            {
                                                                $pull:{
                                                                    courses:courseId
                                                                }
                                                            },{
                                                                new:true
                                                            })
        
    
        // return resposne
        return res.status(200).json({
            success:true,
            message:"Deleted the course Successfully",   
            updatedUserDetails
        })

    }catch(error){
        console.log(error.mesaage);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while deleting the course",   
            
        })
    }
}


// Get User Enrolled Courses
exports.getUserEnrolledCourse=async(req,res)=>{
    try{
        const id=req.user.id;

        const userDetails=await User.findById(id)
                                      .populate({
                                        path:"courses",
                                        populate:{
                                            path:"courseContent",
                                            populate:{
                                                path:"subSection"
                                            }
                                        }
                                      })
                                      .populate("courseProgress")
                                      .exec();
        

        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find user with id: ${userDetails}`,
            })
        }

        
        let courseDurations=[]

        userDetails.courses.map((course)=>{
            let totalDurationInSeconds=0
            course.courseContent.map((content)=>{
                content.subSection.map((lecture)=>{
                    const timeDurationInSeconds=parseInt(lecture.timeDuration)
                    totalDurationInSeconds+=timeDurationInSeconds
                })
            })
            let courseDuration=secsToDuration(totalDurationInSeconds)
            courseDurations.push(courseDuration)
        })


        let coursePercentages=[]
        userDetails.courses.map((course)=>{
            const courseProgressInstance=userDetails?.courseProgress?.filter((cp)=>cp.courseID.equals(course._id))
            if(courseProgressInstance.length!==0){
                const completedLectures=courseProgressInstance[0].completedVideos.length
                let totalNoOfLectures=0
                course.courseContent.forEach((section)=>{
                    totalNoOfLectures+=section.subSection.length
                })
                let coursePercentage=0
                if(totalNoOfLectures===0){
                    coursePercentage=0
                }
                else{
                    coursePercentage=Math.round((completedLectures/totalNoOfLectures)*100)
                }
                coursePercentages.push(coursePercentage)
            }else{
                coursePercentages.push(0)
            }
        })
        
        
        res.status(200).json({
            success:true,
            data:{
                enrolledCourses:userDetails.courses,
                courseDurations:courseDurations,
                coursePercentages
            },
            message:"Successfully fetched the enrolled courses"
        })
        
        
    }catch(error){
        console.log(error.mesaage)
        res.status(500).json({
            success:false,
            message:"Error in fetching the enrolled course details"
        })
    }

}

// Get specific instructor's courses
exports.getInstructorCourses=async(req,res)=>{
    try{
        const id=req.user.id;
        

        const courses=await Course.find({instructor:id})
                                  .populate({
                                    path:"courseContent",
                                    populate:{
                                        path:"subSection"
                                    }
                                  })
                                  .populate("category")
                                  .exec();
                                  
        let courseDurations=[]

        courses.map((course)=>{
            let totalDurationInSeconds=0
            course.courseContent.map((content)=>{
                content.subSection.map((lecture)=>{
                    const timeDurationInSeconds=parseInt(lecture.timeDuration)
                    totalDurationInSeconds+=timeDurationInSeconds
                })
            })
            let courseDuration=secsToDuration(totalDurationInSeconds)
            courseDurations.push(courseDuration)
        })

        return res.status(200).json({
            success:true,
            message:"All instructor's courses fetched",
            data:{
                courses,
                courseDurations
            }
        })
    }catch(error){
        console.log("Failed to fetch instructor's courses",error)
        return res.status(500).json({
            success:false,
            message:"Error occured while fetching instructor's courses"
        })
    }
}

