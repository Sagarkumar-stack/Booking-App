const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("AUTH HEADER:", authHeader); // ✅ correct place

        if (!authHeader) {
            return res.status(401).json({ message: "No token" });
        }

        const token = authHeader.split(" ")[1];

        console.log("TOKEN:", token); // 👈 extra debug

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (err) {
        console.log("JWT ERROR:", err.message);
        return res.status(401).json({ message: "Invalid token" });
    }
};