import { Schema, model } from "mongoose";
import bcrypt, { hash } from "bcrypt";
import createError from "http-errors";

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "Please provide username."],
        // unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    bio: {
        type: String,
    },
    avatar: {
        type: String,
        default: 'photo.png'
    },
    coverPhoto: {
        type: String,
        default: 'photo.png'
    }
}, {
    timestamps: true
});


userSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) next()
        const salt = await bcrypt.genSalt(10); //it generate a salt (big string)
        this.password = await bcrypt.hash(this.password, salt)
        next();
    } catch (error) {
        next(createError(500, error.message))
    }
})
    

const userModel = model("userModel", userSchema)
export default userModel