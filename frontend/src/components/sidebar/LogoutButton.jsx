import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";
import { useState } from "react";

const LogoutButton = () => {
	const { loading, logout } = useLogout();
	const [showConfirm, setShowConfirm] = useState(false);

	const handleLogout = () => {
		if (showConfirm) {
			logout();
			setShowConfirm(false);
		} else {
			setShowConfirm(true);
		}
	};

	return (
		<div className='mt-auto pt-4 flex justify-center relative'>
			{showConfirm && !loading ? (
				<div className='w-full flex flex-col gap-2'>
					<div className='bg-gray-700 text-white py-2 px-4 rounded-lg shadow-md text-center'>
						<span>Confirm Logout?</span>
					</div>
					<div className='flex gap-2 justify-center'>
						<button 
							className='bg-gray-600 hover:bg-gray-500 text-gray-200 py-2 px-4 rounded-lg transition-colors shadow-md flex-1'
							onClick={() => setShowConfirm(false)}
						>
							Cancel
						</button>
						<button 
							className='bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors shadow-md flex-1'
							onClick={handleLogout}
						>
							Logout
						</button>
					</div>
				</div>
			) : (
				<button 
					className='flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors w-full justify-center shadow-md'
					onClick={() => setShowConfirm(true)}
					disabled={loading}
				>
					{loading ? (
						<span className='loading loading-spinner'></span>
					) : (
						<>
							<BiLogOut className='w-5 h-5 text-gray-300' />
							<span className='text-gray-300'>Logout</span>
						</>
					)}
				</button>
			)}
		</div>
	);
};
export default LogoutButton;
