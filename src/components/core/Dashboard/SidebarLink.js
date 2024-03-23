import React from 'react'
import { Link, matchPath, useLocation } from 'react-router-dom'
import * as Icons from 'react-icons/vsc'
import { useDispatch } from 'react-redux';
import { resetCourseState, setCourse, setEditDetails, setStep } from '../../../slices/courseSlice';


export const SidebarLink = ({link,iconName}) => {

    const location=useLocation();
    const dispatch=useDispatch()


    const Icon=Icons[iconName]

    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname)
    }
    
  return (
    <Link to={link.path} onClick={link.id===4?(()=>{
      dispatch(setCourse(null))
      dispatch(setStep(1))
      dispatch(setEditDetails(false))
    }):({})}  className={`relative px-8 text-sm font-medium flex gap-2 py-2 items-center cursor-pointer ${matchRoute(link.path)?"text-yellow-200 bg-yellow-800 border-l-[3.2px] border-yellow-200":"text-richblack-400 bg-transparent"}`}>
        <Icon className='text-2xl'/>
        {link.name}
    </Link>
  )
}
