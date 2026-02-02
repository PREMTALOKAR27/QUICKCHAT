import React, { useEffect, useRef } from 'react'
import assets, { messagesDummyData } from '../assets/assets';
import { Info,ChevronLeft } from 'lucide-react';
import { formatMessageTime } from '../library/utils';

const ChatContainer = ({selectedUser,setSelecteduser}) => {

  const scrollEnd= useRef();

  useEffect(()=>{
    if(scrollEnd.current){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
  },[])


  return selectedUser ? (
    <div className=' h-full overflow-scroll backdrop-blur-lg text-white' >

      {/*------------ header------------*/}
      <div className='relative flex items-center gap-3 py-3 mx-4 border-b border-stone-500 '>
        
        <img className='rounded-full w-8 ' src={assets.profile_martin} alt="profile image" />
        <p className='text-lg flex items-center gap-2'>Martin Johnson</p>
        <span className='w-2 h-2 rounded-full bg-green-500'></span>

        <ChevronLeft onClick={()=>setSelecteduser(null)} className=' absolute right-0 cursor-pointer md:hidden max-w-7'/>

        <Info className=' absolute right-0 cursor-pointer max-md:hidden max-w-5'/>
      </div>

      {/*---------chat area------*/}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messagesDummyData.map((msg,index)=>(
          <div key={index} className={`flex items-end gap-2 justify-end ${msg.senderId !== '680f50e4f10f3cd28382ecf9' && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' />
            ):(
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === '680f50e4f10f3cd28382ecf9' ? 'rounded-br-none' : 'rounded-bl-none'}`}>{msg.text}</p>
            )
            }

            <div className='text-center text-xs'>
              <img src={msg.senderId === '680f50e4f10f3cd28382ecf9' ? assets.avatar_icon :assets.profile_martin} alt="" className='w-7 rounded-full' />
              <p className='text-gray-500' >{formatMessageTime(msg.createdAt) }</p>
            </div>
          </div>
        ))}
        <div ref={scrollEnd} ></div>
      </div>

      {/*------bottom arear-------*/}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12  rounded-full'>
          <input type="text" placeholder='send a message' 
          className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
          <input type="file" id='image' accept='image/png, image/jpeg, image/.jpg' hidden  />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <div>
          <img src={assets.send_button} alt="" className='w-10 mr-2 cursor-pointer' />
        </div>
        
      </div>

    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.favicon}  className='max-w-16' alt="" />
      <p>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatContainer
