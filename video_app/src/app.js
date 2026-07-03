import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    //allows requests from only specific origin
    origin: process.env.CORS_ORIGIN,

    //allows cookies/headers to be included in cross-origin request
    credentials: true
}))

//limiting the details about the request
app.use(express.json({
    limit: "16kb"
}))


//data that is sent is like a url seperated with &
app.use(express.urlencoded({
    //supporting nested objects and arrays
    extended: true,
    limit: "16kb"
}))


//static files like images are stored in my public folder
app.use(express.static("public"))


//to be able to use the functionality fo cookies
app.use(cookieParser())



//routes
import userRouter from './routes/user.routes.js'

//routes declaration 
//all routes in userRouter has prefix of api/v1/users
app.use("/api/v1/users" , userRouter) //middleware

export {app}