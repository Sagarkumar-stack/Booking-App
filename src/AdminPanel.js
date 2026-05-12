import React, { useState, useEffect } from "react";
import API from "./api";

function AdminPanel() {

    const [flight, setFlight] = useState({
        from: "",
        to: "",
        airline: "",
        price: "",
        seatsAvailable: "",
        departureTime: "",
        arrivalTime: "",
        duration: ""
    });

    const [flights, setFlights] = useState([]);

    const token = localStorage.getItem("token");

    // ✅ Decode User
    const user = token
        ? JSON.parse(atob(token.split(".")[1]))
        : null;

    // ✅ Fetch Flights
    useEffect(() => {
        fetchFlights();
    }, []);

    const fetchFlights = async () => {
        try {

            const res = await API.get("/flights/search");

            setFlights(res.data);

        } catch (err) {
            console.log(err);
        }
    };

    // ✅ Handle Input
    const handleChange = (e) => {

        setFlight({
            ...flight,
            [e.target.name]: e.target.value
        });
    };

    // ✅ Add Flight
    const addFlight = async () => {

        try {

            // ✅ Check Empty Fields
            for (let key in flight) {

                if (!flight[key]) {
                    return alert(`${key} is required`);
                }
            }

            await API.post(
                "/flights/add",
                {
                    ...flight,
                    price: Number(flight.price),
                    seatsAvailable: Number(flight.seatsAvailable)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Flight Added Successfully ✈️");

            // ✅ Clear Form
            setFlight({
                from: "",
                to: "",
                airline: "",
                price: "",
                seatsAvailable: "",
                departureTime: "",
                arrivalTime: "",
                duration: ""
            });

            fetchFlights();

        } catch (err) {

            console.log(err);

            alert(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Error Adding Flight"
            );
        }
    };

    // ✅ Delete Flight
    const deleteFlight = async (id) => {

        try {

            await API.delete(
                `/flights/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Flight Deleted ❌");

            fetchFlights();

        } catch (err) {

            console.log(err);

            alert("Delete Failed");
        }
    };

    // ❌ Block Non Admin
    if (!user || user.role !== "admin") {

        return (
            <div className="text-center mt-20">
                <h1 className="text-3xl font-bold text-red-500">
                    Access Denied ❌
                </h1>
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-gray-100 p-6">

            {/* 🔥 TITLE */}
            <h1 className="text-4xl font-bold text-center mb-10">
                Admin Dashboard ✈️
            </h1>

            {/* ➕ ADD FLIGHT */}
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto mb-10">

                <h2 className="text-2xl font-semibold mb-6">
                    Add New Flight
                </h2>

                <div className="grid grid-cols-2 gap-4">

                    <input
                        name="from"
                        value={flight.from}
                        onChange={handleChange}
                        placeholder="From"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="to"
                        value={flight.to}
                        onChange={handleChange}
                        placeholder="To"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="airline"
                        value={flight.airline}
                        onChange={handleChange}
                        placeholder="Airline"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="price"
                        type="number"
                        value={flight.price}
                        onChange={handleChange}
                        placeholder="Price"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="seatsAvailable"
                        type="number"
                        value={flight.seatsAvailable}
                        onChange={handleChange}
                        placeholder="Seats Available"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="duration"
                        value={flight.duration}
                        onChange={handleChange}
                        placeholder="Duration (2h 30m)"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="departureTime"
                        value={flight.departureTime}
                        onChange={handleChange}
                        placeholder="Departure Time"
                        className="border p-3 rounded-lg"
                    />

                    <input
                        name="arrivalTime"
                        value={flight.arrivalTime}
                        onChange={handleChange}
                        placeholder="Arrival Time"
                        className="border p-3 rounded-lg"
                    />

                </div>

                <button
                    onClick={addFlight}
                    className="w-full mt-6 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
                >
                    Add Flight ✈️
                </button>

            </div>

            {/* 📋 ALL FLIGHTS */}
            <div className="max-w-5xl mx-auto">

                <h2 className="text-2xl font-bold mb-6">
                    All Flights
                </h2>

                <div className="space-y-4">

                    {flights.map((f) => (

                        <div
                            key={f._id}
                            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center"
                        >

                            {/* LEFT */}
                            <div>

                                <h3 className="text-xl font-semibold">
                                    {f.from} → {f.to}
                                </h3>

                                <p className="text-gray-500">
                                    {f.airline}
                                </p>

                                <p className="mt-1 text-sm text-gray-600">
                                    {f.departureTime}
                                    {" • "}
                                    {f.duration}
                                    {" • "}
                                    {f.arrivalTime}
                                </p>

                                <p className="mt-1 text-sm text-green-600">
                                    {f.seatsAvailable} seats left
                                </p>

                            </div>

                            {/* RIGHT */}
                            <div className="text-right">

                                <p className="text-2xl font-bold text-blue-600">
                                    ₹{f.price}
                                </p>

                                <button
                                    onClick={() => deleteFlight(f._id)}
                                    className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}

export default AdminPanel;