import React from 'react'
import Logo from '../../assets/Logo/Logo-Full-Light.png'
import Facebook from '../../assets/Logo/Facebook.png'
import Twitter from '../../assets/Logo/Twitter.png'
import Google from '../../assets/Logo/Google.png'
import Youtube from '../../assets/Logo/Youtube.png'
import { FooterColumn } from './FooterColumn'
import { FooterLink2 } from '../../data/footer-links'
import { Link  } from 'react-router-dom'
import { FaHeart } from "react-icons/fa";

export const Footer = () => {
  return (
    <div className='bg-richblack-800 text-white '>
        <div className='w-11/12 max-w-maxContent mx-auto flex flex-col pt-14 pb-10'>
            {/* Upper section */}
            <div className='flex w-full mb-[32px]'>
                <div className='flex gap-3 w-full pr-14 border-r border-r-[#2C333F]'>
                    <div className='flex flex-col gap-3 w-[33%]'>
                        <img src={Logo} width={"160px"} height={"32px"}/>
                        <div className='flex flex-col gap-3'>
                            <div className='font-inter text-base font-semibold text-richblack-100'>Company</div>
                            <div className='flex flex-col gap-2 text-richblack-400'>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>About</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Careers</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Affiliates</Link>
                            </div>
                        </div>
                        <div className='flex gap-3'>
                            <img src={Facebook} alt="" />
                            <img src={Google} alt="" />
                            <img src={Twitter} alt="" />
                            <img src={Youtube} alt="" />
                        </div>
                    </div>

                    <div className='flex flex-col gap-9 w-[33%]'>
                        <div className='flex flex-col gap-3'>
                            <div className='font-inter text-base font-semibold text-richblack-100'>Resources</div>
                            <div className='flex flex-col gap-2 text-richblack-400'>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Articles</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Blog</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Chart Sheet</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Chart Sheet</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Code Challenges</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Docs</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Projects</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Videos</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Workspaces</Link>
                            </div>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <div className='font-inter text-base font-semibold text-richblack-100'>Support</div>
                            <div className='text-richblack-400'>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Help Center</Link>
                            </div>
                        </div>
                        
                    </div>

                    <div className='flex flex-col gap-9 w-[33%]'>
                        <div className='flex flex-col gap-3'>
                            <div className='font-inter text-base font-semibold text-richblack-100'>Plans</div>
                            <div className='flex flex-col gap-2 text-richblack-400'>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Paid memberships</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>For Students</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Business solutions</Link>
                                
                                
                            </div>
                        </div>

                        <div className='flex flex-col gap-3'>
                            <div className='font-inter text-base font-semibold text-richblack-100'>Community</div>
                            <div className='flex flex-col gap-2 text-richblack-400'>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Forums</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Chapters</Link>
                                <Link to={"/login"} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>Events</Link>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='flex gap-3 w-full pl-12'>
                    <FooterColumn data={FooterLink2[0]}/>
                    <FooterColumn data={FooterLink2[1]}/>
                    <FooterColumn data={FooterLink2[2]}/>
                </div>
            </div>

            {/* lower section */}
            <div className='pt-8 border-t border-t-[#2C333F] w-full flex font-inter text-sm leading-[22px] font-medium text-richblack-300 justify-between'>
                <div className='flex items-center'>
                    <Link to={"/login"} className='border-r border-richblack-700 px-2 hover:text-richblack-25 transition-all duration-200'>Privacy</Link>
                    <Link to={"/login"} className='border-r border-richblack-700 px-2 hover:text-richblack-25 transition-all duration-200'>Cookie Policy</Link>
                    <Link to={"/login"} className='px-2 hover:text-richblack-25 transition-all duration-200'>Terms</Link>

                </div>
                <div className='font-inter text-sm leading-[22px] font-medium flex gap-1 items-baseline'>Made with <FaHeart color='red'/> © 2023 Studynotion</div>
            </div>
        </div>
    </div>
  )
}
