import React, { useState, useEffect } from "react";
import API from "./api";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

function AdminPanel() {

    const [flight, setFlight] = useState({
        from: "", to: "", airline: "", price: "",
        seatsAvailable: "", departureTime: "", arrivalTime: "", duration: ""
    });

    const [flights, setFlights] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [stats, setStats] = useState(null);
    const token = localStorage.getItem("token");
    const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

    useEffect(() => { 
        fetchFlights(); 
        fetchBookings();
        
        const fetchStats = async () => {
            try {
                const res = await API.get("/bookings/stats", { headers: { Authorization: `Bearer ${token}` } });
                setStats(res.data);
            } catch (err) { console.log(err); }
        };

        fetchStats();
    }, [token]);

    const fetchBookings = async () => {
        try {
            const res = await API.get("/bookings/all", { headers: { Authorization: `Bearer ${token}` } });
            setBookings(res.data);
        } catch (err) { console.log(err); }
    };

    const resendNotification = async (id) => {
        try {
            const res = await API.post(`/bookings/resend/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
            let msg = "Notifications Resent Successfully! 📧📱";
            if (res.data.email?.testUrl) {
                msg += `\n\nPreview: ${res.data.email.testUrl}`;
                window.open(res.data.email.testUrl, '_blank');
            }
            alert(msg);
        } catch (err) { alert("Failed to resend"); }
    };

    const fetchFlights = async () => {
        try { const res = await API.get("/flights/search"); setFlights(res.data); }
        catch (err) { console.log(err); }
    };

    const handleChange = (e) => { setFlight({ ...flight, [e.target.name]: e.target.value }); };

    const addFlight = async () => {
        try {
            for (let key in flight) { if (!flight[key]) return alert(`${key} is required`); }
            await API.post("/flights/add", { ...flight, price: Number(flight.price), seatsAvailable: Number(flight.seatsAvailable) }, { headers: { Authorization: `Bearer ${token}` } });
            alert("Flight Added Successfully ✈️");
            setFlight({ from: "", to: "", airline: "", price: "", seatsAvailable: "", departureTime: "", arrivalTime: "", duration: "" });
            fetchFlights();
        } catch (err) {
            console.log(err);
            alert(err.response?.data?.message || err.response?.data?.error || "Error Adding Flight");
        }
    };

    const deleteFlight = async (id) => {
        try {
            await API.delete(`/flights/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            alert("Flight Deleted ❌");
            fetchFlights();
        } catch (err) { console.log(err); alert("Delete Failed"); }
    };

    if (!user || user.role !== "admin") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="glass-card p-12 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-8 h-8 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                    </div>
                    <h1 className="text-2xl font-bold text-rose-400 mb-2">Access Denied</h1>
                    <p className="text-slate-500 text-sm">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    const fields = [
        { name: "from", label: "From", placeholder: "Departure city", icon: "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" },
        { name: "to", label: "To", placeholder: "Arrival city", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" },
        { name: "airline", label: "Airline", placeholder: "Airline name", icon: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" },
        { name: "price", label: "Price (₹)", placeholder: "Price", type: "number", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
        { name: "seatsAvailable", label: "Seats", placeholder: "Seats available", type: "number", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
        { name: "duration", label: "Duration", placeholder: "e.g. 2h 30m", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        { name: "departureTime", label: "Departure", placeholder: "Departure time", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
        { name: "arrivalTime", label: "Arrival", placeholder: "Arrival time", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
    ];

    return (
        <div className="min-h-screen text-slate-100">

            {/* Header */}
            <div className="max-w-6xl mx-auto px-4 pt-10 pb-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-glow">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            Admin Dashboard
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage flights and monitor the platform</p>
                    </div>
                    <div className="glass-card px-5 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 flex items-center justify-center">
                            <svg className="w-4 h-4 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Total Flights</p>
                            <p className="text-lg font-bold text-white">{flights.length}</p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Analytics Dashboard */}
            {stats && (
                <div className="max-w-6xl mx-auto px-4 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="glass-card p-6">
                            <p className="text-sm text-slate-400">Total Users</p>
                            <p className="text-3xl font-bold text-white">{stats.summary.totalUsers}</p>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-sm text-slate-400">Total Bookings</p>
                            <p className="text-3xl font-bold text-white">{stats.summary.totalBookings}</p>
                        </div>
                        <div className="glass-card p-6">
                            <p className="text-sm text-slate-400">Total Revenue</p>
                            <p className="text-3xl font-bold text-emerald-400">₹{stats.summary.totalRevenue}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Revenue Over Time</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={stats.revenueData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="date" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                        <Line type="monotone" dataKey="revenue" stroke="#34d399" strokeWidth={3} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="text-lg font-bold text-white mb-4">Popular Destinations</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={stats.destinationData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                        <Bar dataKey="bookings" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Flight Form */}
            <div className="max-w-3xl mx-auto px-4 mb-10">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        </div>
                        Add New Flight
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fields.map((f) => (
                            <div key={f.name}>
                                <label className="block text-xs font-medium text-slate-500 mb-1.5 uppercase tracking-wider">{f.label}</label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                        <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={f.icon} /></svg>
                                    </div>
                                    <input
                                        name={f.name}
                                        type={f.type || "text"}
                                        value={flight[f.name]}
                                        onChange={handleChange}
                                        placeholder={f.placeholder}
                                        className="glass-input pl-10"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <button onClick={addFlight} className="w-full mt-6 btn-gradient btn-gradient-emerald py-3.5 text-base font-semibold flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Flight
                    </button>
                </motion.div>
            </div>

            {/* All Flights */}
            <div className="max-w-6xl mx-auto px-4 pb-10">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                    All Flights
                </h2>

                <div className="space-y-4">
                    {flights.map((f, i) => (
                        <motion.div key={f._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card glass-card-hover p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-indigo/20 to-accent-violet/20 border border-accent-indigo/20 flex items-center justify-center flex-shrink-0">
                                        <svg className="w-6 h-6 text-accent-indigo" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-lg font-bold text-white">{f.from}</span>
                                            <span className="text-accent-indigo">→</span>
                                            <span className="text-lg font-bold text-white">{f.to}</span>
                                        </div>
                                        <p className="text-sm text-slate-400">{f.airline}</p>
                                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                            <span className="text-xs text-slate-500">{f.departureTime} • {f.duration} • {f.arrivalTime}</span>
                                            <span className="badge badge-success">{f.seatsAvailable} seats</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold gradient-text">₹{f.price}</span>
                                    <button onClick={() => deleteFlight(f._id)} className="btn-ghost px-4 py-2.5 text-sm text-rose-400 border-rose-500/20 hover:bg-rose-500/10 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Recent Bookings */}
            <div className="max-w-6xl mx-auto px-4 pb-20">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                    Recent Bookings & Communications
                </h2>

                <div className="glass-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">PNR</th>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Flight</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map((b) => (
                                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono font-bold text-accent-indigo bg-accent-indigo/10 px-2 py-1 rounded text-xs">
                                                {b.pnr}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-white">{b.user?.name}</p>
                                            <p className="text-[10px] text-slate-500">{b.user?.email}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-white">{b.flightId?.airline}</p>
                                            <p className="text-[10px] text-slate-500">{b.flightId?.from} → {b.flightId?.to}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`badge ${b.paymentStatus === 'success' ? 'badge-success' : 'badge-pending'}`}>
                                                {b.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-bold text-white">₹{b.amount}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => resendNotification(b._id)}
                                                className="text-[10px] font-black uppercase tracking-widest text-accent-indigo hover:text-white transition-colors flex items-center gap-2 ml-auto"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                Resend
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminPanel;