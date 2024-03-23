import React, { useState } from 'react'

import {Chart,registerables} from "chart.js"
import {Pie} from "react-chartjs-2"
// import { Chart } from 'chart.js/dist'

Chart.register(...registerables)

export const InstructorChart = ({courses}) => {

    const [currChart,setCurrChart]=useState("Students")

    const getRandomColors=(numColors)=>{
        const colors=[]
        for(let i=0;i<numColors;i++){
            const currentColor=`rgb(${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)},${Math.floor(Math.random()*256)})`
            colors.push(currentColor)
        }
        return colors;
    }

    // create data for chart display student info
    const chartDataForStudents={
        labels: courses.map((course)=>course.courseName),
        datasets: [
            {
                data:courses.map((course)=>course.studentsEnrolled.length),
                backgroundColor: getRandomColors(courses.length)
            }
        ]

    }

    // create data for chart displaying income info
    const chartDataForIncome={
        labels:courses.map((course)=>course.courseName),
        datasets: [
            {
                data:courses.map((course)=>course.price*course.studentsEnrolled.length),
                backgroundColor: getRandomColors(courses.length)
            }
        ]
    }

    const options={

    }



  return (
    <div className='flex flex-col gap-6 pl-2 pb-4 mt-3'>
        <div className='flex items-center gap-4 '>
            <button className={`px-3 py-2 font-semibold text-lg  ${currChart==='Students'?"text-yellow-50 bg-richblack-600":"text-yellow-400  hover:bg-richblack-700"} `}
            onClick={()=>{
                setCurrChart("Students")
            }}>
                Student
            </button>
            <button className={`px-3 py-2 font-semibold text-lg ${currChart==='Income'?"text-yellow-50 bg-richblack-600":"text-yellow-400 hover:bg-richblack-700"}`}
            onClick={()=>{
                setCurrChart("Income")
            }}>
                Income
            </button>
        </div>

        <div className='min-w-min flex flex-col h-[400px] items-center'>
            <Pie
                data={currChart==="Students"?chartDataForStudents:chartDataForIncome}
                options={options}
            />
            
        </div>
    </div>
  )
}
