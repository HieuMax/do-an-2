const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files-upload/')
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + "-f" + path.extname(file.originalname);
        cb(null, filename);
    },
})

const upload = multer({ storage: storage });

module.exports = upload;
