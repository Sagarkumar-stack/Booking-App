import React, { useState } from "react";
import API from "./api";
import { motion, AnimatePresence } from "framer-motion";

const DatePicker = ({ label, value, onChange, minDate, accentColor, isOpen, onToggle }) => {
    const [viewDate, setViewDate] = useState(new Date());

    const formatDate = (dateStr) => {
        if (!dateStr) return "Select";
        const parts = dateStr.split('-');
        const d = new Date(parts[0], parts[1]-1, parts[2]);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return (
        <div className="flex-1 relative z-50 overflow-visible">
            <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(); }}
                className="w-full text-left p-4 hover:bg-white/5 transition-all cursor-pointer group"
            >
                <span className={`block text-[10px] font-black ${accentColor === 'accent-indigo' ? 'text-accent-indigo' : 'text-accent-violet'} uppercase mb-1.5 tracking-widest`}>
                    {label}
                </span>
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-white group-hover:text-accent-indigo transition-colors uppercase leading-tight">
                        {formatDate(value)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase">
                        {value ? value.split('-')[0] : ""}
                    </span>
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-[100]" onClick={onToggle}></div>
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-64 bg-[#0d111c] border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-[110] backdrop-blur-3xl"
                            style={{ transformOrigin: 'top left' }}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <button type="button" onClick={() => setViewDate(new Date(year, month - 1, 1))} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                </button>
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-white">
                                    {viewDate.toLocaleString('default', { month: 'short', year: 'numeric' })}
                                </h4>
                                <button type="button" onClick={() => setViewDate(new Date(year, month + 1, 1))} className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
                                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                    <span key={d} className="text-[9px] font-black text-slate-500">{d}</span>
                                ))}
                            </div>
                            
                            <div className="grid grid-cols-7 gap-0.5 text-center">
                                {days.map((day, i) => {
                                    if (!day) return <div key={`empty-${i}`} className="p-1"></div>;
                                    const dStr = `${year}-${(month + 1) < 10 ? `0${month + 1}` : (month + 1)}-${day < 10 ? `0${day}` : day}`;
                                    const isSelected = dStr === value;
                                    const isPast = dStr < minDate;

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            disabled={isPast}
                                            onClick={() => {
                                                const d = day < 10 ? `0${day}` : day;
                                                const m = (month + 1) < 10 ? `0${month + 1}` : (month + 1);
                                                onChange(`${year}-${m}-${d}`);
                                                onToggle();
                                            }}
                                            className={`
                                                p-2 text-[10px] font-black rounded-lg transition-all
                                                ${isPast ? 'opacity-5 cursor-not-allowed' : 'hover:bg-accent-indigo hover:text-white cursor-pointer'}
                                                ${isSelected ? 'bg-accent-indigo text-white shadow-glow' : 'text-slate-400'}
                                            `}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md"
    >
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent-indigo/20 to-accent-violet/20 flex items-center justify-center text-accent-indigo mb-4 border border-accent-indigo/20">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </motion.div>
);

function Home() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const [departureDate, setDepartureDate] = useState(today);
    const [returnDate, setReturnDate] = useState("");
    const [tripType, setTripType] = useState("oneWay");
    const [flights, setFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);
    const [passengers, setPassengers] = useState(1);
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [bookingPhase, setBookingPhase] = useState("outbound"); // outbound or inbound
    const [openDatePicker, setOpenDatePicker] = useState(null); // 'departure', 'return', or null

    // 🔍 SEARCH FLIGHTS
    const searchFlights = async () => {
        if (!from || !to) return;
        try {
            setLoading(true);
            const res = await API.get(`/flights/search?from=${from}&to=${to}&tripType=${tripType}&departureDate=${departureDate}&returnDate=${returnDate}`);
            setFlights(res.data.flights);
            setReturnFlights(res.data.returnFlights || []);
            setBookingPhase("outbound");
            setSelectedFlight(null);
            setSelectedReturnFlight(null);
            // Smooth scroll to results
            window.scrollTo({ top: 600, behavior: 'smooth' });
        } catch (err) {
            console.log(err);
            alert("Error fetching flights");
        }
        setLoading(false);
    };

    const fetchSuggestions = async (query, type) => {
        if (query.length < 2) {
            type === "from" ? setFromSuggestions([]) : setToSuggestions([]);
            return;
        }
        try {
            const res = await API.get(`/flights/suggestions?query=${query}`);
            type === "from" ? setFromSuggestions(res.data) : setToSuggestions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const toggleSeat = (seat) => {
        if (selectedSeats.includes(seat)) {
            setSelectedSeats(selectedSeats.filter((s) => s !== seat));
        } else {
            if (selectedSeats.length >= passengers) return alert(`Only ${passengers} seats allowed`);
            setSelectedSeats([...selectedSeats, seat]);
        }
    };

    const confirmBooking = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return alert("Please login first");
            if (selectedSeats.length === 0) return alert("Please select seats");

            const totalPrice = (selectedFlight.price + (selectedReturnFlight?.price || 0)) * passengers;

            // Create outbound booking
            const bookingRes = await API.post("/bookings/book", {
                flightId: selectedFlight._id,
                seats: selectedSeats.length,
                selectedSeats
            }, { headers: { Authorization: `Bearer ${token}` } });

            const outboundBooking = bookingRes.data.booking;
            let inboundBooking = null;

            // Create return booking if exists
            if (selectedReturnFlight) {
                const returnRes = await API.post("/bookings/book", {
                    flightId: selectedReturnFlight._id,
                    seats: selectedSeats.length,
                    selectedSeats
                }, { headers: { Authorization: `Bearer ${token}` } });
                inboundBooking = returnRes.data.booking;
            }

            const orderRes = await API.post("/payments/create-order", {
                amount: totalPrice
            }, { headers: { Authorization: `Bearer ${token}` } });

            const options = {
                key: "rzp_test_SjFqNVrVXp6wun",
                amount: orderRes.data.amount,
                currency: orderRes.data.currency,
                name: "TravelX",
                description: "Flight Booking Payment",
                order_id: orderRes.data.id,
                handler: async function (response) {
                    try {
                        // Verify payment for outbound
                        const res1 = await API.post(`/payments/pay/${outboundBooking._id}`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, { headers: { Authorization: `Bearer ${token}` } });

                        // Verify payment for inbound if exists
                        let res2 = null;
                        if (inboundBooking) {
                            res2 = await API.post(`/payments/pay/${inboundBooking._id}`, {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            }, { headers: { Authorization: `Bearer ${token}` } });
                        }

                        let alertMsg = "Payment Successful ✈️";
                        if (res1.data.notification?.testUrl) {
                            alertMsg += `\n\n📧 Test Email Sent: ${res1.data.notification.testUrl}`;
                            // Also open in new tab for convenience
                            window.open(res1.data.notification.testUrl, '_blank');
                        }
                        
                        alert(alertMsg);
                        setSelectedFlight(null);
                        setSelectedReturnFlight(null);
                        window.location.href = "/bookings";
                    } catch (err) {
                        alert("Payment verification failed");
                    }
                },
                theme: { color: "#6366f1" }
            };
            new window.Razorpay(options).open();
        } catch (err) {
            alert("Booking failed");
        }
    };

    return (
        <div className="min-h-screen text-slate-100 pb-20">
            {/* 🌌 HERO SECTION */}
            <section className="relative pt-20 pb-16 px-6">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-accent-indigo/10 blur-[120px] rounded-full -z-10 opacity-50"></div>
                
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm">
                            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Next Generation Travel App</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter leading-tight">
                            Travel Beyond <br />
                            <span className="gradient-text">Boundaries.</span>
                        </h1>
                        
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                            Experience the future of flight booking with real-time tracking, 
                            secure payments, and an intuitive interface designed for modern travelers.
                        </p>
                    </motion.div>

                    {/* 🔍 SEARCH COMPONENT */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="glass-card p-6 w-full max-w-5xl mx-auto shadow-2xl relative z-[50] overflow-visible"
                    >
                        {/* Trip Type Selector */}
                        <div className="flex gap-4 mb-6">
                            <button 
                                onClick={() => setTripType("oneWay")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${tripType === "oneWay" ? "bg-accent-indigo text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                            >
                                One Way
                            </button>
                            <button 
                                onClick={() => setTripType("roundTrip")}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${tripType === "roundTrip" ? "bg-accent-indigo text-white" : "bg-white/5 text-slate-400 hover:bg-white/10"}`}
                            >
                                Round Trip
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                            {/* Departure */}
                            <div className="lg:col-span-3 relative group px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all h-full flex flex-col justify-center">
                                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">From</label>
                                <input 
                                    value={from}
                                    placeholder="Source" 
                                    onChange={e => { setFrom(e.target.value); fetchSuggestions(e.target.value, "from"); }} 
                                    className="w-full bg-transparent text-sm font-bold placeholder:text-slate-600 focus:outline-none" 
                                />
                                {fromSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-64 bg-dark-900 border border-white/10 rounded-xl mt-2 overflow-hidden z-[60] shadow-2xl backdrop-blur-xl">
                                        {fromSuggestions.map(s => (
                                            <div key={s} onClick={() => { setFrom(s); setFromSuggestions([]); }} className="p-3 hover:bg-white/5 cursor-pointer text-sm font-bold">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Arrival */}
                            <div className="lg:col-span-3 relative group px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all h-full flex flex-col justify-center">
                                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">To</label>
                                <input 
                                    value={to}
                                    placeholder="Destination" 
                                    onChange={e => { setTo(e.target.value); fetchSuggestions(e.target.value, "to"); }} 
                                    className="w-full bg-transparent text-sm font-bold placeholder:text-slate-600 focus:outline-none" 
                                />
                                {toSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 w-64 bg-dark-900 border border-white/10 rounded-xl mt-2 overflow-hidden z-[60] shadow-2xl backdrop-blur-xl">
                                        {toSuggestions.map(s => (
                                            <div key={s} onClick={() => { setTo(s); setToSuggestions([]); }} className="p-3 hover:bg-white/5 cursor-pointer text-sm font-bold">
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Custom Dates Component */}
                            <motion.div 
                                layout
                                className="lg:col-span-3 flex items-center gap-0 bg-white/5 border border-white/5 p-1 rounded-2xl overflow-visible h-full relative z-[60]"
                            >
                                <DatePicker 
                                    label="Departure" 
                                    value={departureDate} 
                                    onChange={setDepartureDate} 
                                    minDate={today} 
                                    accentColor="accent-indigo"
                                    isOpen={openDatePicker === 'departure'}
                                    onToggle={() => setOpenDatePicker(openDatePicker === 'departure' ? null : 'departure')}
                                />
                                
                                <AnimatePresence>
                                    {tripType === "roundTrip" && (
                                        <motion.div 
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: "100%", opacity: 1 }}
                                            exit={{ width: 0, opacity: 0 }}
                                            className="border-l border-white/10 overflow-visible relative z-[60]"
                                        >
                                            <DatePicker 
                                                label="Return" 
                                                value={returnDate} 
                                                onChange={setReturnDate} 
                                                minDate={departureDate || today} 
                                                accentColor="accent-violet"
                                                isOpen={openDatePicker === 'return'}
                                                onToggle={() => setOpenDatePicker(openDatePicker === 'return' ? null : 'return')}
                                            />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>

                            {/* Passengers */}
                            <div className="lg:col-span-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 h-full flex flex-col justify-center">
                                <label className="block text-[9px] font-black text-slate-500 uppercase mb-1 tracking-widest">Passengers</label>
                                <select value={passengers} onChange={e => setPassengers(Number(e.target.value))} className="w-full bg-transparent text-sm font-bold focus:outline-none cursor-pointer">
                                    {[1, 2, 3, 4, 5].map(n => <option key={n} value={n} className="bg-dark-900">{n} Traveler{n > 1 ? 's' : ''}</option>)}
                                </select>
                            </div>

                            {/* Search Button */}
                            <div className="lg:col-span-1 h-full">
                                <button onClick={searchFlights} className="btn-gradient rounded-2xl w-full h-full min-h-[60px] flex items-center justify-center shadow-glow-indigo transition-all hover:scale-105 active:scale-95">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* 🎫 PNR TRACKER BAR */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4"
                    >
                        <div className="relative group w-full max-w-sm">
                            <input 
                                placeholder="ENTER PNR (e.g., TX1234)" 
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white placeholder:text-slate-600 focus:outline-none focus:border-accent-indigo transition-all"
                                id="pnrSearchInput"
                            />
                            <button 
                                onClick={async () => {
                                    const pnr = document.getElementById("pnrSearchInput").value;
                                    if (!pnr) return;
                                    try {
                                        const res = await API.get(`/bookings/pnr/${pnr}`);
                                        alert(`PNR Found! \nPassenger: ${res.data.user.name}\nFlight: ${res.data.flightId.airline}\nRoute: ${res.data.flightId.from} -> ${res.data.flightId.to}`);
                                    } catch (err) {
                                        alert("PNR Not Found ❌");
                                    }
                                }}
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent-indigo hover:bg-accent-violet text-white text-[10px] font-black uppercase px-4 py-2 rounded-xl transition-all"
                            >
                                Track PNR
                            </button>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            Lost your ticket? Track it with PNR.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ✈️ RESULTS SECTION */}
            <div id="results" className="max-w-5xl mx-auto px-6 space-y-6 mt-32">
                {flights.length > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between mb-8"
                    >
                        <h2 className="text-2xl font-black uppercase tracking-tighter">
                            {tripType === "roundTrip" ? (bookingPhase === "outbound" ? "Select Outbound Flight" : "Select Return Flight") : "Available Flights"}
                        </h2>
                        {tripType === "roundTrip" && bookingPhase === "inbound" && (
                            <button onClick={() => setBookingPhase("outbound")} className="text-xs font-bold text-accent-indigo hover:underline flex items-center gap-1">
                                <span>←</span> Change Outbound
                            </button>
                        )}
                    </motion.div>
                )}
                
                <AnimatePresence mode="wait">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="glass-card p-8 animate-pulse">
                                <div className="h-8 w-64 bg-white/5 rounded-lg mb-4"></div>
                                <div className="h-4 w-full bg-white/5 rounded-lg"></div>
                            </div>
                        ))
                    ) : (
                        (bookingPhase === "outbound" ? flights : returnFlights).map((f, i) => (
                            <motion.div
                                key={f._id}
                                initial={{ opacity: 0, x: bookingPhase === "outbound" ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: bookingPhase === "outbound" ? 20 : -20 }}
                                transition={{ delay: i * 0.1 }}
                                className="glass-card glass-card-hover p-6 border-white/5 hover:border-accent-indigo/30 group mb-4"
                            >
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="flex items-center gap-6 w-full">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center border border-white/10 group-hover:shadow-glow transition-all">
                                            <span className="text-2xl font-bold">{f.airline[0]}</span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-black">{f.from}</h3>
                                                <div className="h-px flex-1 bg-white/10 relative">
                                                    <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 text-accent-indigo">✈</div>
                                                </div>
                                                <h3 className="text-xl font-black">{f.to}</h3>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                                <span className="text-accent-indigo">{f.airline} ({f.flightNumber})</span>
                                                <span>• {f.aircraft}</span>
                                                <span>• {f.departureTime}</span>
                                                <span>• {f.duration}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center md:text-right min-w-[150px]">
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Starting Price</p>
                                        <p className="text-3xl font-black text-white mb-4">₹{f.price.toLocaleString()}</p>
                                        <button 
                                            onClick={() => { 
                                                if (tripType === "roundTrip" && bookingPhase === "outbound") {
                                                    setSelectedFlight(f);
                                                    setBookingPhase("inbound");
                                                    window.scrollTo({ top: 300, behavior: 'smooth' });
                                                } else {
                                                    if (tripType === "roundTrip") {
                                                        setSelectedReturnFlight(f);
                                                    } else {
                                                        setSelectedFlight(f);
                                                    }
                                                    setSelectedSeats([]); 
                                                }
                                            }} 
                                            className="btn-gradient px-8 py-3 w-full font-black text-sm uppercase tracking-widest"
                                        >
                                            {tripType === "roundTrip" && bookingPhase === "outbound" ? "Select" : "Book"}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* 🚀 FEATURES SECTION */}
            <section className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                        title="Live Flight Engine"
                        desc="Experience our unique fetching API that generates real-time dummy flights for any route instantly."
                    />
                    <FeatureCard 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
                        title="Secure Payments"
                        desc="Industry-standard payment verification via Razorpay ensures your transactions are always safe."
                    />
                    <FeatureCard 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        title="Powerful Admin Portal"
                        desc="Manage flights, view bookings, and control the entire ecosystem with our robust admin tools."
                    />
                </div>
            </section>

            {/* 🎟️ SEAT SELECTION POPUP */}
            <AnimatePresence>
                {((tripType === "oneWay" && selectedFlight) || (tripType === "roundTrip" && selectedFlight && selectedReturnFlight)) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-xl flex justify-center items-center z-50 p-4">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="glass-card p-10 w-full max-w-2xl border-white/10 shadow-glow-indigo">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <h2 className="text-3xl font-black mb-2 uppercase tracking-tighter">Select Your Seat</h2>
                                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                                        {selectedFlight.from} to {selectedFlight.to} {selectedReturnFlight ? `& ${selectedReturnFlight.from} to ${selectedReturnFlight.to}` : ""} • {selectedFlight.airline}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedFlight(null)} className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                                    <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-5 gap-3 mb-10 p-6 rounded-3xl bg-black/40 border border-white/5">
                                {[...Array(20)].map((_, i) => {
                                    const seat = `A${i + 1}`;
                                    const isSel = selectedSeats.includes(seat);
                                    return (
                                        <button key={seat} onClick={() => toggleSeat(seat)} className={`p-4 rounded-xl text-sm font-black transition-all ${isSel ? 'bg-gradient-to-br from-accent-indigo to-accent-violet text-white shadow-glow' : 'bg-white/5 text-slate-500 hover:text-white hover:bg-white/10 border border-white/5'}`}>
                                            {seat}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 mb-8">
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Payable</p>
                                    <p className="text-4xl font-black text-white">
                                        ₹{((selectedFlight.price + (selectedReturnFlight?.price || 0)) * selectedSeats.length).toLocaleString()}
                                    </p>
                                </div>
                                <button onClick={confirmBooking} className="btn-gradient px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-widest shadow-glow-lg">Confirm & Pay</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;
