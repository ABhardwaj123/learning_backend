import mongoose from 'mongoose'

const userScema = new mongoose.Schema(
    {
        //username: String

        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: [true , "password is required"]
        }
    }, {timestamps: true}
)

export const User = mongoose.model('User' , userScema)