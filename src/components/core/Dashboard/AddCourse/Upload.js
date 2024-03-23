import React, { useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import ReactPlayer from 'react-player/lazy';
import { useSelector } from 'react-redux';
import { Player } from 'video-react';
import 'video-react/dist/video-react.css';

export const Upload = ({register,errors,name,setValue,label,video=false,editData=null,viewData=null}) => {

    const {course,editDetails}=useSelector((state)=>state.course)

    const [selectedFile,setSelectedFile]=useState(null);
    const [previewSource,setPreviewSource]=useState(
        viewData?viewData:editData?editData:""
    );

    

    const onDrop=(acceptedFiles)=>{
        const file=acceptedFiles[0]
        if(file){
            setSelectedFile(file)
            previewFile(file)
        }
    }

    const previewFile = (file) => {
        const reader=new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend=()=>{
            setPreviewSource(reader.result)
        }
    }

  const {getRootProps,getInputProps,isDragActive}=useDropzone({
    accept:!video?{
        "image/*":[".jgeg",".jpg",".png"]
    }:{
        "video/*":[".mp4"]
    },onDrop
  })

  useEffect(()=>{
    register(name,{required:true})
  },[])

  useEffect(()=>{
    setValue(name,selectedFile)
  },[selectedFile])

  return (
    <div className='flex flex-col w-full gap-[6px]'>
        <label htmlFor={label} className='text-[14px] font-normal leading-[22px] text-richblack-5'>
            {label} {!viewData && <sup className='text-pink-200'>*</sup>}
        </label>
        
        <div className={`border min-h-[250px] border-dashed border-richblack-200 ${isDragActive?"bg-richblack-600":"bg-richblack-700"} flex items-center justify-center   rounded-[8px] cursor-pointer  w-full`}>
            {
                previewSource!==""?(
                    <div className='flex flex-col gap-2 justify-center items-center py-3 px-3'>
                        {
                            !video?(
                                <img src={previewSource}
                                    alt="Preview"
                                    className=" rounded-md object-contain w-80 h-64"
                                />
                            ):(
                                <ReactPlayer 
                                    playsInline={true}
                                    controls={true}
                                    url={previewSource}
                                    width={450}
                                    height={300}
                                    className='rounded-md'
                                />
                            )
                        }
                        {
                            !viewData &&
                            <button type='button' className='text-richblack-400 text-[12px] leading-[20px] font-semibold cursor-pointer underline'
                            onClick={()=>{
                                setPreviewSource("")
                                setSelectedFile(null)
                                setValue(name,null)
                            }}>
                                Cancel
                            </button>
                        }
                    </div>
                ):(
                    <div className='flex flex-col justify-center items-center gap-7 py-8 px-3' {...getRootProps()}>
                            <input  {...getInputProps()} id={name} />
                            <div className='flex p-3 justify-center items-center gap-[10px] rounded-[200px] bg-pure-greys-800 cursor-pointer'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="23" height="22" viewBox="0 0 23 22" fill="none">
                                    <g clipPath="url(#clip0_11167_21399)">
                                    <path d="M17.3678 6.76382C17.202 6.71652 17.0506 6.62851 16.9275 6.5078C16.8044 6.38708 16.7134 6.2375 16.6629 6.07265C16.3822 5.12119 15.9113 4.23658 15.2789 3.47234C14.6464 2.7081 13.8655 2.08012 12.9833 1.62641C12.1011 1.1727 11.1361 0.902693 10.1465 0.83272C9.15701 0.762747 8.16357 0.894266 7.22633 1.21932C6.2891 1.54437 5.42755 2.0562 4.69384 2.72383C3.96012 3.39147 3.36949 4.20102 2.95768 5.10351C2.54587 6.006 2.32145 6.98266 2.29799 7.97438C2.27453 8.96611 2.45253 9.95229 2.82121 10.8732C2.9059 11.067 2.92414 11.2834 2.87308 11.4887C2.82201 11.6939 2.70451 11.8765 2.53888 12.0081C1.80896 12.5498 1.23908 13.2788 0.889564 14.1179C0.540044 14.957 0.423883 15.875 0.553375 16.7747C0.755458 17.991 1.38692 19.0946 2.33316 19.8851C3.27939 20.6756 4.47769 21.1006 5.71054 21.0831H10.5845C10.8276 21.0831 11.0607 20.9865 11.2326 20.8146C11.4045 20.6427 11.5011 20.4095 11.5011 20.1664C11.5011 19.9233 11.4045 19.6901 11.2326 19.5182C11.0607 19.3463 10.8276 19.2497 10.5845 19.2497H5.71054C4.9188 19.2689 4.14637 19.0039 3.53324 18.5026C2.92011 18.0013 2.50686 17.2969 2.36838 16.5171C2.28056 15.944 2.35173 15.3577 2.57414 14.8222C2.79655 14.2867 3.16167 13.8225 3.62971 13.4802C4.12134 13.1128 4.47697 12.5925 4.64073 12.0009C4.8045 11.4094 4.76712 10.7803 4.53446 10.2123C4.07443 8.99746 4.05078 7.66052 4.46754 6.43015C4.80047 5.46635 5.39666 4.61504 6.18857 3.97267C6.98048 3.33029 7.93646 2.92253 8.94821 2.79557C9.18289 2.76535 9.41926 2.75005 9.65588 2.74973C10.8412 2.74583 11.9959 3.12596 12.947 3.83323C13.8982 4.54049 14.5947 5.53683 14.9322 6.67307C15.064 7.10607 15.3013 7.49951 15.623 7.81794C15.9446 8.13638 16.3404 8.36982 16.7747 8.49723C17.8376 8.81158 18.7791 9.44312 19.4731 10.3073C20.1671 11.1715 20.5806 12.2271 20.6582 13.3327C20.7358 14.4384 20.4737 15.5414 19.9071 16.494C19.3405 17.4466 18.4964 18.2034 17.4879 18.6631C17.3386 18.7395 17.2138 18.8563 17.1278 19.0003C17.0417 19.1442 16.9978 19.3094 17.0011 19.4771C16.9993 19.6287 17.0357 19.7785 17.1068 19.9124C17.178 20.0464 17.2816 20.1604 17.4083 20.2439C17.5349 20.3274 17.6805 20.3777 17.8317 20.3903C17.9828 20.4028 18.1348 20.3772 18.2735 20.3158C22.063 18.4944 24.1218 13.703 20.9135 9.07382C20.0301 7.92149 18.7788 7.1063 17.3678 6.76382Z" fill="#FFD60A"/>
                                    <path d="M17.6472 15.3149C17.8191 15.143 17.9156 14.9099 17.9156 14.6668C17.9156 14.4238 17.8191 14.1907 17.6472 14.0188L16.1934 12.5649C15.6777 12.0494 14.9784 11.7598 14.2492 11.7598C13.52 11.7598 12.8206 12.0494 12.3049 12.5649L10.8511 14.0188C10.6841 14.1916 10.5917 14.4232 10.5938 14.6635C10.5959 14.9039 10.6923 15.1338 10.8622 15.3038C11.0322 15.4737 11.2621 15.5701 11.5025 15.5722C11.7428 15.5743 11.9744 15.4819 12.1472 15.3149L13.3325 14.1297V21.0835C13.3325 21.3266 13.4291 21.5598 13.601 21.7317C13.7729 21.9036 14.006 22.0002 14.2492 22.0002C14.4923 22.0002 14.7254 21.9036 14.8973 21.7317C15.0692 21.5598 15.1658 21.3266 15.1658 21.0835V14.1297L16.3511 15.3149C16.523 15.4868 16.7561 15.5833 16.9992 15.5833C17.2422 15.5833 17.4753 15.4868 17.6472 15.3149Z" fill="#FFD60A"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_11167_21399">
                                    <rect width="22" height="22" fill="white" transform="translate(0.5)"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            <p className='text-richblack-200 text-[12px] leading-[20px] font-normal w-[60%] text-center'>
                                Drag and drop an {!video?"image":"video"}, or click to {" "}
                                <span className='text-yellow-50 font-semibold cursor-pointer'>Browse </span> 
                                Max 6MB each (12MB for videos)
                            </p>
                            <ul className='flex  list-disc p-[10px] items-start gap-[52px]'>
                                <li className='text-richblack-400 text-[12px] leading-[20px] font-semibold'>Aspect ratio 16:9</li>
                                <li className='text-richblack-400 text-[12px] leading-[20px] font-semibold'>Recommended size 1024x576</li>
                            </ul>
                    </div>
                )
            }
            
        </div>
        {
            errors[name] &&
            <span className='text-yellow-25'>{label} is Required</span>
        }
            
    </div>
  )
}

 