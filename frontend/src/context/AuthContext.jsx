import { createContext, useContext, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../store";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
	return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
	const dispatch = useDispatch();
	const authUser = JSON.parse(localStorage.getItem("chat-user")) || null;

	useEffect(() => {
		dispatch(setAuthUser(authUser));
	}, [dispatch, authUser]);

	return <AuthContext.Provider value={{ authUser }}>{children}</AuthContext.Provider>;
};
