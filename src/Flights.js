import React, { useState } from "react";
import API from "./api";

function Flights() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [flights, setFlights] = useState([]);

    const searchFlights = async () => {
        try {
            const res = await API.get(`/flights/search?from=${from}&to=${to}`);
            setFlights(res.data);
        } catch (err) {
            alert("Error fetching flights");
        }
    };

    const bookFlight = async (flightId) => {
        try {
            const token = localStorage.getItem("token");

            await API.post(
                "/bookings/book",
                { flightId, seats: 1 },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Flight booked ✅");

        } catch (err) {
            alert(err.response?.data?.message || "Booking failed");
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Search Flights</h2>

            <div className="flex gap-3 mb-4">
                <input
                    className="border p-2 rounded w-full"
                    placeholder="From"
                    onChange={(e) => setFrom(e.target.value)}
                />

                <input
                    className="border p-2 rounded w-full"
                    placeholder="To"
                    onChange={(e) => setTo(e.target.value)}
                />

                <button
                    onClick={searchFlights}
                    className="bg-green-600 text-white px-4 rounded hover:bg-green-700"
                >
                    Search
                </button>
            </div>

            <div className="grid gap-4">
                {flights.map((flight) => (
                    <div
                        key={flight._id}
                        className="border p-4 rounded-lg shadow flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">
                                {flight.from} → {flight.to}
                            </p>
                            <p className="text-sm text-gray-500">
                                {flight.airline} • ₹{flight.price}
                            </p>
                            <p className="text-sm">Seats: {flight.seatsAvailable}</p>
                        </div>

                        <button
                            onClick={() => bookFlight(flight._id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Book ✈️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Flights;