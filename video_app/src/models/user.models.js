import mongoose ,{Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


const userSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    fullname: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    avatar: {
        type: String, 
        required: true
    },

    coverImage: {
        type: String
    },

    watchHistory: [
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],

    password: {
        type: String,
        required: [true, 'Password is required']
    },

    refreshToken: {
        type: String
    }

}, {timestamps: true})

//mongoose middleware. runs right before a document is saved(pre("save"))
userSchema.pre("save" , async function(next){
    //if password was not changed it immediately returns next
    if(!this.isModified("password")) return next()

    //if password changed then update in database
    //10 -> number of salt rounds. more rounds -> more secure
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

//this.password is the password stored in the database for current user(current context)
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password , this.password)
}

userSchema.methods.generateAccessToken = function(){
    //jwt.sign(payload, secret, options)
    //access token is generally short lived
    //used frequently for authorization
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }

    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }

    )
}


export const User = mongoose.model("User" , userSchema)