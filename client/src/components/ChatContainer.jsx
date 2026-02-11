import { useContext, useEffect, useRef, useState } from 'react'
import assets from '../assets/assets';
import { Info,ChevronLeft } from 'lucide-react';
import { formatMessageTime } from '../library/utils';
import { ChatContext } from '../context/chatContex';
import { AuthContext } from '../context/AuthContex';
import toast from 'react-hot-toast';

const ChatContainer = () => {

  const {messages, selectedUser, setSelectedUser, sendMessage, deleteMessage, getMessages, showRightSidebar, setShowRightSidebar}=useContext(ChatContext);
  const {authUser, onlineUsers}= useContext(AuthContext);

  const scrollEnd= useRef();
  const longPressTimer= useRef(null);
  const [input,setInput]= useState("");
  const LONG_PRESS_MS= 600;

  const showDeleteToast = (message) => {
    if(!message?._id){
      toast.error("Message id missing");
      return;
    }
    toast.dismiss("delete-confirm");
    toast((t)=>(
      <div className="flex flex-col gap-2 rounded-lg bg-stone-900/95 p-3 text-sm text-white shadow-lg">
        <p>Delete this message?</p>
        <div className="flex items-center justify-end gap-2">
          <button
            className="rounded bg-red-500/80 px-3 py-1 text-white hover:bg-red-500"
            onClick={async ()=>{
              toast.dismiss(t.id);
              await deleteMessage(message._id);
            }}
          >
            Delete
          </button>
          <button
            className="rounded bg-white/10 px-3 py-1 text-white hover:bg-white/20"
            onClick={()=> toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ), {id: "delete-confirm", duration: 8000});
  }

  const startLongPress = (message) => {
    if(message.senderId !== authUser._id) return;
    if(longPressTimer.current){
      clearTimeout(longPressTimer.current);
    }
    longPressTimer.current = setTimeout(()=>{
      showDeleteToast(message);
    }, LONG_PRESS_MS);
  }

  const cancelLongPress = ()=>{
    if(longPressTimer.current){
      clearTimeout(longPressTimer.current);
      longPressTimer.current= null;
    }
  }

  // handle sending a message
  const handleSendMessage= async (e)=>{
    e.preventDefault();
    if(input.trim() === "") return null;
    await sendMessage({text: input.trim()});
    setInput("");
  }

  // handle sending a image
  const handleSendImage = async (e)=>{
  const file= e.target.files[0]
    if(!file || !file.type.startsWith("image/")){
      toast.error("select an image file");
      return;
    }
    const reader= new FileReader();
    reader.onloadend = async ()=>{
      console.log("Image read complete, sending...");
      await sendMessage({image: reader.result});
      console.log("Image sent request completed");
      e.target.value="";
    }
    reader.readAsDataURL(file);
  }

  useEffect(()=>{
    if(selectedUser){
      getMessages(selectedUser._id);
    }
  },[selectedUser]);

  useEffect(()=>{
    if(scrollEnd.current && messages){
      scrollEnd.current.scrollIntoView({behavior: "smooth"})
    }
  },[messages])


  return selectedUser ? (
    <div className={`h-full overflow-scroll backdrop-blur-lg text-white ${showRightSidebar ? 'max-md:hidden' : ''}`} >

      {/*------------ header------------*/}
      <div className='relative flex items-center gap-3 py-3 mx-4 border-b border-stone-500 '>
        
        <img className='rounded-full w-8 ' src={selectedUser.profilePic || assets.avatar_icon} alt="profile image" />
        <p onClick={()=>setShowRightSidebar(true)} className='text-lg flex items-center gap-2 cursor-pointer md:cursor-default'>{selectedUser.fullName}
          {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
        </p>

        <ChevronLeft onClick={()=>setSelectedUser(null)} className=' absolute right-0 cursor-pointer md:hidden max-w-7'/>

        <Info className=' absolute right-0 cursor-pointer max-md:hidden max-w-5'/>
      </div>

      {/*---------chat area------*/}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        {messages.map((msg,index)=>{
          const longPressHandlers = msg.senderId === authUser._id ? {
            onPointerDown: () => startLongPress(msg),
            onPointerUp: cancelLongPress,
            onPointerMove: cancelLongPress,
            onPointerLeave: cancelLongPress,
            onPointerCancel: cancelLongPress,
          } : {};

          return (
          <div key={msg._id || index} className={`flex items-end gap-2 justify-end ${msg.senderId !== authUser._id && 'flex-row-reverse'}`}>
            {msg.image ? (
              <img src={msg.image} alt="" className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' {...longPressHandlers} />
            ):(
              <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${msg.senderId === authUser._id ? 'rounded-br-none' : 'rounded-bl-none'}`} {...longPressHandlers}>{msg.text}</p>
            )
            }

            <div className='text-center text-xs'>
              <img src={msg.senderId === authUser._id ? authUser?.profilePic || assets.avatar_icon : selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-7 rounded-full' />
              <p className='text-gray-500' >{formatMessageTime(msg.createdAt) }</p>
            </div>
          </div>
        )})}
        <div ref={scrollEnd} ></div>
      </div>

      {/*------bottom area-------*/}
      <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
        <div className='flex-1 flex items-center bg-gray-100/12  rounded-full'>
          <input onChange={(e)=>setInput(e.target.value)} value={input}
            onKeyDown={(e)=>e.key === "Enter" ? handleSendMessage(e) : null} type="text" placeholder='send a message' 
          className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-400'/>
          <input onChange={handleSendImage} type="file" id='image' accept='image/png, image/jpeg, image/.jpg' hidden  />
          <label htmlFor="image">
            <img src={assets.gallery_icon} alt="" className='w-5 mr-2 cursor-pointer' />
          </label>
        </div>
        <div>
          <img onClick={handleSendMessage} src={assets.send_button} alt="" className='w-10 mr-2 cursor-pointer' />
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
