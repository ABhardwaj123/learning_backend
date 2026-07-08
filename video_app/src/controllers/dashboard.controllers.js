import mongoose, { Mongoose } from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id

    const totalVideos = await Video.countDocuments({ owner: userId })
    const totalSubscribers = await Subscription.countDocuments({ channel: userId })

    const videoStats = await Video.aggregate([
        {
            $match: { owner: new mongoose.Types.ObjectId(userId) }
        }, 

        {
            $group: {

                _id: null,
                totalViews: { $sum: "$views" }
            }
        }
    ])

    const totalViews = videoStats[0]?.totalViews || 0

    const videos = await Video.find({ owner: userId }).select("_id")
    const videoIds = videos.map((video) => video._id)

    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    })

    return res
    .status(200)
    .json(new ApiResponse(200, {
        totalVideos,
        totalSubscribers,
        totalViews,
        totalLikes
    }, "Channel stats fetched successfully"))
    
})




const getChannelVideos = asyncHandler(async (req, res) => {

    const user = req.user?._id

    if(!user){
        throw new ApiError(400 , "invalid user")
    }

    const videos = await Video.find({
        owner: user
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , videos , "videos for this channel fetched successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }