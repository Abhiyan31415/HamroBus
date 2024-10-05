const express = require('express');
const {
    getAllBuses,
    addBus,
    updateBus,
    deleteBus,
    searchBuses,
} = require('../controllers/busController'); 
const router = express.Router();

// Existing routes
router.get('/buses', getAllBuses);
router.post('/buses', addBus);
router.put('/buses/:id', updateBus);
router.delete('/buses/:id', deleteBus);

// New search route
router.post('/buses/search', searchBuses);


module.exports = router;