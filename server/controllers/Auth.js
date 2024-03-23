const Otp = require("../models/OTP");
const Profile = require("../models/Profile");
const User = require("../models/User");
const otpGenerator=require("otp-generator")
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const mailSender=require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

require("dotenv").config();

// send OTP
exports.sendOTP = async(req,res) => {
    try{

        // fetch email from req's body
        const {email} = req.body; 
        // check if email field is missing
        if(!email){
            return res.status(401).json({
                success:false,
                message:"All fields are required"
            })  
        }

        if(!email.includes('@')){
            return res.status(401).json({
                success:false,
                message:"Email is not valid"
            })  
        }

        // check if user exists
        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already exists"
            }) 
        }

        // generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        console.log("OTP generated:",otp);

        // Check unique OTP or not
        var result = await Otp.findOne({otp:otp})

        while(result){
            otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false
            })
            result = await Otp.findOne({otp:otp})
        }

        //CREATE db entry for OTP
        const otpEntry=await Otp.create({
            email,otp
        })
        console.log(otpEntry);

        // return resposne
        res.status(200).json({
            success:true,
            message:"OTP sent successfully",
            otp:otp
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

// signup
exports.signup = async(req,res) => {
    try{
        // data fetch from req body
        const {firstName,lastName,email,password,confirmPassword,accountType,contactNumber,otp}=req.body;

        // data validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !accountType){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            })
        }

        if(!email.includes('@')){
            return res.status(401).json({
                success:false,
                message:"Email is not valid"
            })  
        }

        // check user already exists
        const existingUser=await User.findOne({email});

        if(existingUser){
            return res.status(401).json({
                success:false,
                message:"User already exists, please log in to continue"
            })
        }
        
        // match the passwords
        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:'Password and Confirm Password does not match, please try again'
            })
        }

        

        // find most recent OTP stored for the user
        const recentOtp=await Otp.find({email:email}).sort({createdAt:-1}).limit(1);
        console.log("Recent Otp:",recentOtp);

        // validate OTP
        if(recentOtp.length==0){
            // otp not found
            return res.status(400).json({
                success:false,
                message:'OTP not found'
            })
        }else if(otp!==recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:'Invalid OTP'
            })
        }

        
        // HASH PASSWORD
        const hashedPassword=await bcrypt.hash(password,10);
        let approved="";
        approved==="Instructor"?(approved=false):(approved=true);
        

        // CREATE ENTRY IN DB
        const profileDetails=await Profile.create({
            gender:' ',
            dateOfBirth:null,
            about:null,
            contactNumber:91
        })

        const user=await User.create({
            firstName,lastName,email,contactNumber,
            password:hashedPassword,accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        // return response
        return res.status(200).json({
            success:true,
            message:'User registered successfully',
            user
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again"
        })
    }
}


// login
exports.login = async(req,res) => {
    try{
        // fetch data from req body
        const {email,password}=req.body;
        // validate fetched data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            })
        }

        if(!email.includes('@')){
            return res.status(401).json({
                success:false,
                message:"Email is not valid"
            })  
        }

        // user exist or not
        const user= await User.findOne({email})
                                .populate("additionalDetails")
                                .populate("cartItems")
                                .populate("courseProgress")
                                .exec()
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered, please sign up to continue'
            })
        }

        // compare passwords and generate JWT token

        if(await bcrypt.compare(password,user.password)){
            const payload={
                email:user.email,
                id:user._id,
                accountType:user.accountType
            }
            let token=jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"24h"
            })
            user.token=token
            user.password=undefined

            // create cookie and send resposne
            const options={
                expires: new Date(Date.now()+ 3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged In Successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:'Password is incorrect'
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Log In failed, please try again"
        })
    }
}


// change password
exports.changePassword= async(req,res) => {
    try{
        // fetch data
        const {currentPassword,newPassword,confirmNewPassword}=req.body;

        const id=req.user.id;

        // data validation
        if(!currentPassword || !newPassword || !confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:'All fields are required'
            })
        }

        if(newPassword!==confirmNewPassword){
            return res.status(403).json({
                success:false,
                message:'Passwords do not match'
            })
        }

        
        // access user entry from db
        const userDetails=await User.findById(id);

        if(!userDetails){
            return res.status(403).json({
                success:false,
                message:'Authentication Error'
            })
        }

        // 
        if(await bcrypt.compare(currentPassword,userDetails.password)){
            
            const newHashedPassoword=await bcrypt.hash(newPassword,10);

            const updatedUserDetails=await User.findByIdAndUpdate(id,
                                        {password:newHashedPassoword},
                                        {new:true})

            console.log(updatedUserDetails)
            try{
                const emailResponse=await mailSender(userDetails.email,'Password Updated Confirmation',passwordUpdated(updatedUserDetails.email,`${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`));
                console.log("Email sent successfully:", emailResponse.response);
            }catch(error){
                console.error("Error occurred while sending email:", error);
                return res.status(500).json({
                    success: false,
                    message: "Error occurred while sending email",
                    error: error.message,
                });
            }

            return res.status(200).json({
                success:true,
                message:'Password Updated Successfully'
            })
        }
        else{
            return res.status(403).json({
                success:false,
                message:'Old Password is not correct'
            })
        }

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while password updation'
        })
    }
}






