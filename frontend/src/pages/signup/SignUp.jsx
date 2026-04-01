import { Link } from "react-router-dom";
import { useState } from "react";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
	});

	const { loading, signup } = useSignup();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-8 glass-panel'>
				<h1 className='text-4xl font-bold text-center text-white mb-6'>
					Sign Up <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300'> ChatApp</span>
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className='block text-sm font-medium text-gray-300 mb-1'>
							Full Name
						</label>
						<input
							type='text'
							placeholder='John Doe'
							className='w-full glass-input p-3 rounded-xl'
							value={inputs.fullName}
							onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-1'>
							Username
						</label>
						<input
							type='text'
							placeholder='johndoe'
							className='w-full glass-input p-3 rounded-xl'
							value={inputs.username}
							onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-1'>
							Password
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full glass-input p-3 rounded-xl'
							value={inputs.password}
							onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-300 mb-1'>
							Confirm Password
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full glass-input p-3 rounded-xl'
							value={inputs.confirmPassword}
							onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
						/>
					</div>


					<Link
						to={"/login"}
						className='text-sm text-gray-400 hover:text-cyan-400 transition-colors inline-block mt-2 font-medium'
					>
						Already have an account?
					</Link>

					<div className="mt-6">
						<button className='w-full premium-btn py-3 rounded-xl flex items-center justify-center font-bold text-lg cursor-pointer' disabled={loading}>
							{loading ? <span className='loading loading-spinner text-white'></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;

// STARTER CODE FOR THE SIGNUP COMPONENT
// import GenderCheckbox from "./GenderCheckbox";

// const SignUp = () => {
// 	return (
// 		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
// 			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
// 				<h1 className='text-3xl font-semibold text-center text-gray-300'>
// 					Sign Up <span className='text-blue-500'> ChatApp</span>
// 				</h1>

// 				<form>
// 					<div>
// 						<label className='label p-2'>
// 							<span className='text-base label-text'>Full Name</span>
// 						</label>
// 						<input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10' />
// 					</div>

// 					<div>
// 						<label className='label p-2 '>
// 							<span className='text-base label-text'>Username</span>
// 						</label>
// 						<input type='text' placeholder='johndoe' className='w-full input input-bordered h-10' />
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

// 					<div>
// 						<label className='label'>
// 							<span className='text-base label-text'>Confirm Password</span>
// 						</label>
// 						<input
// 							type='password'
// 							placeholder='Confirm Password'
// 							className='w-full input input-bordered h-10'
// 						/>
// 					</div>

// 					<GenderCheckbox />

// 					<a className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' href='#'>
// 						Already have an account?
// 					</a>

// 					<div>
// 						<button className='btn btn-block btn-sm mt-2 border border-slate-700'>Sign Up</button>
// 					</div>
// 				</form>
// 			</div>
// 		</div>
// 	);
// };
// export default SignUp;
