const express = require('express');
const router = express.Router();
const regionController = require('../controllers/regionController');

router.post('/regions', regionController.createRegion);
router.get('/regions', regionController.getAllRegions);
router.get('/regions/:id', regionController.getRegionById);
router.put('/regions/:id', regionController.updateRegionById);
router.delete('/regions/:id', regionController.deleteRegionById);
router.get('/regions/:id/voters', regionController.getVotersOfRegion);
router.get('/regions/:id/parties', regionController.getPartiesOfRegion);
router.get('/regions/:id/download-voters', regionController.downloadVotersList);
router.get('/regions/:id/download-parties', regionController.downloadPartiesList);

module.exports = router;