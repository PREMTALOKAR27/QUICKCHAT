import Message from "../models/message.js";
import User from "../models/user.js";
import cloudinary from "../lib/cloudinary.js";
import {io,userSocketMap} from "../index.js";


//get all users except the logged in user
export const getUsersForSidebar= async (req,res)=>{
    try{
        const userId = req.user._id;
        const filteredUsers= await User.find({_id: {$ne:userId}}).select("-password");

        //count number of messages not seen
        const unseenMessages={};
        const promises= filteredUsers.map(async (user)=>{
            const messages = await Message.find({senderId: user._id, receiverId: userId, seen: false})
            if(messages.length >0){
                unseenMessages[user._id]=messages.length;
            }
        });
        await Promise.all(promises);
        res.json({success: true, users: filteredUsers, unseenMessages});
    }catch(error){
        console.log(error.message);
        res.json({success: false, messages: error.message});
    }
};

// get all messages for selected user
export const getMessages = async (req,res)=>{
    try {
      const { id: selectedUserId } = req.params;
      const myId = req.user._id;

      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: selectedUserId },
          { senderId: selectedUserId, receiverId: myId },
        ],
      });
      await Message.updateMany(
        { senderId: selectedUserId, receiverId: myId },
        { seen: true },
      );

      res.json({ success: true, messages });
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, messages: error.message });
    }
};

//api to mark message as seen using message id
export const markMessageAsSeen= async (req,res)=>{
    try {
        const {id}= req.params;
        await Message.findByIdAndUpdate(id, {seen: true});
        res.json({success: true});
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, messages: error.message });
    }
};

//send message to seletected user
export const sendMessage= async (req,res) =>{
    try {
      const { text, image } = req.body;
      const receiverId = req.params.id;
      const senderId= req.user._id;

      let imageUrl;
      if(image){
        try {
            const upload = await cloudinary.uploader.upload(image, {
                folder: "quickchat",
            });
            imageUrl= upload.secure_url;
        } catch (uploadError) {
            return res.json({ success: false, message: "Image upload failed" });
        }
      }

      const newMessage = await Message.create({
        senderId,
        receiverId,
        text,
        image: imageUrl
      });

      //emit the new message to the receiver socket
      const receiverSocketId= userSocketMap[receiverId];
      if(receiverSocketId){
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }

      res.json({
        success: true,
        newMessage
      });
      
    } catch (error) {
      console.log(error.message);
      res.json({ success: false, messages: error.message });
    }
}

//delete message by id (sender only)
export const deleteMessage = async (req,res)=>{
    try {
        const {id}= req.params;
        const userId = req.user._id;
        const message = await Message.findById(id);

        if(!message){
            return res.status(404).json({success: false, message: "Message not found"});
        }
        if(message.senderId.toString() !== userId.toString()){
            return res.status(403).json({success: false, message: "Not authorized to delete this message"});
        }

        await Message.findByIdAndDelete(id);

        const receiverSocketId = userSocketMap[message.receiverId.toString()];
        if(receiverSocketId){
            io.to(receiverSocketId).emit("messageDeleted", {messageId: id, senderId: message.senderId.toString()});
        }

        res.json({success: true});
    } catch (error) {
        console.log(error.message);
        res.status(500).json({success: false, message: error.message});
    }
}
