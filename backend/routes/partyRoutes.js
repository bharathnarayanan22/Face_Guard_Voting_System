const express = require('express');
const router = express.Router();
const { getParties,enrollParty, updateParty, deleteParty, viewResults, fetchPartiesByRegion } = require('../controllers/partyController');

router.get('/parties',getParties);
router.post('/enroll-party', enrollParty);
router.put('/:id', updateParty);
router.delete('/parties/:partyId', deleteParty);
router.get('/parties/ViewResults', viewResults);
router.get('/parties/:region', fetchPartiesByRegion);

module.exports = router;
