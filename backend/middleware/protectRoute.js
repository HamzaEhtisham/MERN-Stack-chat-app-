import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const protectRoute = async (req, res, next) => {
	try {
		const token = req.cookies.jwt;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		console.log("Token received:", token);
		console.log("JWT_SECRET:", process.env.JWT_SECRET ? "[SECRET IS SET]" : "[SECRET IS MISSING]");

		try {
			const decoded = jwt.verify(token, process.env.JWT_SECRET);
			console.log("Token decoded successfully:", decoded);

			const user = await User.findById(decoded.userId).select("-password");

			if (!user) {
				return res.status(404).json({ error: "User not found" });
			}

			req.user = user;
			next();
		} catch (jwtError) {
			console.log("JWT Verification Error:", jwtError.message);
			return res.status(401).json({ error: `Unauthorized - JWT Error: ${jwtError.message}` });
		}
	} catch (error) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;
