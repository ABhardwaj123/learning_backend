//router helps us create our mini app using express
import { Router } from "express";
import { loginUser, logoutUser, registerUser , refreshAccessToken} from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

//attaching a route to a new instance
router.route("/register").post(
    //first runs upload.fields and multer saves it to the server
    //then our registerUser logic is begin executed
    
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),    
    registerUser
)


router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT , logoutUser)

router.route("/refresh-token").post(refreshAccessToken)

export default router