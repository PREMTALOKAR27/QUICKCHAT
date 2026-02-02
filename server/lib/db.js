import mongoose from "mongoose";

export const connectDB= async ()=>{
    try{
        mongoose.connection.on('connected', ()=> console.log("database connected successfully"));
        await mongoose.connect(`${process.env.MONGODB_URL}/chat-app`)
    }catch (error){
        console.log(error);
    }
}
