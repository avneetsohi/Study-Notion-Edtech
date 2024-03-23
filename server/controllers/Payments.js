const { default: mongoose } = require("mongoose");
const {instance}=require("../config/razorpay");
const Course = require("../models/Course");
const mailSender=require("../utils/mailSender");
const User = require("../models/User");
const crypto = require("crypto");
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const CourseProgress = require("../models/CourseProgress");


exports.capturePayment = async(req,res) => {

    const {courses}=req.body;
    const userId=req.user.id

    if(courses.length===0){
        return res.status(401).json({
            success:false,
            message:"Courses not found"
        })
    }

    let totalAmount=0;
    try{
        for(const courseId of courses){

            if(!courseId){
                return res.status(400).json({
                    success:false,
                    message:"Course Id not found"
                })
            }

            const course=await Course.findById(courseId);
            if(!course){
                return res.status(400).json({
                    success:false,
                    message:"Course Id is not valid"
                })
            }

            const uid=new mongoose.Types.ObjectId(userId);

            if(course.studentsEnrolled.includes(uid)){
                return res.status(400).json({
                    success:false,
                    message:"Student is already enrolled in the course"
                })
            }

            totalAmount+=course.price

        }

        const currency="INR"
        const options={
            amount:totalAmount*100,
            currency,
            receipt: Math.random(Date.now()).toString()
        }
        

        try{
            const orderResponse=await instance.orders.create(options)
            

            const userDetails = await User.findById(userId)
                                    .populate("additionalDetails")     
                                    .exec();
           
            // res.setHeader('Permissions-Policy','payment=*')

            return res.status(200).json({
                success:true,
                message:"Successfully Initiated the Payment",
                data:{
                    orderResponse,
                    userDetails
                }
            })
        }catch(error){
            console.log(error)
            return res.status(500).json({
                success:false,
                message:"Error in capturing order"
            })
        }
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"Error while initiating the payment"
        })
    }

}


exports.verifyPayment=async(req,res)=>{

    const {courses,orderResponse,paymentResponse}=req.body;
    const userId=req.user.id;
    
    let body = orderResponse.id + "|" + paymentResponse.razorpay_payment_id

    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
                                    .update(body.toString())
                                    .digest("hex")

    console.log("Expected Signature",expectedSignature)
    console.log("Razorpay Signature",paymentResponse.razorpay_signature)

    const razorpay_signature=paymentResponse.razorpay_signature
    if(expectedSignature === razorpay_signature){

        try{
            const uid=new mongoose.Types.ObjectId(userId)
            for(const courseId of courses){
                

                const courseDetails=await Course.findByIdAndUpdate(courseId,{
                                                                        $push:{
                                                                            studentsEnrolled:uid
                                                                        }
                                                                        },{new:true})

                const newCourseProgress=await CourseProgress.create({
                    courseID:courseId,
                    completedVideos:[]
                })

                const userResponse=await User.findByIdAndUpdate(uid,{
                                                                        $push:{
                                                                            courses:courseId,
                                                                            courseProgress:newCourseProgress._id
                                                                        }
                                                                    },
                                                                    {
                                                                        new:true
                                                                    })

                                                                

                const emailResponse=await mailSender(userResponse.email,`Congratulations, You have Successfully enrolled in the ${courseDetails.courseName} Course`,courseEnrollmentEmail(courseDetails.courseName,`${userResponse.firstName} ${userResponse.lastName}`))

                console.log("Email Response",emailResponse);

            }
            const user=await User.findById(uid);

            return res.status(200).json({
                success:true,
                message:"Successfully Verified the Payment",
                data:user
            })
        }catch(error){
            console.log("Some error occured while verifying the payment",error)
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }
    }
    return res.status(500).json({
        success:false,
        message:"The expected signature and razorpay signature did not match for payment verification"
    })
}

exports.paymentSuccessEmail=async(req,res)=>{
    const {user,orderDetails,paymentDetails}=req.body;

    try{
        const emailResponse=await mailSender(user.email,'Thank You for the Purchase. We have recieved your Payment.',paymentSuccessEmail(`${user.firstName} ${user.lastName}`,orderDetails.amount/100,orderDetails.id,paymentDetails.razorpay_payment_id))

        if(!emailResponse){
            return res.status(401).json({
                success:false,
                message:"No email Response found"
            })
        }

        return res.status(200).json({
            success:true,
            message:"Sent the payment success email",
            data:emailResponse
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error occured while sending Successfull Payment Email"
        })
    }
}












// THE TWO BELOW CONTROLLERS ARE NOT WRONG BUT THEY WILL ONLY WORK FOR PAYMENT OF 1 COURSE. WE NEED TO HANDLE MULITPLE COURSES' PAYMENTS AT THE SAME TIME (IF THERE ARE MULTIPLE COURSES IN THE CART) SO WE NEED TO HAVE THE ABOVE TWO FUNCTIONS. 
// capture the payment and initiate the Razorpay Order
// exports.capturePayment=async(req,res)=>{
//     try{
//         // get courseId and userId 
//         const {courseId}=req.body;
//         const userId=req.user.id;

//         // validation
//         // course validation
//         if(!courseId){
//             return res.status(400).json({
//                 success:false,
//                 message:"Please provide valid course ID"
//             })
//         }

//         // valid courseDetail
//         let course;
//         try{
//             course=await Course.findById(courseId);

//             if(!course){
//                 return res.status(400).json({
//                     success:false,
//                     message:"Could not find the course"
//                 })
//             }
//         }catch(error){
//             return res.status(400).json({
//                 success:false,
//                 message:"Something went wrong while validating the course details"
//             })
//         }
        
//         // user already paid for the same course
//         const uid= new mongoose.Types.ObjectId(userId);
//         if(course.studentsEnrolled.includes(uid)){
//             return res.status(400).json({
//                 success:false,
//                 message:"Student is already enrolled"
//             })
//         }
//         // order create 
//         const amount=course.price;
//         const currency="INR";
//         const options={
//             amount:amount*100,
//             currency,
//             receipt:Math.random(Date.now()).toString(),
//             notes:{
//                 courseId,
//                 userId
//             }
//         }

//         try{
//             // INITIATE THE PAYMENT USING RAZORPAY
//             const paymentResponse=await instance.orders.create(options)
//             console.log(paymentResponse)
//             // return response
//             return res.status(200).json({
//                 success:true,
//                 courseName:course.courseName,
//                 courseDescription:course.courseDescription,
//                 thumbnail:course.thumbnail,
//                 orderId:paymentResponse.id,
//                 currency:paymentResponse.currency,
//                 amount:paymentResponse.amount
//             })
            
//         }catch(error){
//             console.log(error)
//             res.json({
//                 success:false,
//                 message:"Could not initiate order"
//             })
//         }
//     }catch(error){
//         console.entityrror(error)
//         return res.status(500).json({
//             success:false,
//             message:error.message
//         })
//     }
// }

// verify signature of Razorpay and Server 
// exports.verifySignature=async(req,res)=>{
//     const webhookSecret="10713437";

//     // this signature comes in encrypted format
//     const signature=req.headers("x-razorpay-signature");

//     // Hmac- Hashed based Message Authentication Code  ---> Combination of hashing algo and secret_key
//     const shasum=crypto.createHmac("sha256",webhookSecret)
//     shasum.update(JSON.stringify(req.body));
//     const digest = shasum.digest("hex");

//     if(signature === digest){
//         console.log("Payment is Authorised");

//         const userId=req.body.payload.payment.entity.notes.userId;
//         const courseId=req.body.payload.payment.entity.notes.courseId

//         try{
//             // fulfill the action

//             // find the student and update the courses field 
//             const enrolledStudent=await User.findByIdAndUpdate(userId,
//                                                                 {
//                                                                     $push:{
//                                                                         courses:courseId
//                                                                     }
//                                                                 },
//                                                                 {
//                                                                     new:true
//                                                                 })
            
//             console.log(enrolledStudent)

//             // FIND THE COURSE AND ENROLL THE STUDENT IN IT
//             const enrolledCourse=await Course.findByIdAndUpdate(courseId,
//                                                                 {
//                                                                     $push:{
//                                                                         studentsEmrolled:userId
//                                                                     }
//                                                                 },
//                                                                 {
//                                                                     new:true
//                                                                 })
//             if(!enrolledCourse){
//                 return res.status(500).json({
//                     success:false,
//                     message:'Course not found'
//                 })
//             }

//             console.log(enrolledCourse)

//             //Send confirmation email
//             const emailResponse=await mailSender(enrolledStudent.email,
//                                                 "Congratulations from Codehelp" ,
//                                                 "Congratulations, You are enrolled into new Study Notion Course")

//             console.log(emailResponse)

//             return res.status(200).json({
//                 success:true,
//                 message:"Signature verified and course added"
//             })


//         }catch(error){
//             console.log(TypeError)
//             return res.status(509).json({
//                 success:false,
//                 message:error.message
//             })
//         }
//     }
//     else{
//         return res.status(400).json({
//             success:false,
//             message:"Invalid request"
//         })
//     }

    


// }


