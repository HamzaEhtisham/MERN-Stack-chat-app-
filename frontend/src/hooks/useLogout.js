import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();
	const navigate = useNavigate();

	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/auth/logout", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user");
			setAuthUser(null);
			navigate("/login");
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	// Function to force clear JWT cookie and localStorage
	const forceLogout = () => {
		// Clear localStorage
		localStorage.removeItem("chat-user");
		setAuthUser(null);
		
		// Redirect to login page
		navigate("/login");
		toast.success("Please login again to refresh your session");
	};

	return { loading, logout, forceLogout };
};
export default useLogout;
