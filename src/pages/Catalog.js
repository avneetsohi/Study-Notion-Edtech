import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Footer } from '../components/common/Footer';
import { useSelector } from 'react-redux';
import apiConnector from '../services/apiconnector';
import categories from '../services/apis';
import toast from 'react-hot-toast';
import { CoursesGrid } from '../components/core/CategoryDetailsPage/CoursesGrid';
import { CourseCard } from '../components/core/CategoryDetailsPage/CourseCard';

export const Catalog = () => {
    const {catalogName}=useParams();
    const {category}=useSelector((state)=>state.category)
    const [loading,setLoading]=useState(false);
    const [selectedCategoryCourses,setSelectedCategoryCourses]=useState([]);
    const [differentCategoryCourses,setDifferentCategoryCourses]=useState([]);
    const [topCourses,setTopCourses]=useState([]);
    const {token}=useSelector((state)=>state.auth)
    // const [categoryId,setCategoryId]=useState(null);
    
    const [unselectedCategory,setUnselectedCategory]=useState(null);
    const [btnId,setBtnId]=useState(1);

    // const fetchAllCategories=async()=>{
    //     try{
    //         const result=await apiConnector("GET",categories.SHOWCATEGORIES_API);
    //         if(!result.data.success){
    //             throw new Error(result.data.message);
    //         }
    //         console.log("FETCH ALL CATEGORIES API RESPONSE",result);
    //         const allCategories=result.data.data;
    //         const cateogory_Id=allCategories.filter((catg)=>catg.name.replace(" ","-").toLowerCase()===catalogName)[0]._id;
    //         setCategoryId(cateogory_Id);
    //     }catch(error){
    //         console.log("FETCH ALL CATEGORIES API ERROR",error);
    //     }
    // }
    
    // // console.log("Selected Category Courses",selectedCategoryCourses)
    // // console.log("Different Category Courses",differentCategoryCourses)
    // // console.log("Top  Courses",topCourses)

    // useEffect(()=>{
    //     setBtnId(1);
    //     fetchAllCategories();
    // },[catalogName])
    

    const fetchPageCategoryDetails = async()=>{
        
        try{
            setLoading(true);
            const result=await apiConnector("POST",categories.GET_CATEGORY_DETAILS_PAGE_API,{categoryID:category._id,btnId})
            if(!result.data.success){
                throw new Error(result.data.message)
            }
            console.log("GET CATEGORY DETAILS PAGE API RESPONSE",result);
            setSelectedCategoryCourses(result.data.data.selectedCategoryCourses);
            setUnselectedCategory(result.data.data.unselectedCategory)
            setDifferentCategoryCourses(result.data.data.unselectedCategoryCourses)
            setTopCourses(result.data.data.mostSellingCourses)
           
            
        }catch(error){
            console.log("Error occured while fetching category details page",error)
            toast.error("Failed to fetch selected category details")
        }
        setLoading(false);
    }

    useEffect(()=>{
        setBtnId(1)
    },[catalogName])

    useEffect(()=>{
        if(category){
            fetchPageCategoryDetails();
        }
    },[category,btnId])




  return (
    <div>
        {
            loading?(<div className='custom-loader mx-auto mt-44'></div>):(
                <div>
                    {
                        !category?(
                            <p className='text-[26px] mt-44 text-center text-richblack-200 font-medium'>
                                Please select a category from the catalog dropdown menu.
                            </p>
                        ):(
                            <div>
                                {/* section 1 */}
                                <div className='bg-richblack-800 py-14'>
                                    <div className='w-11/12 max-w-maxContent mx-auto flex flex-col gap-5 justify-between'>
                                        <p className='text-richblack-100 capitalize'> 
                                            Home / Catalog / <span className='text-yellow-50'>{catalogName.replace("-"," ")}</span>
                                        </p>
                                        <h1 className='capitalize text-[30px] text-richblack-5'>{catalogName.replace("-"," ")}</h1>
                                        <p className='text-richblack-100 text-[18px]'>{category?.description}</p>
                                    </div>
                                </div>


                                {/* section 2 */}
                                <div className='py-10'>
                                    <div className='w-11/12 max-w-maxContent mx-auto'>
                                        <h2 className='text-4xl text-richblack-5 font-bold '>Courses to get You Started</h2>
                                        <div className='flex  mt-5'>
                                            <button className={` text-[17px] px-4 py-3 ${btnId===1?"text-yellow-50 border-b-[2px] border-yellow-50":"text-richblack-50"} `}
                                            onClick={()=>{
                                                setBtnId(1)  
                                            }}>   
                                                Most Popular
                                            </button>
                                            <button className={`text-[17px] px-4 py-3 ${btnId===2?"text-yellow-50 border-b-[2px] border-yellow-50":"text-richblack-50"}`}
                                            onClick={()=>{
                                                setBtnId(2)
                                            }}>   
                                                New
                                            </button>
                                        </div>
                                        <div className='w-full h-[0.5px] bg-richblack-100 '></div>

                                        <div className='mt-4'>
                                            {
                                                selectedCategoryCourses?.length===0?(
                                                    <p className=' text-[18px] text-richblack-200 font-medium'>No Course Available Right Now.</p>
                                                ):(
                                                    <CoursesGrid courseList={selectedCategoryCourses}/>
                                                )
                                            }
                                        </div>

                                        <h2 className='text-4xl text-richblack-5 font-bold mt-20 capitalize'>Top Courses in {unselectedCategory?.name}</h2>
                                        <div className='mt-3'>
                                            {
                                                differentCategoryCourses?.length===0?(
                                                    <p className='text-[18px] text-richblack-200 font-medium'>No Course Available Right Now. </p>
                                                ):(
                                                    <CoursesGrid courseList={differentCategoryCourses}/>
                                                )
                                            }
                                        </div>


                                        <h2 className='text-4xl text-richblack-5 font-bold mt-20'>Frequently Bought</h2>
                                        <div className='mt-3 flex flex-wrap gap-x-5 items-center'>
                                            {
                                                topCourses?.length===0?(
                                                    <p className=' text-[18px] text-richblack-200 font-medium'>No Course Available Right Now.</p>
                                                ):(
                                                    topCourses.map((course)=>(
                                                        <CourseCard key={course._id} course={course}/>
                                                    ))
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>

                                {/* footer section */}
                                <Footer/>
                            </div>
                        )
                    }
                </div>
            )
        }
        
    </div>
  )
}
