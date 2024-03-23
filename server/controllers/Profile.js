const Course = require("../models/Course");
const Profile = require("../models/Profile");
const User = require("../models/User");
const cron=require("node-cron");
const { uploadMediaToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// update profile
exports.updateProfile=async(req,res)=>{
    console.log("Reached the endpoint")
    try{
        // fetch data
        const {firstName,lastName,gender,dateOfBirth,contactNumber,about}=req.body;

        // get user id
        const id=req.user.id;
        

        // data validation
        if(!gender  || !contactNumber){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            })
        }

        console.log("Before updating in DB")
        
        // find profile
        const userDetails=await User.findByIdAndUpdate(id)
        console.log("User Details:",userDetails)
        const profileId=userDetails.additionalDetails;
        console.log("User Details:",profileId)

        // update the profile db entry
        const updatedProfile=await Profile.findByIdAndUpdate(profileId,
                                                            {
                                                                gender,dateOfBirth,about,contactNumber
                                                            },
                                                            {new:true});

        const image=`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
        await User.findByIdAndUpdate(id,{firstName,lastName,image},{new:true})
        
        const updatedUserDetails=await User.findById(id)
                                            .populate("additionalDetails")
                                            .exec();

        console.log("After updating in DB")

        // return resposne
        return res.status(200).json({
            success:true,
            message:"Updated the user's Profile Successfully",
            updatedUserDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to Update the user's Profile",
        })
    }
    
}

// Update Profile Picture
exports.updateProfilePicture=async(req,res)=>{

    try{
        const userId=req.user.id;
        const profilePicture=req.files.displayPicture;

        if(!profilePicture){
            return res.status(403).json({
                success:false,
                message:'No file found'
            })
        }

        const uploadedImageDetails=await uploadMediaToCloudinary(profilePicture,process.env.FOLDER_NAME,1000,1000)
        console.log("Img response:", uploadedImageDetails)

        const updatedUserDetails=await User.findByIdAndUpdate({_id:userId},{image:uploadedImageDetails.secure_url},{new:true});

        return res.status(200).json({
            success:true,
            message:"Profile picture has been updated successfully",
            updatedUserDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Error while updating the profile picture'
        })
    }


}

exports.editUserCartDetials=async(req,res)=>{
    
    try{
        const userId=req.user.id;
        const {cartItems,cartItemCount,cartTotalAmount}=req.body;

        
        const userDetails=await User.findByIdAndUpdate(userId,{
                                                        cartItems,
                                                        cartItemCount,
                                                        cartTotalAmount
                                                        },{
                                                            new:true
                                                        })

        return res.status(200).json({
            success:true,
            message:"Successfully, updated the user's cart details",
            data:userDetails
        })
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Some error occured while updating cart's details"
        })
    }
}


// delete accounnt
exports.deleteAccount=async(req,res)=>{
    try{
        // get id
        const id=req.user.id
        console.log("User id:",id)
        // validation
        const userDetails=await User.findById(id);
        if(!userDetails){
            return res.status(403).json({
                success:false,
                message:"User not found "
            })
        }
        console.log("User Details",userDetails)
        // delete related profile
        const profileId=userDetails.additionalDetails;

        await Profile.findByIdAndDelete(profileId)

        // TODO HW: UNEROLL USER FROM ALL ENROLLED COURSES
        const courses=await Course.updateMany({studentsEnrolled:id},
                                {
                                    $pull:{
                                        studentsEnrolled:id
                                    }
                                },
                                {new:true})

        // EXPLORE --> HOWW CAN WE SCHEDULE THIS DELETE OPERATION
        // delete user's db entry

        await User.findByIdAndDelete(id);

        // return response
        return res.status(200).json({
            success:true,
            message:"Deleted user's account Successfully"
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:"Failed to delete user's account"
            
        })
    }
}
 

// Get User's All details Handler
exports.getAllUserDetails=async(req,res)=>{
    try{
        // get id
        console.log("User id:",req.user.id);
        console.log("User email:",req.user.email);
        
        const id=req.user.id;

        // validate and get user details
        const userAllDetails=await User.findById(id).populate("additionalDetails").exec();
        console.log("User details:",userAllDetails)
        
        if(!userAllDetails){
            return res.status(400).json({
                success:true,
                message:"User not found",
                
            })
        }
        
        // return response
        return res.status(200).json({
            success:true,
            message:"Fetched all the details of the user successfully",
            userAllDetails
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error in Fetching all the details of the user",
            
        })
    }
}



exports.scheduleDeleteAccount = async(req,res) => {
    try{
        const currentTime=new Date();
        const threeDaysLaterTime=new Date(currentTime.getTime()+(3*60*1000));

        // threeDaysLaterTime.setHours(23);
        // threeDaysLaterTime.setMinutes(23);
        // threeDaysLaterTime.setSeconds(0);

        const cronTime = `${threeDaysLaterTime.getSeconds()} ${threeDaysLaterTime.getMinutes()} ${threeDaysLaterTime.getHours()}  ${threeDaysLaterTime.getDate()} ${threeDaysLaterTime.getMonth()+1} Friday`

        console.log("Cron Time", cronTime)

        cron.schedule(cronTime,()=>{
            this.deleteAccount();
        },{
            scheduled:true,
            timezone:"Asia/Kolkata"
        })

        return res.status(200).json({
            success:true,
            message:"User's account deleted successfully"
        })
    }catch(error){
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:"Something went wrong while deleting user's Account"

        })
    }

}