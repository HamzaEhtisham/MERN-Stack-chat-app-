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
		<div className='flex items-center justify-center min-h-screen w-full p-4 animate-fade-in'>
			<div className='w-full max-w-2xl p-10 premium-card space-y-8'>
				<div className="text-center space-y-4">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 items-center justify-center shadow-xl shadow-cyan-500/20 mb-2">
            <img src="/logo.png" alt="ChatVerse" className="w-10 h-10 object-contain" />
          </div>
					<h1 className='text-5xl font-extrabold tracking-tight'>
						<span className='chatverse-gradient-text'>Join ChatVerse</span>
					</h1>
          <p className="text-slate-400 font-medium">Create your professional account in seconds.</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2'>
                Full Name
              </label>
              <input
                type='text'
                placeholder='John Doe'
                className='w-full premium-input p-4'
                value={inputs.fullName}
                onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2'>
                Username
              </label>
              <input
                type='text'
                placeholder='johndoe'
                className='w-full premium-input p-4'
                value={inputs.username}
                onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
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
                value={inputs.password}
                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
              />
            </div>

            <div>
              <label className='block text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2'>
                Confirm Password
              </label>
              <input
                type='password'
                placeholder='••••••••'
                className='w-full premium-input p-4'
                value={inputs.confirmPassword}
                onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
              />
            </div>
          </div>

					<div className="flex justify-between items-center pt-2">
            <Link
              to={"/login"}
              className='text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-semibold'
            >
              Already have an account?
            </Link>
          </div>

					<button className='w-full premium-btn-v2 py-4 flex items-center justify-center font-bold text-lg' disabled={loading}>
						{loading ? <span className='loading loading-spinner text-white'></span> : "Create Account"}
					</button>
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
