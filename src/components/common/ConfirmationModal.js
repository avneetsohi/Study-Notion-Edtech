import React from 'react'
import { IconButton } from './IconButton'

export const ConfirmationModal = ({setModal,setOverlay,iconBtnText,iconBtnHandler,modalHeading,modalText}) => {
  return (
    <div className={`absolute top-56  translate-x-[50%] lg:left-96 lg:translate-x-[50%] rounded-md bg-richblack-800 border border-richblack-100  z-20 px-6 py-7 flex flex-col gap-5 `}>
      <h1 className='font-semibold text-3xl text-richblack-5'>{modalHeading}</h1>
      <p className='font-light text-lg text-richblack-200'>{modalText}</p>
      <div className='flex gap-3'>
        <IconButton  iconBtnText={iconBtnText} iconBtnHandler={iconBtnHandler}/>
        <button type='button' onClick={()=>{
          setModal(false);
          setOverlay(false);
        }} className='bg-richblack-200 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'>
          Cancel
        </button>
      </div>
    </div>
  )
}



