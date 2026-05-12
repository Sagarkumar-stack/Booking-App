import React, { useState } from "react";
import API from "./api";
import { motion } from "framer-motion";

function Login() {

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {

        try {

            setLoading(true);

            const res = await API.post(
                "/users/login",
                {
                    email,
                    password
                }
            );

            // ✅ SAVE TOKEN
            localStorage.setItem(
                "token",
                res.data.token
            );

            alert("Login successful ✅");

            // ✅ REFRESH APP
            window.location.href = "/";

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Login failed"
            );

        }

        setLoading(false);
    };

    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-2xl"
        >

            {/* 🔥 TITLE */}
            <div className="text-center mb-6">

                <h2 className="text-3xl font-bold text-blue-600">
                    Welcome Back ✈️
                </h2>

                <p className="text-gray-500 mt-2">
                    Login to continue your journey
                </p>

            </div>

            {/* 📧 EMAIL */}
            <input
                name="email"
                id="email"
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
                className="w-full border p-3 rounded-xl mb-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* 🔒 PASSWORD */}
            <input
                name="password"
                id="password"
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
                className="w-full border p-3 rounded-xl mb-5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {/* 🔥 LOGIN BUTTON */}
            <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl hover:scale-[1.02] transition font-semibold shadow-lg"
            >

                {loading
                    ? "Logging in..."
                    : "Login"}

            </button>

        </motion.div>
    );
}

export default Login;