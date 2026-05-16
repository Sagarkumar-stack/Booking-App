import React, { useState } from "react";
import API from "./api";
import { motion, AnimatePresence } from "framer-motion";

// portal = "user" | "admin"
function Auth({ portal = "user", onClose }) {

    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Visibility states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const isAdmin = portal === "admin";
    const role = isAdmin ? "admin" : "user";
    const portalLabel = isAdmin ? "Admin" : "User";
    const accentColor = isAdmin ? "from-rose-500 to-pink-600" : "from-accent-indigo to-accent-violet";
    const glowColor = isAdmin ? "rgba(244,63,94,0.15)" : "rgba(99,102,241,0.15)";
    const borderColor = isAdmin ? "rgba(244,63,94,0.2)" : "rgba(99,102,241,0.2)";

    const reset = () => {
        setName(""); setPhone(""); setEmail(""); setPassword(""); setConfirmPassword(""); setError("");
        setShowPassword(false); setShowConfirmPassword(false);
    };

    const switchMode = (m) => { reset(); setMode(m); };

    // ✅ EMAIL VALIDATION & AUTO-LOWERCASE
    const handleEmailChange = (e) => {
        let val = e.target.value.toLowerCase();
        // Only allow alphabets, numbers, @ and .
        val = val.replace(/[^a-z0-9@.]/g, "");
        setEmail(val);
    };

    // ✅ HANDLE LOGIN
    const handleLogin = async () => {
        setError("");
        if (!email || !password) { setError("Please fill all fields"); return; }
        try {
            setLoading(true);
            const res = await API.post("/users/login", { email, password, expectedRole: role });
            localStorage.setItem("token", res.data.token);
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // ✅ HANDLE SIGNUP
    const handleSignup = async () => {
        setError("");
        if (!name || !email || !password || !confirmPassword) { setError("Please fill all fields"); return; }
        if (password !== confirmPassword) { setError("Passwords do not match"); return; }
        if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
        try {
            setLoading(true);
            await API.post("/users/signup", { name, email, password, role, phone });
            // Auto-login after signup
            const res = await API.post("/users/login", { email, password, expectedRole: role });
            localStorage.setItem("token", res.data.token);
            window.location.href = "/";
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = mode === "login" ? handleLogin : handleSignup;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Portal Header */}
            <div className="text-center mb-7">
                <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${accentColor} mb-4`}
                    style={{ boxShadow: `0 0 30px ${glowColor}` }}
                >
                    {isAdmin ? (
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    ) : (
                        <span className="text-3xl">✈️</span>
                    )}
                </div>

                {/* Portal Badge */}
                <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-3 text-xs font-semibold"
                    style={{ background: `${glowColor}`, border: `1px solid ${borderColor}`, color: isAdmin ? "#fb7185" : "#818cf8" }}
                >
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: isAdmin ? "#fb7185" : "#818cf8" }}></div>
                    {portalLabel} Portal
                </div>

                <h2 className="text-2xl font-bold text-white mb-1">
                    {mode === "login" ? `Welcome Back` : `Create Account`}
                </h2>
                <p className="text-slate-400 text-sm">
                    {mode === "login" ? `Sign in to your ${portalLabel.toLowerCase()} account` : `Register as a ${portalLabel.toLowerCase()}`}
                </p>
            </div>

            {/* Toggle Login / Signup */}
            <div className="flex rounded-xl p-1 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <button
                    onClick={() => switchMode("login")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "login" ? `bg-gradient-to-r ${accentColor} text-white shadow-md` : "text-slate-400 hover:text-white"}`}
                >
                    Sign In
                </button>
                <button
                    onClick={() => switchMode("signup")}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${mode === "signup" ? `bg-gradient-to-r ${accentColor} text-white shadow-md` : "text-slate-400 hover:text-white"}`}
                >
                    Sign Up
                </button>
            </div>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 px-4 py-3 rounded-xl text-sm text-rose-300 flex items-start gap-2"
                        style={{ background: "rgba(244,63,94,0.1)", border: "1px solid rgba(244,63,94,0.2)" }}
                    >
                        <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {error}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Fields */}
            <div className="space-y-4">
                {/* Name — signup only */}
                <AnimatePresence>
                    {mode === "signup" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <input type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} className="glass-input pl-10 mb-4" />
                            </div>

                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Phone Number (with +country code)</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <input type="text" placeholder="+919876543210" value={phone} onChange={e => setPhone(e.target.value)} className="glass-input pl-10" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Email */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={handleEmailChange}
                            className="glass-input pl-10"
                        />
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="glass-input pl-10 pr-10"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                            ) : (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password — signup only */}
                <AnimatePresence>
                    {mode === "signup" && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="glass-input pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full mt-6 bg-gradient-to-r ${accentColor} text-white py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                style={{ boxShadow: loading ? "none" : `0 0 30px ${glowColor}` }}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {mode === "login" ? "Signing in..." : "Creating account..."}
                    </>
                ) : (
                    mode === "login" ? "Sign In" : "Create Account"
                )}
            </button>

            {/* Divider */}
            <div className="mt-5 flex items-center justify-center gap-2">
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }}></div>
                <span className="text-xs text-slate-600 px-2">{portalLabel} Portal</span>
                <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.06)" }}></div>
            </div>

        </motion.div>
    );
}

export default Auth;
