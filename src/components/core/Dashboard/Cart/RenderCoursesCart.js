import React, { useEffect } from 'react'
import { CartCourseCard } from './CartCourseCard'
import { useSelector } from 'react-redux'


export const RenderCoursesCart = () => {
    const {itemCart}=useSelector((state)=>state.cart)
    return (
    <div className='w-[75%] flex flex-col gap-5'>
        {
            itemCart.map((course,index)=>(
                <CartCourseCard key={course._id}
                    course={course}
                    index={index}
                />
            ))
        }
    </div>
  )
}
