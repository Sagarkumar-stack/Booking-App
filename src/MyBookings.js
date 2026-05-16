import React, { useEffect, useState } from "react";
import API from "./api";
import { motion } from "framer-motion";

function MyBookings() {
    const [bookings, setBookings] = useState([]);

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

    useEffect(() => { fetchBookings(); }, []);

    const payNow = async (booking) => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await API.post("/payments/create-order", { amount: booking.amount }, { headers: { Authorization: `Bearer ${token}` } });
            const options = {
                key: "rzp_test_SjFqNVrVXp6wun",
                amount: data.amount,
                currency: "INR",
                name: "Travel Booking App ✈️",
                description: "Flight Payment",
                order_id: data.id,
                handler: async function (response) {
                    try {
                        await API.post(`/payments/pay/${booking._id}`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, { headers: { Authorization: `Bearer ${token}` } });
                        alert("Payment Successful 💰");
                        fetchBookings();
                    } catch (err) { console.log(err); alert("Payment verification failed"); }
                },
                prefill: { name: "Sagar", email: "sagar@test.com" },
                theme: { color: "#6366f1" },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) { console.log(err); alert("Payment failed ❌"); }
    };

    const cancelBooking = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await API.delete(`/bookings/cancel/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            alert("Cancelled ❌");
            fetchBookings();
        } catch (err) { console.log(err); alert("Cancel failed"); }
    };

    const handleDownloadTicket = async (id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:5000/api/bookings/ticket/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error("Failed to download");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `TravelX_Ticket_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error(error);
            alert("Error downloading ticket.");
        }
    };

    return (
        <div className="min-h-screen text-slate-100">
            <div className="max-w-5xl mx-auto px-4 pt-10 pb-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-glow">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                            </div>
                            My Bookings
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage and track your flight reservations</p>
                    </div>
                    <div className="glass-card px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Bookings</p>
                            <p className="text-lg font-bold text-white">{bookings.length}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="max-w-5xl mx-auto px-4 pb-10">
                {bookings.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                        <div className="w-20 h-20 rounded-2xl bg-surface border border-surface-border mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-300 mb-2">No bookings yet</h3>
                        <p className="text-sm text-slate-500">Your flight reservations will appear here once you book a flight.</p>
                    </motion.div>
                )}

                <div className="space-y-4">
                    {bookings.map((b, i) => (
                        <motion.div key={b._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo/20 to-accent-violet/20 border border-accent-indigo/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg font-bold text-white">{b.flightId?.from}</span>
                                            <span className="text-accent-indigo">→</span>
                                            <span className="text-lg font-bold text-white">{b.flightId?.to}</span>
                                        </div>
                                        <p className="text-sm text-slate-400 mb-2">{b.flightId?.airline}</p>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <span className="text-xs text-slate-500">Seats: {b.seats}</span>
                                            <span className="text-xs text-slate-500">₹{b.amount}</span>
                                            <span className={`badge ${b.paymentStatus === "success" ? "badge-success" : "badge-pending"}`}>
                                                {b.paymentStatus === "success" ? "Paid" : "Pending"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                    {b.paymentStatus === "success" && (
                                        <button onClick={() => handleDownloadTicket(b._id)} className="btn-gradient btn-gradient-indigo px-5 py-2.5 text-sm">Download E-Ticket</button>
                                    )}
                                    {b.paymentStatus !== "success" && (
                                        <button onClick={() => payNow(b)} className="btn-gradient btn-gradient-emerald px-5 py-2.5 text-sm">Pay Now</button>
                                    )}
                                    <button onClick={() => cancelBooking(b._id)} className="btn-ghost px-5 py-2.5 text-sm text-rose-400 border-rose-500/20 hover:bg-rose-500/10">Cancel</button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default MyBookings;