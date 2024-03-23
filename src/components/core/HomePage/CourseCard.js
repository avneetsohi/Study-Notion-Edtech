import React from 'react'
import Beginner from '../../../assets/Images/users.png'
import Lessons from '../../../assets/Images/fi-sr-chart-tree.png'

export const CourseCard = ({cardData,currentCard,setCurrentCard}) => {
  return (
    <div className={`w-[30%] flex flex-col items-center gap-16 justify-between  pt-7 ${currentCard===cardData.heading?"bg-white shadow-[13px_13px_0px_0px] shadow-yellow-25":"bg-richblack-800"} cursor-pointer`}
    onClick={()=>setCurrentCard(cardData.heading)}>
        <div className='mx-4 flex flex-col gap-4'>
            <p className={`font-semibold text-xl ${currentCard===cardData.heading?"text-black":"text-white"}`}>{cardData.heading}</p>
            <p className='font-medium text-lg text-richblack-300'>{cardData.description}</p>
        </div>
        <div className={`w-full flex gap-10  px-4 py-3 justify-between text-lg font-medium font-inter border-t border-richblack-600 border-dashed ${currentCard===cardData.heading?"text-blue-400":"text-richblack-300"}`}>
            <div className='flex items-center gap-2 text-xl'>
                <img src={Beginner}/>
                <p className=''>{cardData.level}</p>
            </div>
            <div  className='flex items-center gap-2'>
                <img src={Lessons}/>
                <p>{cardData.lessionNumber} Lessons</p>
            </div>
        </div>
        
    </div>
    
  )
}
