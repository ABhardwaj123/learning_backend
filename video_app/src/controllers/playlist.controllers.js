import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    const userId = req.user?._id

    if(!name?.trim() || !description?.trim()){
        throw new ApiError(400, "Name and description are required")
    }
    
    const newPlaylist = await Playlist.create({
        name,
        description,
        owner: userId
    })

    return res
    .status(201)
    .json(new ApiResponse(200 , newPlaylist , "playlist created successfully"))
})



const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.user?._id
    
    if(!isValidObjectId(userId)){
        throw new ApiError(400, "Invalid user id")
    }

    const userPlaylists = await Playlist.find({ owner: userId })

    return res
    .status(200)
    .json(new ApiResponse(200, userPlaylists, "Playlists fetched successfully"))
})



const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

    if(!isValidObjectId(playlistId)){
        throw new ApiError(404, "Playlist not found")
    }

    const playlist = await Playlist.findById(playlistId)

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
})




const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params

    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, "Invalid playlist or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    //checks if even one video that is asked to add is already there or not
    const alreadyExists = playlist.videos.some(
        (video) => video.toString() === videoId
    )

    if(alreadyExists){
        throw new ApiError(400, "Video already in playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
})




const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400 , "Invalid playlist or video id")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404, "Playlist not found")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to modify this playlist")
    }

    const alreadyExists = playlist.videos.some(
        (video) => video.toString() === videoId
    )

    if(!alreadyExists){
        throw new ApiError(400 , "video not in playlist")
    }

    playlist.videos = playlist.videos.filter(
        (video) => video.toString() !== videoId
    )
    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))

})




const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404 , "no such playlist exists")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to delete this playlist")
    }

    await playlist.deleteOne()

    return res
    .status(200)
    .json(new ApiResponse(200 , {} , "playlist deleted successfully"))

})



const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body

    if(!name?.trim() || !description?.trim()){
       throw new ApiError(400, "Name and description are required")
    }
    
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid playlist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404 , "no such playlist exists")
    }

    if(playlist.owner.toString() !== req.user?._id.toString()){
        throw new ApiError(403, "You are not authorized to update this playlist")
    }

    playlist.name = name
    playlist.description = description
    await playlist.save()

    return res
    .status(200)
    .json(new ApiResponse(200 , playlist , "playlist details updated successfully"))
    
})



export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}