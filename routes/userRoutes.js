const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/userController");
const auth = require("../middleware/auth");

// existing routes
router.post("/signup", signup);
router.post("/login", login);

// ✅ ADD THIS (IMPORTANT)
router.get("/profile", auth, (req, res) => {
    res.json({
        message: "Protected route accessed",
        user: req.user
    });
});

module.exports = router;