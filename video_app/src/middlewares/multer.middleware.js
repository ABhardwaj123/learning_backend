//multer is used so deal with files that have to be uploaded
import multer from "multer"

//multer can either save it on disk(server) or memory(RAM)
const storage = multer.diskStorage({
    //tells where the file should be stored
    //"file" gives info about the file being uploaded
    destination: function(req , file , cb) {

        //null -> no error
        cb(null, "./public/temp")
    },

    //tells by what name should the file be saved
    filename: function(req , file , cb){

        //telling that keep the filename same as given by the user
        cb(null , file.originalname)
    }
})


export const upload = multer({storage: storage})

//cb is callback function which gives some answer after it is completed
//we delete the files from our temp server once uploaded in database