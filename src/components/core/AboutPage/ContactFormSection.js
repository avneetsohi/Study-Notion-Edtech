import React from 'react'
import { ContactUsForm } from '../ContactPage/ContactUsForm'



export const ContactFormSection = () => {
  return (
    <div className='mx-auto w-[40%] lg:w-[30%] flex flex-col gap-14 text-richblack-5'>
        <div className='flex flex-col gap-3'>
            <h1 className='text-center text-[40px] leading-[50px] font-semibold'>Get in Touch</h1>
            <p className='text-center text-base text-richblack-400 font-medium '>We'd love to hear from you, Please fill out this form.</p>
        </div>
        <ContactUsForm/>
    </div>
  )
}
