import React from 'react'
import { HightlightText } from '../components/core/HomePage/HightlightText'
import aboutUs1 from '../assets/Images/aboutus1.webp'
import aboutUs2 from '../assets/Images/aboutus2.webp'
import aboutUs3 from '../assets/Images/aboutus3.webp'
import FoundingStory from '../assets/Images/FoundingStory.png'
import { StatsComponent } from '../components/core/AboutPage/StatsComponent'
import { LearningGrid } from '../components/core/AboutPage/LearningGrid'
import { ContactFormSection } from '../components/core/AboutPage/ContactFormSection'
import { Footer } from '../components/common/Footer'
import { ReviewSlider } from '../components/common/ReviewSlider'


export const About = () => {
  return (
    <div className='w-screen'>
        {/* section 1 */}
        <section className='w-full pt-24 pb-[250px] bg-richblack-700'>
            <div className='relative w-11/12 max-w-maxContent  flex flex-col gap-5 mx-auto items-center'>
                <h1 className='w-[90%] lg:w-[60%] text-white text-4xl text-center font-semibold'>
                    Driving Innovation in Online Education for a
                    <HightlightText text={' Brighter Future'}/>
                </h1>
                <p className='lg:w-[75%] text-lg text-richblack-200 text-center mx-auto font-bold'>
                    Studynotion is at the forefront of driving innovation in online education. 
                    We're passionate about creating a brighter future by offering cutting-edge courses,
                    leveraging emerging technologies, and nurturing a vibrant learning community.
                </p>
                <div className=' absolute top-[250px] w-[60%] lg:w-full flex justify-center md:gap-3 lg:gap-12 items-center'>
                    <img src={aboutUs1} alt='' className='h-52 lg:h-[340px]'/>
                    <img src={aboutUs2} alt='' className='h-52 lg:h-[340px]'/>
                    <img src={aboutUs3} alt='' className='h-52 lg:h-[340px]'/>
                </div>
            </div>
        </section>

        {/* section 2 */}
        <section className='w-full pb-16 border-b border-richblack-600'>
            <div className='w-11/12 mx-auto max-w-maxContent'>
                <h1 className='mt-28 text-[20px] leading-7 lg:text-[37px] lg:mt-60 lg:leading-[52px] text-white mx-auto w-full  font-bold lg:font-semibold text-center lg:tracking-[-0.72px]'>
                    We are passionate about revolutionizing the way we learn. 
                    Our innovative platform <HightlightText text={'combines technology'}/>, <HightlightText text={'expertise'} type={'highlighted-text2'}/>, and 
                    community to create an <HightlightText text={'unparalleled educational experience.'} type={'highlighted-text2'}/>
                </h1>
            </div>
        </section>

        {/* section 3 */}
        <section className='w-full py-24'>
            <div className='w-11/12 max-w-maxContent mx-auto flex flex-col gap-[180px]'>
                {/* Upper part */}
                <div className='flex justify-between items-center text-white gap-64'>
                    <div className='flex flex-col justify-between gap-4 w-full'>
                        <h1 className='font-inter text-4xl leading-[44px] font-semibold tracking-[-0.72px]'>
                            <HightlightText text={'Our Founding Story'} type={'highlighted-text3'}/>
                        </h1>
                        <p className='mt-2 text-base font-medium text-richblack-300'>
                            Our e-learning platform was born out of a shared vision and passion for transforming 
                            education. It all began with a group of educators, technologists, and lifelong learners who 
                            recognized the need for accessible, flexible, and high-quality learning opportunities in a 
                            rapidly evolving digital world.
                        </p>
                        <p className='text-base font-medium text-richblack-300'>
                            As experienced educators ourselves, we witnessed firsthand the limitations and challenges 
                            of traditional education systems. We believed that education should not be confined to the 
                            walls of a classroom or restricted by geographical boundaries. We envisioned a platform 
                            that could bridge these gaps and empower individuals from all walks of life to unlock their 
                            full potential.
                        </p>
                    </div>
                    <div className='w-full'>
                        <img src={FoundingStory} className=''/>
                    </div>
                </div>

                {/* Lower Part */}
                <div className='w-full flex justify-between items-center text-white gap-48'>

                    <div className='flex flex-col justify-between w-full gap-6'>
                        <h1 className='text-4xl leading-[44px] font-semibold tracking-[-0.72px]'>
                            <HightlightText text={'Our Vision'} type={'highlighted-text4'}/>
                        </h1>
                        <p className='text-base font-medium text-richblack-300'>
                            With this vision in mind, we set out on a journey to create an e-learning platform that would 
                            revolutionize the way people learn. Our team of dedicated experts worked tirelessly to 
                            develop a robust and intuitive platform that combines cutting-edge technology with 
                            engaging content, fostering a dynamic and interactive learning experience.
                        </p>
                    </div>
                    <div className='w-full flex flex-col gap-6'>
                        <h1 className='text-4xl leading-[44px] font-semibold tracking-[-0.72px]'>
                            <HightlightText text={'Our Mission'} />
                        </h1>
                        <p className='text-base font-medium  text-richblack-300'>
                            Our mission goes beyond just delivering courses online. We wanted to create a vibrant 
                            community of learners, where individuals can connect, collaborate, and learn from one 
                            another. We believe that knowledge thrives in an environment of sharing and dialogue, and 
                            we foster this spirit of collaboration through forums, live sessions, and networking opportunities.
                        </p>
                    </div>
                </div>

            </div>
        </section>

        {/* section 4 */}
        <StatsComponent/>


        {/* section 5 */}
        <section className='w-full bg-richblack-900 py-20'>
            <LearningGrid/>
        </section>

        {/* section 6 */}
        <section className='mt-4 pb-10 mb-16'>
            <ContactFormSection/>  
        </section>

        {/* section 7 */}
        <section className='mb-24'>
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
