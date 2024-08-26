const jwt = require("jsonwebtoken");
const { prisma } = require("../Db/db.config");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization || req.header('Authorization');
        console.log(token);
        
        if (!token) {
            return res.status(401).json({ msg: "Unauthorized - No token provided" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({ msg: "Invalid token" });
        }
        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: { id: true, phoneNumber: true, email: true, firstName: true, lastName: true }, // Customize the fields as needed
        });

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        req.user = user;
        next();

    } catch (error) {
        console.error("Authentication error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ msg: "Unauthorized - Token has expired" });
        } else {
            return res.status(500).json({ msg: "Internal Server Error" });
        }
    }
};
