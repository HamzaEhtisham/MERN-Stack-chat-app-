import { useState } from "react";
import { Link } from "react-router-dom";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-8 glass-panel'>
				<h1 className='text-4xl font-bold text-center text-white mb-6'>
					Login
					<span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className='block text-sm font-medium text-gray-300 mb-1'>
							Username
						</label>
						<input
							type='text'
							placeholder='Enter username'
							className='w-full glass-input p-3 rounded-xl'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className="mb-4">
						<label className='block text-sm font-medium text-gray-300 mb-1'>
							Password
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full glass-input p-3 rounded-xl'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<Link to='/signup' className='text-sm text-gray-400 hover:text-cyan-400 transition-colors inline-block mt-2 font-medium'>
						{"Don't"} have an account?
					</Link>

					<div className="mt-6">
						<button className='w-full premium-btn py-3 rounded-xl flex items-center justify-center font-bold text-lg' disabled={loading}>
							{loading ? <span className='loading loading-spinner text-white'></span> : "Login"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default Login;

// STARTER CODE FOR THIS FILE
// const Login = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Login
// 					<span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='Enter username' className='w-full input input-bordered h-10' />
// 					</div>

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Enter Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>
// 					<a href='#' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block'>
// 						{"Don't"} have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2'>Login</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default Login;
