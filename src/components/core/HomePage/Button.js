import React from 'react'
import { Link } from 'react-router-dom'

export const CTAButton = ({children,active,linkTo}) => {
  return (
    <Link to={linkTo}>
        <div className={` flex items-center gap-2 font-inter text-center text-lg leading-[24px] px-[34px] py-[10px] rounded-md font-bold ${active?"bg-yellow-50 text-black shadow-[1px_1px_0px_0px_rgba(255,255,255,0.51)]":"bg-richblack-800 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)]"}
        hover:scale-95 transition-all duration-200`}>
            {children}
        </div>
    </Link>

  )
}


// 