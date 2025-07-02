const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticateToken } = require('../middleware/authMiddleware');

const { addDestination, getAllDestinations, addTour, getAllTour, getAllDetails, bookTour } = require('../controllers/appController');

router.post('/v1/add-destination', upload.fields([{ name: 'image_url' }]), addDestination);
router.get('/v1/get-all-destinations', getAllDestinations);
router.post('/v1/add-tour', upload.fields([{ name: 'tour_image' }]), addTour);
router.get('/v1/get-all-tours', getAllTour);
router.get('/v1/get-tour', getAllDetails);
router.post('/v1/book-tour', bookTour);

module.exports = router;
