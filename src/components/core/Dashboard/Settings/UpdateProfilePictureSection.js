import React, { useEffect, useRef, useState } from 'react'
import { HiOutlineUpload } from 'react-icons/hi'
import { useDispatch, useSelector } from 'react-redux'
import apiConnector from '../../../../services/apiconnector'
import { profile } from '../../../../services/apis'
import toast from 'react-hot-toast'
import { setUser } from '../../../../slices/profileSlice'


export const UpdateProfilePictureSection = () => {
    const {user}=useSelector((state)=>state.profile)
    const {token}=useSelector((state)=>state.auth)
    const [loading,setLoading]=useState(false);
    const dispatch=useDispatch();

    const [imageFile,setImageFile]=useState(null);
    const [previewSource,setPreviewSource]=useState(null);

    const fileInputRef=useRef(null);

    function handleClick(){
        fileInputRef.current.click()
    }

    function changeHandler(event){
        const file=event.target.files[0];
        console.log(file)
        if(file){
            setImageFile(file)
            previewFile(file)
        }
    }

    function previewFile(file){
        const reader=new FileReader
        reader.readAsDataURL(file)
        reader.onloadend = () =>{
            setPreviewSource(reader.result)
        }
    }

    const handleFileUpload = async() => {
        setLoading(true);
        try{
            console.log("Uploading")
            const formData=new FormData();
            formData.append("displayPicture",imageFile)
            console.log("form data",formData)
            const response=await apiConnector("PUT",profile.UPDATE_PROFILE_PICTURE_API,formData,
            {
                "Content-Type": "multipart/form-data",
                Authorization:`Bearer ${token}`
            })

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            dispatch(setUser(response.data.updatedUserDetails))
            localStorage.setItem("user",JSON.stringify(response.data.updatedUserDetails));
            console.log("UPDATE PROFILE PICTURE API RESPONSE....",response)
            toast.success("Updated the Profile Picture Succcessfully")

        }catch(error){
            console.log("ERROR -- UPDATE PROFILE PICTURE API....",error)
            toast.error("Failed to Update the Profile Picture")
        }
        setLoading(false)
    }

    useEffect(()=>{
        if(imageFile){
            previewFile(imageFile)
        }
    },[imageFile])
  


  return (
    <div className='py-6 px-10 flex justify-between items-center bg-richblack-800 rounded-md'>
        <div className='flex gap-5 items-center '>
            <img src={previewSource || user?.image} height={75} width={75} className=' rounded-full object-cover' loading='lazy'/>
            <div className='flex flex-col gap-2'>
                <p className='text-richblack-5 font-medium text-base leading-1'>Change Profile Picture</p>
                <div className='flex gap-3'>
                    
                    <input  type='file' id='profilePic' name='profilePic'  className='hidden'
                    accept="image/png, image/gif, image/jpeg" ref={fileInputRef}
                    onChange={changeHandler}
                    />
                    <button className='outline-none px-8 py-2   rounded-[8px] bg-richblack-700 text-richblack-5 text-lg font-semibold flex items-center'
                    onClick={handleClick}>
                        Select
                    </button>
                    {
                        !loading?(
                            <button className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'
                            onClick={handleFileUpload}>
                                Update
                                <HiOutlineUpload fontSize={22} />
                            </button>   
                        ):(
                            <button className='flex gap-2 items-center bg-yellow-100 text-richblack-900 text-lg font-semibold px-6 py-2 rounded-md'>
                                Uploading...
                            </button>   
                        )
                    }
                    
                </div>
            </div>
        </div>
    </div>
  )
}


