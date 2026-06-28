const mongoose = require("mongoose");

// Local MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/postdata")
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Connection Error:", err);
});

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    age: Number,
    email: String,
    password: String,

    profilepic: {
        type: String,
        default: "default_image.png"
    },

    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "post"
        }
    ]
});

module.exports = mongoose.model("user", userSchema);