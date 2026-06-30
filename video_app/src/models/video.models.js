import mongoose , {Schema} from "mongoose";
//pagination is used to send data in chunks/pages. Not sending all the data at one single time.
//example - as you scroll through YouTube , the pages loads on scrolling
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema({

    videoFile: {
        type: String,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    duration: {
        type: Number,
        required: true
    },

    views: {
        type: Number,
        default: 0
    },

    isPublished: {
        type: Boolean,
        default: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
    
}, {timestamps: true})

//extending our schema with the plugin of paginate
videoSchema.plugin(mongooseAggregatePaginate)

export const Video = mongoose.model("Video" , videoSchema)