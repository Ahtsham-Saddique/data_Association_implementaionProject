const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "public/images/uploads");
    },

    filename: function (req, file, cb) {

        crypto.randomBytes(12, (err, bytes) => {

            if (err) {
                return cb(err);
            }

            const fn =
                bytes.toString("hex") +
                path.extname(file.originalname);

            cb(null, fn);

        });

    }

});

const upload = multer({ storage });

module.exports = upload;