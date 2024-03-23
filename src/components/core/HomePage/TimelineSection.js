import React from 'react'
import Logo1 from "../../../assets/TimeLineLogo/Logo1.svg"
import Logo2 from "../../../assets/TimeLineLogo/Logo2.svg"
import Logo3 from "../../../assets/TimeLineLogo/Logo3.svg"
import Logo4 from "../../../assets/TimeLineLogo/Logo4.svg"
import TimeLineImage from "../../../assets/Images/TimelineImage.png"

export const TimelineSection = () => {
    const timeline=[
        {
            Logo:Logo1,
            heading:"Leadership",
            Description:"Fully committed to the success company"
        },
        {
            Logo:Logo2,
            heading:"Responsibility",
            Description:"Students will always be our top priority"
        },
        {
            Logo:Logo3,
            heading:"Flexibility",
            Description:"The ability to swtich is an important skill"
        },
        {
            Logo:Logo4,
            heading:"Solve the problem",
            Description:"Code your way to a solution"
        }
    ]
    
  return (
    <div className='w-11/12 max-w-maxContent mx-auto mt-20 '>
        <div className='flex flex-row gap-10 items-center'>
            {/* left box */}
            <div className='relative w-[45%] flex flex-col gap-11'>
                {
                    timeline.map((element,index)=>(

                        <div key={index} className='flex flex-col relative'>
                            <div className='flex items-start gap-10' key={index}>
                                <div className='w-[50px] h-[50px] bg-pure-greys-25 rounded-full flex items-center justify-center'>
                                    <img src={element.Logo}/>
                                </div>
                                <div className='flex flex-col'>
                                    <h2 className='font-semibold text-[18px]'>{element.heading}</h2>
                                    <p className='text-base'>{element.Description}</p>
                                </div>

                            </div>

                          

                            <div className= {`${index===timeline.length-1?"h-0":"h-12"} border-dashed absolute border-l border-[#AFB2BF] -bottom-11 left-6`}></div>                           
                            
                        </div>
                
                        

                        
                    ))
                }
            </div>
            {/* right box */}
            <div className='relative shadow-[20px_20px_0px_0px_#FFF]'>
                <img src={TimeLineImage} alt="timelineImage" className='shadow-[-2px_-5px_15px_2px] shadow-blue-100 object-cover h-fit'/>
                <div className=' absolute -bottom-7 left-[65px] py-10 bg-caribbeangreen-700 flex text-white uppercase'>
                    <div className='flex border-r border-caribbeangreen-300 items-center gap-3 px-7'>
                        <p className='text-3xl font-bold'>10</p>
                        <p className='text-caribbeangreen-300 text-md'>YEARS EXPERIENCE</p>
                    </div>
                    <div className='flex items-center gap-3 px-7'>
                        <p className='text-3xl font-bold'>250</p>
                        <p className='text-caribbeangreen-300 text-md'>TYPES OF COURSES</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

// gap-[2px] leading-[20px] ==> timeline section 

// border-l border-dashed border-black md:ml-4 lg:ml-6 -->timeline section