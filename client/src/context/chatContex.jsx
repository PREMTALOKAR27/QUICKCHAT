import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContex";
import toast from "react-hot-toast";


export const ChatContext=createContext();

export const ChatProvider = ({children})=>{

    const [messages, setMessages]= useState([]);
    const [users,setUser]= useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unseenMessages, setUnseenMessages]= useState({});
    const [showRightSidebar, setShowRightSidebar]= useState(false);

    const {socket,axios}= useContext(AuthContext);

    //function to get all users for sidebar
    const getUsers = async()=>{
        try {
            const {data} = await axios.get("/api/messages/users");
            if(data.success){
                setUser(data.users);
                setUnseenMessages(data.unseenMessages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to get messages for selected user
    const getMessages= async (userId)=>{
        try {
            const {data}= await axios.get(`/api/messages/${userId}`);
            if(data.success){
                setMessages(data.messages);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to send message to selected user
    const sendMessage = async (messageData)=>{
        try {
            const {data}= await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
            if(data.success){
                setMessages((prevMessages)=>[...prevMessages,data.newMessage]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    //function to delete message
    const deleteMessage = async (messageId)=>{
        if(!messageId){
            toast.error("Message id missing");
            return;
        }
        try {
            const {data}= await axios.delete(`/api/messages/${messageId}`);
            if(data.success){
                setMessages((prevMessages)=> prevMessages.filter((message)=> message._id !== messageId));
            }else{
                toast.error(data.message || data.messages || "Failed to delete message");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.response?.data?.messages || error.message);
        }
    }

    //function to subscribe to messages for selected user
    const subscribeToMessages= async ()=>{
        if(!socket){
            return;
        }
        socket.on('newMessage', (newMessage)=>{
            if(selectedUser && newMessage.senderId === selectedUser._id){
                newMessage.seen=true;
                setMessages((prevMessages)=> [...prevMessages, newMessage]);
                axios.put(`/api/messages/mark/${newMessage._id}`);
            }else{
                setUnseenMessages((prevUnseenMessages)=>({
                    ...prevUnseenMessages, [newMessage.senderId] : 
                    prevUnseenMessages[newMessage.senderId] ? prevUnseenMessages[newMessage.senderId]+1 :1
                }))
            }
        })

        socket.on('messageDeleted', ({messageId, senderId})=>{
            setMessages((prevMessages)=> prevMessages.filter((message)=> message._id !== messageId));
            if(senderId){
                setUnseenMessages((prevUnseenMessages)=>{
                    const currentCount = prevUnseenMessages[senderId];
                    if(!currentCount) return prevUnseenMessages;
                    const nextCount = currentCount - 1;
                    if(nextCount <= 0){
                        const updated = {...prevUnseenMessages};
                        delete updated[senderId];
                        return updated;
                    }
                    return {...prevUnseenMessages, [senderId]: nextCount};
                })
            }
        })
    }

    //function to unsubscribe from messages
    const unsubscribeFromMessages =()=>{
        if(socket){
            socket.off("newMessage");
            socket.off("messageDeleted");
        }
    }

    useEffect(()=>{
        subscribeToMessages();
        return ()=> unsubscribeFromMessages();
    },[socket,selectedUser]);

    useEffect(()=>{
        if(!selectedUser){
            setShowRightSidebar(false);
        }
    },[selectedUser]);

    const value={
        messages,
        users,
        selectedUser,
        getUsers,
        getMessages,
        sendMessage,
        deleteMessage,
        setSelectedUser,
        unseenMessages,
        setUnseenMessages,
        showRightSidebar,
        setShowRightSidebar,

    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}
