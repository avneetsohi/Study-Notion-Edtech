import React from 'react'
import { HightlightText } from './HightlightText'
import know_your_progress from '../../../assets/Images/Know_your_progress.png'
import compare_with_others from '../../../assets/Images/Compare_with_others.png'
import plan_your_lesson from '../../../assets/Images/Plan_your_lessons.png'
import { CTAButton } from './Button'

export const LearningLanguageSection = () => {
  return (
    <div className='w-11/12 max-w-maxContent mx-auto mt-40'>
      <div className='flex flex-col gap-5 items-center'>
        <div className='text-4xl font-semibold text-center'>Your swiss knife for <HightlightText text={" learning any language"}/></div>
        <div className='text-center text-richblack-600 mx-auto text-base mt-3 w-[55%]'>Using spin making learning multiple languages easy with 20+ languages realistic voice-over, progress tracking, custom schedule and more.</div>
        <div className='flex items-center justify-center mt-5'>
          <img src={know_your_progress} alt="Know your progress Image" className='object-contain -mr-60'/>
          <img src={compare_with_others} alt="Compare with others Image" className='object-contain ml-28'/>
          <img src={plan_your_lesson} alt="Plan your lesson Image" className='object-contain -ml-40'/>
        </div>
        <div className='w-fit'>
          <CTAButton active={true} linkTo={"/signup"}>
            
            Learn More
          
          </CTAButton>
        </div>
      </div>

    </div> 
  )
}
