import React from 'react'
import { HightlightText } from '../HomePage/HightlightText';
import { CTAButton } from '../HomePage/Button';

export const LearningGrid = () => {

    const LearningGridArray = [
        {
          order: -1,
          heading: "World-Class Learning for ",
          highlightText: "Anyone, Anywhere",
          description:
            "Studynotion partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
          BtnText: "Learn More",
          BtnLink: "/",
        },
        {
          order: 1,
          heading: "Curriculum Based on Industry Needs",
          description:
            "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
        },
        {
          order: 2,
          heading: "Our Learning Methods",
          description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
        },
        {
          order: 3,
          heading: "Certification",
          description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
        },
        {
          order: 4,
          heading: `Rating "Auto-grading"`,
          description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
        },
        {
          order: 5,
          heading: "Ready to Work",
          description:
            "Studynotion partners with more than 275+ leading universities and companies to bring",
        },
      ];

  return (
    <div className='grid mx-auto grid-cols-1 lg:grid-cols-4 px-56 lg:px-[210px]   text-white'>
        {
            LearningGridArray.map((card,index)=>(
                <div key={index} className={
                    `${card.order===-1?"bg-richblack-900":`${card.order%2===1?"bg-richblack-600":"bg-richblack-800"}`}
                    ${index===0 && " lg:col-span-2 "}
                    ${card.order===3 && "lg:col-start-2"}`
                }>
                    {
                        card.order===-1?(
                            <div className='w-full text-richblack-5 flex flex-col items-start gap-[18px] px-8 py-4 lg:py-0 h-[340px] lg:h-[280px]'>
                                <h1 className='text-4xl font-semibold '>
                                    {card.heading} 
                                    <HightlightText text={card.highlightText}/>
                                </h1>
                                <p className='text-lg  leading-[24px] text-richblack-400  font-medium'>{card.description}</p>
                                <CTAButton active={true} linkTo={card.BtnLink}>
                                    {card.BtnText}
                                </CTAButton>
                            </div>
                        ):(
                            <div className='w-full flex flex-col px-8 py-6 gap-5 h-[320px] lg:h-[280px]'>
                                <h1 className='text-xl font-normal'>{card.heading}</h1>
                                <p className='text-base  leading-[24px] text-richblack-100  font-light'>{card.description}</p>
                            </div>
                        )
                    }
                </div>
            ))
        }
    </div>
  )
}
