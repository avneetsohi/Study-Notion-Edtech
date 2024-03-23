    import React from 'react'
import { CourseCard } from './CourseCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';
import { FreeMode, Pagination, Autoplay,Navigation } from 'swiper/modules';

export const CoursesGrid = ({courseList}) => {

  return (
    <div>
        {
            <Swiper
                slidesPerView={3}
                spaceBetween={100}
                loop={true}
                pagination={true}
                modules={[Autoplay,FreeMode]}
                className="mySwiper"
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={true}
                breakpoints={{
                    1024:{slidesPerView:courseList.length>=3?3:3}
                }}
            >
                {
                    courseList?.map((course)=>(
                        <SwiperSlide key={course._id}>
                            <CourseCard course={course}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            
        }
    </div>
  )
}
