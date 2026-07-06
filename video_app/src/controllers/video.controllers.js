import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    
    const filter = {
        isPublished: true
    }

    if(query){
        filter.title = { $regex: query , $options: "i"}
    }

    if(userId){
        filter.owner = userId
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)

    const sortField = sortBy || "createdAt"
    const sortDirection = sortType === "asc" ? 1 : -1

    const videos = await Video.find(filter)
    .sort({ [sortField]: sortDirection })
    .page((pageNum-1) * limitNum)
    .limit(limitNum)

    return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched successfully"))
})




const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body

    if(!title?.trim() || !description?.trim()){
        throw new ApiError(400, "Title and description are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path


    if(!videoLocalPath || !thumbnailLocalPath){
        throw new ApiError(400 , "video/thumbnail is missing")
    }

    const video = await uploadOnCloudinary(videoLocalPath)
    if(!video?.url){
        throw new ApiError(400, "Error while uploading video")
    }

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    if(!thumbnail?.url){
        throw new ApiError(400, "Error while uploading thumbnail")
    }

    const videoObj = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        isPublished: true,
        owner: req.user?._id
    })

    return res
    .status(201)
    .json(new ApiResponse(200 , videoObj , "video published successfully"))
    
})



const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400 , "invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404 , "video not found")
    }

    //somebody asked for the video, adding their view
    video.views += 1
    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200 , video , "video fetched successfully"))
})




const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title , description } = req.body
    const thumbnailLocalPath = req.file?.path

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    if(!title?.trim() || !description?.trim()){
        throw new ApiError(400, "Title and description are required")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "Video not found")
    }

    if(video.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to update this video")
    }

    video.title = title
    video.description = description

    if(thumbnailLocalPath){
        const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

        if(!thumbnail.url){
            throw new ApiError(400, "Error while uploading thumbnail")
        }

        video.thumbnail = thumbnail.url
    }

    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200, video, "Video updated successfully"))

})




const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    if(!isValidObjectId(videoId)){
        throw new ApiError(400 , "invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404 , "video not found")
    }

    if(video.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this video")
    }

    await video.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "video deleted successfully"))
})




const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if(!isValidObjectId(videoId)){
        throw new ApiError(400 , "invalid video id")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404 , "video not found")
    }

    if(video.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to modify this video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res
    .status(200)
    .json(new ApiResponse(200 , video , "video's publish status toggled successfully"))

})



export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}