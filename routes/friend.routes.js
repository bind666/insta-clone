import express from "express";
import auth from "../middleware/auth.js"
import { acceptRejectFriend, fetchFriendRequests, fetchFriends, sendFriendRequest } from "../controller/friend.controller.js";
import { validateFetchReq } from "../middleware/validator.js";


const friendRouter = express.Router();

friendRouter.route("/:id").post(auth, sendFriendRequest)
friendRouter.route("/:id").put(auth, acceptRejectFriend)
friendRouter.route("/").get(validateFetchReq, auth, fetchFriends)
friendRouter.route("/myfriendreq").get(validateFetchReq, auth, fetchFriendRequests)

export default friendRouter;