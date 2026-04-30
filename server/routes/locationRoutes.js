const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { verifyToken, verifyTokenFromQuery } = require('../middlewares/authMiddleware');
const { validateLocation, validateIdParam } = require('../middlewares/validation');

router.get('/stream', verifyTokenFromQuery, locationController.streamLocations);

router.post('/update', validateLocation, locationController.updateLocation);
router.get('/latest', verifyToken, locationController.getLatestLocations);
router.get('/user/:id', verifyToken, validateIdParam, locationController.getLocationByUserId);
module.exports = router;