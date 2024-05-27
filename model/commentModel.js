import mongoose, { model } from "mongoose";

const commentSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    postid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostModel"
    },
    comment: {
        type: String,
        trim:true,
        required:true
    }
}, {
    timestamps: true
})

const CommentModel = model("CommentModel", commentSchema)
export default CommentModel;