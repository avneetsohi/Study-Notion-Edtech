import React, { useState } from 'react'
import { sidebarLinks } from '../../../data/dashboard-links'
import { useDispatch, useSelector } from 'react-redux'
import { Link, matchPath, useLocation, useNavigate } from 'react-router-dom'
import { VscArchive,VscSettingsGear,VscSignOut } from "react-icons/vsc";
import { SidebarLink } from './SidebarLink';
import { ACCOUNT_TYPE } from '../../../utils/constants';



export const Sidebar = ({setModal,setOverlay}) => {
    
    const {user, loading:profileLoading}=useSelector((state)=>state.profile)
    const {loading: authLoading}=useSelector((state)=>state.auth)
 

    const location = useLocation();
    

    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname)
    }

    if(authLoading || profileLoading){
        return (
            <div className='custom-loader mx-auto mt-40'></div>
        )
    }

    return (
    <div className=' min-w-[222px] flex flex-col pt-6 border-r-[1px] border-r-richblack-700 bg-richblack-800 h-[calc(100vh-3.5rem)] overflow-hidden'>
        <div className='flex flex-col gap-2 my-4'>
            {
                sidebarLinks.map((element)=>{

                    if(element.type && element.type !== user.accountType) return null

                    return (
                        <SidebarLink key={element.id} link={element} iconName={element.icon}/>
                    )
                    
                    
                })
            }

            {
                user.accountType===ACCOUNT_TYPE.STUDENT && 
                <Link to='/dashboard/cart'  className={`flex gap-2 px-8 py-2 items-center ${matchRoute('/dashboard/cart')?"text-yellow-200 bg-yellow-800 border-l-[3.2px] border-yellow-200":"text-richblack-400 bg-transparent cursor-pointer"}`}>
                    <VscArchive fontSize={24}/>
                    Cart
                </Link>
            }

        </div>

        <div className='h-[1px] w-10/12 mx-auto bg-richblack-600 mb-4'></div>

        <div className='flex flex-col gap-2 '>
            <Link to='/dashboard/settings'  className={`flex gap-2 px-8 py-2 items-center ${matchRoute('/dashboard/settings')?"text-yellow-200 bg-yellow-800 border-l-[3.2px] border-yellow-200":"text-richblack-400 bg-transparent cursor-pointer"}`}>
                <VscSettingsGear fontSize={24}/>
                Settings
            </Link>
            
            <div className={`flex gap-2 px-8 py-2 items-center text-richblack-400 bg-transparent cursor-pointer`} onClick={()=>{
                                                                                    setModal(true);
                                                                                    setOverlay(true);
                                                                                }}>
                <VscSignOut fontSize={24}/>
                Logout
            </div>
        </div>

        
    </div>
  )
}
