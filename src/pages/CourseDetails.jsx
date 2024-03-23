import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom'
import apiConnector from '../services/apiconnector';
import { courses, payments } from '../services/apis';
import toast from 'react-hot-toast';
import { ACCOUNT_TYPE, COURSE_STATUS } from '../utils/constants';
import rzpLogo from '../assets/Logo/rzp_logo.png'
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { Overlay } from '../components/common/Overlay';

import { setCourse, setPaymentLoading } from '../slices/courseSlice';
import { Footer } from '../components/common/Footer';
import RatingStars from '../components/common/RatingStars';
import { FormatDate } from '../services/FormatDate';
import { IoMdInformationCircleOutline } from "react-icons/io";
import { GoGlobe } from "react-icons/go";
import { FaCaretRight } from "react-icons/fa";
import { FaShareFromSquare } from "react-icons/fa6";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
import { averageRating } from '../utils/averageRating';
import { addToCart, removeFromCart, resetCart } from '../slices/cartSlice';
import { Error } from './Error';




export const CourseDetails = () => {

  const {courseId}=useParams();
  const {token}=useSelector((state)=>state.auth)
  const {user}=useSelector((state)=>state.profile)
  const navigate=useNavigate();
  const dispatch=useDispatch();
  const [modal,setModal]=useState(false);
  const [overlay,setOverlay]=useState(false);
  const RAZORPAY_KEY_ID=process.env.REACT_APP_RAZORPAY_KEY_ID

  

  function loadScript(src){
    return new Promise((resolve)=>{
        const script=document.createElement("script")
        script.src=src

        script.onload = () => {
            resolve(true)
        }

        script.onerror = () => {
            resolve(false)
        }

        document.body.appendChild(script)
    })
}
    
  const handleBuyCourse = async() => {
    if(token){
        if(user.accountType===ACCOUNT_TYPE.STUDENT){
            const toastId = toast.loading("Loading...");

            try{
                const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    
                if(!res) {
                    toast.error("RazorPay SDK failed to load");
                    return;
                }
    
                const response=await apiConnector("POST",payments.CAPTURE_PAYMENT_API,{courses:[courseId]},{
                    Authorization:`Bearer ${token}`
                })
                if(!response.data.success){
                    throw new Error(response.data.message)
                }
                console.log("CAPTURE PAYMENT API RESPONSE",response)
    
                const {orderResponse,userDetails}=response.data.data
                console.log("ORDER RESPONSE",orderResponse)
    
              
               
                const options={
                    key:RAZORPAY_KEY_ID,
                    amount:orderResponse.amount,
                    currency:orderResponse.currency,
                    name:"StudyNotion",
                    image:rzpLogo,
                    description: "Thank You for Purchasing the Course",
                    order_id:orderResponse.id,
                    prefill:{
                        name:`${userDetails.firstName} ${userDetails.lastName}`,
                        email:userDetails.email,
                        contact:`+91${userDetails.additionalDetails.contactNumber}`
                        
                    },
                    handler:function(response){
                        paymentSuccessEmailHandler(user,orderResponse,response)
                        verifyPaymentHandler(orderResponse,response)

                    },
                }
                const paymentObject=new window.Razorpay(options)
                paymentObject.open()
                paymentObject.on("payment.failed",function(response){
                    toast.error("Payment Failed. Please Try again later")
                    console.log("Payment failed response",response.error)
                })
            }catch(error){
                console.log("Error CAPTURE PAYMENT API",error)
                toast.error("Failed to make the Payment")
            }
            toast.dismiss(toastId);
        }else{
            toast.error(`You cannot buy the course. You are an ${user.accountType}`)
            return;
        }
        
    }else{
        setModal(true);
        setOverlay(true);
    }
    

  }


  const paymentSuccessEmailHandler=async(user,orderDetails,paymentResponse)=>{
   
    try{
        const response=await apiConnector("POST",payments.PAYMENT_SUCCESS_EMAIL,{user,orderDetails,paymentDetails:paymentResponse},{
            Authorization:`Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        console.log("Payment Success Email",response)

    }catch(error){
        console.log("Error occured while sending the Payment Success email",error)
    }

  }


  const verifyPaymentHandler= async(orderResponse,paymentResponse) => {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try{
        const response = await apiConnector("POST",payments.VERIFY_PAYMENT_API,{
            courses:[courseId],
            paymentResponse,
            orderResponse
        },
        {
            Authorization:`Bearer ${token}`
        })
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        console.log("VERIFY PAYMENT API RESPONSE",response)
        toast.success("Payment Successful, You are addded to the course");
        navigate("/dashboard/enrolled-courses");
        dispatch(removeFromCart(courseId))
    }catch(error){
        console.log("Error while Verifying Payment",error)
        toast.error("Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }

  const [courseData,setCourseData]=useState(null);
  const [avgRating,setAvgRating]=useState(0)
  const [totalLectures,setTotalLectures]=useState(0)
  const [courseDuration,setCourseDuration]=useState("");
  const [loading,setLoading]=useState(false);


  const fetchCourseDetails=async()=>{
    try{
        setLoading(true)
        const response=await apiConnector("POST",courses.GET_COURSE_DETAILS,{courseId})
        if(!response.data.success){
            throw new Error(response.data.message)
        }

        console.log("GET COURSE DETAILS API RESPONSE",response)
        setCourseData(response.data.data.courseDetails)
        setCourseDuration(response.data.data.courseDuration)
        setLoading(false)
    }catch(error){
        console.log("Error occured while fetching course details",error)
        toast.error("Failed to fetch the Course Details")
        setLoading(false)
    }
    
  }

  function countTotalLectures(sections){
    
    let lectures=0;
    if(sections){
        for(const section of sections){
            lectures += section?.subSection?.length
        }
    }
    setTotalLectures(lectures)
  }

  useEffect(()=>{
    fetchCourseDetails();
  },[])
  
  useEffect(()=>{
    const result=averageRating(courseData?.ratingAndReviews)
    setAvgRating(result)
    countTotalLectures(courseData?.courseContent)
  },[courseData])
  
  const copyURL=async()=>{
    await navigator.clipboard.writeText(window.location.href)
    toast.success("Link Copied to Clipboard")
  }
  
  

  const [sectionDropdownStatus,setSectionDropdownStatus]=useState([])

  function handleSectionDropdown(id){
    setSectionDropdownStatus(
        !sectionDropdownStatus.includes(id)?
        sectionDropdownStatus.concat(id):
        sectionDropdownStatus.filter((sectionId)=>sectionId!==id)
    )
  }

  if(loading){
    return(
        <div className='custom-loader mx-auto mt-44'></div>
    )
  }

  if(!courseData){
    return (
        <Error/>
    )
  }

  return (
    <div className='text-white'>
        
        {/* section 1 */}
        <div className='bg-richblack-800 pt-[130px] pb-[145px] relative'>
            <div className='w-11/12 max-w-maxContent mx-auto'>
                <div className='flex flex-col gap-5 w-[64%]'>
                    <h1 className='text-richblack-5 text-5xl font-bold '>{courseData?.courseName}</h1>
                    <p className='text-richblack-400 text-xl font-medium'>{courseData?.courseDescription}</p>
                    <div className='flex text-xl gap-2 items-center'>
                        <p className='text-yellow-50'>{avgRating}</p>
                        <RatingStars 
                            Review_Count={avgRating}
                            Star_Size={25}
                        />
                        <p>({courseData?.ratingAndReviews?.length} reviews)</p>
                        <p>{courseData?.studentsEnrolled?.length} Students Enrolled</p>
                    </div>
                    <p className='text-xl'>Created By {courseData?.instructor.firstName} {courseData?.instructor.lastName}</p>
                    <div className='flex gap-4 items-center text-xl'>
                        <div className='flex items-center gap-2'>
                            <IoMdInformationCircleOutline/>
                            <p>Created on {FormatDate(courseData?.createdAt)}</p>
                        </div>
                        <div className='flex items-center gap-2'>
                            <GoGlobe/>
                            <p>English</p>
                        </div>
                    </div>
                </div>

                <div className='absolute right-56 top-12 flex flex-col gap-4 bg-richblack-600 rounded-lg pt-6 pb-8 px-5'>
                    <img src={courseData?.thumbnail}
                        className='w-[380px] h-[270px] object-cover rounded-lg'
                    />
                    <h2 className='text-richblack-5 text-2xl font-semibold'>Rs. {courseData?.price}</h2>
                    {
                        (courseData?.studentsEnrolled?.find((student)=>student._id===user._id))?(
                            <Link to={`/view-course/${courseId}/section/${courseData?.courseContent[0]?._id}/sub-section/${courseData?.courseContent[0]?.subSection[0]?._id}`} className='bg-yellow-50 text-center px-4 py-2 rounded-md text-richblue-900 font-semibold'>
                                Go to Course
                            </Link>
                        ):(
                            <div className='flex flex-col gap-2'>
                                <button className='bg-yellow-50 px-4 py-2 rounded-md text-richblue-900 font-semibold'
                                onClick={handleBuyCourse}>
                                    Buy Now
                                </button>
                                <button className='bg-richblack-700 px-4 py-2 rounded-md  font-semibold'
                                onClick={()=>{
                                    if(token){
                                        if(user.accountType===ACCOUNT_TYPE.STUDENT){
                                            dispatch(addToCart(courseData))
                                        }else{
                                            toast.error(`You cannot Add the Course to the Cart. You are an ${user.accountType}`)
                                        }
                                    }else{
                                        setModal(true)
                                        setOverlay(true)
                                    }
                                }}>   
                                    Add to Cart
                                </button>
                            </div>
                        )
                    }
                    <p className='text-center text-richblack-25 text-base font-normal'>30-Day Money-Back Guarantee</p>
                    <div>
                        <h3 className='text-2xl font-semibold'>This Course Includes:</h3>
                        <div className='flex flex-col gap-3 mt-3'>
                            {
                                courseData?.tags.map((item,index)=>(
                                    <div key={index} className='flex gap-1 items-center text-caribbeangreen-100'>
                                        <FaCaretRight/>
                                        <p>{item}</p>
                                    </div>
                                ))
                            }
                        </div>
                    </div>

                    <span className='flex gap-2 mt-3 text-center items-center justify-center text-yellow-50 text-xl cursor-pointer'
                    onClick={copyURL}>
                        <FaShareFromSquare/>
                        Share    
                    </span>
                </div>
            </div>
        </div>

        {/* section 2 */}
        <div className='py-10'>
            <div className='w-11/12 max-w-maxContent mx-auto '>
                <div className='w-[64%] flex flex-col gap-8 border border-richblack-400 px-6 py-8'>
                    <h1 className='font-semibold text-4xl'>What you'll learn</h1>
                    <p className='text-lg font-medium'>{courseData?.whatYouWillLearn}</p>
                </div>
                <div className='w-[64%] mt-12 flex flex-col gap-3'>
                    <h1 className='font-semibold text-[32px] leading-[36px]'>Course Content</h1>
                    <div className='flex justify-between text-lg font-medium mt-2'>
                        <p >{courseData?.courseContent?.length} section(s) {totalLectures} lecture(s) {courseDuration} total Length</p>            
                        <span className='text-yellow-50 cursor-pointer'
                        onClick={()=>{
                            setSectionDropdownStatus([])
                        }}>
                            Collapse All Sections
                        </span>
                    </div>

                    <div className=' border border-richblack-500 mt-2'>
                        {
                            courseData?.courseContent?.map((section,index)=>(
                                <div key={section._id} >
                                    <div className={`bg-richblack-600 cursor-pointer px-4 py-5 flex justify-between transition-all `}
                                    onClick={()=>{
                                        handleSectionDropdown(section._id)
                                    }}>
                                        <div className='flex gap-1 items-center'>
                                            {
                                                !sectionDropdownStatus.includes(section._id)?(<AiOutlineDown/>):(<AiOutlineUp/>)
                                            }
                                            <p className='text-xl font-semibold'>{section?.sectionName}</p>
                                        </div>
                                        <p className='text-yellow-50'>{section?.subSection?.length} lectures(s)</p>
                                    </div>

                                    {
                                        sectionDropdownStatus.includes(section._id) && 
                                        <div className={`${sectionDropdownStatus.includes(section._id)?"h-16":"h-0"}  transition-all ease-in-out  duration-1000`}>
                                            {
                                                section?.subSection?.map((subSection)=>(
                                                    <div key={subSection._id} className={`flex gap-2 items-center px-4 py-5 `}>
                                                        <HiOutlineVideoCamera />
                                                        <p className='text-lg font-medium'>{subSection?.title}</p>
                                                    </div>        
                                                ))
                                            }
                                        </div>
                                    }

                                    {/* {
                                        sectionDropdownStatus.includes(section._id) && section?.subSection?.map((subSection)=>(
                                            <div key={subSection._id} className={`flex gap-2 items-center px-4 py-5 ${sectionDropdownStatus.includes(section._id)?"h-16":"h-0"} transition-all  duration-1000`}>
                                                <HiOutlineVideoCamera />
                                                <p className='text-lg font-medium'>{subSection?.title}</p>
                                            </div>        
                                        ))
                                    } */}

                                </div>
                            ))
                        }
                    </div>
                </div>

                <div className='mt-12 flex flex-col gap-4'>
                    <h1 className='font-semibold text-[32px] leading-[36px]'>Author</h1>
                    <div className='flex items-center gap-3'>
                        <img src={courseData?.instructor.image}
                            className='h-14 w-14 aspect-square rounded-full'
                        />
                        <p className='text-[20px] font-medium'>{courseData?.instructor.firstName} {courseData?.instructor.lastName}</p>
                    </div>
                </div>


            </div>
        </div>


        {/* footer section */}
        <Footer/>

        {
            modal && <ConfirmationModal
                setModal={setModal}
                setOverlay={setOverlay}
                iconBtnText={"Login"}
                iconBtnHandler={()=>navigate("/login")}
                modalHeading={"You are not Logged in!"}
                modalText={"Please Login to Purchase Course"}
            />
        }

        {
            overlay && <Overlay/>
        }
    </div>

  )
}



