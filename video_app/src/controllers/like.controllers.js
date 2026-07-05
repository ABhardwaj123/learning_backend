import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    const userId = req.user?._id
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const videoLike = await Like.findOne({
        video: videoId,
        likedBy: userId
    })

    if(videoLike){
        await videoLike.deleteOne()

        return res
        .status(200)
        .json(new ApiResponse(200 , {} , "like removed successfully"))
    }

    const newLike = await Like.create({
        video: videoId,
        likedBy: userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200 , newLike , "liked the video"))
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    const userId = req.user?._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    const commentLike = await Like.findOne({
        comment: commentId,
        likedBy: userId
    })

    if(commentLike){
        await commentLike.deleteOne()

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "like removed successfully"))
    }

    const newLike = await Like.create({
        comment: commentId,
        likedBy: userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, newLike, "liked the comment"))
})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    const userId = req.user?._id

    if(!isValidObjectId(tweetId)){
        throw new ApiError(400, "Invalid tweet id")
    }

    const tweetLike = await Like.findOne({
        tweet: tweetId,
        likedBy: userId
    })

    if(tweetLike){
        await tweetLike.deleteOne()

        return res
        .status(200)
        .json(new ApiResponse(200, {}, "like removed successfully"))
    }

    const newLike = await Like.create({
        tweet: tweetId,
        likedBy: userId
    })

    return res
    .status(200)
    .json(new ApiResponse(200, newLike, "liked the tweet"))
})



const getLikedVideos = asyncHandler(async (req, res) => {
    const likedVideos = await Like.find({
        likedBy: req.user?._id,
        video: { $exists: true }
    }).populate("video")

    return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "liked videos fetched successfully"))
})



export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}