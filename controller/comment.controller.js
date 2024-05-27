import asyncHandler from "express-async-handler";
import createError from "http-errors";
import PostModel from "../model/postModel.js"
import CommentModel from "../model/commentModel.js";
import ApiResponse from "../utils/ApiResponse.js";


const postComment = asyncHandler(async (req, res, next) => {
    const { postid } = req.params;
    const { comment } = req.body;

    if (!postid) {
        return next(createError(422, "post id required"))
    }

    if (!comment) {
        return next(createError(422, "Comment required"))
    }

    const post = await PostModel.findById(postid);

    if (!post) {
        return next(createError(404, "Invalid post"))
    }

    const individualCommentCount = await CommentModel.countDocuments({ postid, userid: req.user._id })
    if (individualCommentCount >= 8) {
        return next(createError(409, "Max comment reached."))

    }

    const newComment = await CommentModel.create({
        userid: req.user._id,
        postid,
        comment
    })

    res.status(200).json(new ApiResponse(newComment, "Comment done."))
})

const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentid } = req.params

    if (!commentid) {
        return next(createError(422, "Commentid required"))
    }

    const comment = await CommentModel.findById(commentid).populate({
        path: "postid",
        model: "PostModel",
    });

    if (!comment) {
        return next(createError(404, "Invalid comment."))
    }

    if (comment.userid.toString() === req.user._id.toString() || req.user._id.toString() === comment.postid.userid.toString()) {
        await comment.deleteOne()
    } else {
        return next(createError(409,"Unathorized user to delete comment"))
    }

    res.status(200).json(new ApiResponse(null, "Comment deleted"))
})


const fetchComment = asyncHandler(async (req, res, next) => {
    const { page, limit, sort } = req.query;
    const { postid } = req.params;
    const skip = (page - 1) * limit;

    const comments = await CommentModel.find({ postid }).skip(skip).limit(limit).sort(sort).populate({
        path: "userid",
        model: "UserModel",
        select: "-refreshToken -accessToken -password -createdAt -__v -updatedAt -coverPhoto -bio -email -fullname"
    })

    res.status(200).json(new ApiResponse(comments, "comment fetched."))

})

export { postComment, deleteComment ,fetchComment};