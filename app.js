const express = require("express");
const app = express();
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require("cookie-parser");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const upload = require("./config/multerconfig");

// Middleware
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
    res.render("createAccount");
});

app.get("/profile/upload", (req, res) => {
    res.render("profileupload");
});

app.get("/Profile", isLoggedIn, async (req, res) => {
    let email = req.user.email;
    let user = await userModel.findOne({ email }).populate("posts");
    res.render("Profile", { user });
});

app.get("/like/:id", isLoggedIn, async (req, res) => {
    let post = await postModel.findById(req.params.id);
    let userId = req.user.userid;
    if (!post.likes.includes(userId)) {
        post.likes.push(userId);
    } else {
        post.likes.pull(userId);
    }
    await post.save();
    res.redirect("/Profile");
});

app.post("/upload", isLoggedIn, upload.single("image"), async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    user.profilepic = req.file.filename;
    await user.save();
    res.redirect("/Profile");
});

app.post("/post", isLoggedIn, async (req, res) => {
    try {
        const { content } = req.body;
        const user = await userModel.findOne({ email: req.user.email });
        const post = await postModel.create({
            user: user._id,
            content: content
        });
        user.posts.push(post._id);
        await user.save();
        res.redirect("/Profile");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).send("Invalid credentials");
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (result) {
                let token = jwt.sign(
                    {
                        email: user.email,
                        userid: user._id
                    },
                    process.env.JWT_SECRET || "shhh"
                );
                res.cookie("token", token);
                res.redirect('/Profile');
            } else {
                res.status(400).send("Invalid credentials");
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.post("/register", async (req, res) => {
    try {
        let { email, username, name, password, age } = req.body;
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).send("User already registered");
        }

        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.status(500).send("Error");
            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.status(500).send("Error");

                let newUser = await userModel.create({
                    name,
                    username,
                    password: hash,
                    email,
                    age,
                });

                let token = jwt.sign(
                    {
                        email: newUser.email,
                        userid: newUser._id,
                    },
                    process.env.JWT_SECRET || "shhh"
                );

                res.cookie("token", token);
                res.redirect("/Profile");
            });
        });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.get('/logout', (req, res) => {
    res.cookie("token", "");
    res.redirect("/login");
});

function isLoggedIn(req, res, next) {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).send("You must be logged in");
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET || "shhh");
        req.user = data;
        next();
    } catch (err) {
        return res.status(401).send("Invalid or expired token");
    }
}

app.get("/edit/:id", isLoggedIn, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.id);
        if (!post) return res.status(404).send("Post not found");
        res.render("edit", { post });
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

app.post("/update/:id", isLoggedIn, async (req, res) => {
    try {
        const { content } = req.body;
        await postModel.findByIdAndUpdate(
            req.params.id,
            { content: content },
            { new: false }
        );
        res.redirect("/Profile");
    } catch (err) {
        console.log(err);
        res.status(500).send("Something went wrong");
    }
});

// Remove app.listen() for Vercel
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

// Export for Vercel
module.exports = app;
