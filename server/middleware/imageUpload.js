const path = require('path');
const multer  = require('multer');
const fs = require('fs');
const fsPromise = require('fs').promises;
const logger = require('../logger');

// ( async () => {
//     try {
//         if(!fs.existsSync(path.join(__dirname, '..', 'assets'))) {
//             await fsPromise.mkdir(path.join(__dirname, '..', 'assets/'));
//             await fsPromise.mkdir(path.join(__dirname, '..', 'assets/profile'));
//         }

//         if(!fs.existsSync(path.join(__dirname, '..', 'assets/profile'))) {
//             await fsPromise.mkdir(path.join(__dirname, '..', 'assets/profile'));
//         }
//     } catch (err) {
//         logger.warn(`${err}`, {module: `Image Upload`})
//     }
// }) ()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `/usr/share/nginx/html/Annotation-Tool/Dev/images`)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({ storage: storage})

module.exports = { upload }
