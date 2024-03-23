import React from 'react'

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';


export const IconButton = ({setModal,setOverlay,iconBtnText,iconBtnHandler}) => {

  const dispatch=useDispatch();
  const navigate=useNavigate();

  
  return (
    <button className='bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md' onClick={iconBtnHandler}>
      {iconBtnText}
    </button>
  )
}
