import React, { useState } from "react";
import API from "./api";
import { motion, AnimatePresence } from "framer-motion";

function Home() {

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [flights, setFlights] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedFlight, setSelectedFlight] = useState(null);

    const [passengers, setPassengers] = useState(1);

    const [selectedSeats, setSelectedSeats] = useState([]);

    // 🔍 SEARCH FLIGHTS
    const searchFlights = async () => {

        try {

            setLoading(true);

            const res = await API.get(
                `/flights/search?from=${from}&to=${to}`
            );

            setFlights(res.data);

        } catch (err) {

            console.log(err);

            alert("Error fetching flights");
        }

        setLoading(false);
    };

    // 💺 SELECT SEAT
    const toggleSeat = (seat) => {

        if (selectedSeats.includes(seat)) {

            setSelectedSeats(
                selectedSeats.filter((s) => s !== seat)
            );

        } else {

            if (selectedSeats.length >= passengers) {
                return alert(`Only ${passengers} seats allowed`);
            }

            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    // ✅ CONFIRM BOOKING + RAZORPAY
    const confirmBooking = async () => {

        try {

            const token = localStorage.getItem("token");

            if (!token) {
                return alert("Please login first");
            }

            if (selectedSeats.length === 0) {
                return alert("Please select seats");
            }

            // ✅ CREATE BOOKING
            const bookingRes = await API.post(
                "/bookings/book",
                {
                    flightId: selectedFlight._id,
                    seats: selectedSeats.length,
                    selectedSeats
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const booking = bookingRes.data.booking;

            // ✅ CREATE ORDER
            const orderRes = await API.post(
                "/payments/create-order",
                {
                    amount: selectedFlight.price * passengers
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const order = orderRes.data;

            // ✅ OPEN RAZORPAY
            const options = {

                key: "YOUR_RAZORPAY_KEY_ID",

                amount: order.amount,

                currency: order.currency,

                name: "TravelX",

                description: "Flight Booking Payment",

                order_id: order.id,

                handler: async function () {

                    try {

                        await API.post(
                            `/payments/pay/${booking._id}`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        alert("Payment Successful ✈️");

                        setSelectedFlight(null);

                        window.location.href = "/bookings";

                    } catch (err) {

                        console.log(err);

                        alert("Payment verification failed");
                    }
                },

                theme: {
                    color: "#2563eb"
                }
            };

            const razor = new window.Razorpay(options);

            razor.open();

        } catch (err) {

            console.log(err);

            alert("Booking failed");
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 text-gray-800">

            {/* 🔥 HERO */}
            <div className="text-center pt-20 pb-10">

                <motion.h1
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold mb-3 text-gray-900"
                >
                    Fly Anywhere ✈️
                </motion.h1>

                <p className="text-lg text-gray-600">
                    Luxury travel experience starts here
                </p>

            </div>

            {/* 🔍 SEARCH */}
            <div className="flex justify-center px-4">

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-5xl"
                >

                    <div className="grid md:grid-cols-4 gap-4">

                        {/* FROM */}
                        <input
                            list="cities"
                            placeholder="From ✈️"
                            onChange={(e) => setFrom(e.target.value)}
                            className="border p-3 rounded-xl bg-gray-50"
                        />

                        {/* TO */}
                        <input
                            list="cities"
                            placeholder="To 🌍"
                            onChange={(e) => setTo(e.target.value)}
                            className="border p-3 rounded-xl bg-gray-50"
                        />

                        {/* PASSENGERS */}
                        <select
                            value={passengers}
                            onChange={(e) =>
                                setPassengers(Number(e.target.value))
                            }
                            className="border p-3 rounded-xl bg-gray-50"
                        >
                            {[1, 2, 3, 4, 5].map((n) => (
                                <option key={n}>
                                    {n} Passenger
                                </option>
                            ))}
                        </select>

                        {/* SEARCH BUTTON */}
                        <button
                            onClick={searchFlights}
                            className="bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 hover:scale-105 transition"
                        >
                            Search
                        </button>

                    </div>

                    {/* CITY LIST */}
                    <datalist id="cities">
                        <option value="Delhi" />
                        <option value="Mumbai" />
                        <option value="Bangalore" />
                        <option value="Hyderabad" />
                        <option value="Chennai" />
                        <option value="Kolkata" />
                        <option value="Goa" />
                        <option value="Pune" />
                    </datalist>

                </motion.div>

            </div>

            {/* ✈️ RESULTS */}
            <div className="max-w-5xl mx-auto mt-10 px-4 space-y-5">

                {/* ⏳ LOADING */}
                {loading &&
                    [1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="bg-white p-5 rounded-xl shadow animate-pulse"
                        >
                            <div className="h-4 bg-gray-300 w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 w-1/4"></div>
                        </div>
                    ))}

                {/* ✈️ FLIGHTS */}
                {!loading &&
                    flights.map((f, i) => (

                        <motion.div
                            key={f._id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-xl transition"
                        >

                            <div className="flex justify-between items-center">

                                {/* LEFT */}
                                <div className="flex items-center gap-4">

                                    <img
                                        src="https://img.icons8.com/color/48/airplane-take-off.png"
                                        alt=""
                                        className="w-12"
                                    />

                                    <div>

                                        <p className="text-xl font-semibold">
                                            {f.from} → {f.to}
                                        </p>

                                        <p className="text-gray-500">
                                            {f.airline}
                                        </p>

                                        <p className="text-sm text-gray-400 mt-1">
                                            {f.departureTime}
                                            {" • "}
                                            {f.duration}
                                            {" • "}
                                            {f.arrivalTime}
                                        </p>

                                        <p className="text-sm text-green-600 mt-1">
                                            {f.seatsAvailable} seats left
                                        </p>

                                    </div>

                                </div>

                                {/* RIGHT */}
                                <div className="text-right">

                                    <p className="text-3xl font-bold text-blue-600">
                                        ₹{f.price}
                                    </p>

                                    <button
                                        onClick={() => {
                                            setSelectedFlight(f);
                                            setSelectedSeats([]);
                                        }}
                                        className="mt-2 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                                    >
                                        Book
                                    </button>

                                </div>

                            </div>

                        </motion.div>
                    ))}

            </div>

            {/* 🎟️ BOOKING POPUP */}
            <AnimatePresence>

                {selectedFlight && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
                    >

                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="bg-white p-8 rounded-2xl w-full max-w-xl"
                        >

                            <h2 className="text-2xl font-bold mb-4">
                                Select Seats ✈️
                            </h2>

                            <p className="mb-4">
                                {selectedFlight.from} → {selectedFlight.to}
                            </p>

                            {/* 💺 SEATS */}
                            <div className="grid grid-cols-4 gap-3 mb-6">

                                {[...Array(20)].map((_, i) => {

                                    const seat = `A${i + 1}`;

                                    const selected =
                                        selectedSeats.includes(seat);

                                    return (
                                        <button
                                            key={seat}
                                            onClick={() => toggleSeat(seat)}
                                            className={`p-3 rounded-lg border transition
                                            ${selected
                                                    ? "bg-green-600 text-white"
                                                    : "bg-gray-100"
                                                }`}
                                        >
                                            {seat}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* 🎯 INFO */}
                            <p className="mb-4 text-sm text-gray-500">
                                Selected Seats:
                                {" "}
                                {selectedSeats.join(", ")}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3">

                                <button
                                    onClick={() => setSelectedFlight(null)}
                                    className="px-4 py-2 rounded-lg bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={confirmBooking}
                                    className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                                >
                                    Confirm Booking
                                </button>

                            </div>

                        </motion.div>

                    </motion.div>
                )}

            </AnimatePresence>

        </div>
    );
}

export default Home;