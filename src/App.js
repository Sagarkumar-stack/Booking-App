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
import Login from "./Login";
import MyBookings from "./MyBookings";
import AdminPanel from "./AdminPanel";

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

          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* BOOKINGS */}
          <Route
            path="/bookings"
            element={
              user
                ? <MyBookings />
                : <Home />
            }
          />

          {/* ✅ ADMIN PROTECTED */}
          <Route
            path="/admin"
            element={
              user?.role === "admin"
                ? <AdminPanel />
                : <Home />
            }
          />

        </Routes>

      </motion.div>

    </AnimatePresence>
  );
}

function App() {

  const [user, setUser] = useState(null);

  const [showLogin, setShowLogin] = useState(false);

  // ✅ CHECK TOKEN
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setShowLogin(true);
      return;
    }

    try {

      const decoded = JSON.parse(
        atob(token.split(".")[1])
      );

      setUser(decoded);

    } catch (err) {

      console.log(err);

      localStorage.clear();

      setShowLogin(true);
    }

  }, []);

  // ✅ LOGOUT
  const logout = () => {

    localStorage.clear();

    setUser(null);

    setShowLogin(true);

    window.location.href = "/";
  };

  return (

    <Router>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-100 text-gray-800">

        {/* 🔥 NAVBAR */}
        <div className="flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md shadow-md">

          <h1 className="text-3xl font-bold text-blue-600">
            ✈️ TravelX
          </h1>

          <div className="flex gap-6 items-center text-sm font-medium">

            <Link
              to="/"
              className="hover:text-blue-600 transition"
            >
              Home
            </Link>

            {/* USER ONLY */}
            {user && (

              <Link
                to="/bookings"
                className="hover:text-blue-600 transition"
              >
                Bookings
              </Link>

            )}

            {/* ADMIN ONLY */}
            {user?.role === "admin" && (

              <Link
                to="/admin"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Admin
              </Link>

            )}

            {/* LOGIN / LOGOUT */}
            {!user ? (

              <button
                onClick={() => setShowLogin(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Login
              </button>

            ) : (

              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>

            )}

          </div>

        </div>

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto p-6">

          <AnimatedRoutes user={user} />

        </div>

        {/* LOGIN POPUP */}
        <AnimatePresence>

          {showLogin && !user && (

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
            >

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="bg-white p-8 rounded-2xl w-full max-w-md relative"
              >

                {/* CLOSE */}
                <button
                  onClick={() => setShowLogin(false)}
                  className="absolute top-3 right-3 text-gray-500 text-xl"
                >
                  ✕
                </button>

                {/* LOGIN */}
                <Login />

              </motion.div>

            </motion.div>

          )}

        </AnimatePresence>

      </div>

    </Router>
  );
}

export default App;