import { Schema, model } from "mongoose"

const friendSchema = new Schema({
    senderID: {
        type: Schema.Types.ObjectId,
        ref:"userModel"
    },
    receiverID: {
        type: Schema.Types.ObjectId,
        ref:"userModel"
    },
    status: {
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }
}, {
    timestamps: true
})

const friendModel = model("friendModel", friendSchema)

export default friendModel;