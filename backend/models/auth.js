const mongoose = require("mongoose");
 const connect = mongoose.connect(
     "mongodb+srv://praju:praju5541@cluster0.ulllouu.mongodb.net/"
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

const ticketSchema = new mongoose.Schema({
    username: {
        type: String,
        required: false,
    },
    contact: {
        type: Number,
        required: false,
    }, 
    routeNumber: {
        type: String,
        required: false,
    },
    busName:{
        type:String,
        required:false,
    },
    departureTime: {
        type: Date,
        required: false,
    },
    arrivalTime: {
        type: Date,
        required: false,
    },
    fromLocation: {
        type: String,
        required: false, // Add this line to require fromLocation
    },
    toLocation: {
        type: String,
        required: false, // Add this line to require toLocation
    },
    travelDate: {
        type: String, 
        required: false, // Add this line to require travelDate
    },
    bookedSeats:{
        type:[String],
        required:false,
    }




});

// const BusSchema = new mongoose.Schema({
//     routeNumber: {
//         type: String,
//         required: true,
//     },
//     rowNumber:{
//         type: Number,
//         required: false,
//     },
//     busName: {
//         type: String,
//         required: false,
//     },

//     departureTime: {
//         type: Date,
//         required: true,
//     },
//     arrivalTime: {
//         type: Date,
//         required: true,
//     },
//     availableSeats: {
//         type: Number,
//         required: true,
//     },
//     price: {
//         type: Number,
//         required: true,
//     },
//     fromLocation: {
//         type: String,
//         required: true, // Add this line to require fromLocation
//     },
//     toLocation: {
//         type: String,
//         required: true, // Add this line to require toLocation
//     },
//     travelDate: {
//         type: String,
//         required: true, // Add this line to require travelDate
//     },
// });
const ticket= new mongoose.model("Tickets",ticketSchema);
const collection = new mongoose.model("Users", LoginSchema);
//const bus = new mongoose.model("Bus", BusSchema);
module.exports ={collection,ticket};
