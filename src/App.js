import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

import Home from "./Home";
import Auth from "./Auth";
import MyBookings from "./MyBookings";
import AdminPanel from "./AdminPanel";
import Chatbot from "./Chatbot";
import UserProfile from "./UserProfile";

function AnimatedRoutes({ user }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/bookings" element={user ? <MyBookings /> : <Home />} />
          <Route path="/profile" element={user ? <UserProfile /> : <Home />} />
          <Route path="/admin" element={user?.role === "admin" ? <AdminPanel /> : <Home />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authPortal, setAuthPortal] = useState("none");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ CHECK TOKEN
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthPortal("user"); // show user login by default
      return;
    }
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      
      // Check if token is expired
      const now = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < now) {
        console.log("Token expired, clearing storage");
        localStorage.clear();
        setUser(null);
        setAuthPortal("user");
        return;
      }

      setUser(decoded);
      localStorage.setItem("userId", decoded.id);
    } catch (err) {
      console.log(err);
      localStorage.clear();
      setAuthPortal("user");
    }
  }, []);

  // ✅ LOGOUT
  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAuthPortal("user");
    setIsSidebarOpen(false);
    window.location.href = "/";
  };

  const showAuth = authPortal !== "none" && !user;

  const NavItem = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      onClick={() => {
        setIsSidebarOpen(false);
        if (onClick) onClick();
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all duration-200 group"
    >
      <div className="w-8 h-8 rounded-lg bg-slate-800/50 flex items-center justify-center group-hover:bg-accent-indigo/20 group-hover:text-accent-indigo transition-colors">
        {icon}
      </div>
      <span className="font-medium">{label}</span>
    </Link>
  );

  return (
    <Router>
      <div className="min-h-screen bg-dark-900 text-slate-100 font-sans overflow-x-hidden">

        {/* Background glow effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent-indigo/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-accent-violet/8 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-72 h-72 bg-accent-cyan/5 rounded-full blur-3xl"></div>
        </div>

        {/* 🔥 HEADER / TOP BAR */}
        <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 h-16 flex items-center px-6 lg:px-8" style={{ background: "rgba(10,14,26,0.85)", backdropFilter: "blur(16px)" }}>
          <div className="w-full flex justify-between items-center">

            <div className="flex items-center gap-4">
              {/* Sidebar Toggle Button */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/10 transition-all border border-white/10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isSidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                  <span className="text-lg">✈</span>
                </div>
                <span className="text-xl font-bold tracking-tight">
                  <span className="gradient-text">Travel</span>
                  <span className="text-white">X</span>
                </span>
              </Link>
            </div>

            {/* Top Right Actions */}
            {!user ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAuthPortal("user")}
                  className="hidden md:block text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => setAuthPortal("user")}
                  className="btn-gradient px-5 py-2 text-sm font-bold rounded-xl shadow-glow"
                >
                  Join Now
                </button>
                <div className="w-px h-4 bg-white/10 hidden md:block mx-1"></div>
                <button
                  onClick={() => setAuthPortal("admin")}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/30 bg-rose-500/5 text-rose-400 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 transition-all"
                >
                  Admin
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                  <p className="text-xs text-white font-black leading-none uppercase tracking-tighter">{user.name || user.email.split('@')[0]}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{user.role} Account</p>
                </div>
                <div className="relative group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-lg ${user.role === "admin" ? "bg-gradient-to-br from-rose-500 to-pink-600" : "bg-gradient-to-br from-accent-indigo to-accent-violet"}`}>
                    {user.email ? user.email[0].toUpperCase() : "U"}
                  </div>
                  <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="glass-card p-2 shadow-2xl border-white/10">
                      <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-sm font-bold">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 🔥 SIDEBAR */}
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />

              {/* Sidebar Content */}
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 left-0 bottom-0 w-72 z-50 flex flex-col p-6 border-r border-white/5 shadow-2xl"
                style={{ background: "rgba(10,14,26,0.98)", backdropFilter: "blur(20px)" }}
              >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between mb-8 mt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-glow">
                      <span className="text-sm">✈</span>
                    </div>
                    <span className="text-lg font-bold">TravelX</span>
                  </div>
                  <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* User Profile Info in Sidebar */}
                {user && (
                  <div className="mb-8 p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white ${user.role === "admin" ? "bg-gradient-to-br from-rose-500 to-pink-600" : "bg-gradient-to-br from-accent-indigo to-accent-violet"}`}>
                      {user.email ? user.email[0].toUpperCase() : "U"}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm text-white font-bold truncate leading-tight">{user.name || user.email}</p>
                      <p className="text-xs text-slate-500 capitalize mt-0.5">{user.role} Account</p>
                    </div>
                  </div>
                )}

                <nav className="flex-1 space-y-2">
                  <NavItem
                    to="/"
                    label="Home"
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                  />

                  {user && (
                    <>
                      <NavItem
                        to="/bookings"
                        label="My Bookings"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                      />
                      <NavItem
                        to="/profile"
                        label="My Profile"
                        icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                      />
                    </>
                  )}

                  {user?.role === "admin" && (
                    <NavItem
                      to="/admin"
                      label="Admin Dashboard"
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                    />
                  )}
                </nav>

                <div className="mt-auto pt-6 border-t border-white/5 space-y-2">
                  {!user ? (
                    <>
                      <button
                        onClick={() => { setIsSidebarOpen(false); setAuthPortal("user"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-accent-indigo/10 transition-all border border-transparent hover:border-accent-indigo/20"
                      >
                        <div className="w-8 h-8 rounded-lg bg-accent-indigo/10 text-accent-indigo flex items-center justify-center">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                        </div>
                        <span className="font-medium">User Login</span>
                      </button>
                      <button
                        onClick={() => { setIsSidebarOpen(false); setAuthPortal("admin"); }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                      >
                        <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="font-medium">Admin Portal</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20"
                    >
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                      </div>
                      <span className="font-semibold">Logout</span>
                    </button>
                  )}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* CONTENT */}
        <main className="relative pt-16 min-h-screen">
          <AnimatedRoutes user={user} />
        </main>

        {/* ═══ AUTH MODAL ═══ */}
        <AnimatePresence>
          {showAuth && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex justify-center items-center z-50 p-4"
              style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="glass-card p-8 w-full max-w-md relative"
                style={{
                  boxShadow: authPortal === "admin"
                    ? "0 0 60px rgba(244,63,94,0.15), 0 25px 50px rgba(0,0,0,0.5)"
                    : "0 0 60px rgba(99,102,241,0.15), 0 25px 50px rgba(0,0,0,0.5)"
                }}
              >
                {/* Portal switcher tabs at top */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-1 p-1 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <button
                      onClick={() => setAuthPortal("user")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${authPortal === "user" ? "bg-gradient-to-r from-accent-indigo to-accent-violet text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      User
                    </button>
                    <button
                      onClick={() => setAuthPortal("admin")}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${authPortal === "admin" ? "bg-gradient-to-r from-rose-500 to-pink-600 text-white" : "text-slate-400 hover:text-white"}`}
                    >
                      Admin
                    </button>
                  </div>

                  {/* Close button */}
                  <button
                    onClick={() => setAuthPortal("none")}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                    style={{ background: "rgba(255,255,255,0.05)" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Auth form */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={authPortal}
                    initial={{ opacity: 0, x: authPortal === "admin" ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: authPortal === "admin" ? -20 : 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Auth portal={authPortal} onClose={() => setAuthPortal("none")} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FOOTER */}
        <footer className="relative z-10 border-t border-white/5 mt-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center">
                  <span className="text-sm">✈</span>
                </div>
                <span className="text-sm font-semibold text-slate-400">TravelX</span>
              </div>
              <p className="text-xs text-slate-500">© 2026 TravelX. Premium flight booking platform.</p>
            </div>
          </div>
        </footer>

        <Chatbot />

      </div>
    </Router>
  );
}

export default App;