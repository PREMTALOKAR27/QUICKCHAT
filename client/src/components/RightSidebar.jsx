import React, { useContext, useEffect, useState } from 'react'
import assets from "../assets/assets"
import { ChatContext } from '../context/chatContex';
import { AuthContext } from '../context/AuthContex';
import { X } from 'lucide-react';

const RightSidebar = () => {

  const {selectedUser, messages, showRightSidebar, setShowRightSidebar}= useContext(ChatContext);
  const {logout,onlineUsers} = useContext(AuthContext);
  const [msgImages, setMsgImages]= useState([]);

  //get all the images from the messages and set them to state
  useEffect(()=>{
    setMsgImages(
      messages.filter(msg => msg.image).map(msg=>msg.image)
    )
  },[messages])

  return selectedUser && (
    <div className={`bg-[#8185B2]/10 text-white w-full h-full relative overflow-y-scroll ${showRightSidebar ? "max-md:block" : "max-md:hidden"}`}>
      <button
        type="button"
        onClick={()=>setShowRightSidebar(false)}
        className='md:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-white/10'
        aria-label='Close details'
      >
        <X size={18} />
      </button>
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" 
        className='w-20 aspect-[1/1] rounded-full'/>

        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          {onlineUsers.includes(selectedUser._id) && <p className='w-2 h-2 rounded-full bg-green-500'></p>}
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>
      <hr className='border-[#ffffff50] my-4'/>

      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {msgImages.map((url,index)=>(
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md'/>
            </div>
          ))}
        </div>
      </div>
      
      <button onClick={()=>logout()} className=' absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-400 to-violet-600
        text-white border-none text-sm font-light py-2 px-20 rounded-full cursor-pointer '>
        Logout
      </button>
    </div>
  )
}

export default RightSidebar
