const multer = require('multer');
const path = require('path');

// Setting up my storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${Date.now()}${ext}`);  
    }
});

// Initialize upload middleware
const upload = multer({ storage: storage });

module.exports = upload;
