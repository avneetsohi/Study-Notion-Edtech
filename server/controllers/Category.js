const { default: mongoose, ObjectId } = require("mongoose");
const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");

function getRandomInt(max){
    return Math.floor(Math.random() * max);
}

exports.createCategory = async(req,res) => {
    try{
        // fetch data
        const {name,description}=req.body;

        // data validation
        if(!name || !description){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            })
        }

        // create entry in db
        const categoryDetails=await Category.create({
            name,
            description:description
        })

        console.log(categoryDetails)

        // return response
        return res.status(200).json({
            success:true,
            message:'Category created Successfully' 
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}


exports.showAllCategories = async(req,res) => {
    try{
        const allCategories=await Category.find({});
        return res.status(200).json({
            success:true,
            message:'All categories returned successfully', 
            data:allCategories
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

exports.categoryPageDetails = async(req,res) => {
    try{
        // get categoryID
        const {categoryID,btnId}=req.body;

        if(!categoryID){
            return res.status(404).json({
                success:false,
                message:"Category not found"
            })
        }

        

        // fetch courses corresponding to category ID
        const selectedCategory=await Category.findById(categoryID);

         // VALIDATION
         if(!selectedCategory){
            return res.status(404).json({
                success:false,
                message:"Data not Found"
            })
        }

        let selectedCategoryCourses;
        if(btnId===1){
            const courses=await Course.find({category:categoryID})
                                                    .populate("instructor")
                                                    .populate("ratingAndReviews")
                                                    .exec();
            selectedCategoryCourses=courses.sort(
                (a,b)=>b.studentsEnrolled.length-a.studentsEnrolled.length
            )

        }else{
            selectedCategoryCourses=await Course.find({category:categoryID})
                                                .sort({createdAt:-1})
                                                .populate("instructor")
                                                .populate("ratingAndReviews")
                                                .exec();
        }
        

       

        // GET COURSES FOR A DIFFERENT CATEGORY
        const differentCategories=await Category.find({_id:{$ne:categoryID}})
        
        const unselectedCategory=differentCategories[getRandomInt(differentCategories.length)];
        

        const courses=await Course.find({category:unselectedCategory._id})
                                              .populate("instructor")
                                              .populate("ratingAndReviews")
                                              .exec();
                                            
        const unselectedCategoryCourses=courses.sort(
            (a,b)=>b.studentsEnrolled.length-a.studentsEnrolled.length
        )
        
        // GET TOP 10 SELLING COURSES
        const topCourses=await Course.aggregate([
            {
                $match: {
                    // category:{$ne:new mongoose.Types.ObjectId(categoryID)},
                    status:"Published"
                }
            },
            {
                $project: {
                    courseName: 1,
                    price: 1,
                    thumbnail:1,
                    instructor:1,
                    ratingAndReviews: 1,
                    status:1,
                    studentsEnrolledCount: { $size: "$studentsEnrolled" }
                }
            },
            {
                $sort: { studentsEnrolledCount: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "RatingAndReview",
                    localField: "ratingAndReviews",
                    foreignField: "_id",
                    as: "populatedRatingAndReviews"
                }
            },
            {
                $addFields: {
                    populatedRatingAndReviews: "$populatedRatingAndReviews"
                }
            },
            {
                $project: {
                    courseName: 1,
                    price: 1,
                    thumbnail:1,
                    status:1,
                    ratingAndReviews: "$populatedRatingAndReviews",
                    studentsEnrolledCount: 1,
                    instructor:1
                }
            }
        ])

        const instructorIds = topCourses.map(course => course.instructor);

        const instructors = (await User.find({ _id: { $in: instructorIds } }))

        const mostSellingCourses = topCourses.map(course => {
            const instructor = instructors.find(
                instructor => instructor._id.equals(course.instructor) 
            );
            return {
                ...course,
                instructor: instructor
            };
        });

        

        // console.log("Top Course",mostSellingCourses);
        

        // RETURN RESPONSE
        return res.status(200).json({
            success:true,
            message:"Fetched category page details data",
            data:{
                selectedCategory,
                selectedCategoryCourses,
                unselectedCategory,
                unselectedCategoryCourses,
                mostSellingCourses
            }

        })

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}