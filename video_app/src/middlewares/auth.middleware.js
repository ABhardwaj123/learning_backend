//only to verify if user is there or not
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.models.js"

export const verifyJWT = asyncHandler( async(req , _ , next) => {
    
    try{
        //trying to get the accessToken either from cookies or authorization header
        //Authorization: Bearer eyJhbGciOi...
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer " , "")

        if(!token){
            throw new ApiError(401 , "Unauthorized request")
        }
        
        //makes sure that it was created using our ACCESS_TOKEN_SECRET only
        //if valid this decodedToken has our object of accessToken
        const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401 , "invalid access token")
        }

        //attaching user X's data so that rest of our app doesn't waste time on finding out that who is the user
        req.user=user
        next()

    }catch(error){
        throw new ApiError(401 , error?.message || "invalid access token")
    }
})