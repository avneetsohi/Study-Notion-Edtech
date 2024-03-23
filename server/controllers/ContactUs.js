const { contactUsEmail } = require("../mail/templates/contactFormRes");
const mailSender=require("../utils/mailSender")
require("dotenv").config();
exports.sendEnquiry=async(req,res)=>{
    try{
        const {firstName,lastName,email,contact,message}=req.body;

        if(!firstName || !email || !contact || !message){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        const messageDetails={
            name: `${firstName} ${lastName}`,
            email,
            Contact_Number: contact,
            Message:message
        }

        await mailSender(email,"Enquiry Acknowledgement Confirmation- StudyNotion",contactUsEmail(email,firstName,lastName,message,contact))

        await mailSender(process.env.MAIL_USER,`MESSAGE/ENQUIRY FROM STDUY NOTION USER`,
        `<h1>A message has been sent by a User</h1>
        <h4>Name:  ${firstName} ${lastName}</h4>
        <h4>Contact: ${contact}</h4>
        <h4>Message: ${message}</h4>
        `)

        return res.status(200).json({
            success:true,
            message:"Enquiry has been sent successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong while sending the Enquiry"
        })
    }
}