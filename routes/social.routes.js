import express from "express"
import auth from "../middleware/auth.js";
import { deletePost, fetchPost, postFile, updatePost } from "../controller/social.controller.js";
import { validateFetchReq } from "../middleware/validator.js";

const socialRouter = express.Router();

socialRouter.route("/").post(auth, postFile)
socialRouter.route("/:id").delete(auth, deletePost)
socialRouter.route("/").get(validateFetchReq, auth, fetchPost)
socialRouter.route("/:id").put(auth, updatePost)


export default socialRouter;