import React, { useState } from 'react'
import { HightlightText } from './HightlightText'
import { HomePageExplore } from '../../../data/homepage-explore'
import { CourseCard } from './CourseCard'

const tabsName=[
    "Free",
    "New to Coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]

export const ExploreMore = () => {
    
    const [currentTab,setCurrentTab]=useState(tabsName[0]);
    const [courses,setCourses]=useState(HomePageExplore[0].courses)
    const [currentCard,setCurrentCard]=useState(HomePageExplore[0].courses[0].heading)

    const setMyCards=(value)=>{
        setCurrentTab(value);
        const result= HomePageExplore.filter((course)=>course.tag===value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);

    }
  return (

    <div className='relative w-11/12 flex flex-col items-center mt-14'>
        <div className='text-4xl font-semibold text-center mx-auto'>Unlock the <HightlightText text={" Power of Code"}></HightlightText> </div>
        <p className='text-richblack-300 text-[16px] font-medium mt-3 text-center mx-auto'>Learn to Build Anything You Can Imagine</p>
        <div className='flex px-2 py-1 rounded-full mt-5 gap-3 bg-richblack-800 mb-[330px] mx-auto'>
            {
                tabsName.map((tab,index)=>(
                    <div className={`text-[16px] ${currentTab===tab?"bg-richblack-900 text-richblack-5 font-medium":"text-richblack-200"} 
                    rounded-full transition-all duration-200 cursor-pointer hover:bg-richblack-900 hover:text-richblack-5 px-4 py-2`}
                    key={index}
                    onClick={()=>setMyCards(tab)}>
                        {tab}
                    </div>
                ))
            }
        </div>

        <div className='absolute flex gap-10 top-[240px]'>
            {
                courses.map((element,index)=>(
                    <CourseCard key={index}
                    cardData={element}
                    currentCard={currentCard}
                    setCurrentCard={setCurrentCard}
                    />
                ))
            }
        </div>
    </div>
    
        


  )
}
