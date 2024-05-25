import asyncHandler from "express-async-handler";
import createError from "http-errors";
import userModel from "../model/userModel.js";
import friendModel from "../model/friendModel.js";
import ApiResponse from "../utils/ApiResponse.js";


const sendFriendRequest = asyncHandler(async (req, res, next) => {
    const { _id: senderID } = req.user;
    const { id: receiverID } = req.params;

    if (!receiverID) {
        return next(createError(422, "Receiver ID required"))
    }

    if (senderID.toString() === receiverID) {
        return next(createError(422, "can't send friend request to self"))
    }

    const isValidFriend = await userModel.findById(receiverID);
    if (!isValidFriend) {
        return next(createError(404, "ghante ka friend"))
    }

    const isFriendExists = await friendModel.findOne({ senderID, receiverID })

    if (isFriendExists) {
        return next(createError(409, "friend request bheji jaa chuki hai"))
    }

    const newFriend = friendModel.create({
        senderID,
        receiverID
    })

    res.status(200).json(new ApiResponse(newFriend, "friend request sent."))

})

const acceptRejectFriend = asyncHandler(async (req, res, next) => {
    const { _id } = req.user;
    const { id: friendReqID } = req.params;
    const { type } = req.query;

    if (!type) {
        return next(createError(422, "type required."))
    }

    const validTypes = ["accept", "reject"]

    if (!validTypes.includes(type)) {
        return next(createError(422, "invalid type."))
    }

    if (!friendReqID) {
        return next(createError(422, "friend req id required."))
    }

    const isValidFriendReq = await friendModel.findOne({
        _id: friendReqID,
        $or: [{ senderID: _id.toString() }, { receiverID: _id.toString() }]
    });

    if (!isValidFriendReq) {
        return next(createError(404, "Ghante ka friend request."))
    }

    if (type === "accept" && _id.toString() === isValidFriendReq.senderID.toString()) {
        return next(createError(409, "You can not accept the friend request."))
    }

    if (type === "accept") {
        isValidFriendReq.status = "accepted"
        await isValidFriendReq.save();
        res.status(200).json(new ApiResponse(isValidFriendReq, "Badhai ho friend hua he."))
    } else {
        await isValidFriendReq.deleteOne()
        res.status(200).json(new ApiResponse(null, "Badhai ho tumhara cut gya he."))
    }

})

const fetchFriends = asyncHandler(async (req, res, next) => {
    const { page, limit, sort } = req.query
    const friends = await userModel.find({}).skip((page - 1) * 10).limit(limit).sort(sort).
        select("-refreshToken -accessToken -password -createdAt -__v -updatedAt -coverPhoto -bio")

    res.status(200).json(new ApiResponse(friends, "friends fetched"))
})

const fetchFriendRequests = asyncHandler(async (req, res, next) => {
    const { _id: receiverID } = req.user;
    const { page, limit, sort } = req.query

    const requests = await friendModel.find({ receiverID }).skip((page - 1) * 10).limit(limit).sort(sort)
        .select("-createdAt -updatedAt -__v")

    // console.log(requests.toString());
    if (requests == "") {
        return next(createError(409, "no request found"))
    }
    res.status(200).json(new ApiResponse(requests, "friends requests fetched"))
})



export { sendFriendRequest, acceptRejectFriend, fetchFriends, fetchFriendRequests };