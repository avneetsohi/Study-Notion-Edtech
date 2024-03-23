import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/core/Dashboard/Sidebar'
import { ConfirmationModal } from '../components/common/ConfirmationModal'
import { Overlay } from '../components/common/Overlay'
import { setToken } from '../slices/authSlice'
import { setUser } from '../slices/profileSlice'
import toast from 'react-hot-toast'
import { resetCart } from '../slices/cartSlice'
import apiConnector from '../services/apiconnector'
import { profile } from '../services/apis'


export const Dashboard = () => {
  const {loading: authLoading}=useSelector((state)=>state.auth)
  const {loading: profileLoading} = useSelector((state)=>state.profile)
  const [modal,setModal]=useState(false);
  const [overlay,setOverlay]=useState(false);
  const dispatch=useDispatch()
  const navigate=useNavigate()
  const {itemCart,total,totalItems}=useSelector((state)=>state.cart)
  const {token}=useSelector((state)=>state.auth)

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
    setModal(false);
    setOverlay(false);
    dispatch(setToken(null));
    localStorage.setItem("token",null);
    dispatch(setUser(null));
    localStorage.setItem("user",null);
    editUserCartDetials();

   
    
    toast.success('Logged Out')
    navigate("/login")
  }

  // HW 1: to check the spinner rendering
  if(authLoading || profileLoading){
    return (
      <div className='custom-loader mx-auto mt-40'></div>
    )
  }

  return (
    <div>
      <div className={` h-[calc(100vh-3.5rem)]  flex w-full overflow-y-hidden`}>
        <Sidebar setModal={setModal} setOverlay={setOverlay}/>
        <div className='min-h-[calc(100vh-3.5rem)] w-full overflow-y-auto '>
          <div className='mx-auto w-11/12 max-w-[1000px] py-10'>
            <Outlet/>
          </div>
        </div>
      </div>

      {
        modal && 
        <ConfirmationModal setModal={setModal} setOverlay={setOverlay} iconBtnText={"Logout"} 
        iconBtnHandler={logOutHandler} modalHeading={"Are you Sure?"} modalText={"You will be logged out of your account."}/>
      }

      
      {
        overlay && <Overlay overlay={overlay}/>  
      }
      
    </div>

  
  )
}
