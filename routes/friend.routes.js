import express from "express";
import auth from "../middleware/auth.js"
import { acceptRejectFriend, sendFriendRequest } from "../controller/friend.controller.js";


const friendRouter = express.Router();

friendRouter.route("/:id").post(auth, sendFriendRequest)
friendRouter.route("/:id").put(auth, acceptRejectFriend)

export default friendRouter;