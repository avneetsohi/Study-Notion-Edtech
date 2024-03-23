const { default: mongoose } = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate=require("../mail/templates/emailVerificationTemplate")


const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:60*5
    }
})

// funciton ---> to send emails
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailSender(email,'Verification Email from StudyNotion',emailTemplate(otp));
        console.log("Email sent successfully",mailResponse.response);
    }
    catch(error){
        
        console.log("Error occured while sending verification email",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    console.log("New document saved to the database")
    if(this.isNew){
        await sendVerificationEmail(this.email,this.otp);
    }
    next();
})

module.exports=mongoose.model("OTP",OTPSchema)