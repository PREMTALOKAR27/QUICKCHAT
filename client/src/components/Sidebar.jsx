import React, { useContext, useEffect, useState } from 'react'
import assets from '../assets/assets'
import { EllipsisVertical,Search, } from 'lucide-react'
import {useNavigate} from 'react-router-dom'
import { AuthContext } from "../context/AuthContex";
import { ChatContext } from '../context/chatContex';


const Sidebar = () => {

  const {getUsers,users,selectedUser,setSelectedUser, unseenMessages, setUnSeenMessages, setShowRightSidebar} = useContext(ChatContext);
  const navigate=useNavigate();

  const {logout, onlineUsers}= useContext(AuthContext);

  const [input, setInput]= useState("");
  const [isOpen, setIsOpen]= useState(false);

  const filteredUsers= input ? users.filter((user)=>user.fullName.toLowerCase().includes(input.toLowerCase())): users;

  let toggleDropdown= ()=>setIsOpen(!isOpen);

  useEffect(()=>{
    getUsers();
  },[onlineUsers])

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? 'max-md:hidden' : ''}`}>
      
      <div className='pb-5'>
        <div className='flex justify-between items-center w-full'>
          <div className='flex '>
            <img className='h-8' src={assets.favicon} alt="logo" />
            <h1 className=' ms-3 text-xl'>Quick Chat</h1>
          </div>  
  
          <div className=' relative group'>
            <EllipsisVertical onClick={toggleDropdown} className=' cursor-pointer ' size={22} absoluteStrokeWidth />
              
              <div className={`absolute top-full right-0 z-20  w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 ${isOpen ? 'block' : 'hidden'}`}>
              <p onClick={()=> navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={()=>logout()} className='cursor-pointer text-sm' >Logout</p>
            </div>
            
          </div>
        </div>

        <div className='bg-[#282142] flex item-center gap-2 border border-gray-600 rounded-full py-3 px-4 mt-5'>
          <Search size={20}/>
          <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='Search User...' className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1 '/>
        </div>  
      </div>

      <div className='flex flex-col'>
        {filteredUsers.map((user,index)=>(
          <div onClick={()=>{setSelectedUser(user); setUnSeenMessages(prev=>({...prev, [user._id]: 0})); setShowRightSidebar(false)}} key={index} className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}> 
            <img className='rounded-full w-[35px] aspect-[1/1]'  src={user?.profilePic || assets.avatar_icon} alt="profile image" />
            <div className='flex flex-col leading-5'>
              <p>{user.fullName}</p>
              { 
                onlineUsers.includes(user._id) 
                ? <span className='text-green-400 text-xs'>Online</span> 
                : <span className='text-neutral-400 text-xs'>Offile</span>
              }
            </div>
            {unseenMessages[user._id] >0 && <p className='absolute flex justify-center item-center top-4 right-2 h-6 w-5 rounded-full bg-violet-500/50' >{unseenMessages[user._id]}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
