const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const auth = require("../middleware/auth");

const Razorpay = require("razorpay");
const crypto = require("crypto");

// 🔐 INIT
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// 💰 CREATE ORDER
router.post("/create-order", auth, async (req, res) => {

    try {

        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR",
        };

        const order = await razorpay.orders.create(options);

        res.json(order);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});


// ✅ VERIFY PAYMENT
router.post("/verify/:bookingId", auth, async (req, res) => {

    try {

        const booking = await Booking.findById(
            req.params.bookingId
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        // 🔐 CREATE SIGNATURE
        const sign =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;

        const expectedSign = crypto
            .createHmac(
                "sha256",
                process.env.RAZORPAY_KEY_SECRET
            )
            .update(sign.toString())
            .digest("hex");

        // ✅ VERIFY
        if (razorpay_signature === expectedSign) {

            booking.paymentStatus = "success";

            booking.paymentId = razorpay_payment_id;

            await booking.save();

            return res.json({
                success: true,
                message: "Payment Verified ✅",
                booking
            });

        } else {

            return res.status(400).json({
                success: false,
                message: "Payment Verification Failed ❌"
            });
        }

    } catch (err) {

        res.status(500).json({
            error: err.message
        });
    }
});

module.exports = router;