const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    flightId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Flight",
        required: true
    },

    seats: {
        type: Number,
        required: true
    },

    selectedSeats: {
        type: [String],
        default: []
    },

    amount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        default: "pending"
    }

}, { timestamps: true });

module.exports =
    mongoose.models.Booking ||
    mongoose.model("Booking", bookingSchema);