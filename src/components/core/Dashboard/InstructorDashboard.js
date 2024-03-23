import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import apiConnector from '../../../services/apiconnector'
import { courses } from '../../../services/apis'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { InstructorChart } from '../InstructorDashboard/InstructorChart'

export const InstructorDashboard = () => {
    const {user}=useSelector((state)=>state.profile)
    const {token}=useSelector((state)=>state.auth)
    const [instructorCourses,setInstructorCourses]=useState([])
    const [loading,setLoading]=useState(false)

    const [enrolledStudents,setEnrolledStudents]=useState([])
    const [totalIncome,setTotalIncome]=useState(0)

    const getAllEnrolledStudents=()=>{
        let students=[]
        instructorCourses.forEach((course)=>{
            course.studentsEnrolled.forEach((student)=>{
                if(!students.includes(student)){
                    students.push(student)
                }
            })
        })
        console.log("ENROLLED STUDENTS ",enrolledStudents)
        setEnrolledStudents(students)
        
    }

    const calcTotalIncome=()=>{
        let income=0
        instructorCourses.forEach((course)=>{
            income += (course.price*(course.studentsEnrolled.length))
        })
        setTotalIncome(income) 
    }

    const fetchInstructorCourses=async()=>{
        try{
            setLoading(true)
            const response=await apiConnector("GET",courses.GET_INSTRUCTOR_COURSES_API,null,{
                Authorization:`Bearer ${token}`
            })
            if(!response.data.success){
                throw new Error(response.data.message)
            }
            console.log("GET INSTRUCTOR COURSES API RESPONSE...",response)
            setInstructorCourses(response.data.data.courses)
        }catch(error){
            console.log("Error while fetching the instructor courses details",error)
            toast.error("Failed to fetch the Instructor Courses Details")
        }
        setLoading(false)
    }


    useEffect(()=>{
        fetchInstructorCourses()
        
    },[])    

    useEffect(()=>{
        getAllEnrolledStudents()
        calcTotalIncome()
    },[instructorCourses])

    if(loading){
        return(
            <div className='custom-loader mt-52 mx-auto'></div>
        )
    }

    if(!instructorCourses.length){
        return (
            <div className='w-full mt-32 flex flex-col gap-4 items-center justify-center '>
                <h1 className=' text-2xl text-richblack-100 mt-32 font-semibold'>You haven't Created any Courses Yet</h1>
                <Link to="/dashboard/add-course"
                className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'>
                    Create Course
                </Link>
            </div>
            
        )
    }

  return (
    <div className='w-full flex flex-col gap-4'>
        <div className='flex flex-col gap-3 w-full px-2'>
            <h1 className='text-white text-2xl font-semibold '>Hi {user.firstName}👋</h1>
            <p className='text-lg font-medium text-richblack-100'>Let's Start Something New</p>
        </div>
        <div className='flex gap-3 w-full'>
            {/* visualize */}
            <div className='w-[75%] bg-richblack-800 rounded-md px-3 py-5'>
                <h2 className='text-white text-2xl font-semibold px-2'>Visualize</h2>
                <InstructorChart courses={instructorCourses}/>
            </div>
            {/* statistics */}
            <div className='w-[25%] flex flex-col bg-richblack-800 gap-2 rounded-md px-3 py-5 '>
                <h2 className='text-white text-2xl font-semibold px-2'>Statistics</h2>
                <div className='flex flex-col gap-3 mt-5 px-2 h-full'>
                    <div className='flex flex-col'>
                        <p className='text-richblack-300 text-lg font-semibold'>Total Courses</p>
                        <h2 className='text-richblack-5 text-3xl font-semibold'>{instructorCourses.length}</h2>
                    </div>

                    <div className='flex flex-col '>
                        <p className='text-richblack-300 text-lg font-semibold'>Total Students</p>
                        <h2 className='text-richblack-5 text-3xl font-semibold'>{enrolledStudents.length}</h2>
                    </div>
                    
                    <div className='flex flex-col '>
                        <p className='text-richblack-300 text-lg font-semibold'>Total Income</p>
                        <h2 className='text-richblack-5 text-3xl font-semibold'>{totalIncome}</h2>
                    </div>
                </div>
            </div>
        </div>

        <div className='w-full bg-richblack-800 rounded-md px-8 py-7 flex flex-col gap-3'>
            <div className='flex items-center justify-between px-2 pr-4 py-2'>
                <p className='text-richblack-25 text-2xl font-semibold'>Your Courses</p>
                <Link to='/dashboard/my-courses'
                className='text-yellow-50 text-base font-medium cursor-pointer '>
                    View All
                </Link>
            </div>
            <div className='flex flex-wrap justify-between items-center px-2 py-2'>
                {
                    instructorCourses.map((course,index)=>{
                        if(index>2 && index<8 && index%2!==0){
                            return(
                                <div key={course._id} className='flex flex-col gap-[1px]'>
                                    <div className='h-[215px]'>
                                        <img src={course.thumbnail}
                                            className='w-[300px] h-[222px] object-contain aspect-square'
                                        />
                                    </div>
                                    <div className=''>
                                        <p className='text-richblack-5 text-lg font-medium'>{course.courseName}</p>
                                        <div className='flex gap-[3px] text-richblack-100  items-center px-[2px]'>
                                            <p>{course.studentsEnrolled.length} students</p>
                                            <p>|</p>
                                            <p>Rs. {course.price} </p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })
                }
            </div>
        </div>
    </div>
  )
}
