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
const collection = new mongoose.model("Users", LoginSchema);
module.exports = collection;
