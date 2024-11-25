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

const storage2 = multer.diskStorage({
    filename: function(req, file, callback){
        callback(null,file.originalname)
    }
})
const upload2 = multer({storage: storage2})

const upload = multer({ storage: storage });

module.exports = {upload, upload2};

// module.exports = { downloadFile }
