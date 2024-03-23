const { default: mongoose} = require("mongoose");

const courseSchema=new mongoose.Schema({
        courseName:{
            type:String,
            required:true,
            trim:true
        },
        courseDescription:{
            type:String,
            trim:true

        },
        instructor:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"User",
            
        },
        whatYouWillLearn:{
            type:String,
            trim:true,
        },
        courseContent:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Section"
            }
        ],
        ratingAndReviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"RatingAndReview" 
            }
        ],
        price:{
            type:Number
        },
        thumbnail:{
            type:String
        },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category", 
        },
        tags:{
            type:[String],
            required:true
        },
        studentsEnrolled:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"User",
                required:true
            }
        ],
        instructions:{
            type:[String]
        },
        status:{
            type:String,
            enum:["Draft","Published"]
        }
    },
    {timestamps:true}
)

module.exports=mongoose.model("Course",courseSchema)