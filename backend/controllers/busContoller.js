const Bus = require('../models/Bus');

// Get all buses
exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find();
        res.status(200).json(buses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a new bus
exports.addBus = async (req, res) => {
    const { routeNumber, departureTime, arrivalTime, availableSeats, price } = req.body;
    const newBus = new Bus({ routeNumber, departureTime, arrivalTime, availableSeats, price });

    try {
        const savedBus = await newBus.save();
        res.status(201).json(savedBus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update a bus
exports.updateBus = async (req, res) => {
    try {
        const updatedBus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedBus);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a bus
exports.deleteBus = async (req, res) => {
    try {
        await Bus.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Bus deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search buses
// Search buses
exports.searchBuses = async (req, res) => {
    const { from, to, date } = req.body;

    console.log('Received search criteria:', req.body);

    // Check if the date is in the expected "MM-DD-YYYY" format
    if (!/^\d{2}-\d{2}-\d{4}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format. Please use MM-DD-YYYY.' });
    }

    console.log(`Search travel date: ${date}`);

    try {
        // Query the database with location filters and travelDate string match
        const buses = await Bus.find({
            fromLocation: from,
            toLocation: to,
            travelDate: date // Compare as a string
        });
        
        console.log(`Found ${buses.length} buses matching the criteria`);

        if (buses.length === 0) {
            return res.status(404).json({ message: 'No buses found for the specified criteria' });
        }

        return res.status(200).json(buses);

    } catch (error) {
        console.error('Error fetching buses:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};













