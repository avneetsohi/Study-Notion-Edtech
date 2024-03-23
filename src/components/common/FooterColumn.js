import React from 'react'
import { Link } from 'react-router-dom'

export const FooterColumn = ({data}) => {
  return (
    <div className='flex flex-col gap-3 w-[33%]'>
        <div className='font-inter text-base font-semibold text-richblack-100'>{data.title}</div>
        <div className='flex flex-col gap-2 text-richblack-400'>
            {
                data.links.map((element,index)=>(
                    
                    <Link key={index} to={`${element.link}`} className='font-inter text-sm leading-[22px] font-normal hover:text-richblack-25 transition-all duration-200'>{element.title}</Link>
                    
                ))
            }
        </div>
    </div>
  )
}
