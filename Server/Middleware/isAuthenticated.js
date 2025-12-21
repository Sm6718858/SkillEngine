import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        // console.log("Token:", token);
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { _id: decoded.userId };
        req.id = decoded.userId;

        next();
    } catch (error) {
        console.log("Auth Error:", error.message);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
