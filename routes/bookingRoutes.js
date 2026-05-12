const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Flight = require("../models/Flight");

const auth = require("../middleware/auth");


// ✅ CREATE BOOKING
router.post("/book", auth, async (req, res) => {

    try {

        const { flightId, seats, selectedSeats } = req.body;

        const flight = await Flight.findById(flightId);

        if (!flight) {
            return res.status(404).json({
                message: "Flight not found"
            });
        }

        if (flight.seatsAvailable < seats) {
            return res.status(400).json({
                message: "Not enough seats"
            });
        }

        // ✅ CREATE BOOKING
        const booking = await Booking.create({

            user: req.user.id,

            flightId: flight._id,

            seats,

            selectedSeats,

            amount: flight.price * seats,

            paymentStatus: "pending"
        });

        // ✅ REDUCE SEATS
        flight.seatsAvailable -= seats;

        await flight.save();

        res.json({
            message: "Booking successful",
            booking
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });
    }
});


// ✅ MY BOOKINGS
router.get("/my-bookings", auth, async (req, res) => {

    try {

        const bookings = await Booking.find({
            user: req.user.id
        }).populate("flightId");

        res.json(bookings);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ✅ CANCEL BOOKING
router.delete("/cancel/:id", auth, async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // ✅ RETURN SEATS
        const flight = await Flight.findById(booking.flightId);

        if (flight) {

            flight.seatsAvailable += booking.seats;

            await flight.save();
        }

        // ✅ DELETE BOOKING
        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            message: "Booking cancelled"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;