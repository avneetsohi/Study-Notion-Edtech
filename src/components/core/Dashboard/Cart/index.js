import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RenderCoursesCart } from './RenderCoursesCart'
import { RenderTotalAmount } from './RenderTotalAmount'
import { CTAButton } from '../../HomePage/Button'
import { resetCart } from '../../../../slices/cartSlice'

export default function Cart () {
    const {totalItems,itemCart,total}=useSelector((state)=>state.cart)
    const dispatch=useDispatch()

  return (
    <div className='w-full mx-auto'>
        <h1 className='text-4xl font-medium text-richblack-5'>My Wishlist</h1>
        <div className='w-full mt-10 flex flex-col gap-4'>
            <div className='text-richblack-500 text-xl flex justify-between items-center w-full'>
                <p>{totalItems} Courses in Wishlist</p>
                <button className='font-inter text-center text-lg  leading-[24px] px-[34px] py-[10px] rounded-md font-bold bg-yellow-50 text-black shadow-[1px_1px_0px_0px_rgba(255,255,255,0.51)]"}'
                onClick={()=>{
                    dispatch(resetCart())
                }}>   
                    Clear Cart
                </button>
            </div>

            <div className='h-[2px] w-full bg-richblack-700'></div>

            {
                totalItems>0?(
                    <div className='text-richblack-5 flex flex-row gap-10'>
                        <RenderCoursesCart/>
                        <RenderTotalAmount/>
                    </div>
                ):(
                    <div className='mt-10 text-center flex  flex-col gap-4 mx-auto text-richblack-5 text-xl items-center'>
                        Your wishlist is empty.
                        <CTAButton linkTo={'/catalog/python'} active={true}>Shop Now</CTAButton>
                    </div>
                )
            }
        </div>
    </div>
  )
}

