import React from 'react'
import { BiError } from "react-icons/bi";

export const Error = () => {
  return (
    <div className='w-11/12 max-w-maxContent mx-auto my-auto flex items-center justify-center'>
        <div className='flex gap-4 text-4xl text-richblack-5 items-center '>
            <BiError fontSize="60px" color='red'/>
            Error - 404 Not Found
        </div>
    </div>
  )
}

