const mongoose = require("mongoose");

// NOTE:
// On platforms like Vercel there is no MongoDB running at localhost.
// Provide MONGODB_URI via environment variables.
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    // Fail fast with a clear error so deployment issues are obvious.
    throw new Error("Missing required environment variable: MONGODB_URI");
}

// Avoid creating multiple connections in dev/hot-reload.
if (mongoose.connection.readyState === 0) {
    mongoose.connect(MONGODB_URI);
}

const userSchema = mongoose.Schema(

    {     
        username: String,
        name: String,
        age:Number,
        email:String,
        password:String,

        profilepic:
        {
            type:String,
            default : "default_image.png"
        },
       posts:
       [
        {
            type:mongoose.Schema.Types.ObjectId  , ref :"post"
        }
       ]
    }
)

module.exports = mongoose.model('user', userSchema);

