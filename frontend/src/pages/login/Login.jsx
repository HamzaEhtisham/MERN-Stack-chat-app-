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
		<div className='flex items-center justify-center min-h-screen w-full p-4 animate-fade-in'>
			<div className='w-full max-w-md p-10 premium-card space-y-8'>
				<div className="text-center space-y-4">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 items-center justify-center shadow-xl shadow-cyan-500/20 mb-2">
            <img src="/logo.png" alt="ChatVerse" className="w-10 h-10 object-contain" />
          </div>
					<h1 className='text-5xl font-extrabold tracking-tight'>
						<span className='chatverse-gradient-text'>ChatVerse</span>
					</h1>
          <p className="text-slate-400 font-medium">Welcome back! Please login to your account.</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className='block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2'>
							Username
						</label>
						<input
							type='text'
							placeholder='Enter your username'
							className='w-full premium-input p-4'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div>
						<label className='block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2'>
							Password
						</label>
						<input
							type='password'
							placeholder='••••••••'
							className='w-full premium-input p-4'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					
					<div className="flex justify-end">
            <Link to='/signup' className='text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-semibold'>
              Create an account?
            </Link>
          </div>

					<button 
            className='w-full premium-btn-v2 py-4 flex items-center justify-center font-bold text-lg' 
            disabled={loading}
          >
						{loading ? <span className='loading loading-spinner text-white'></span> : "Sign In"}
					</button>
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
