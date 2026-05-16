import React, { useState, useEffect } from "react";
import API from "./api";
import { motion } from "framer-motion";

function UserProfile() {
    const [profileData, setProfileData] = useState(null);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await API.get("/users/profile", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfileData(res.data);
            setName(res.data.user.name);
            setPhone(res.data.user.phone || "");
        } catch (err) {
            console.error("Failed to fetch profile", err);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");
            await API.put("/users/profile", { name, phone }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            fetchProfile();
            alert("Profile updated successfully!");
        } catch (err) {
            console.error("Update failed", err);
            alert("Failed to update profile");
        }
    };

    if (!profileData) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

    const { user, stats } = profileData;

    return (
        <div className="min-h-screen text-slate-100 py-10 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-glow">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </div>
                            My Profile
                        </h1>
                        <p className="text-slate-400 text-sm mt-1">Manage your account and view travel history</p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* User Details */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 md:col-span-1">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center mb-4 text-3xl font-bold text-white">
                                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                            </div>
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className="glass-input text-center text-lg font-bold w-full"
                                />
                            ) : (
                                <h2 className="text-xl font-bold text-white">{user.name}</h2>
                            )}
                            <p className="text-sm text-slate-400 mt-1">{user.email}</p>
                            
                            {isEditing ? (
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={(e) => setPhone(e.target.value)} 
                                    placeholder="+91..."
                                    className="glass-input text-center text-xs mt-2 w-full"
                                />
                            ) : (
                                <p className="text-xs text-slate-500 mt-1">{user.phone || "No phone added"}</p>
                            )}

                            <span className="badge badge-pending mt-2">{user.role}</span>
                        </div>

                        {isEditing ? (
                            <div className="flex gap-2">
                                <button onClick={handleUpdate} className="btn-gradient btn-gradient-emerald flex-1 py-2 text-sm">Save</button>
                                <button onClick={() => setIsEditing(false)} className="btn-ghost flex-1 py-2 text-sm">Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setIsEditing(true)} className="btn-ghost w-full py-2 text-sm border-slate-700 hover:bg-slate-800">Edit Profile</button>
                        )}
                    </motion.div>

                    {/* Stats */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass-card p-6 md:col-span-2">
                        <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2">Lifetime Travel Statistics</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="text-accent-indigo mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.countriesVisited}</p>
                                <p className="text-xs text-slate-400">Destinations</p>
                            </div>
                            
                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="text-emerald-400 mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <p className="text-2xl font-bold text-white">{stats.totalFlights}</p>
                                <p className="text-xs text-slate-400">Flights Booked</p>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                                <div className="text-amber-400 mb-2">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                                <p className="text-2xl font-bold text-white">₹{stats.totalSpent}</p>
                                <p className="text-xs text-slate-400">Total Spent</p>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-accent-indigo/10 border border-accent-indigo/20 rounded-xl">
                            <h4 className="text-sm font-semibold text-accent-indigo mb-1">Traveler Tier</h4>
                            <div className="flex items-center gap-3">
                                <div className="text-2xl">
                                    {stats.totalFlights >= 10 ? "💎 Platinum" : stats.totalFlights >= 5 ? "🥇 Gold" : "🥈 Silver"}
                                </div>
                                <p className="text-xs text-slate-400 flex-1">
                                    {stats.totalFlights >= 10 ? "Top tier! You enjoy all premium benefits." : 
                                     `Book ${10 - stats.totalFlights} more flights to reach the next tier.`}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
