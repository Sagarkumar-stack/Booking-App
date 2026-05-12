import React, { useEffect, useState } from "react";
import API from "./api";

function MyBookings() {
    const [bookings, setBookings] = useState([]);

    // 🔄 Fetch bookings
    const fetchBookings = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/bookings/my-bookings", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBookings(res.data);
        } catch (err) {
            console.log(err);
            alert("Failed to load bookings");
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    // 💰 Razorpay Payment
    const payNow = async (booking) => {
        try {
            const token = localStorage.getItem("token");

            // 1️⃣ Create order (backend)
            const { data } = await API.post(
                "/payments/create-order",
                { amount: booking.amount },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            // 2️⃣ Razorpay options
            const options = {
                key: "rzp_test_SjFqNVrVXp6wun", // ✅ your key
                amount: data.amount,
                currency: "INR",
                name: "Travel Booking App ✈️",
                description: "Flight Payment",
                order_id: data.id,

                handler: async function (response) {
                    try {
                        // 3️⃣ Mark payment success
                        await API.post(
                            `/payments/pay/${booking._id}`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }
                        );

                        alert("Payment Successful 💰");
                        fetchBookings();
                    } catch (err) {
                        console.log(err);
                        alert("Payment verification failed");
                    }
                },

                prefill: {
                    name: "Sagar",
                    email: "sagar@test.com",
                },

                theme: {
                    color: "#2563eb",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.log(err);
            alert("Payment failed ❌");
        }
    };

    // ❌ Cancel booking
    const cancelBooking = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/bookings/cancel/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Cancelled ❌");
            fetchBookings();
        } catch (err) {
            console.log(err);
            alert("Cancel failed");
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-100 to-indigo-200 min-h-screen p-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6 text-center text-blue-700">
                    My Bookings ✈️
                </h2>

                {bookings.length === 0 && (
                    <p className="text-center text-gray-500">
                        No bookings found
                    </p>
                )}

                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div
                            key={b._id}
                            className="border p-5 rounded-xl shadow flex justify-between items-center hover:shadow-xl transition"
                        >
                            <div>
                                <p className="font-semibold text-lg">
                                    {b.flightId?.from} → {b.flightId?.to}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {b.flightId?.airline}
                                </p>

                                <p className="text-sm">
                                    Seats: {b.seats}
                                </p>

                                <p className="text-sm">
                                    Amount: ₹{b.amount}
                                </p>

                                <p
                                    className={`font-semibold ${b.paymentStatus === "success"
                                            ? "text-green-600"
                                            : "text-yellow-600"
                                        }`}
                                >
                                    {b.paymentStatus}
                                </p>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {/* 💰 PAY */}
                                {b.paymentStatus !== "success" && (
                                    <button
                                        onClick={() => payNow(b)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Pay 💰
                                    </button>
                                )}

                                {/* ❌ CANCEL */}
                                <button
                                    onClick={() => cancelBooking(b._id)}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyBookings;