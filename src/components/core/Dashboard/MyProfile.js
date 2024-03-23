import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { CTAButton } from '../HomePage/Button'
import { RiEditBoxLine } from "react-icons/ri";

export const MyProfile = () => {
    const {user}=useSelector((state)=>state.profile)
    
    return (
    <div className='w-full mx-auto'>
        <h1 className='text-4xl font-medium text-richblack-5'>My Profile</h1>
        <div className='w-full mt-10 flex flex-col gap-10'>

            {/* section 1 */}
            <div className='py-6 px-10 flex justify-between items-center bg-richblack-800 rounded-md'>
                <div className='flex gap-3 items-center '>
                    <img src={user?.image} height={75} width={75} className='aspect-square rounded-full object-cover' loading='lazy'/>
                    <div className='flex flex-col gap-[0.2px]'>
                        <p className='text-richblack-5 font-semibold text-xl'>{user?.firstName} {" "} {user?.lastName}</p>
                        <p className='text-richblack-200 text-base font-medium'>{user?.email}</p>
                    </div>
                </div>

                <CTAButton linkTo={'/dashboard/settings'} active={true}>
                    Edit
                    <RiEditBoxLine/>
                </CTAButton>
            </div>

            {/* section 2 */}
            <div className='py-6 px-10 flex justify-between items-start bg-richblack-800 rounded-md'>
                <div className='flex flex-col gap-8 justify-between '>
                    <p className='text-richblack-5 font-semibold text-xl'>About</p>
                    <p className='text-richblack-200 text-base font-medium'>
                        {
                            user?.additionalDetails?.about ?? "Write Something About Yourself"
                        }
                    </p>
                </div>

                <CTAButton linkTo={'/dashboard/settings'} active={true}>
                    Edit
                    <RiEditBoxLine/>
                </CTAButton>
            </div>

            {/* section 3 */}
            <div className='py-6 px-10 flex flex-wrap justify-between gap-x-48 gap-y-10 bg-richblack-800 rounded-md'>
                <p className='text-richblack-5 font-semibold text-xl'>Personal Details</p>
                <CTAButton linkTo={'/dashboard/settings'} active={true}>
                    Edit
                    <RiEditBoxLine/>
                </CTAButton>
                <div className='flex flex-wrap justify-between w-[75%] lg:w-[50%] gap-x-[80px] gap-y-5'>
                    <div className='flex flex-col gap-[1px]'>
                        <p className='text-richblack-500 text-base font-light'>First Name</p>
                        <p className='text-richblack-5 font-semibold text-sm '>{user.firstName}</p>
                    </div>
                    <div className='flex flex-col gap-[1px] place-items-end'>
                        <p className='text-richblack-500 text-base font-light '>Last Name</p>
                        <p className='text-richblack-5 font-semibold text-sm '>{user.lastName}</p>
                    </div>
                    <div className='flex flex-col gap-[1px]'>
                        <p className='text-richblack-500 text-base font-light '>Email</p>
                        <p className='text-richblack-5 font-semibold text-sm'>{user.email}</p>
                    </div>
                    <div className='flex flex-col gap-[1px] place-items-end'>
                        <p className='text-richblack-500 text-base font-light'>Phone Number</p>
                        <p className='text-richblack-5 font-semibold text-sm'>
                            {
                                user?.additionalDetails?.contactNumber ?? "Add Contact Number"
                            }
                        </p>
                    </div>
                    <div className='flex flex-col gap-[1px]'>
                        <p className='text-richblack-500 text-base font-light'>Gender</p>
                        <p className='text-richblack-5 font-semibold text-sm'>
                            {
                                user?.additionalDetails?.gender ?? "Add Gender"
                            }
                        </p>
                    </div>
                    <div className='flex flex-col gap-[1px] place-items-end'>
                        <p className='text-richblack-500 text-base font-light'>Date of Birth</p>
                        <p className='text-richblack-5 font-semibold text-sm'>
                            { user?.additionalDetails?.dateOfBirth ? user?.additionalDetails?.dateOfBirth : "Add Date of Birth"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}


