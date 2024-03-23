import React from 'react'

export const StatsComponent = () => {
  return (
        <section className='w-full bg-richblack-700 py-10'>
            <div className='w-11/12 px-32 max-w-maxContent mx-auto flex items-center justify-between text-richblack-5'>
                <div className='flex flex-col gap-[2px] items-center'>
                    <h2 className='text-3xl leading-[38px] font-bold'>5K</h2>
                    <p className='text-base font-semibold text-richblack-500'>Active Students</p>
                </div>
            
                <div className='flex flex-col gap-[2px] items-center'>
                    <h2 className='text-3xl leading-[38px] font-bold'>10+</h2>
                    <p className='text-base font-semibold text-richblack-500'>Mentors</p>
                </div>

                <div className='flex flex-col gap-[2px] items-center'>
                    <h2 className='text-3xl leading-[38px] font-bold'>200+</h2>
                    <p className='text-base font-semibold text-richblack-500'>Courses</p>
                </div>

                <div className='flex flex-col gap-[2px] items-center'>
                    <h2 className='text-3xl leading-[38px] font-bold'>50+</h2>
                    <p className='text-base font-semibold text-richblack-500'>Awards</p>
                </div>
            </div>
        </section>
  )
}
