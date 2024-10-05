const mongoose = require('mongoose');

const busSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: true
    },
    rowNumber: {
        type: Number,
        required: false
    },
    busName:{
        type:String,
        required:false
    },
    departureTime: {
        type: Date,
        required: true
    },
    arrivalTime: {
        type: Date,
        required: true
    },
    availableSeats: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    fromLocation: {
        type: String,
        required: true // Add this line to require fromLocation
    },
    toLocation: {
        type: String,
        required: true // Add this line to require toLocation
    },
    travelDate: {
        type: String, 
        required: true // Add this line to require travelDate
    },
    arrivalDate:{
        type: String,
        required: true
    },
    seats:{
        type:[String],
        required:true,
    }
});

const Bus = mongoose.model('Bus', busSchema);
module.exports = Bus;