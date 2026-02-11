import express from 'express';
import {protectRoute} from "../middleware/auth.js"
import { deleteMessage, getMessages, getUsersForSidebar, markMessageAsSeen, sendMessage } from '../controllers/messageControllers.js';
const messageRouter = express.Router();

messageRouter.get("/users",protectRoute, getUsersForSidebar);
messageRouter.get("/:id", protectRoute, getMessages);
messageRouter.put("/mark/:id", protectRoute, markMessageAsSeen);
messageRouter.post("/send/:id", protectRoute,sendMessage);
messageRouter.delete("/:id", protectRoute, deleteMessage);

export default messageRouter;