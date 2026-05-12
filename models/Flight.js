const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({

    from: String,

    to: String,

    airline: String,

    price: Number,

    seatsAvailable: Number,

    departureTime: String,

    arrivalTime: String,

    duration: String

});

module.exports =
    mongoose.models.Flight ||
    mongoose.model("Flight", flightSchema);