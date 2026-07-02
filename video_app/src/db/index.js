//this file connects our app to mongoDB database
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log(`DB HOST: ${connectionInstance.connection.host}`)

    }catch(error){

        console.log("connection error: ", error)
        process.exit(1)

    }
}

export default connectDB

//mongoose is the library used to talk to mongoDB