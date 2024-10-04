const mongoose = require("mongoose");
const connect = mongoose.connect(
    "mongodb+srv://079bct008abhiyan:h8PyRbG3T1MlUE2P@cluster0.m1z1a.mongodb.net/"
);

connect
    .then(() => {
        console.log("Database Connected sucessfully");
    })
    .catch((err) => console.log(err));

const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    contact: {
        type: Number,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
});

const BusSchema = new mongoose.Schema({
    routeNumber: {
        type: String,
        required: true,
    },
    rowNumber:{
        type: Number,
        required: true,
    },
    busName: {
        type: String,
        required: true,
    },

    departureTime: {
        type: Date,
        required: true,
    },
    arrivalTime: {
        type: Date,
        required: true,
    },
    availableSeats: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    fromLocation: {
        type: String,
        required: true, // Add this line to require fromLocation
    },
    toLocation: {
        type: String,
        required: true, // Add this line to require toLocation
    },
    travelDate: {
        type: String,
        required: true, // Add this line to require travelDate
    },
});

const collection = new mongoose.model("Users", LoginSchema);
const bus = new mongoose.model("Bus", BusSchema);
module.exports = { collection, bus };
