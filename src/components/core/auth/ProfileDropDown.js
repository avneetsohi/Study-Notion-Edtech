import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { setToken } from '../../../slices/authSlice';
import { setUser } from '../../../slices/profileSlice';
import { VscDashboard, VscSignOut } from "react-icons/vsc"
import toast from 'react-hot-toast';
import { useClickOnOutside } from '../../../hooks/useClickOnOutside';
import { resetCart } from '../../../slices/cartSlice';
import { profile } from '../../../services/apis';
import apiConnector from '../../../services/apiconnector';


export const ProfileDropDown = ({user,open,setOpen}) => {
  
  const dispatch=useDispatch();
  const navigate=useNavigate();
  const {token}=useSelector((state)=>state.auth)
  const {total,totalItems,itemCart}=useSelector((state)=>state.cart)
  const ref=useRef(null);
  
  useClickOnOutside(ref,()=>setOpen(false))

  const editUserCartDetials=async()=>{
    try{
      const response=await apiConnector("POST",profile.UPDATE_CART_DETAILS,{
        cartItems:itemCart,
        cartItemCount:totalItems,
        cartTotalAmount:total
      },{
        Authorization:`Bearer ${token}`
      })

      if(!response.data.success){
        throw new Error(response.data.message)
      }
      console.log("UPDATE CART DETAILS API RESPONSE ",response)  

    }catch(error){
      console.log("Error occured while updating cart details",error)
    }
  }

  const logOutHandler = () => {
    setOpen(false);
    dispatch(setToken(null));
    localStorage.setItem("token",null);
    dispatch(setUser(null));
    localStorage.setItem("user",null);

    editUserCartDetials();
    
    toast.success('Logged Out')
    navigate("/login")
  }

  return (
    <div onClick={(e)=>{e.stopPropagation()}} ref={ref} className={`absolute top-11 -left-6 z-20  rounded-md flex flex-col justify-between bg-richblack-800`}>
      <Link to='dashboard/my-profile' onClick={()=>{setOpen(false)}} 
      className={'flex gap-[6px] justify-center items-center px-1  lg:px-3 py-2 rounded-[8px] text-richblack-100 text-base hover:bg-yellow-50 hover:text-black'}>
        <VscDashboard fontSize={16}/> 
        Dashboard
      </Link>
      <button  className='flex  gap-[6px] justify-center items-center lg:px-3 py-2 rounded-[8px] text-richblack-100 text-base hover:bg-yellow-50 hover:text-black' onClick={logOutHandler}>
        <VscSignOut fontSize={16}/>
        Log Out
      </button>
    </div>
  )
}


