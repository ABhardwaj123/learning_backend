import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)

    const comments = await Comment.find({
        video: videoId
    })
    .skip((pageNum-1) * limitNum)
    .limit(limitNum)

    return res
    .status(200)
    .json(new ApiResponse(200 , comments , "comments fetched successfully"))
})



const addComment = asyncHandler(async (req, res) => {
    
    const { content } = req.body
    const { videoId } = req.params
    const userId = req.user?._id

    if(!content?.trim()){
    throw new ApiError(400, "Comment cannot be empty")
    }

    if(!isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid video id")
    }

    const newComment = await Comment.create({
        content,
        video: videoId,
        owner: userId
    })

    return res
    .status(201)
    .json(new ApiResponse(200 , newComment , "comment added successfully"))
})



const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body
    const { commentId } = req.params
    const userId = req.user?._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    if(!content?.trim()){
        throw new ApiError(400, "Content cannot be empty")
    }

    const commentDoc = await Comment.findById(commentId)

    if(!commentDoc){
        throw new ApiError(404, "Comment not found")
    }

    if(commentDoc.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to edit this comment")
    }

    commentDoc.content = content
    await commentDoc.save()

    return res
    .status(200)
    .json(new ApiResponse(200, commentDoc, "Comment updated successfully"))
})



const deleteComment = asyncHandler(async (req, res) => {
    
    const { commentId } = req.params
    const userId = req.user?._id

    if(!isValidObjectId(commentId)){
        throw new ApiError(400, "Invalid comment id")
    }

    

    const commentDoc = await Comment.findById(commentId)

    if(!commentDoc){
        throw new ApiError(404, "Comment not found")
    }

    if(commentDoc.owner.toString() !== userId.toString()){
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    
    await commentDoc.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"))

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }