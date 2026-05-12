module.exports = (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Admin only access ❌" });
        }

        next();
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
};