const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, db) => {
        db(null, 'uploads/')
    },
    filename: (req, file, db) => {
        db(null, `${Date.now()}-${file.originalname}`)
    }
})

const uplaod = multer({
    storage: storage,
})

module.exports = uplaod;