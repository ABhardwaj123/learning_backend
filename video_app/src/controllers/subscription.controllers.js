import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {

    //destructuring channelId from the URL
    const {channelId} = req.params

    //getting just the _id from the logged-in user's object (req.user)
    const userId = req.user?._id

    if(channelId.toString() === userId.toString()){
        throw new ApiError(400 , "user cannot subscribe to itself")
    }

    //check if the subscription is already there

    const sub = await Subscription.findOne({
        subscriber: userId,
        channel: channelId
    })

    if(sub){
        //user is already subscribe
        await sub.deleteOne()

        return res.status(200)
        .json(new ApiResponse(200, {}, "Unsubscribed successfully"))
    }

    

    // channelId is a string (from req.params) → Mongoose casts it to ObjectId
    // userId is already an ObjectId (from req.user._id) → stored as-is
    const newSub = await Subscription.create({
        subscriber: userId,
        channel: channelId
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , newSub , "channel subscribed successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const {channelId} = req.params //connect to channel in our db

    if(!isValidObjectId(channelId)){
        throw new ApiError(400 , "invalid channel id")
    }

    const subscribers = await Subscription.find({
        channel: channelId
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , subscribers , "subscriber list fetched successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {

    
    const { subscriberId } = req.params //connect to subscriber in our db

    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400 , "invalid subscriber id")
    }

    const subscribedChannels = await Subscription.find({
        subscriber: subscriberId
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , subscribedChannels , "subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}