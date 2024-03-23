import React, { useState } from 'react'
import { BiStrikethrough } from 'react-icons/bi'
import { useDispatch, useSelector } from 'react-redux'
import { Overlay } from '../../../common/Overlay'
import { ConfirmationModal } from '../../../common/ConfirmationModal'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { payments } from '../../../../services/apis'
import apiConnector from '../../../../services/apiconnector'
import rzpLogo from '../../../../assets/Logo/rzp_logo.png'
import { resetCart } from '../../../../slices/cartSlice'
import { setPaymentLoading } from '../../../../slices/courseSlice'

export const RenderTotalAmount = () => {
    const {total,itemCart,totalItems}=useSelector((state)=>state.cart)
    const {user}=useSelector((state)=>state.profile)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const {token}=useSelector((state)=>state.auth)
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

            script.onerror=()=>{
                resolve(false)
            }

            document.body.appendChild(script)
        })
    }

    const handleBuyCourse = async() => {
        const courses=itemCart.map((course)=>course._id)
        if(token){
            const toastId=toast.loading("Loading...")
            try{
                const res=await loadScript("https://checkout.razorpay.com/v1/checkout.js");

                if(!res) {
                    toast.error("RazorPay SDK failed to load");
                    return;
                }

                const response=await apiConnector("POST",payments.CAPTURE_PAYMENT_API,{courses},{
                    Authorization:`Bearer ${token}`
                })
                if(!response.data.success){
                    throw new Error(response.data.message)
                }
                console.log("Capture Payment API RESPONSE",response)
                const {orderResponse,userDetails}=response.data.data

                const options={
                    key:RAZORPAY_KEY_ID,
                    amount:orderResponse.amount,
                    currency:orderResponse.currency,
                    name:"StudyNotion",
                    description:"Thank You for the Purchase",
                    image:rzpLogo,
                    order_id:orderResponse.id,
                    handler:function(response){
                        successPaymentEmailHandler(userDetails,orderResponse,response)
                        verifyPaymentHandler(courses,orderResponse,response)
                    },
                    prefill:{
                        name:`${user.firstName} ${user.lastName}`,
                        email:user.email,
                    }
                }
                const paymentObj=new window.Razorpay(options)
                paymentObj.open()
                paymentObj.on("payment.failed",function (response){
                    console.log("Payment error",response.error)
                    toast.error("Payment Failed. Please Try Again Later.")
                   
                })

                toast.dismiss(toastId)
            }catch(error){
                console.log("Error while initiating the payment",error)
                toast.dismiss(toastId)
                toast.error("Payment Failed. Please Try Again Later.")
            }
            
        }else{
            setModal(true)
            setOverlay(true)
        }    
    }

    const successPaymentEmailHandler=async(user,orderDetails,paymentDetails)=>{
        try{
            const emailResponse=await apiConnector("POST",payments.PAYMENT_SUCCESS_EMAIL,{user,orderDetails,paymentDetails},{
                Authorization:`Bearer ${token}`
            })
            if(!emailResponse.data.success){
                throw new Error(emailResponse.data.message)
            }
            console.log("SUCCESSFUL PAYMENT EMAIL API RESPONSE",emailResponse)
        }catch(error){
            console.log("Error while Sending Payment Success Email",error)
        }
    }

    const verifyPaymentHandler=async(courses,orderResponse,paymentResponse)=>{
        const toastId=toast.loading("Verifying Payment...")
        dispatch(setPaymentLoading(true))
        try{
            const response=await apiConnector("POST",payments.VERIFY_PAYMENT_API,{
                courses,orderResponse,paymentResponse
            },{
                Authorization:`Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("Verifying Payment API response",response)
            toast.success(`Payment Successull, You got enrolled in the ${courses.length>1?"Courses":"Course"}`)
            dispatch(resetCart())
            navigate("/dashboard/enrolled-courses")
        }catch(error){
            console.log("Error while verifying the payment",error)
            toast.error("OOPS!! PAYMENT FAILED")
        }   
        toast.dismiss(toastId)
        dispatch(setPaymentLoading(false))
        

    }
  return (
    <div className='w-[25%]'>
        <div className='flex flex-col items-start  p-4 bg-richblack-800 rounded-md'>
            <p className=' text-sm font-medium text-richblack-400'>Total:</p>
            <p className='text-yellow-25 text-2xl font-bold mt-1 '>₹ {total}</p>
            
            <button className='mt-7 mx-auto  gap-2 font-inter text-center text-lg w-full leading-[24px] px-[34px] py-[10px] rounded-md font-bold bg-yellow-50 text-black shadow-[1px_1px_0px_0px_rgba(255,255,255,0.51)]"}
            hover:scale-95 transition-all duration-200'
            onClick={handleBuyCourse}
            >
                Buy Now
            </button>
        </div>

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
