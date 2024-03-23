const { default: mongoose } = require("mongoose");

const userSchema=new mongoose.Schema(
    {
        firstName:{
            type:String,
            required:true,
            trim:true
        },
        lastName:{
            type:String,
            required:true,
            trim:true
        },
        email:{
            type:String,
            required:true,
            trim:true
        },
        password:{
            type:String,
            required:true,
        },
        accountType:{
            type:String,
            enum:['Student','Instructor','Admin'],
            required:true
        },
        active:{
            type:Boolean,
            default:true
        },
        approved:{
            type:Boolean,
            default:true,
        },
        additionalDetails:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Profile"
        },
        courses:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Course"
            }
        ], 
        image:{
            type:String,
            required:true,
        },
        token:{
            type:String
        },
        resetPasswordExpires:{
            type:Date
        },
        courseProgress:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"courseProgress"
            }
        ],
        cartItems:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Course"
            }
        ],
        cartItemCount:{
            type:Number,
            default:0
        },
        cartTotalAmount:{
            type:Number,
            default:0
        }

    },
    {timestamps:true}

)



module.exports=mongoose.model('User',userSchema);