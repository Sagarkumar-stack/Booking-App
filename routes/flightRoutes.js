const express = require("express");
const router = express.Router();

const Flight = require("../models/flight");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");


// ✅ ADMIN ONLY: ADD FLIGHT
router.post("/add", auth, admin, async (req, res) => {

    try {

        const {
            from,
            to,
            airline,
            price,
            seatsAvailable,
            departureTime,
            arrivalTime,
            duration
        } = req.body;

        // ✅ FIXED VALIDATION
        if (
            !from?.trim() ||
            !to?.trim() ||
            !airline?.trim() ||
            price === undefined ||
            seatsAvailable === undefined ||
            !departureTime?.trim() ||
            !arrivalTime?.trim() ||
            !duration?.trim()
        ) {

            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const flight = await Flight.create({

            from,
            to,
            airline,

            price: Number(price),

            seatsAvailable: Number(seatsAvailable),

            departureTime,
            arrivalTime,
            duration
        });

        res.json({
            message: "Flight added successfully ✅",
            flight
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


// ✅ SEARCH FLIGHTS
router.get("/search", async (req, res) => {

    try {

        const { from, to } = req.query;

        let query = {};

        if (from && from.trim() !== "") {

            query.from = {
                $regex: from,
                $options: "i"
            };
        }

        if (to && to.trim() !== "") {

            query.to = {
                $regex: to,
                $options: "i"
            };
        }

        const flights = await Flight.find(query);

        console.log("SEARCH QUERY:", query);
        console.log("FOUND FLIGHTS:", flights.length);

        res.json(flights);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


// ✅ SEED ALL FLIGHTS
router.get("/seed", async (req, res) => {

    try {

        await Flight.deleteMany();

        const cities = [
            "Delhi",
            "Mumbai",
            "Bangalore",
            "Hyderabad",
            "Chennai",
            "Kolkata",
            "Goa",
            "Pune"
        ];

        const airlines = [
            "IndiGo",
            "Air India",
            "Vistara",
            "SpiceJet",
            "Akasa Air"
        ];

        const times = [
            "06:00 AM",
            "07:30 AM",
            "09:00 AM",
            "11:15 AM",
            "01:45 PM",
            "03:30 PM",
            "06:20 PM",
            "09:10 PM"
        ];

        const durations = [
            "1h 30m",
            "2h 10m",
            "2h 45m",
            "3h 15m"
        ];

        let flights = [];

        for (let i = 0; i < cities.length; i++) {

            for (let j = 0; j < cities.length; j++) {

                if (i === j) continue;

                flights.push({

                    from: cities[i],

                    to: cities[j],

                    airline:
                        airlines[
                        Math.floor(Math.random() * airlines.length)
                        ],

                    price:
                        Math.floor(Math.random() * 5000) + 3000,

                    seatsAvailable:
                        Math.floor(Math.random() * 40) + 10,

                    departureTime:
                        times[
                        Math.floor(Math.random() * times.length)
                        ],

                    arrivalTime:
                        times[
                        Math.floor(Math.random() * times.length)
                        ],

                    duration:
                        durations[
                        Math.floor(Math.random() * durations.length)
                        ]
                });
            }
        }

        await Flight.insertMany(flights);

        res.json({
            message: "Flights Added Successfully ✅",
            total: flights.length
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;