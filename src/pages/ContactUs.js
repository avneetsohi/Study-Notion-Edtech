import React from 'react'
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { ContactUsForm } from '../components/core/ContactPage/ContactUsForm';
import { Footer } from '../components/common/Footer';
import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { IoCall } from "react-icons/io5";
import { ReviewSlider } from '../components/common/ReviewSlider';

export const ContactUs = () => {
  return (
    <div>
        {/* section 1 */}
        <section className='py-20'>
            <div className='w-11/12 max-w-maxContent flex flex-col lg:flex-row gap-16 mx-auto text-richblack-5'>
                <div className='flex flex-col px-8 py-10 w-[75%]  items-start gap-10 bg-richblack-800 h-fit rounded-[12px]'>
                    <div className='flex flex-col gap-[1px]'>
                        <div className='flex gap-3 items-center text-xl'>
                            
                            <HiChatBubbleLeftRight fontSize={28} className='text-richblack-300'/>
                            Chat with Us
                        </div>
                        <p className='text-base text-richblack-200 '>Our friendly team is here to help.</p>
                        <p className='text-base text-richblack-200 '>info@studynotion.com</p>
                    </div>

                    <div className='flex flex-col gap-[1px]'>
                        <div className='flex gap-3 items-center text-xl'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2.25C6.61522 2.25 2.25 6.61522 2.25 12C2.25 17.3848 6.61522 21.75 12 21.75C17.3848 21.75 21.75 17.3848 21.75 12C21.75 6.61522 17.3848 2.25 12 2.25ZM8.54688 4.50525C5.71517 5.8121 3.75 8.67655 3.75 12C3.75 16.5563 7.44365 20.25 12 20.25C16.3141 20.25 19.8548 16.9387 20.2191 12.7191L19.7582 12.2582C19.5872 12.0872 19.4449 11.8897 19.3367 11.6734L18.2567 9.5133C18.1304 9.26078 17.7939 9.20616 17.5942 9.4058C17.3818 9.61824 17.0709 9.69881 16.782 9.61627L15.5091 9.25259C15.0257 9.11447 14.524 9.40424 14.402 9.892C14.3109 10.2566 14.4588 10.6392 14.7715 10.8476L15.3582 11.2388C15.9489 11.6326 16.0317 12.4684 15.5297 12.9703L15.3295 13.1705C15.1186 13.3815 15 13.6676 15 13.966V14.3768C15 14.7846 14.8892 15.1847 14.6794 15.5344L13.3648 17.7254C12.9834 18.3611 12.2965 18.75 11.5552 18.75C10.9724 18.75 10.5 18.2776 10.5 17.6948V16.5233C10.5 15.6033 9.93989 14.7759 9.08565 14.4343L8.43151 14.1726C7.44978 13.7799 6.87393 12.7566 7.04776 11.7136L7.05479 11.6714C7.1012 11.393 7.19959 11.1257 7.34482 10.8837L7.43423 10.7347C7.92346 9.91928 8.87244 9.49948 9.80485 9.68597L10.9827 9.92153C11.5574 10.0365 12.124 9.69096 12.285 9.12744L12.4935 8.39774C12.6423 7.87721 12.3991 7.32456 11.9149 7.08245L11.25 6.75L11.159 6.84099C10.7371 7.26295 10.1648 7.5 9.56805 7.5H9.38712C9.13927 7.5 8.90098 7.59905 8.72572 7.7743C8.44225 8.05778 8.00817 8.12907 7.64961 7.94979C7.16435 7.70716 6.98836 7.10278 7.26749 6.63757L8.54688 4.50525Z" fill="#AFB2BF"/>
                            </svg>
                            Visit us
                        </div>
                        <p className='text-base text-richblack-200 '>Come and say hello at our office HQ.</p>
                        <p className='text-base text-richblack-200 '>Akshya Nagar 1st Block 1st Cross, Rammurthy nagar, Bangalore-560016</p>
                    </div>

                    <div className='flex flex-col gap-[1px]'>
                        <div className='flex gap-3 items-center text-xl'>
                        <IoCall fontSize={28} className='text-richblack-300' />
                            Call us
                        </div>
                        <p className='text-base text-richblack-200 '>Mon - Fri From 8am to 5pm</p>
                        <p className='text-base text-richblack-200 '>+123 456 7869</p>
                    </div>
                </div>

                <div className='flex flex-col gap-9 w-full border border-richblack-400 rounded-[20px] px-12 py-14'>
                    <div className='flex flex-col gap-4'>
                        <h1 className='text-4xl font-semibold text-richblack-5'>Got a Idea? We've got the skills. Let's team up</h1>
                        <p className='text-lg font-medium leading-[24px] text-richblack-200'>Tell us more about yourself and what you're got in mind</p>
                    </div>

                    <ContactUsForm/>
                </div>
            </div>
        </section>

        {/* section 2 */}
        <section className='pt-12 pb-20'>
            <div className='flex flex-col gap-7 items-center'>
                <div className='text-4xl text-white font-bold'>
                    Reviews from Other Learners
                </div>
                {/* Review Slider */}
                <ReviewSlider/>
            </div>  
        </section>

        {/* footer section */}
        <Footer/>
    </div>
  )
}
