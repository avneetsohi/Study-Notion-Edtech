import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from "react-icons/fa";
import { HightlightText } from '../components/core/HomePage/HightlightText';
import { CTAButton } from '../components/core/HomePage/Button';
import Banner from "../assets/Images/banner.mp4"
import { CodeBlocks } from '../components/core/HomePage/CodeBlocks';
import { TimelineSection } from '../components/core/HomePage/TimelineSection';
import { LearningLanguageSection } from '../components/core/HomePage/LearningLanguageSection';
import Instructor from '../assets/Images/Instructor.png'
import { ReviewCard } from '../components/core/HomePage/ReviewCard';
import { ExploreMore } from '../components/core/HomePage/ExploreMore';
import { Footer } from '../components/common/Footer';
import { ReviewSlider } from '../components/common/ReviewSlider';

export const Home = () => {
    const codeData='<!DOCTYPE html>\n<html >\nhead><>Example</\ntitle><linkrel="stylesheet"href="styles.css">\n/head>\nbody>\nh1><ahref="/">Header</a>\n/h1>\nnav><ahref="one/">One</a><ahref="two/">Two</\na><ahref="three/">Three</a>\n/nav>'
    
  return (
    <div>
        {/* Section 1 */}
        
        <div className=' mx-auto flex flex-col w-11/12 max-w-maxContent items-center text-white justify-between'>

            <Link to='/signup'>
                <div className='group mt-16 p-1 mx-auto rounded-full bg-richblack-800 text-xl font-bold text-richblack-200 
                transition-all duration-200 hover:scale-95 w-fit shadow-[0px_2px_0px_0px_rgba(255,255,255,0.18)] inset-0'>
                    <div className='flex items-center gap-2 group-hover:bg-richblack-900  rounded-full px-10 py-[5px]
                    transistion-all duration-200 '>
                        <p>Become an Instructor</p>
                        <FaArrowRight/>
                    </div>
                </div>
            </Link>

            <div className='text-center text-4xl font-semibold mt-7'>
                Empower Your Future with 
                <HightlightText text={" Coding Skills"}/>
            </div>

            <div className='mt-4 w-[90%] text-center text-lg font-bold text-richblack-300'>
                With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors.
            </div>

            <div className='flex gap-7 mt-8'>
                <CTAButton active={true} linkTo="/signup">Learn More</CTAButton>
                <CTAButton active={false} linkTo="/login">Book a Demo</CTAButton>
            </div>

            <div className='mx-3 my-[66px] shadow-[20px_20px_0px_0px_#F5F5F5]'>
                <video muted autoPlay loop className='shadow-[-2px_-5px_15px_2px] shadow-blue-100'>
                    <source src={Banner} type='video/mp4'/>
                </video>
            </div>

            {/* Code Section 1 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row"} 
                    heading={
                        <div className='text-4xl font-semibold'>
                            Unlock Your
                            <HightlightText text={" coding potential "}/>
                            with our online courses
                        </div>
                    } 
                    subHeading={
                        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
                    } 
                    ctabtn1={
                        {
                            active:true,
                            btnText:"Try it Yourself",
                            linkTo:"/signup"
                        }
                    }
                    ctabtn2={
                        {
                            active:false,
                            btnText:"Learn More",
                            linkTo:"/login"
                        }
                    }
                    codeblock={codeData}
                    codeColor={"text-yellow-25"} />
            </div>


            {/* Code Section 2 */}
            <div>
                <CodeBlocks 
                    position={"lg:flex-row-reverse"} 
                    heading={
                        <div className='text-4xl font-semibold'>
                            Start <HightlightText text={" coding in"}/> <br/>
                            <HightlightText text={" seconds"}/>
                        </div>
                    } 
                    subHeading={
                        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
                    } 
                    ctabtn1={
                        {
                            active:true,
                            btnText:"Continue Lesson",
                            linkTo:"/signup"
                        }
                    }
                    ctabtn2={
                        {
                            active:false,
                            btnText:"Learn More",
                            linkTo:"/login"
                        }
                    }
                    codeblock={codeData}
                    codeColor={"text-richblack-50"} />
            </div>
            
            <ExploreMore/>
        </div>
        
        {/* Section 2 */}
        <div className='bg-pure-greys-5 text-richblack-700 pb-20'>
            <div className='homepage_bg h-[340px] flex items-center'>
                <div className='w-11/12 max-w-maxContent flex items-center gap-5 mx-auto'>
                    <div className='flex flex-row gap-7 text-white mx-auto mt-12' >
                        <CTAButton active={true} linkTo={"/signup"}>
                            <div className='flex gap-2 items-center'>
                                Explore Full Catalog
                                <FaArrowRight/>
                            </div>
                        </CTAButton>
                        <CTAButton active={false} linkTo={"/signup"}>Learn More</CTAButton>
                    </div>
                </div>
            </div>

            <div className='w-11/12 max-w-maxContent mx-auto flex flex-col mt-20 gap-5 items-center'>
                <div className='flex flex-row items-start gap-10'>
                    <div className='w-[48%] text-4xl font-semibold tracking-wide '>
                        Get the skills you need for a <HightlightText text={"job that is in demand"}></HightlightText>
                    </div>
                    <div className='w-[45%] flex flex-col justify-between items-start gap-10 '>
                        <div className='text-base font-inter font-semibold'>The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.</div>
                        <CTAButton active={true} linkTo={'/signup'} >Learn More</CTAButton>
                    </div>
                </div>

                <div>

                </div>
            </div>

            <TimelineSection/>

            <LearningLanguageSection/>

        </div>

        {/* Section 3 */}
        <div className='mt-20'>
            <div className='w-11/12 max-w-maxContent mx-auto'>
                <div className='flex gap-20'>
                    <div className='w-[95%] shadow-[2px_5px_15px_2px] shadow-blue-100'>
                        <img src={Instructor} alt="Instructor Image" className='object-contain shadow-[-20px_-20px_0px_0px_#FFF]'/>
                    </div>
                    <div className='flex flex-col justify-center items-start gap-20'>
                        <div className='text-white'>
                            <p className='text-4xl font-semibold leading-10'>Become an <br/><HightlightText text={"instructor"}/></p>
                            <p className='mt-3 text-[19px] leading-6 font-inter font-medium text-richblack-300 '>Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.</p>
                        </div>
                        
                        <CTAButton active={true} linkTo={"/signup"}>
                            <div className='flex items-center gap-3 text-lg'>
                                Start Teaching Today
                                <FaArrowRight />
                            </div>
                        </CTAButton>
                    </div>
                </div>

                <div className='mt-40 flex flex-col gap-7 items-center pb-20'>
                    <div className='text-4xl text-white font-bold'>
                        Reviews from Other Learners
                    </div>
                    {/* Review Slider */}
                    <ReviewSlider/>
                </div>  
            </div>
        </div>

        {/* Footer */}
        <Footer/>



    </div>
  )
}
