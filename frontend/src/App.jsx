import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import SessionRefreshButton from "./components/shared/SessionRefreshButton";
import useOfflineSync from "./hooks/useOfflineSync";

function App() {
	const { authUser } = useAuthContext();
	const { isOnline } = useOfflineSync();

	return (
		<div className='fixed inset-0 w-full overflow-hidden bg-transparent flex flex-col'>
			{/* Professional Offline Banner */}
			{!isOnline && (
				<div className="absolute top-0 left-0 right-0 z-[1000] flex items-center justify-center gap-3 bg-red-500/10 backdrop-blur-md border-b border-red-500/20 text-red-200 text-xs font-medium py-1.5 px-4 animate-fade-in shadow-2xl">
					<span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
					<span>Connection Interrupted — ChatVerse is currently in offline mode</span>
				</div>
			)}
			
			<main className="flex-1 w-full h-full relative overflow-hidden">
				<Routes>
					<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
					<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
					<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				</Routes>
			</main>



			<Toaster position="top-right" />
			{authUser && <SessionRefreshButton />}
		</div>
	);
}

export default App;


