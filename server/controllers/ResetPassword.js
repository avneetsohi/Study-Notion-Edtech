
const User=require("../models/User")
const mailSender=require("../utils/mailSender")
const bcrypt=require("bcrypt")
const crypto=require("crypto")

// reset Password Token
exports.resetPasswordToken = async(req,res) => {
    // fetch email from req body
    try{
        const email=req.body.email;
        // check user exists or not and validate email
        const user=await User.findOne({email});
        if(!user){
            return res.status(403).json({
                success:false,
                message:"Your email is not registered"
            })
        }
        // generate token
        const token=crypto.randomUUID();
        // update User by adding token and expiration time
        const updatedUserDetails=await User.findOneAndUpdate({email},
                                                        {
                                                            token:token,
                                                            resetPasswordExpires: Date.now() + 5*60*1000
                                                        },
                                                        {new:true});
        // create url
        const url= `http://localhost:3000/update-password/${token}`

        // send mail containing the url
        await mailSender(email,
			"Password Reset",
			`Your Link for email verification is ${url}. Please click this url to reset your password.`);

        // return response

        return res.status(200).json({
            success:true,
            message:"Email sent successfully, please check email and change password",
            data:updatedUserDetails

        })

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while resetting password"
        })
    }
}


// reset Password

exports.resetPassword=async(req,res)=>{
    try{
        // data fetch
        const {password,confirmPassword,token}=req.body;

        // validation
        if(password!==confirmPassword){
            return res.status(401).json({
                success:false,
                message:'Passwords do not match'
            })
        }

        // get user details from db using token
        const userDetails=await User.findOne({token});

        // if no entry - invalid token
        // token time check
        if(!userDetails){ 
            return res.status(403).json({
                success:false,
                message:'Token invalid'
            })
        }else if(Date.now()>userDetails.resetPasswordExpires){
            return res.status(401).json({
                success:false,
                message:'Token is expired, please regenerate your token'
            })
        }
    

        // password hashing
        const hashedPassword=await bcrypt.hash(password,10);

        // update password
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true})

        // return response 
        return res.status(200).json({
            success:true,
            message:'Password reset successful'
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:'Something went wrong while Password reset'
        })
    }
}