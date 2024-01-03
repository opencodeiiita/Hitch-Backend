const multer = require('multer');
const path = require('path');
const {v4: uuidv4} = require('uuid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, path.basename(file.originalname) + '-' + uuidv4() + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'||
        file.mimetype === 'image/gif' ||
        file.mimetype === 'image/pdf') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const FILE_SIZE_LIMIT = process.env.FILE_SIZE_LIMIT || 1024 * 1024 * 1; // 1 MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * FILE_SIZE_LIMIT
    },
    fileFilter: fileFilter
});

module.exports = upload;